"use strict"

/**
 * Geometry
 * @memberof core
 * @namespace geometry
 */

const geoRegPoly = require('./geo-reg-poly');

/**
 * Finds the central point (avg.) between the given points
 * @param {number[]} points
 * @memberof core.geometry.points
 * @returns central point (avg.) between the given points
 */
const ptCentroid = (points, mode = '3d') => {
    const min = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
    const max = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]

    points.forEach(pt => {
        min[0] = Math.min(min[0], pt[0])
        min[1] = Math.min(min[1], pt[1])

        max[0] = Math.max(max[0], pt[0])
        max[1] = Math.max(max[1], pt[1])

        if (mode === '3d') {
            min[2] = Math.min(min[2], pt[2])
            max[2] = Math.max(max[2], pt[2])
        }
    })

    let output = [
        (max[0] + min[0]) / 2,
        (max[1] + min[1]) / 2,
    ]
    if (mode === '3d') {
        output = [...output, (max[2] + min[2]) / 2]
    }
    return output;
}

const geometryUtils = ({ lib, swLib }) => {
    const { maths } = swLib.core;

    return {
        /**
         * Gets triangular points in area
         * @memberof core.geometry
         * @param {*} x 
         * @param {*} y 
         * @param {*} radius 
         * @returns ...
         */
        getTriangularPtsInArea: (x, y, radius, centrePoints = true) => {
            const diam = radius * 2;
            const allPoints = [];

            const allYCoords = [];
            let yCoordCtr = 0;
            do {
                allYCoords.push(yCoordCtr);
                yCoordCtr = diam * 0.86603 + yCoordCtr;
            } while (yCoordCtr <= y);

            let yIdxCtr = 0;
            do {
                let xCtr = 0;
                do {
                    if (maths.isEven(yIdxCtr)) {
                        allPoints.push({ x: xCtr, y: allYCoords[yIdxCtr] });
                    } else {
                        allPoints.push({ x: radius + xCtr, y: allYCoords[yIdxCtr] });
                    }
                    xCtr = xCtr + diam;
                } while (xCtr <= x);
                yIdxCtr = yIdxCtr + 1;
            } while (yIdxCtr < allYCoords.length);

            if (!centrePoints) {
                return allPoints
            }

            const simplePts = allPoints.map(pt => [pt.x, pt.y])
            const pointCentroid = ptCentroid(simplePts, '2d');

            return allPoints.map(pt => {
                return {
                    x: pt.x - pointCentroid[0],
                    y: pt.y - pointCentroid[1],
                }
            });
        },
        /**
         * Gets square points in area
         * @memberof core.geometry
         * @param {*} x 
         * @param {*} y 
         * @param {*} radius 
         * @returns ...
         */
        getSquarePtsInArea: (x, y, radius, centrePoints = true) => {
            const diam = radius * 2;
            const allXCoords = [];
            let xCtr = 0;
            do {
                allXCoords.push(xCtr);
                xCtr = xCtr + diam;
            } while (xCtr <= x);

            const allYCoords = [];
            let yCtr = 0;
            do {
                allYCoords.push(yCtr);
                yCtr = yCtr + diam;
            } while (yCtr <= y);

            const allPoints = maths.arrayCartesianProduct(allXCoords, allYCoords);
            const outPts = allPoints.map(pt => { return { x: pt[0], y: pt[1] } });

            if (!centrePoints) {
                return outPts
            }

            const simplePts = outPts.map(pt => [pt.x, pt.y])
            const pointCentroid = ptCentroid(simplePts, '2d');

            return outPts.map(pt => {
                return {
                    x: pt.x - pointCentroid[0],
                    y: pt.y - pointCentroid[1],
                }
            });
        },
        /**
         * Functions related to sets of Cartesian points
         * @memberof core.geometry
         * @namespace points
         */
        points: {
            centroid: ptCentroid,
        },
        regPoly: geoRegPoly.init({ lib, swLib }),
    }
}

module.exports = { init: geometryUtils };
