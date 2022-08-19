import {getRemoteSiteByNameAndLocation} from "../../model/site/site_firabase_queries";
import {find, isEmpty} from "lodash";
import {QarSite} from "../../model/qar_listing/QarModel";


export async function fetchSiteByNameAndLocation(newSiteInfo: QarSite, is_connected: boolean, store_sites) {

    if (is_connected) {
        /* check remotely if the site exists */
        const siteSnap = await getRemoteSiteByNameAndLocation(
            newSiteInfo.name,
            newSiteInfo.location,
            newSiteInfo.region,
            newSiteInfo.subRegion
        )
        if (siteSnap !== null) {
            return siteSnap
        }
    }

    const store_site = find(store_sites, {
        name: newSiteInfo.name,
        location: newSiteInfo.location,
        region: newSiteInfo.region,
        subRegion: newSiteInfo.subRegion
    })

    if (store_site !== undefined) {
        /* Update only when owner is not null */
        if (!isEmpty(newSiteInfo.owner)) {
            return store_site;
        }
    }

    return newSiteInfo;
}
