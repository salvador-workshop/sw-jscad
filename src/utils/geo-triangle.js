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
        // follows JSCAD defaults
        let outType = 'SSS'
        let outValues = [1, 1, 1]

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

        const sideKeys = Object.keys(validSides);
        const angleKeys = Object.keys(validAngles);

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

    const solve30DegRtTriangle = ({
        hypot,
        long,
        short,
    }) => {
        const invalidHypot = typeof hypot != 'number' || hypot < 0
        const invalidShort = typeof short != 'number' || short < 0
        const invalidLong = typeof long != 'number' || long < 0

        if (invalidHypot && invalidShort && invalidLong) {
            // we need at least one valid value
            return null;
        }

        const sides = [hypot, long, short];
        const firstValidIdx = sides.findIndex(sideVal => !!sideVal)

        let outHypot = 0;
        let outLong = 0;
        let outShort = 0;

        switch (firstValidIdx) {
            case 0:
                outHypot = hypot;
                outLong = hypot / 2 * Math.sqrt(3);
                outShort = hypot / 2;
                break;
            case 1:
                outHypot = long / Math.sqrt(3) * 2;
                outLong = long;
                outShort = long / Math.sqrt(3);
                break;
            case 2:
                outHypot = short * 2;
                outLong = short * Math.sqrt(3);
                outShort = short;
                break;
        }

        return {
            hypot: outHypot,
            long: outLong,
            short: outShort,
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
        solve30DegRtTriangle,
        rightTriangleOpts,
    }
}

module.exports = { init: geoTriangle };
