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
    const { cuboid, cylinder, triangle, rectangle } = lib.primitives
    const { expand } = lib.expansions
    const { translate, rotate, align, mirror } = lib.transforms
    const { subtract, union } = lib.booleans
    const { measureBoundingBox, measureDimensions } = lib.measurements
    const { extrudeRotate } = lib.extrusions

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
     * Generates an edge flange profile
     * @param {string} type - "inset" or "offset"
     * @param {number} width 
     * @param {number} thickness 
     * @param {string[]} flipOpts - array of options for flipping ("vertical" or "horizontal")
     */
    const edgeFlangeProfile = (type = 'inset', width, thickness, flipOpts = []) => {
        let triangleAlignOpts = {}
        let triangleMirrorOpts = null
        let bearingSurfaceAlignOpts = {}
        let mirrorOpts = null

        const height = geometry.triangle.solve30DegRtTriangle({ short: width }).long;

        if (type === 'inset') {
            triangleAlignOpts = { modes: ['max', 'min', 'center'], relativeTo: [0, 0, 0] }
            bearingSurfaceAlignOpts = { modes: ['max', 'max', 'center'], relativeTo: [0, 0, 0] }

            if (flipOpts.includes('vertical')) {
                triangleAlignOpts.modes = ['max', 'max', 'center']
                bearingSurfaceAlignOpts.modes = ['max', 'min', 'center']
                triangleMirrorOpts = { normal: [0, 1, 0], origin: [0, -height - thickness, 0] }
            }
        } else if (type === 'offset') {
            triangleAlignOpts = { modes: ['min', 'min', 'center'], relativeTo: [0, 0, 0] }
            bearingSurfaceAlignOpts = { modes: ['min', 'max', 'center'], relativeTo: [0, 0, 0] }
            mirrorOpts = { normal: [1, 0, 0] }

            if (flipOpts.includes('vertical')) {
                triangleAlignOpts.modes = ['max', 'max', 'center']
                bearingSurfaceAlignOpts.modes = ['max', 'min', 'center']
                triangleMirrorOpts = { normal: [0, 1, 0], origin: [0, -height - thickness, 0] }
            }
        } else {
            return null;
        }

        let triangleProfile = triangle({ type: 'SAS', values: [width, TAU / 4, height] });
        if (triangleMirrorOpts != null) {
            triangleProfile = mirror(triangleMirrorOpts, triangleProfile)
        }

        const triangleSection = align(
            triangleAlignOpts,
            triangleProfile
        )

        const bearingSurface = align(
            bearingSurfaceAlignOpts,
            rectangle({ size: [width, thickness] })
        )

        let finalShape = union(bearingSurface, triangleSection);
        if (mirrorOpts != null) {
            finalShape = mirror(mirrorOpts, finalShape)
        }

        return align({ modes: ['center', 'center', 'center'] }, finalShape)
    }

    /**
     * Builds a flat mesh panel model. Mesh thickness is determined by `size[2]`
     * @param {*} opts 
     * @param {number[]} opts.size
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
        const basePlate = cuboid({ size });
        const parts = [basePlate]
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
            const punchPoints = getPunchPoints(
                pattern,
                size[0] + (meshSpecs.radius * 2),
                size[1] + (meshSpecs.radius * 2),
                meshSpecs.radius
            )
            punchPoints.forEach(punchPt => {
                parts.push(translate([punchPt.x, punchPt.y, 0], punch))
            });

            const punchedPanel = subtract(...parts)
            const panelEdge = subtract(
                basePlate,
                cuboid({
                    size: [
                        size[0] - (meshSpecs.edgeMargin * 2),
                        size[1] - (meshSpecs.edgeMargin * 2),
                        size[2] * 1.5,
                    ]
                })
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
        console.log(baseCuboidBb);
        console.log(measureDimensions(baseCuboid));

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
                    cylinder({ radius: meshRadius, height: radius * 2, segments: meshSegments })
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

        let reinforcedTube = baseShape;

        const hasInset = edgeInsets.some(insetVal => insetVal > 0)
        if (hasInset) {
            edgeInsets.forEach((insetWidth, idx) => {
                if (insetWidth === 0) {
                    return
                }
                const isTop = idx === 0;
                let sectionAlignOpts = {}
                let ringAlignOpts = {}
                const flipOpts = []
                if (isTop) {
                    sectionAlignOpts = { modes: ['min', 'min', 'max'], relativeTo: [0, 0, height], }
                    ringAlignOpts = { modes: ['center', 'center', 'max'], relativeTo: [0, 0, height], }
                    flipOpts.push('vertical')
                } else {
                    sectionAlignOpts = { modes: ['min', 'min', 'min'], relativeTo: [0, 0, 0], }
                    ringAlignOpts = { modes: ['center', 'center', 'min'], relativeTo: [0, 0, 0], }
                }
                const insetSection = align(
                    sectionAlignOpts,
                    edgeFlangeProfile('inset', insetWidth, 0.5, flipOpts)
                )
                const insetRing = align(
                    ringAlignOpts,
                    extrudeRotate({ segments }, translate([radius - thickness - insetWidth, 0, 0], insetSection))
                );

                reinforcedTube = union(reinforcedTube, insetRing)
            })
        }

        const hasOffset = edgeOffsets.some(offsetVal => offsetVal > 0)
        if (hasOffset) {
            edgeOffsets.forEach((offsetWidth, idx) => {
                if (offsetWidth === 0) {
                    return
                }
                const isTop = idx === 0;
                let sectionAlignOpts = {};
                let ringAlignOpts = {};
                const flipOpts = []
                if (isTop) {
                    sectionAlignOpts = { modes: ['min', 'min', 'max'], relativeTo: [0, 0, height], }
                    ringAlignOpts = { modes: ['center', 'center', 'max'], relativeTo: [0, 0, height], }
                    flipOpts.push('vertical')
                } else {
                    sectionAlignOpts = { modes: ['min', 'min', 'min'], relativeTo: [0, 0, 0], };
                    ringAlignOpts = { modes: ['center', 'center', 'min'], relativeTo: [0, 0, 0], };
                }
                const offsetSection = align(
                    sectionAlignOpts,
                    edgeFlangeProfile('offset', offsetWidth, 0.5, flipOpts)
                )
                const offsetRing = align(
                    ringAlignOpts,
                    extrudeRotate({ segments }, translate([radius, 0, 0], offsetSection))
                );

                reinforcedTube = union(reinforcedTube, offsetRing)
            })
        }

        let punchedTube = subtract(reinforcedTube, completePunch)
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
        edgeFlangeProfile,
        frameCuboid,
        meshPanel,
        meshCuboid,
        meshCylinder,
    }
}

module.exports = { init: superPrimitivesInit };
