import {db} from "../../core/utils/config";
import {Site, SiteModelMdb} from "./SiteModel";
import {chunk, flattenDeep, uniq} from "lodash";


const siteCollRef = db.collection('sites')

/**
 * service to get site info from firebase
 * @param site_id to get a specific site
 * @returns {SiteModel} of site
 */

export async function getRemoteSiteById(site_id) {
    try {
        const site = await siteCollRef.doc(site_id).get()

        if (!site.exists) {

            return null;
        }

        return site.data()
    } catch (err) {
        console.log("something went wrong fetching site info", err.code)

        return null;
    }
}


/**
 * service to get site info from firebase
 * @returns {SiteModel} of site
 * @param site_ids
 */
export async function getRemoteSitesByIds(site_ids) {

    try {
        /* Firebase only a limit of 10 */
        const site_chunks = chunk(uniq(site_ids), 10)

        const userRelatedSites = Promise.all(site_chunks.map(async chunk => {
            let siteObjArr = []
            const sites = await siteCollRef.where('_id', 'in', chunk).get()
            sites.forEach(docs => {
                siteObjArr.push(docs.data())
            })
            return siteObjArr
        }))
        return flattenDeep(await userRelatedSites)

    } catch (err) {
        throw "something went wrong fetching user related sites [code - " + err.code + "]"
    }
}


function convertFbDateToISOString(date) {
    if (typeof date !== 'string' && date !== undefined) {
        return date.toDate().toISOString()
    }
    return date || null
}


/**
 * Get all site from the remote
 * @returns {Promise<[Site]>}
 */

export async function getAllSites(region): Promise<Array<Site>> {

    try {
        const sites = await siteCollRef.get();
        let siteArr: Array<Site> = [];

        sites.forEach(doc => {
            let siteData = doc.data()
            siteArr.push(siteData as Site)
        });

        return siteArr // To be saved locally.

    } catch (err) {
        console.log("something went wrong fetching all sites", err)
    }
}


/**
 * maybe_used
 * The code below may not be used in the pro version because the site will be created from the remote
 */

/**
 * function to get Site By Name And Location.
 * @param name for the site
 * @param location
 * @param region for the site
 * @param subRegion for the site
 * @returns {Promise<null|*>} object of the site or null when not found
 */

export async function getRemoteSiteByNameAndLocation(name, location, region, subRegion) {

    try {
        let getSiteData;

        if (location !== undefined) {
            getSiteData = await siteCollRef
                .where('name', '==', name)
                .where('location', '==', location)
                .limit(1)
                .get();

            if (getSiteData.empty) {
                return null
            }
        } else {
            getSiteData = await siteCollRef
                .where('name', '==', name)
                .where('region', '==', region)
                .where('subRegion', '==', subRegion)
                .limit(1)
                .get();

            if (getSiteData.empty) {
                return null
            }
        }

        let siteArr = [];

        getSiteData.forEach(doc => {
            /* If the buyer/field-tech exits, get the doc id and data */
            let siteSnap = doc.data()

            siteArr.push(new SiteModelMdb(
                siteSnap._id === undefined ? doc.id : siteSnap._id,
                siteSnap.name,
                siteSnap.location || null,
                siteSnap.region || null,
                siteSnap.subRegion || null,
                siteSnap.owner || null,
                siteSnap.created_at,
                siteSnap.updated_at || siteSnap.created_at
            ))
        });

        return siteArr[0];
    } catch (err) {
        console.log("something went wrong fetching site info", err)
    }
}


export async function upsertRemoteSite(siteModel) {

    try {
        let getData;

        if (siteModel.location !== undefined) {
            getData = await siteCollRef
                .where('name', '==', siteModel.name)
                .where('location', '==', siteModel.location)
                .limit(1)
                .get();
        } else {
            getData = await siteCollRef
                .where('name', '==', siteModel.name)
                .where('region', '==', siteModel.region)
                .where('subRegion', '==', siteModel.subRegion)
                .limit(1)
                .get();
        }

        if (getData.empty) {
            await siteCollRef.doc(siteModel._id).set(siteModel);
        } else {
            await siteCollRef.doc(siteModel._id).update({
                owner: siteModel.owner,
                updated_at: siteModel.updated_at
            })
        }

        return true;
    } catch (err) {
        throw err;
    }
}
