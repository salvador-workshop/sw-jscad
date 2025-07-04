"use strict"

/**
 * ...
 * @namespace core.position
 */

const positionUtils = ({ lib }) => {
    const {
        measureDimensions,
        measureBoundingBox,
    } = lib.measurements

    /**
     * Measures key info, and presents it in a readable manner, like `{ size: { x: 99, y: 99, z: 99 }, min: { ... }, max: { ... } }`
     * @memberof core.position
     * @instance
     * @returns ...
     */
    const measure = (inputGeom) => {
        return {
            boundingBox: measureBoundingBox(inputGeom),
            dimensions: measureDimensions(inputGeom),
        }
    };

    const getGeomCoords = (geom) => {
        const bBox = measureBoundingBox(geom);

        return {
            right: bBox[1][0], // (+X)
            left: bBox[0][0], // (-X)
            back: bBox[1][1], // (+Y)
            front: bBox[0][1], // (-Y)
            top: bBox[1][2], // (+Z)
            bottom: bBox[0][2], // (-Z)
        }
    }

    return {
        measure,
        getGeomCoords,
        /**
         * Gets the keypoints for a given object
         * @memberof core.position
         * @instance
         * @returns ...
         */
        getKeypoints: (inputGeom) => {
            // keypoints: box corners, midpoints of edges, midpoints of box faces
            return null;
        }
    }
}

module.exports = { init: positionUtils };
