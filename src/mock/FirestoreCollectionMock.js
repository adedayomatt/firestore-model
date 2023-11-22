const FirestoreSnapshotMock = require("../Mock/FirestoreSnapshotMock");
const FirestoreDocMock = require("../Mock/FirestoreDocMock");

class FirestoreCollectionMock {

    constructor(path, snapshot) {
        this.path = path;
        this.setSnapshot(snapshot)
    }


    setSnapshot(snapshot) {
        this.snapshot = snapshot
    }

    doc(id) {
        return new FirestoreDocMock(id, this)
    }

    where(field, condition, value) {
        return this
    }

    limit(limit) {
        return this;
    }

    async get() {
        return this.snapshot ? [this.snapshot] : []
    }

    async add(data) {
        return this.snapshot
    }

}

module.exports = FirestoreCollectionMock;