const BaseModel = require("./BaseModel");

class FirestoreCollectionGroupModel extends BaseModel {
    constructor(collectionGroup, id, foreignKey) {
        super(collectionGroup);
        if(id && foreignKey) this.setQuery(query => query.where(foreignKey, '==', id))
    }
}

module.exports = FirestoreCollectionGroupModel;