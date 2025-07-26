"use strict"

const modelsInit = ({ lib, swLib }) => {
    return {
        prefab: require('./prefab').init({ lib, swLib }),
        profiles: require('./profiles').init({ lib, swLib }),
    }
}

module.exports = { modelsInit };
