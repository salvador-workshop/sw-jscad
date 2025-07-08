"use strict"

/**
 * Triangle calculations
 * @memberof utils.geometry
 * @namespace triangle
 */

const geoTriangle = ({ lib, swLib }) => {
    const { measureDimensions, measureBoundingBox, measureCenter } = lib.measurements;
    const { TAU } = lib.maths.constants

    const getTriangleCtrlPoints = (points) => {
        return null;
    }

    const centroid = (points) => {
        return null;
    }

    const orthocentre = (points) => {
        return null;
    }

    const circumcentre = (points) => {
        return null;
    }

    const circumradius = (points) => {
        return null;
    }

    const incentre = (points) => {
        return null;
    }

    const incircleRadius = (points) => {
        return null;
    }

    const eulerLine = (points) => {
        return null;
    }

    /**
     * ...
     * @param {object} opts 
     * @param {number} opts.hypot 
     * @param {number} opts.long 
     * @param {number} opts.short 
     * @param {number} opts.longAngle 
     * @param {number} opts.shortAngle 
     * @returns If valid, returns triangle creation strategy (AAS, ASA, SAS, etc) and values for `jscad.primitives.triangle()`. If invalid, returns `null`
     */
    const rightTriangleOpts = ({
        hypot,
        long,
        short,
        longAngle,
        shortAngle,
    }) => {

        const isValueValid = (val) => {
            return typeof val == 'number' && val >= 0
        }

        const sides = { hypot, long, short }
        const angles = { longAngle, shortAngle }

        const validSides = Object.entries(sides).filter(([sideName, sideVal]) => {
            return isValueValid(sideVal)
        })
        const validAngles = Object.entries(angles).filter(([angleName, angleVal]) => {
            return isValueValid(angleVal)
        })

        if (validSides.length == 0 && validAngles.length == 0) {
            return null
        }

        const sideKeys = validSides.map(vSide => vSide[0]);
        const angleKeys = validAngles.map(vSide => vSide[0]);

        // follows JSCAD defaults
        let outType = 'SSS'
        let outValues = [1, 1, 1]

        if (validSides.length == 3) {
            outType = 'SSS'
            outValues = [short, hypot, long]
        } else if (sideKeys.includes('long') && sideKeys.includes('short')) {
            outType = 'SAS'
            outValues = [short, TAU / 4, long]
        } else if (sideKeys.includes('long') && angleKeys.includes('shortAngle')) {
            outType = 'AAS'
            outValues = [TAU / 4, shortAngle, long]
        } else if (sideKeys.includes('short') && angleKeys.includes('longAngle')) {
            outType = 'AAS'
            outValues = [TAU / 4, longAngle, short]
        } else if (sideKeys.includes('hypot') && angleKeys.includes('longAngle') && angleKeys.includes('shortAngle')) {
            outType = 'ASA'
            outValues = [longAngle, hypot, shortAngle]
        }

        return {
            type: outType,
            values: outValues,
        }
    }

    return {
        getTriangleCtrlPoints,
        centroid,
        orthocentre,
        circumcentre,
        circumradius,
        incentre,
        incircleRadius,
        eulerLine,
        rightTriangleOpts,
    }
}

module.exports = { init: geoTriangle };
