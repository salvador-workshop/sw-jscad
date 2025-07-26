"use strict"

/**
 * ...
 * @memberof models.profiles
 * @namespace text2d
 */

const textUtils = ({ lib }) => {
    const { union } = lib.booleans
    const { circle } = lib.primitives
    const { translate } = lib.transforms
    const { vectorText } = lib.text
    const { hullChain } = lib.hulls

    /**
     * Creates a simple 2D line of text
     * @memberof models.profiles.text2d
     * @instance
     * @param {*} param0 
     * @returns ...
     */
    const basicText = (opts) => {
        const lineRadius = opts.charLineWidth / 2
        const lineCorner = circle({ radius: lineRadius })

        const lineSegmentPointArrays = vectorText({ x: 0, y: 0, input: opts.message, height: opts.fontSize }) // line segments for each character
        const lineSegments = []
        lineSegmentPointArrays.forEach((segmentPoints) => { // process the line segment
            const corners = segmentPoints.map((point) => translate(point, lineCorner))
            lineSegments.push(hullChain(corners))
        })
        return union(lineSegments)
    }

    return {
        basicText,
    }
}

module.exports = { init: textUtils };
