"use strict"

/**
 * Cuboid calculations
 * @memberof core.position
 * @namespace cuboid
 */

const geoCuboid = ({ lib, swLib }) => {
    const {
        measureDimensions,
        measureBoundingBox,
        measureCenter
    } = lib.measurements;

    const { position } = swLib.core

    /**
     * ...
     * @memberof core.position.cuboid
     * @param {object} cuboidGeom 
     * @returns ...
     */
    const getCuboidCoords = (cuboidGeom) => {
        return position.getGeomCoords(cuboidGeom)
    }

    /**
     * ...
     * @memberof core.position.cuboid
     * @param {object} cuboidGeom 
     * @returns ...
     */
    const getCuboidCorners = (cuboidGeom) => {
        const bBox = measureBoundingBox(cuboidGeom);

        const coords = getCuboidCoords(cuboidGeom);
        return {
            c1: bBox[1],
            c2: [coords.left, coords.back, coords.top],
            c3: [coords.right, coords.front, coords.top],
            c4: [coords.left, coords.front, coords.top],
            c5: [coords.right, coords.back, coords.bottom],
            c6: [coords.left, coords.back, coords.bottom],
            c7: [coords.right, coords.front, coords.bottom],
            c8: bBox[0],
        }
    }

    /**
     * ...
     * @memberof core.position.cuboid
     * @param {object} cuboidGeom 
     * @returns ...
     */
    const getCuboidCentre = (cuboidGeom) => {
        return measureCenter(cuboidGeom);
    }

    /**
     * ...
     * @memberof core.position.cuboid
     * @param {*} cuboidGeom 
     * @returns ...
     */
    const getCuboidCtrlPoints = (cuboidGeom) => {
        const bBox = measureBoundingBox(cuboidGeom);
        const dims = measureDimensions(cuboidGeom);

        const coords = getCuboidCoords(cuboidGeom);
        const corners = getCuboidCorners(cuboidGeom);
        const centre = getCuboidCentre(cuboidGeom);

        const edgeMidpoints = {
            e1: [coords.right, centre[1], coords.bottom], // midpoint of edge (Y axis, +Y, +Z)
            e2: [centre[0], coords.back, coords.bottom], // midpoint of edge (X axis, +Y, +Z)
            e3: [coords.left, centre[1], coords.bottom], // midpoint of edge (Y axis, -Y, -Z)
            e4: [centre[0], coords.front, coords.bottom], // midpoint of edge (X axis, -Y, -Z)
            e5: [centre[0], centre[1], centre[2]], // midpoint of edge (Z axis, +X, +Z)
            e6: [centre[0], centre[1], centre[2]], // midpoint of edge (Z axis, -X, +Z)
            e7: [centre[0], centre[1], centre[2]], // midpoint of edge (Z axis, -X, -Z)
            e8: [centre[0], centre[1], centre[2]], // midpoint of edge (Z axis, +X, -Z)
            e9: [coords.right, centre[1], coords.top], // midpoint of edge (Y axis, +X, +Y)
            e10: [centre[0], coords.back, coords.top], // midpoint of edge (X axis, +X, +Y)
            e11: [coords.left, centre[1], coords.top], // midpoint of edge (Y axis, -X, -Y)
            e12: [centre[0], coords.front, coords.top], // midpoint of edge (X axis, -X, -Y)
        };

        const faceMidpoints = {
            f1: [coords.right, centre[1], centre[2]], // right (+X)
            f2: [coords.left, centre[1], centre[2]], // left (-X)
            f3: [centre[0], coords.back, centre[2]], // back (+Y)
            f4: [centre[0], coords.front, centre[2]], // front (-Y)
            f5: [centre[0], centre[1], coords.top], // top (+Z)
            f6: [centre[0], centre[1], coords.bottom], // bottom (-Z)
        };

        // i1 to i8 are inside the cuboid, at the centre of each octant
        // (each octant is practically a sub-cuboid)
        const qtrCuboidDims = [dims[0] / 4, dims[1] / 4, dims[2] / 4]
        const internal = {
            i0: centre,
            i1: [
                centre[0] + qtrCuboidDims[0], // octant I (+X, +Y, +Z)
                centre[1] + qtrCuboidDims[1],
                centre[2] + qtrCuboidDims[2],
            ],
            i2: [
                centre[0] - qtrCuboidDims[0], // octant II (-X, +Y, +Z)
                centre[1] + qtrCuboidDims[1],
                centre[2] + qtrCuboidDims[2],
            ],
            i3: [
                centre[0] + qtrCuboidDims[0], // octant III (+X, -Y, +Z)
                centre[1] - qtrCuboidDims[1],
                centre[2] + qtrCuboidDims[2],
            ],
            i4: [
                centre[0] - qtrCuboidDims[0], // octant VI (-X, -Y, +Z)
                centre[1] - qtrCuboidDims[1],
                centre[2] + qtrCuboidDims[2],
            ],
            i5: [
                centre[0] + qtrCuboidDims[0], // octant V (+X, +Y, -Z)
                centre[1] + qtrCuboidDims[1],
                centre[2] - qtrCuboidDims[2],
            ],
            i6: [
                centre[0] - qtrCuboidDims[0], // octant VI (-X, +Y, -Z)
                centre[1] + qtrCuboidDims[1],
                centre[2] - qtrCuboidDims[2],
            ],
            i7: [
                centre[0] + qtrCuboidDims[0], // octant VII (+X, -Y, -Z)
                centre[1] - qtrCuboidDims[1],
                centre[2] - qtrCuboidDims[2],
            ],
            i8: [
                centre[0] - qtrCuboidDims[0], // octant VIII (-X, -Y, -Z)
                centre[1] - qtrCuboidDims[1],
                centre[2] - qtrCuboidDims[2],
            ],
        }

        return {
            ...internal,
            ...corners,
            ...edgeMidpoints,
            ...faceMidpoints,
        };
    }

    return {
        getCuboidCoords,
        getCuboidCorners,
        getCuboidCentre,
        getCuboidCtrlPoints,
    }
}

module.exports = {
    init: geoCuboid,
};
