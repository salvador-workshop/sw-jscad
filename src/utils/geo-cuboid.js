"use strict"

/**
 * Cuboid calculations
 * @memberof utils.geometry
 * @namespace cuboid
 */

const geoCuboid = ({ lib, swLib }) => {
    const { measureDimensions, measureBoundingBox } = lib.measurements;

    const getControlPoints = (length, width, height) => {
        return null;
    }

    const centre = (length, width, height) => {
        return null;
    }

    const diagonalLength = (length, width, height) => {
        return null;
    }

    return {
        getControlPoints,
        centre,
        diagonalLength,
    }
}

module.exports = { init: geoCuboid };
