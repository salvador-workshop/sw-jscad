"use strict"

const geometryInit = ({ lib, swLib }) => {
    return require('./geometry').init({ lib, swLib })
}

module.exports = { geometryInit };
