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
    const { translate, rotate, align } = lib.transforms
    const { subtract, union } = lib.booleans
    const { measureBoundingBox } = lib.measurements
    const { TAU } = lib.maths.constants

    const { geometry, maths } = swLib.utils

    /**
     * Builds a flat mesh panel model. Mesh thickness is determined by `size[2]`
     * @param {*} opts 
     * @param {[]} opts.size
     * @param {Number} opts.radius - radius
     * @param {Number} opts.segments - # of segments in mesh holes
     * @param {Number} opts.edgeMargin - distance between edges and mesh holes
     * @param {String} opts.pattern - 'tri' (default) or 'square'
     * @returns ...
     */
    const meshPanel = ({ size, radius, segments, edgeMargin, pattern = 'tri' }) => {
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

        const parts = [basePlate]
        punchPoints.forEach(punchPt => {
            parts.push(translate([punchPt.x, punchPt.y, 0], punch))
        });

        return subtract(...parts)
    }

    /**
     * Builds a flat mesh panel model. Mesh thickness is determined by `size[2]`
     * @param {*} param0 
     * @returns ...
     */
    const meshCuboid = ({ size, meshPanelThickness, radius, segments, edgeMargin, pattern = 'tri', openTop = false }) => {
        const specs = {
            meshPanelThickness: meshPanelThickness || maths.inchesToMM(3 / 32),
            edgeMargin: edgeMargin || radius * 2,
        }
        specs.marginOffset = specs.edgeMargin * 2;

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

        const parts = []
        mPanelSpecs.forEach((mPanelSpec, idx) => {
            const rotatedPanel = rotate(mPanelSpec.rotation, meshPanel({
                size: mPanelSpec.size,
                radius,
                segments,
                marginOffset: specs.marginOffset,
                pattern,
            }));

            parts.push(align({ modes: ['min', 'min', 'min'], relativeTo: baseCuboidBb[0] }, rotatedPanel))
            const skipTop = openTop && idx == 2;
            if (!skipTop) {
                parts.push(align({ modes: ['max', 'max', 'max'], relativeTo: baseCuboidBb[1] }, rotatedPanel))
            }
        });

        return union(...parts)
    }

    /**
     * ...
     * @param {*} opts 
     * @returns ...
     */
    const meshCylinder = ({ radius, height, segments = 16, thickness = 2, edgeMargin, meshRadius, meshMinWidth, meshSegments = 16 }) => {
        const specs = {
            edgeMargin: edgeMargin || meshRadius * 2
        }

        const baseCylinder = cylinder({ radius, height, segments });
        const cutCylinder = cylinder({ radius: radius - thickness, height: height + radius, segments });
        const baseShape = align(
            { modes: ['center', 'center', 'min'] },
            subtract(baseCylinder, cutCylinder)
        )
        const circumference = TAU * radius;

        let numPunches = 1;
        let circCtr = numPunches * meshRadius;
        while (circCtr < circumference) {
            circCtr += meshRadius * 2 + meshMinWidth;
            if (circCtr < circumference) {
                numPunches += 1
            }
        }

        const punches = []
        for (let idx = 0; idx < numPunches; idx++) {
            const currAngle = idx / numPunches * TAU
            punches.push(rotate([0, 0, currAngle], align(
                { modes: ['min', 'center', 'center'] },
                rotate(
                    [0, Math.PI / 2, 0],
                    cylinder({ radius: meshRadius, height: radius + (meshRadius / 2), segments: meshSegments })
                )
            )))
        }
        const completePunch = align(
            { modes: ['center', 'center', 'min'], relativeTo: [0, 0, specs.edgeMargin] },
            union(...punches)
        )

        let numPunchDiscs = 1;
        let htCtr = specs.edgeMargin
        let discHeightInterval = (meshRadius * 2 + meshMinWidth) * 0.86603
        while (htCtr < height) {
            htCtr += discHeightInterval;
            if (htCtr < height) {
                numPunchDiscs += 1
            }
        }

        let punchedTube = subtract(baseShape, completePunch)
        for (let idx = 0; idx < numPunchDiscs - 1; idx++) {
            const zOffset = discHeightInterval * idx;
            let discRotation = [0, 0, 0]
            if (maths.isOdd(idx)) {
                discRotation = [0, 0, TAU / (numPunches * 2)]
            }
            punchedTube = subtract(punchedTube, translate(
                [0, 0, zOffset],
                rotate(discRotation, completePunch))
            )
        }

        return punchedTube;
    }

    /**
     * Frame cuboid
     * @memberof utils.superPrimitives
     * @param {*} param0 
     * @returns ...
     */
    const frameCuboid = ({ size, frameWidth }) => {
        const outerCuboid = cuboid({ size });

        return outerCuboid;
    }

    return {
        frameCuboid,
        meshPanel,
        meshCuboid,
        meshCylinder,
    }
}

module.exports = { init: superPrimitivesInit };
