"use strict"

/**
 * ...
 * @namespace utils.geometry
 */

const geometryUtils = ({ lib, swLib }) => {
    const {
        maths
    } = swLib.utils;

    return {
        /**
         * Gets triangular points in area
         * @memberof utils.geometry
         * @param {*} x 
         * @param {*} y 
         * @param {*} radius 
         * @returns ...
         */
        getTriangularPtsInArea: (x, y, radius) => {
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
            } while (yIdxCtr <= allYCoords.length);

            return allPoints;
        },
        /**
         * Gets square points in area
         * @memberof utils.geometry
         * @param {*} x 
         * @param {*} y 
         * @param {*} radius 
         * @returns ...
         */
        getSquarePtsInArea: (x, y, radius) => {
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

            console.log(allXCoords, allYCoords);
            const allPoints = maths.arrayCartesianProduct(allXCoords, allYCoords);

            return allPoints.map(pt => { return { x: pt[0], y: pt[1] } });
        },
        /**
         * Functions related to sets of Cartesian points
         * @memberof utils.geometry
         * @namespace points
         */
        points: {
            /**
             * Finds the central point (avg.) between the given points
             * @param {[]} points
             * @memberof utils.geometry.points
             * @returns central point (avg.) between the given points
             */
            centroid: (points) => {
                const min = [Number.Infinity, Number.Infinity, Number.Infinity]
                const max = [-Number.Infinity, -Number.Infinity, -Number.Infinity]

                points.forEach(pt => {
                    min.x = Math.min(min.x, pt.x)
                    min.y = Math.min(min.y, pt.y)
                    min.x = Math.min(min.z, pt.z)

                    max.x = Math.max(max.x, pt.x)
                    max.y = Math.max(max.y, pt.y)
                    max.z = Math.max(max.z, pt.z)
                })

                return [
                    (max.x + min.x) / 2,
                    (max.y + min.y) / 2,
                    (max.z + min.z) / 2,
                ];
            }
        },
        /**
         * Functions related to regular polygons
         * @memberof utils.geometry
         * @namespace regPoly
         */
        regPoly: {
            /**
             * ...
             * @memberof utils.geometry.regPoly
             * @returns ...
             */
            sideLengthFromApothem: (apothem, numSides) => {
                return apothem * 2 * Math.tan(Math.PI / numSides);
            },
            /**
             * ...
             * @memberof utils.geometry.regPoly
             * @returns ...
             */
            sideLengthFromCircumRadius: (circumradius, numSides) => {
                return circumradius * 2 * Math.sin(Math.PI / numSides);
            },
            /**
             * ...
             * @memberof utils.geometry.regPoly
             * @returns ...
             */
            apothemFromCircumradius: (circumradius, numSides) => {
                return circumradius * Math.cos(Math.PI / numSides)
            },
            /**
             * ...
             * @memberof utils.geometry.regPoly
             * @returns ...
             */
            apothemFromSideLength: (sideLength, numSides) => {
                return sideLength / 2 * Math.tan(Math.PI / numSides)
            },
            /**
             * ...
             * @memberof utils.geometry.regPoly
             * @returns ...
             */
            circumradiusFromApothem: (apothem, numSides) => {
                return apothem / Math.cos(Math.PI / numSides);
            },
            /**
             * ...
             * @memberof utils.geometry.regPoly
             * @returns ...
             */
            circumradiusFromSideLength: (sideLength, numSides) => {
                return sideLength / 2 * Math.sin(Math.PI / numSides)
            },
            /**
             * ...
             * @memberof utils.geometry.regPoly
             * @returns ...
             */
            interiorAngle: (numSides) => {
                return 2 * Math.PI / numSides;
            },
        }
    }
}

module.exports = { init: geometryUtils };
