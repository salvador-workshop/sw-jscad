"use strict"

const rectangularFrameInit = ({ lib, swLib }) => {
    const { circle, cuboid, cylinder, triangle, rectangle } = lib.primitives
    const { expand } = lib.expansions
    const { translate, rotate, align, mirror } = lib.transforms
    const { subtract, union } = lib.booleans
    const { measureBoundingBox, measureDimensions } = lib.measurements
    const { extrudeRotate, extrudeLinear } = lib.extrusions
    const { TAU } = lib.maths.constants

    const { position } = swLib.core
    const { geometry } = swLib.utils
    const { profiles } = swLib.details

    // Defining corner styles and available tag options
    const cornerStyleTypes = ['round', 'tri', 'rect', 'ellipse', 'cornerBez']

    const cStyleDefault = { inv: false, inset: true, offset: false }
    const cStRound = { inv: true, offset: true }
    const cStRect = { inv: true, offset: true }
    const cStEllipse = { ...cStRect }
    const cStCornerBez = { inv: true }

    const cRoundStyles = {
        round: {
            id: 'round',
            ...cStyleDefault,
            ...cStRound,
            func: ({ radius }) => {
                return circle({ radius })
            }
        },
    }

    const cTriStyles = {
        tri45deg: {
            id: 'tri45deg',
            ...cStyleDefault,
            func: profiles.triangle.right45
        },
        tri30deg: {
            id: 'tri30deg',
            ...cStyleDefault,
            func: profiles.triangle.right30
        },
        triGolden: {
            id: 'triGolden',
            ...cStyleDefault,
            func: profiles.triangle.rightGolden
        },
        triSilver: {
            id: 'triSilver',
            ...cStyleDefault,
            func: profiles.triangle.rightSilver
        },
        triBronze: {
            id: 'triBronze',
            ...cStyleDefault,
            func: profiles.triangle.rightBronze
        },
        triCopper: {
            id: 'triCopper',
            ...cStyleDefault,
            func: profiles.triangle.rightCopper
        },
    }

    const cStDefRect = {
        ...cStyleDefault,
        ...cStRect,
    }
    const cRectStyles = {
        rectGolden: {
            id: 'rectGolden',
            ...cStDefRect,
            func: profiles.rectangle.golden
        },
        rectSixtyThirty: {
            id: 'rectSixtyThirty',
            ...cStDefRect,
            func: profiles.rectangle.sixtyThirty
        },
        rectSilver: {
            id: 'rectSilver',
            ...cStDefRect,
            func: profiles.rectangle.silver
        },
        rectBronze: {
            id: 'rectBronze',
            ...cStDefRect,
            func: profiles.rectangle.bronze
        },
        rectCopper: {
            id: 'rectCopper',
            ...cStDefRect,
            func: profiles.rectangle.copper
        },
        rectSuperGolden: {
            id: 'rectSuperGolden',
            ...cStDefRect,
            func: profiles.rectangle.superGolden
        },
        rectPlastic: {
            id: 'rectPlastic',
            ...cStDefRect,
            func: profiles.rectangle.plastic
        },
    }

    const cStDefEllipse = {
        ...cStyleDefault,
        ...cStEllipse
    }
    const cEllipseStyles = {
        ellipseGolden: {
            id: 'ellipseGolden',
            ...cStDefEllipse,
            func: profiles.ellipse.golden
        },
        ellipseSixtyThirty: {
            id: 'ellipseSixtyThirty',
            ...cStDefEllipse,
            func: profiles.ellipse.sixtyThirty
        },
        ellipseSilver: {
            id: 'ellipseSilver',
            ...cStDefEllipse,
            func: profiles.ellipse.silver
        },
        ellipseBronze: {
            id: 'ellipseBronze',
            ...cStDefEllipse,
            func: profiles.ellipse.bronze
        },
        ellipseCopper: {
            id: 'ellipseCopper',
            ...cStDefEllipse,
            func: profiles.ellipse.copper
        },
        ellipseSuperGolden: {
            id: 'ellipseSuperGolden',
            ...cStDefEllipse,
            func: profiles.ellipse.superGolden
        },
        ellipsePlastic: {
            id: 'ellipsePlastic',
            ...cStDefEllipse,
            func: profiles.ellipse.plastic
        },
    }

    const cStDefCornBez = {
        ...cStyleDefault,
        ...cStCornerBez,
    }
    const cCornerBezStyles = {
        cornerBezGolden: {
            id: 'cornerBezGolden',
            ...cStDefCornBez,
            func: profiles.curves.rightCorner.golden
        },
        cornerBezSixtyThirty: {
            id: 'cornerBezSixtyThirty',
            ...cStDefCornBez,
            func: profiles.curves.rightCorner.sixtyThirty
        },
        cornerBezSilver: {
            id: 'cornerBezSilver',
            ...cStDefCornBez,
            func: profiles.curves.rightCorner.silver
        },
        cornerBezBronze: {
            id: 'cornerBezBronze',
            ...cStDefCornBez,
            func: profiles.curves.rightCorner.bronze
        },
        cornerBezCopper: {
            id: 'cornerBezCopper',
            ...cStDefCornBez,
            func: profiles.curves.rightCorner.copper
        },
        cornerBezSuperGolden: {
            id: 'cornerBezSuperGolden',
            ...cStDefCornBez,
            func: profiles.curves.rightCorner.superGolden
        },
        cornerBezPlastic: {
            id: 'cornerBezPlastic',
            ...cStDefCornBez,
            func: profiles.curves.rightCorner.plastic
        },
    }

    const cornerStyles = {
        ...cRoundStyles,
        ...cTriStyles,
        ...cRectStyles,
        ...cEllipseStyles,
        ...cCornerBezStyles,
    }

    const rectangularFrameDefOpts = {
        direction: 'in',
        frameWidth: 5,
        cornerOpts: {
            style: 'round',
            radius: 2.5,
        }
    }
    rectangularFrameDefOpts.outCornerOpts = rectangularFrameDefOpts.cornerOpts

    /**
     * Frame rect
     * @memberof utils.superPrimitives
     * @param {object} opts 
     * @param {number[]} opts.size - Size of interior space
     * @param {string} opts.direction - Where ornaments are applied. Choose between "in" (default), "out", or "both"
     * @param {number} opts.frameWidth - Width of frame around interior space
     * @param {object} opts.cornerOpts - options for interior side
     * @param {string} opts.cornerOpts.style - profile type, like "tri45deg", "rectSixtyThirty", "ellipseGolden", "cornerBezSilver"
     * @param {number} opts.cornerOpts.size
     * @param {number} opts.cornerOpts.length
     * @param {number} opts.cornerOpts.width
     * @param {number} opts.cornerOpts.radius
     * @param {string} opts.cornerOpts.longAxis
     * @param {string} opts.cornerOpts.opt - Option for each corner. Choose between "inv", "inset", "offset"
     * @param {object} opts.outCornerOpts - options for exterior side
     * @returns ...
     */
    const rectangularFrame = ({
        size,
        direction = rectangularFrameDefOpts.direction,
        frameWidth = rectangularFrameDefOpts.frameWidth,
        cornerOpts = rectangularFrameDefOpts.cornerOpts,
        outCornerOpts = rectangularFrameDefOpts.outCornerOpts,
    }) => {
        console.log('rectangularFrame', size, direction)
        console.log(frameWidth, cornerOpts, outCornerOpts)

        const specs = {
            totalSize: [
                frameWidth * 2 + size[0],
                frameWidth * 2 + size[1],
            ],
            // TODO - calculate long axis instead of defaulting to 'x'
            longAxis: cornerOpts.longAxis || position.findLongAxis(size)
        }
        console.log(specs)

        const inRectBase = rectangle({ size })
        const inRectBaseCoords = position.getGeomCoords(inRectBase)
        const inRectBaseCtrlPts = geometry.rectangle.getRectangleCtrlPoints(inRectBase)
        const inRectBaseCorners = geometry.rectangle.getRectangleCorners(inRectBase)
        const inCornerStyle = cornerStyles[cornerOpts.style]

        const outRectBase = rectangle({ size: specs.totalSize })
        const outRectBaseCoords = position.getGeomCoords(outRectBase)
        const outRectBaseCtrlPts = geometry.rectangle.getRectangleCtrlPoints(outRectBase)
        const outRectBaseCorners = geometry.rectangle.getRectangleCorners(outRectBase)
        const outCornerStyle = cornerStyles[outCornerOpts.style]

        let inRect = inRectBase
        let outRect = outRectBase
        console.log(inCornerStyle, outCornerStyle)

        if (direction != 'out' && inCornerStyle) {
            const inStyleType = cornerStyleTypes.find(cStyleType => inCornerStyle.id.startsWith(cStyleType))
            const inCornerPieces = Object.entries(inRectBaseCorners).map(([cName, cPt]) => {
                const inCornerPiece = inCornerStyle.func(cornerOpts)
                let inPieceRotation = [0, 0, 0]
                let inPieceAlign = ['center', 'center', 'center']

                if (['rect', 'ellipse'].includes(inStyleType) && specs.longAxis == 'y') {
                    inPieceRotation = [0, 0, TAU / 4]
                }


                if (cName == 'c4') {
                    return align(
                        { modes: inPieceAlign, relativeTo: cPt },
                        rotate(inPieceRotation, inCornerPiece)
                    )
                } else if (cName == 'c3') {
                    return align(
                        { modes: inPieceAlign, relativeTo: cPt },
                        rotate(inPieceRotation, inCornerPiece)
                    )
                } else if (cName == 'c2') {
                    return align(
                        { modes: inPieceAlign, relativeTo: cPt },
                        rotate(inPieceRotation, inCornerPiece)
                    )
                } else {
                    // defaults to c1
                    return align(
                        { modes: inPieceAlign, relativeTo: cPt },
                        rotate(inPieceRotation, inCornerPiece)
                    )
                }
            })
            inRect = union(inRectBase, ...inCornerPieces)
        }

        if (direction != 'in' && outCornerStyle) {
            const outStyleType = cornerStyleTypes.find(cStyleType => outCornerStyle.id.startsWith(cStyleType))
            const outCornerPieces = Object.entries(outRectBaseCorners).map(([cName, cPt]) => {
                const outCornerPiece = outCornerStyle.func(outCornerOpts)
                let outPieceRotation = [0, 0, 0]
                let outPieceAlign = ['center', 'center', 'center']

                if (['rect', 'ellipse'].includes(outStyleType) && specs.longAxis == 'y') {
                    outPieceRotation = [0, 0, TAU / 4]
                }

                if (cName == 'c4') {
                    return align(
                        { modes: outPieceAlign, relativeTo: cPt },
                        rotate(outPieceRotation, outCornerPiece)
                    )
                } else if (cName == 'c3') {
                    return align(
                        { modes: outPieceAlign, relativeTo: cPt },
                        rotate(outPieceRotation, outCornerPiece)
                    )
                } else if (cName == 'c2') {
                    return align(
                        { modes: outPieceAlign, relativeTo: cPt },
                        rotate(outPieceRotation, outCornerPiece)
                    )
                } else {
                    // defaults to c1
                    return align(
                        { modes: outPieceAlign, relativeTo: cPt },
                        rotate(outPieceRotation, outCornerPiece)
                    )
                }
            })
            outRect = union(outRectBase, ...outCornerPieces)
        }

        return subtract(outRect, inRect);
    }

    return {
        rectangularFrame,
    }
}

module.exports = { init: rectangularFrameInit };
