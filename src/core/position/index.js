"use strict"

const positionInit = ({ lib, swLib }) => {
    return require('./position').init({ lib, swLib })
}

module.exports = { init: positionInit };
