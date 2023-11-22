const moment = require("moment");
const database = require("../helpers/database")
const { convertMetaKeyValueToObj } = require("../helpers")
const BaseModel = require("./BaseModel");

class FirestoreCollectionModel extends BaseModel {

    constructor(collection) {
        super(collection);
    }

    setId(id) {
        this.id = id;
        if(this.id){
            this.documentRef = this.source.doc(this.id);
        }
        this.setSoftDelete(true);
        return this;
    }

    getId() {
        return this.id;
    }

    setSoftDelete(softDelete) {
        this.softDelete = softDelete;
        return this;
    }

    setMetadata(metadata) {
        this.metadata = metadata;
        return this;
    }

    getDocument() {
        return this.documentRef.get()
    }

    async exist() {
        return (await this.getDocument()).exists;
    }

    async get() {
        return database.snapShotToObject(await this.getDocument());
    }

    formatAttributes(attributes) {
        if(this.metadata instanceof Array) {
            attributes.metadata = convertMetaKeyValueToObj(this.metadata)
        }
        return attributes;
    }

    async create(attributes = {}){
        const doc = {
            ...this.formatAttributes(attributes),
            timestamp: {
                created_at: moment().unix(),
                updated_at:  moment().unix(),
            }
        }
        if(!this.id && !this.autoId) {
            this.setId(await database.generateNanoIdWithinCollection(this.path))
        }
        if(this.id) {
            if(await this.exist()) throw new Error("Document already exist")
            await this.documentRef.set({ id: this.id, ...doc})
            return this.get();
        }
        const result = await this.source.add(doc);
        this.setId(result.id)
        this.setSource(result);
        return this.set({ id: result.id });
    }

    async update(attributes = {}, updateTimestamp = true) {
        attributes = this.formatAttributes(attributes);
        if(updateTimestamp) attributes["timestamp.updated_at"] = moment().unix();
        if(!(await this.exist())) throw new Error("Document does not exist")
        await this.documentRef.update(attributes);
        return this.get()
    }

    async createOrUpdate(attributes = {}) {
        if(await this.exist())  return this.update(attributes)
        return this.create(attributes);
    }

    async set(attributes = {}) {
        attributes = this.formatAttributes(attributes);
        if(!(await this.exist())) throw new Error("Document does not exist")
        await this.documentRef.set(attributes, { merge: true});
        return this.get()
    }

    async delete() {
        if(!(await this.exist())) throw new Error("Document does not exist");
        if(this.softDelete) {
            await this.documentRef.update({
                "timestamp.deleted_at": moment().unix()
            });
        } else await this.documentRef.delete();
        return this.id
    }

}

module.exports = FirestoreCollectionModel;