const FirestoreSnapshotMock = require("../Mock/FirestoreSnapshotMock");

class FirestoreDocMock {

    constructor(id, parent = null) {
        this.setParent(parent);
        this.setPath(id)
    }

    setParent(parent) {
        this.parent = parent
    }

    setPath(id) {
        this.id = id;
        this.path = (this.parent ? this.parent.path : "") + "/" + id
    }

    async get() {
        return this.parent ? this.parent.snapshot : null
    }
}

module.exports = FirestoreDocMock;