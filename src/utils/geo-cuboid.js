"use strict"

/**
 * Cuboid calculations
 * @memberof utils.geometry
 * @namespace cuboid
 */

const geoCuboid = ({ lib, swLib }) => {
    const {
        measureDimensions,
        measureBoundingBox,
        measureCenter
    } = lib.measurements;

    const getCuboidCoords = (cuboidGeom) => {
        const bBox = measureBoundingBox(cuboidGeom);

        return {
            right: bBox[1][0], // (+X)
            left: bBox[0][0], // (-X)
            back: bBox[1][1], // (+Y)
            front: bBox[0][1], // (-Y)
            top: bBox[1][2], // (+Z)
            bottom: bBox[0][2], // (-Z)
        }
    }

    const getCuboidCorners = (cuboidGeom) => {
        const bBox = measureBoundingBox(cuboidGeom);

        const coords = getCuboidCoords(cuboidGeom);
        return {
            c1: bBox[1], // (+X, +Y, +Z)
            c2: [coords.right, coords.front, coords.top], // (+X, -Y, +Z)
            c3: [coords.left, coords.front, coords.top], // (-X, -Y, +Z)
            c4: [coords.left, coords.back, coords.top], // (-X, +Y, +Z)
            c5: [coords.right, coords.back, coords.bottom], // (+X, +Y, -Z)
            c6: [coords.right, coords.front, coords.bottom], // (+X, -Y, -Z)
            c7: bBox[0], // (-X, -Y, -Z)
            c8: [coords.left, coords.back, coords.bottom], // (-X, +Y, -Z)
        }
    }

    const getCuboidCentre = (cuboidGeom) => {
        return measureCenter(cuboidGeom);
    }

    const getCuboidCtrlPoints = (cuboidGeom) => {
        const bBox = measureBoundingBox(cuboidGeom);
        const dims = measureDimensions(cuboidGeom);

        const coords = getCuboidCoords(cuboidGeom);
        const corners = getCuboidCorners(cuboidGeom);
        const centre = getCuboidCentre(cuboidGeom);

        const edgeMidpoints = {
            e1: [centre[0], centre[1], centre[2]], // midpoint of edge (X axis, +Y, +Z)
            e2: [centre[0], centre[1], centre[2]], // midpoint of edge (X axis, -Y, +Z)
            e3: [centre[0], centre[1], centre[2]], // midpoint of edge (X axis, -Y, -Z)
            e4: [centre[0], centre[1], centre[2]], // midpoint of edge (X axis, +Y, -Z)
            e5: [centre[0], centre[1], centre[2]], // midpoint of edge (Y axis, +X, +Z)
            e6: [centre[0], centre[1], centre[2]], // midpoint of edge (Y axis, -X, +Z)
            e7: [centre[0], centre[1], centre[2]], // midpoint of edge (Y axis, -X, -Z)
            e8: [centre[0], centre[1], centre[2]], // midpoint of edge (Y axis, +X, -Z)
            e9: [centre[0], centre[1], centre[2]], // midpoint of edge (Z axis, +X, +Y)
            e10: [centre[0], centre[1], centre[2]], // midpoint of edge (Z axis, +X, -Y)
            e11: [centre[0], centre[1], centre[2]], // midpoint of edge (Z axis, -X, -Y)
            e12: [centre[0], centre[1], centre[2]], // midpoint of edge (Z axis, -X, +Y)
        };

        const faceMidpoints = {
            f1: [centre[0], centre[1], centre[2]], // right (+X)
            f2: [centre[0], centre[1], centre[2]], // left (-X)
            f3: [centre[0], centre[1], centre[2]], // back (+Y)
            f4: [centre[0], centre[1], centre[2]], // front (-Y)
            f5: [centre[0], centre[1], centre[2]], // top (+Z)
            f6: [centre[0], centre[1], centre[2]], // bottom (-Z)
        };

        // i1 to i8 are inside the cuboid, at the centre of each octant
        // (each octant is practically a sub-cuboid)
        const internal = {
            i0: centre,
            i1: [0, 0, 0], // octant I (+X, +Y, +Z)
            i2: [0, 0, 0], // octant II (-X, +Y, +Z)
            i3: [0, 0, 0], // octant III (+X, -Y, +Z)
            i4: [0, 0, 0], // octant VI (-X, -Y, +Z)
            i5: [0, 0, 0], // octant V (+X, +Y, -Z)
            i6: [0, 0, 0], // octant VI (-X, +Y, -Z)
            i7: [0, 0, 0], // octant VII (+X, -Y, -Z)
            i8: [0, 0, 0], // octant VIII (-X, -Y, -Z)
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
