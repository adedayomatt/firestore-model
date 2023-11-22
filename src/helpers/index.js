const helpers = {

  /**
   * sort an object by the key
   */
  sortObject: (obj) => {
      const sorted = {};
      if(obj) {
        Object.keys(obj).sort().forEach((key) => {
            sorted[key] = obj[key];
        });
      } 
     return sorted;
  },

    /**
     * Convert an object to a key/value pair array
     *
     * @param obj
     * @returns {*[]}
     */
    convertObjectToMetaKeyValue(obj = {}) {
        const arr = [];
        for (let key in obj) {
            arr.push({ key, value: obj[key] })
        }
        return arr;
    },

    /**
     * Conver array of key and value pairs to object
     *
     * @param arr
     * @returns {{}}
     */
    convertMetaKeyValueToObj(arr = []) {
        const obj = {};
        for (let meta of arr) {
            obj[meta.key] = meta.value;
        }
        return obj;
    },

    getObjectItem: (object = {}, address = "", defaultValue = null) => {
        const components = address.split(".");
        if(components.length === 1) {
            let component = components[0];
            let value = object[component];
            return value || defaultValue;
        }
        return helpers.getObjectItem(object[components[0]], components.slice(1).join("."), defaultValue)
    },

    setObjectItem: (object = {}, address = "", value = null) => {
        object = object || {}
        const components = address.split(".");
        if(components.length === 1) {
            return { ...object || {}, [components[0]]: value }
        }
        const parent = components[0];
        let childElement = object[parent] instanceof Object ? object[parent] : {}
        object[parent] = helpers.setObjectItem(childElement, components.slice(1).join("."), value)
        return object;
    }
  
};

module.exports = helpers;