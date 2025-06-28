"use strict"

/**
 * Rectangle calculations
 * @memberof utils.geometry
 * @namespace rectangle
 */

const geoRectangle = ({ lib, swLib }) => {
    const {
        measureDimensions,
        measureBoundingBox,
        measureCenter
    } = lib.measurements;

    const getRectangleCoords = (rectGeom) => {
        const bBox = measureBoundingBox(rectGeom);

        return {
            right: bBox[1][0], // (+X)
            left: bBox[0][0], // (-X)
            back: bBox[1][1], // (+Y)
            front: bBox[0][1], // (-Y)
        }
    }

    const getRectangleCorners = (rectGeom) => {
        const bBox = measureBoundingBox(rectGeom);

        const coords = getRectangleCoords(rectGeom);
        return {
            c1: bBox[1], // (+X, +Y)
            c2: [coords.right, coords.front, 0], // (+X, -Y)
            c3: bBox[0], // (-X, -Y)
            c4: [coords.left, coords.back, 0], // (-X, +Y)
        }
    }

    const getRectangleCentre = (rectGeom) => {
        return measureCenter(rectGeom);
    }

    const getRectangleCtrlPoints = (rectGeom) => {
        const bBox = measureBoundingBox(rectGeom);
        const dims = measureDimensions(rectGeom);

        const coords = getRectangleCoords(rectGeom);
        const corners = getRectangleCorners(rectGeom);
        const centre = getRectangleCentre(rectGeom);

        const edgeMidpoints = {
            e1: [centre[0], centre[1], centre[2]], // midpoint of edge (X axis, +Y,)
            e2: [centre[0], centre[1], centre[2]], // midpoint of edge (X axis, -Y,)
            e3: [centre[0], centre[1], centre[2]], // midpoint of edge (Y axis, +X,)
            e4: [centre[0], centre[1], centre[2]], // midpoint of edge (Y axis, -X,)
        }

        // i1 to i4 are inside the rectangle, at the centre of each quadrant
        // (each quadrant is practically a sub-rectangle)
        const internal = {
            i0: centre,
            i1: [0, 0, 0], // quadrant I (+X, +Y)
            i2: [0, 0, 0], // quadrant II (-X, +Y)
            i3: [0, 0, 0], // quadrant III (-X, -Y)
            i4: [0, 0, 0], // quadrant VI (+X, -Y)

        }

        return {
            ...internal,
            ...corners,
            ...edgeMidpoints,
        };
    }

    return {
        getRectangleCoords,
        getRectangleCorners,
        getRectangleCentre,
        getRectangleCtrlPoints,
    }
}

module.exports = { init: geoRectangle };
