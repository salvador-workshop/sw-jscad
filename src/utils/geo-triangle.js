"use strict"

/**
 * Triangle calculations
 * @memberof utils.geometry
 * @namespace triangle
 */

const geoTriangle = ({ lib, swLib }) => {
    const { measureDimensions, measureBoundingBox, measureCenter } = lib.measurements;

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
    }
}

module.exports = { init: geoTriangle };
