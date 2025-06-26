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

    const { maths } = swLib.core
    const { geometry } = swLib.utils

    const getPunchPoints = (pattern, length, width, radius) => {
        let punchPoints = geometry.getTriangularPtsInArea(length, width, radius)
        if (pattern === 'square') {
            punchPoints = geometry.getSquarePtsInArea(length, width, radius)
        }
        return punchPoints
    }

    /**
     * Builds a flat mesh panel model. Mesh thickness is determined by `size[2]`
     * @param {*} opts 
     * @param {[]} opts.size
     * @param {Number} opts.radius - radius
     * @param {Number} opts.segments - # of segments in mesh holes
     * @param {Number} opts.edgeMargin - distance between edges and mesh holes
     * @param {String} opts.pattern - 'tri' (default) or 'square'
     * @param {String} opts.patternMode - 'contain' (default) or 'fill'
     * @returns ...
     */
    const meshPanel = ({
        size,
        radius,
        segments = 16,
        edgeMargin,
        pattern = 'tri',
        patternMode = 'contain',
    }) => {
        const punchSpecs = {
            radius: radius,
            height: size[2] * 2,
            segments,
        }

        const meshSpecs = {
            radius: radius + (size[2] / 2),
            edgeMargin: edgeMargin || radius + size[2],
        }
        meshSpecs.length = size[0] - (meshSpecs.edgeMargin * 2)
        meshSpecs.width = size[1] - (meshSpecs.edgeMargin * 2)
        meshSpecs.height = size[2]

        let outputPanel = null
        const parts = [basePlate]
        const basePlate = cuboid({ size });
        const punch = cylinder(punchSpecs);

        if (patternMode === 'contain') {
            // pattern is neatly contained in the bounding rectangle
            const punchPoints = getPunchPoints(pattern, meshSpecs.length, meshSpecs.width, meshSpecs.radius)
            punchPoints.forEach(punchPt => {
                parts.push(translate([punchPt.x, punchPt.y, 0], punch))
            });

            outputPanel = subtract(...parts)
        }
        else if (patternMode === 'fill') {
            // pattern extends outside the bounding rectangle, and gets cut off
            const punchPoints = getPunchPoints(pattern, size[0], size[1], meshSpecs.radius)
            punchPoints.forEach(punchPt => {
                parts.push(translate([punchPt.x, punchPt.y, 0], punch))
            });

            const punchedPanel = subtract(...parts)
            const panelEdge = subtract(
                basePlate,
                cuboid({ size: [
                    size[0] - (meshSpecs.edgeMargin * 2),
                    size[1] - (meshSpecs.edgeMargin * 2),
                    size[2] * 1.5,
                ] })
            );

            outputPanel = union(punchedPanel, panelEdge)
        }

        return outputPanel
    }

    /**
     * Builds a flat mesh panel model. Mesh thickness is determined by `size[2]`
     * @param {*} param0 
     * @returns ...
     */
    const meshCuboid = ({
        size,
        meshPanelThickness,
        radius,
        segments = 16,
        edgeMargin,
        pattern = 'tri',
        openTop = false,
    }) => {
        const specs = {
            meshPanelThickness: meshPanelThickness || maths.inchesToMm(3 / 32),
            edgeMargin: edgeMargin || radius * 2,
        }
        specs.marginOffset = specs.edgeMargin * 2;

        const baseCuboid = cuboid({ size })
        const baseCuboidBb = measureBoundingBox(baseCuboid);

        // [x,y,z (default)]
        const mPanelSpecs = [
            {
                size: [size[2], size[1], specs.meshPanelThickness],
                rotation: [0, Math.PI / 2, 0],
                scaleFactors: [size[0] / specs.meshPanelThickness * 3, 1, 1],
            },
            {
                size: [size[0], size[2], specs.meshPanelThickness],
                rotation: [Math.PI / 2, 0, 0],
                scaleFactors: [1, size[1] / specs.meshPanelThickness * 3, 1],
            },
            {
                size: [size[0], size[1], specs.meshPanelThickness],
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
    const meshCylinder = ({
        radius,
        height,
        segments = 16,
        thickness = 2,
        edgeMargin,
        edgeInsets = [0, 0],
        edgeOffsets = [0, 0],
        meshRadius,
        meshMinWidth,
        meshSegments = 16,
    }) => {
        const specs = {
            edgeMargin: edgeMargin || meshMinWidth
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

        let numPunchDiscs = 1;
        let htCtr = 0
        let remainingHt = height
        let discHeightInterval = (meshRadius * 2 + meshMinWidth) * 0.86603
        while (htCtr < height) {
            htCtr += discHeightInterval;
            if (htCtr < height) {
                numPunchDiscs += 1
                remainingHt -= discHeightInterval;
            }
        }

        const completePunch = align(
            { modes: ['center', 'center', 'min'], relativeTo: [0, 0, (specs.edgeMargin + remainingHt) / 2 * 0.86603] },
            union(...punches)
        )

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
    const frameCuboid = ({
        size,
        frameWidth,
    }) => {
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
