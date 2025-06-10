"use strict"

/**
 * ...
 * @namespace utils.maths
 */

/**
 * @memberof utils.maths
 * @param {*} a 
 * @param {*} b 
 * @returns ...
 */
const arrayCartesianProduct = (a, b) => a.reduce((acc, x) => [...acc, ...b.map(y => [x, y])], []);

const mathUtils = ({ lib, swLib }) => {
    const {
        INCHES_MM_FACTOR
    } = swLib.core.constants;

    return {
        /**
         * ...
         * @memberof utils.maths
         * @param {*} n 
         * @returns ...
         */
        isEven: (n) => {
            return n % 2 == 0;
        },
        /**
         * ...
         * @memberof utils.maths
         * @param {*} n 
         * @returns ...
         */
        isOdd: (n) => {
            return Math.abs(n % 2) == 1;
        },
        arrayCartesianProduct,
        /**
         * ...
         * @memberof utils.maths
         * @param {*} numInches 
         * @returns ...
         */
        // todo: fix casing typo
        inchesToMM: (numInches) => numInches * INCHES_MM_FACTOR,
        /**
         * ...
         * @memberof utils.maths
         * @param {*} numInches 
         * @returns ...
         */
        mmToInches: (numMils) => numMils / INCHES_MM_FACTOR,
        /**
         * ...
         * @memberof utils.maths
         * @param {*} numInches 
         * @returns ...
         */
        factorize: (num) => {
            const int1 = Math.floor(Math.sqrt(num));
            const rem = num % int1
            if (rem === 0) {
                return [int1, int1]
            }
            const int2 = (num - rem) / int1
            return [int1, int2 + 1]
        },
    }
}


module.exports = { init: mathUtils };
