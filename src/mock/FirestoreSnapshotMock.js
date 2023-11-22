const { nanoid } = require("nanoid")

class FirestoreSnapshotMock {

    constructor(data, id) {
        this.exists = true;
        this.setId(id);
        this.setData(data);
    }

    setId(id) {
        this.ref = {
            id: id || nanoid(8)
        }
    }

    setData(data){
        this._data = data;
    }

    data() {
        return this._data || {};
    }

    async update(data) {
        this.setData(data);
        return data
    }

    async set(data) {
        this.setData(data);
        return data
    }

}

module.exports = FirestoreSnapshotMock;