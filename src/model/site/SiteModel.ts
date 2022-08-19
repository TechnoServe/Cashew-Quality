export function SiteModel(id, name, location, region, subRegion, owner, created_at, updated_at) {
    this.id = id;
    this.name = name;
    this.location = location || null;
    this.region = region;
    this.subRegion = subRegion;
    this.owner = owner;
    this.created_at = created_at;
    this.updated_at = updated_at;
}

export function SiteModelMdb(_id, name, location, region, subRegion, owner, created_at, updated_at) {
    this._id = _id;
    this.name = name;
    this.location = location;
    this.region = region;
    this.subRegion = subRegion;
    this.owner = owner;
    this.created_at = created_at;
    this.updated_at = updated_at;
}

// Site type
export interface Site {
    _id: string,
    name: string,
    location?: string,
    region: string,
    subRegion: string,
    created_at: string,
    updated_at: string
}

export default SiteModel;
