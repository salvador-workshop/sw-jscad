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

    const { position } = swLib.core

    const getRectangleCoords = (rectGeom) => {
        return position.getGeomCoords(rectGeom)
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
            e1: [coords.right, centre[1], centre[2]], // midpoint of edge (Y axis, +X,)
            e2: [centre[0], coords.back, centre[2]], // midpoint of edge (X axis, +Y,)
            e3: [coords.left, centre[1], centre[2]], // midpoint of edge (Y axis, -X,)
            e4: [centre[0], coords.front, centre[2]], // midpoint of edge (X axis, -Y,)
        }

        // i1 to i4 are inside the rectangle, at the centre of each quadrant
        // (each quadrant is practically a sub-rectangle)
        const qtrRectDims = [dims[0] / 4, dims[1] / 4, 0]
        const internal = {
            i0: centre,
            i1: [centre[0] + qtrRectDims[0], centre[1] + qtrRectDims[1], centre[2]], // quadrant I (+X, +Y)
            i2: [centre[0] - qtrRectDims[0], centre[1] + qtrRectDims[1], centre[2]], // quadrant II (-X, +Y)
            i3: [centre[0] - qtrRectDims[0], centre[1] - qtrRectDims[1], centre[2]], // quadrant III (-X, -Y)
            i4: [centre[0] + qtrRectDims[0], centre[1] - qtrRectDims[1], centre[2]], // quadrant VI (+X, -Y)

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
