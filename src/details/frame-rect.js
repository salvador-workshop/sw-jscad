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
        },
        cornerStyle: cRoundStyles.round,
    }
    rectangularFrameDefOpts.outCornerOpts = rectangularFrameDefOpts.cornerOpts

    /**
     * ...
     * @param {object} opts 
     * @param {number[]} opts.size
     * @param {object} opts.cornerOpts - options for interior side
     * @param {string} opts.cornerOpts.style - profile type, like "tri45deg", "rectSixtyThirty", "ellipseGolden", "cornerBezSilver"
     * @param {number} opts.cornerOpts.size
     * @param {number} opts.cornerOpts.length
     * @param {number} opts.cornerOpts.width
     * @param {number} opts.cornerOpts.radius
     * @param {string} opts.cornerOpts.longAxis
     * @param {string} opts.cornerOpts.opt - Option for each corner. Choose between "inv", "inset", "offset"
     * @returns ...
     */
    const shapedRectangle = ({
        size,
        cornerOpts = rectangularFrameDefOpts.cornerOpts,
    }) => {
        let outRect = rectangle({ size })
        const outRectCoords = position.getGeomCoords(outRect)
        const outRectCorners = geometry.rectangle.getRectangleCorners(outRect)
        const cornerStyle = cornerStyles[cornerOpts.style]

        const inCornerPieces = []
        const notches = []

        if (cornerStyle) {
            const styleType = cornerStyleTypes.find(cStyleType => cornerStyle.id.startsWith(cStyleType))
            const cornerPiece = cornerStyle.func(cornerOpts)
            const cornerPieceDims = measureDimensions(cornerPiece)

            const baseNotch = rectangle({ size: [cornerPieceDims[0] / 2, cornerPieceDims[1] / 2] })

            Object.entries(outRectCorners).forEach(([cName, cPt]) => {
                let inPieceRotation = [0, 0, 0]
                let inPieceAlign = ['center', 'center', 'center']

                // adjust rotation by type
                if (['rect', 'ellipse'].includes(styleType) && cornerOpts.longAxis == 'y') {
                    inPieceRotation = [0, 0, TAU / 4]
                }

                if (cName == 'c4') {
                    // (-X, -Y)
                    inPieceAlign = ['min', 'min', 'center']
                } else if (cName == 'c3') {
                    // (-X, +Y)
                    inPieceAlign = ['min', 'max', 'center']
                } else if (cName == 'c2') {
                    // (+X, +Y)
                    inPieceAlign = ['max', 'max', 'center']
                } else {
                    // defaults to c1 (+X, -Y)
                    inPieceAlign = ['max', 'min', 'center']
                }

                const newNotch = align(
                    { modes: inPieceAlign, relativeTo: cPt },
                    rotate(inPieceRotation, baseNotch)
                )
                notches.push(newNotch)

                const newInCornerPiece = align(
                    { modes: inPieceAlign, relativeTo: cPt },
                    rotate(inPieceRotation, cornerPiece)
                )
                inCornerPieces.push(newInCornerPiece)
            })

            outRect = subtract(outRect, ...notches)
            outRect = union(outRect, ...inCornerPieces)
        }
        return outRect
    }

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
        const specs = {
            totalSize: [
                frameWidth * 2 + size[0],
                frameWidth * 2 + size[1],
            ],
            longAxis: cornerOpts.longAxis || position.findLongAxis(size)
        }

        const iCornOpts = { ...cornerOpts, longAxis: specs.longAxis }
        const oCornOpts = { ...outCornerOpts, longAxis: specs.longAxis }

        const inRectBase = rectangle({ size })
        const inCornerStyle = cornerStyles[iCornOpts.style]

        const outRectBase = rectangle({ size: specs.totalSize })
        const outCornerStyle = cornerStyles[oCornOpts.style]

        let inRect = inRectBase
        let outRect = outRectBase

        if (direction != 'out' && inCornerStyle) {
            inRect = shapedRectangle({
                size,
                cornerOpts: iCornOpts,
            })
        }

        if (direction != 'in' && outCornerStyle) {
            outRect = shapedRectangle({
                size: specs.totalSize,
                cornerOpts: oCornOpts,
            })
        }

        return subtract(outRect, inRect);
    }

    return {
        rectangularFrame,
    }
}

module.exports = { init: rectangularFrameInit };
