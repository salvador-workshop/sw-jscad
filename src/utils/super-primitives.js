"use strict"

/**
 * ...
 * @namespace utils.superPrimitives
 */


//-----------
// TO-DO
//---------------------
// - Cylinders with rounded corners
//---------------------

const superPrimitivesInit = ({ lib, swLib }) => {
    const { cuboid, cylinder } = lib.primitives
    const { expand } = lib.expansions
    const { translate } = lib.transforms
    const { subtract, union } = lib.booleans
    const { measureBoundingBox } = lib.measurements

    const { geometry, maths } = swLib.utils

    /**
     * Builds a flat mesh panel model. Mesh thickness is determined by `size[2]`
     * @param {*} opts 
     * @param {[]} opts.size
     * @param {Number} opts.radius - radius
     * @param {Number} opts.segments - # of segments in mesh holes
     * @param {Number} opts.edgeMargin - distance between edges and mesh holes
     * @param {String} opts.pattern - 'tri' (default) or 'square'
     * @returns 
     */
    const meshPanel = ({ size, radius, segments, edgeMargin, pattern = 'tri' }) => {
        console.log(size, radius, segments)
        const punchSpecs = {
            radius: radius,
            height: size[2] * 2,
            segments,
        }
        const panelSpecs = {
            radius: radius + (size[2] / 2),
            edgeMargin: edgeMargin || radius * 2,
        }
        panelSpecs.length = size[0] - (panelSpecs.edgeMargin * 2)
        panelSpecs.width = size[1] - (panelSpecs.edgeMargin * 2)
        panelSpecs.height = size[2]

        const basePlate = cuboid({ size });

        const punch = cylinder(punchSpecs);

        let punchPoints = geometry.getTriangularPtsInArea(panelSpecs.length, panelSpecs.width, panelSpecs.radius)
        if (pattern === 'square') {
            punchPoints = geometry.getSquarePtsInArea(panelSpecs.length, panelSpecs.width, panelSpecs.radius)
        }
        console.log('punchPoints', punchPoints)

        const parts = [basePlate]
        punchPoints.forEach(punchPt => {
            parts.push(translate([punchPt.x, punchPt.y, 0], punch))
        });

        return subtract(...parts)
    }

    /**
     * Builds a flat mesh panel model. Mesh thickness is determined by `size[2]`
     * @param {*} param0 
     * @returns 
     */
    const meshCuboid = ({ size, meshPanelThickness, edgeMargin, radius, segments }) => {
        const specs = {
            marginOffset: edgeMargin * 2,
            meshPanelThickness: meshPanelThickness || maths.inchesToMM(3 / 32),
        }
        const baseCuboid = cuboid({ size })
        const baseCuboidBb = measureBoundingBox(baseCuboid);

        // [x,y,z (default)]
        const mPanelSpecs = [
            {
                size: [size[2], size[1], specs.meshPanelThickness / 2],
                rotation: [0, Math.PI / 2, 0],
                scaleFactors: [size[0] / specs.meshPanelThickness * 3, 1, 1],
            },
            {
                size: [size[0], size[2], specs.meshPanelThickness / 2],
                rotation: [Math.PI / 2, 0, 0],
                scaleFactors: [1, size[1] / specs.meshPanelThickness * 3, 1],
            },
            {
                size: [size[0], size[1], specs.meshPanelThickness / 2],
                rotation: [0, 0, 0],
                scaleFactors: [1, 1, size[2] / specs.meshPanelThickness * 3],
            },
        ]

        console.log('mPanelSpecs', mPanelSpecs)

        const parts = []
        mPanelSpecs.forEach(mPanelSpec => {
            const panelFrame = subtract(
                cuboid({ size: mPanelSpec.size }),
                cuboid({
                    size: [
                        mPanelSpec.size[0] - specs.marginOffset,
                        mPanelSpec.size[1] - specs.marginOffset,
                        mPanelSpec.size[2]]
                })
            )
            const rotatedPanel = rotate(mPanelSpec.rotation, union(panelFrame, meshPanel({
                size: mPanelSpec.size,
                radius,
                segments,
            })));

            parts.push(align({ modes: ['min', 'min', 'min'], relativeTo: baseCuboidBb[0] }, rotatedPanel))
            parts.push(align({ modes: ['max', 'max', 'max'], relativeTo: baseCuboidBb[1] }, rotatedPanel))
        });

        return union(...parts)
    }

    return {
        /**
         * Frame cuboid
         * @memberof utils.superPrimitives
         * @param {*} param0 
         * @returns ...
         */
        frameCuboid: ({ size, frameWidth }) => {
            console.log(`frameCuboid() size = ${JSON.stringify(size)}, frameWidth = ${JSON.stringify(frameWidth)}`);
            const outerCuboid = cuboid({ size });

            return outerCuboid;
        },
        meshPanel,
        meshCuboid,
        /**
         * ...
         * @param {*} opts 
         * @returns ...
         */
        meshCylinder: ({ }) => {
            return 0
        },
    }
}

module.exports = { init: superPrimitivesInit };
