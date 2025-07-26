"use strict"

/**
 * ...
 * @namespace utils.transform
 */

const transformUtils = ({ lib, swLib }) => {
    const { subtract } = lib.booleans
    const { measureDimensions } = lib.measurements;
    const { cuboid } = lib.primitives
    const { align, mirror, rotate } = lib.transforms
    const { colorize } = lib.colors

    /**
     * ...
     * @memberof utils.transform
     * @param {object} opts 
     * @param {boolean} opts.reverse 
     * @param {object[]} geoms 
     */
    const stack = ({ reverse = false }, geoms) => {
        let stackHeight = 0
        const geomList = reverse ? geoms.reverse() : geoms
        return geomList.map(geom => {
            const alignedGeom = align({ modes: ['center', 'center', 'min'], relativeTo: [0, 0, stackHeight] }, geom)
            stackHeight = stackHeight + measureDimensions(geom)[2]
            return alignedGeom
        })
    }

    return {
        /**
         * Cuts a given geometry in half.
         * @memberof utils.transform
         * @instance
         * @param {Object} opts
         * @param {string} opts.axis - Axis direction pointing to the remaining geometry. This could be negative, specified like "x" or "-y"
         * @param {Object} geom - Object we're cutting
         * @returns bisected geometry
         */
        bisect3d: (opts, geom) => {
            const geomDims = measureDimensions(geom);
            const baseCutBox = cuboid({
                size: [
                    geomDims[0] + 3,
                    geomDims[1] + 3,
                    geomDims[2] + 3,
                ]
            });
            let alignedCutBox = null;
            const remAxis = opts.axis || 'z';
            switch (remAxis) {
                case "-x":
                    alignedCutBox = align({ modes: ['min', 'center', 'center'] }, baseCutBox);
                    break;
                case "x":
                    alignedCutBox = align({ modes: ['max', 'center', 'center'] }, baseCutBox);
                    break;
                case "-y":
                    alignedCutBox = align({ modes: ['center', 'min', 'center'] }, baseCutBox);
                    break;
                case "y":
                    alignedCutBox = align({ modes: ['center', 'max', 'center'] }, baseCutBox);
                    break;
                case "-z":
                    alignedCutBox = align({ modes: ['center', 'center', 'min'] }, baseCutBox);
                    break;
                case "z":
                default:
                    alignedCutBox = align({ modes: ['center', 'center', 'max'] }, baseCutBox);
            }

            return subtract(
                geom,
                alignedCutBox
            );
        },
        /**
         * Cuts a slice of an object
         * @memberof utils.transform
         * @instance
         * @param {Object} opts
         * @param {number} opts.centralAngle
         * @param {Object} geom - Object we're cutting
         * @returns bisected geometry
         */
        cutCircularSlice: (opts, geom) => {
            const geomDims = measureDimensions(geom);
            const baseCutBox = cuboid({
                size: [
                    geomDims[0] + 3,
                    geomDims[1] + 3,
                    geomDims[2] + 3,
                ]
            });

            const cutBox1 = colorize(
                [0.7, 0.7, 0.1, 0.5],
                rotate([0, 0, opts.centralAngle / 2], align({ modes: ['max', 'center', 'center'] }, baseCutBox))
            );
            const cutBox2 = mirror({ normal: [1, 0, 0] }, cutBox1);
            let cutAssembly = subtract(geom, cutBox1);
            cutAssembly = subtract(cutAssembly, cutBox2);

            return cutAssembly
        },
        stack
    }
}

module.exports = { init: transformUtils };
