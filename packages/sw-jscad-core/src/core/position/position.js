"use strict"

const posCuboid = require('./pos-cuboid');
const posRectangle = require('./pos-rectangle');
const posTriangle = require('./pos-triangle');

/**
 * ...
 * @memberof core
 * @namespace position
 */

const positionUtils = ({ lib, swLib }) => {
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

    /**
     * Gets 3D bounding coordinates of a given geometry
     * @memberof core.position
     * @param {object} geom 
     * @returns Bounding coords (right, left, back, front, top, bottom)
     */
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
     * Finds long axis of a coord set
     * @memberof core.position
     * @param {number[]} size - [x, y, z]
     * @returns axis with longest value (either "x", "y", or "z") or `null` if invalid
     */
    const findLongAxis = (size) => {
        const is2d = size.length == 2 && size.every(sizeNum => typeof sizeNum === 'number' && sizeNum > 0)
        const is3d = size.length == 3 && size.every(sizeNum => typeof sizeNum === 'number' && sizeNum > 0)

        if (!is2d && !is3d) {
            return null
        }

        const maxDim = Math.max(...size)
        const maxDimIdx = size.indexOf(maxDim)
        const axes = ['x', 'y', 'z']

        return axes[maxDimIdx]
    }

    const position = {
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
    const preLib = {...swLib}
    preLib.core.position = position
    console.log(preLib)

    return {
        ...position,
        cuboid: posCuboid.init({ lib, swLib: preLib }),
        rectangle: posRectangle.init({ lib, swLib: preLib }),
        triangle: posTriangle.init({ lib, swLib: preLib }),
    }
}

module.exports = { init: positionUtils };
