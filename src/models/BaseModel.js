const database = require("../helpers/database")

class BaseModel {

    constructor(source) {
        this.setAutoId(true);
        this.setSource(source)
    }

    setAutoId(autoId) {
        this.autoId = autoId;
        return this;
    }

    setSource(source) {
        this.source = source;
        this.query = source;
        return this;
    }

    setQuery(builder) {
        if(typeof builder === 'function') {
            this.query = builder(this.query)
        }
        return this;
    }

    getQuery() {
        return this.query
    }

    getCollection() {
        return this.source.get();
    }

    async getQueryResult(returnObject = false) {
        const snapShots = await this.query.get();
        return returnObject
            ? database.snapshotsToObject(snapShots)
            : database.snapshotsToArray(snapShots);
    }

    async all(returnObject = false) {
        return await this.getQueryResult(returnObject)
    }

    async getCollectionWithBuilder(builder) {
        this.setQuery(builder);
        return this.getQueryResult();
    }

    async getDocWithBuilder(builder) {
        if(typeof builder === 'function') {
            const result = await this.getCollectionWithBuilder((query) => builder(query).limit(1));
            return result.length ? result[0] : null;
        }
        return null;
    }
}

module.exports = BaseModel;