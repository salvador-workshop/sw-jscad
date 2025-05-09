"use strict"

const positionUtils = ({ lib }) => {
    return {
        /**
         * Measures key info, and presents it in a readable manner, like `{ size: { x: 99, y: 99, z: 99 }, min: { ... }, max: { ... } }`
         */
        measure: (inputGeom) => {
            const {
                measureDimensions,
                measureBoundingBox,
            } = lib.measurements

            return {
                boundingBox: measureBoundingBox(inputGeom),
                dimensions: measureDimensions(inputGeom),
            }
        }
    }
}

module.exports = { init: positionUtils };
