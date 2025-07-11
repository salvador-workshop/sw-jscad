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

    /**
     * ...
     * @param {number[]} size - [x, y, z]
     * @returns axis with longest value (either "x", "y", or "z") or `null` if invalid
     */
    const findLongAxis = (size) => {
        console.log('findLongAxis', size)
        const is2d = size.length == 2 && size.every(sizeNum => typeof sizeNum === 'number' && sizeNum > 0)
        const is3d = size.length == 3 && size.every(sizeNum => typeof sizeNum === 'number' && sizeNum > 0)
        console.log(is2d, is3d)

        if (!is2d && !is3d) {
            return null
        }

        const maxDim = Math.max(...size)
        const maxDimIdx = size.indexOf(maxDim)
        const axes = ['x', 'y', 'z']
        console.log(maxDim, maxDimIdx, axes[maxDimIdx])

        return axes[maxDimIdx]
    }

    return {
        measure,
        getGeomCoords,
        findLongAxis,
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
