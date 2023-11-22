const { nanoid } = require('nanoid');
const { convertObjectToMetaKeyValue } = require("./index")

const helpers = {
    /**
   * Generate a unique nano ID within a collection
   * @param {*} collection 
   * @param {*} size 
   * @returns 
   */
   generateNanoIdWithinCollection: async (collection, size = 8, prefix = null) => {
    const id = prefix ? prefix+'-'+nanoid(size) : nanoid(size);
    if((await collection.doc(id).get()).exists) return helpers.generateNanoIdWithinCollection();
    
    return id;
  },
/**
 * Generate a unique nano ID within an array
 * @param {*} array 
 * @param {*} size 
 * @returns 
 */
  generateNanoIdWithinArray: (array = [], size = 8) => {
    const id =  nanoid(size);
    if(array.find(item => item.id === id)) helpers.generateNanoIdWithinArray();

    return id;
  },

  snapshotsToArray: snapshots => {
      const arr = [];
      if(snapshots.empty) return arr;
      snapshots.forEach(snapshot => {
          arr.push(helpers.snapShotToObject(snapshot))
      })
      return arr;
  },

    snapshotsToObject: snapshots => {
        const obj = {};
        if(snapshots.empty) return obj;
        snapshots.forEach(snapshot => {
            obj[snapshot.ref.id] = helpers.snapShotToObject(snapshot)
        })
        return obj;
    },

    snapShotToObject: snapshot => {
        if (snapshot && snapshot.exists) {
            const data = snapshot.data();
            data._metadata = data.metadata || {};
            data.metadata = convertObjectToMetaKeyValue(data._metadata)
            return {
                id: snapshot.ref.id,
                ...data
            }
        }
        return null
    }
}

module.exports = helpers;