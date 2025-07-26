"use strict"

/**
 * Builds "foil" shapes such as trefoils, quatrefoils, cinquefoils, etc. Input 2D profiles must be centred at (0, 0, 0)
 * @memberof models.prefab
 * @namespace foils3d
 */

const foilBuilder = ({ lib, swLib }) => {
    const { union, subtract, scission } = lib.booleans
    const { rotate, align, translate, mirror } = lib.transforms
    const { cuboid, rectangle } = lib.primitives
    const { measureBoundingBox } = lib.measurements
    const { extrudeRotate } = lib.extrusions

    /**
     * Builds a 3D n-foil opening using a given 2D cross-section profile
     * @memberof models.prefab.foils3d
     * @instance
     * @param {Object} opts
     * @param {number} opts.numLobes - number of lobes
     * @param {number} opts.radius - radius of container circle
     * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
     * @param {boolean} opts.cutCentre - if true, cuts a circular hole in centre of opening
     * @param {geom2.Geom2} geomProfile - 2D cross-section profile
     * @access private
     */
    const buildFoil3d = (opts, geomProfile) => {
        const centralAngle = Math.PI * 2 / opts.numLobes;
        const sinHalfCentral = Math.sin(centralAngle / 2);
        const isCentreCut = opts.cutCentre || true;

        // this radius has zero overlap between lobe circles
        const lobeRadiusInSlice = sinHalfCentral / (1 + sinHalfCentral) * opts.radius;
        const lobeRadiusDiff = opts.radius / 2 - lobeRadiusInSlice;
        const lobeRadiusMean = lobeRadiusInSlice + (lobeRadiusDiff / 2);

        const lobeRadType = opts.lobeRadiusType || 'mean'
        let lobeRadius = lobeRadiusMean;
        if (lobeRadType === 'inSlice') {
            lobeRadius = lobeRadiusInSlice
        } else if (lobeRadType === 'halfRadius') {
            lobeRadius = opts.radius / 2
        }

        const translatedProfile = translate([lobeRadius, 0, 0], geomProfile);
        const lobeCircle = extrudeRotate({ segments: 48 }, translatedProfile);
        const alignedLobeCircle = translate([0, -(opts.radius - lobeRadius), 0], lobeCircle);

        const lobeCircleBbox = measureBoundingBox(alignedLobeCircle);
        const cutBlockThickness = (lobeCircleBbox[1][2] - lobeCircleBbox[0][2]) * 2;
        const cutBlock1 = rotate([0, 0, centralAngle / 2], align({ modes: ['min', 'center', 'none'] }, cuboid({ size: [lobeRadius, opts.radius * 2, cutBlockThickness] })));
        const cutBlock2 = mirror({ normal: [1, 0, 0] }, cutBlock1);
        const cutBlock = union(cutBlock1, cutBlock2);
        let cutLobe = subtract(alignedLobeCircle, cutBlock);

        const profileBbox = measureBoundingBox(geomProfile);
        const profileSize = [profileBbox[1][0] - profileBbox[0][0], profileBbox[1][1] - profileBbox[0][1]];
        const negProfile = subtract(rectangle({ size: [profileSize[0] + 1, profileSize[1] + 1] }), geomProfile);
        const negProfileCut = subtract(negProfile, translate([(profileSize[0] + 2) / 2, 0, 0], rectangle({ size: [profileSize[0] + 2, profileSize[1] + 2] })));
        const negProfileAdj = translate([profileSize[0] / 2, 0, 0], negProfileCut);

        let centreCircle = extrudeRotate({ segments: 48 }, translate([lobeRadius, 0, 0], negProfileAdj));
        if (opts.numLobes === 3) {
            // special case for trefoils
            if (lobeRadType === 'mean') {
                centreCircle = extrudeRotate({ segments: 48 }, translate([opts.radius * 0.435, 0, 0], negProfileCut));
            }
            else if (lobeRadType === 'inSlice') {
                centreCircle = extrudeRotate({ segments: 48 }, translate([opts.radius * 0.3, 0, 0], negProfileCut));
            }
            else if (lobeRadType === 'halfRadius') {
                centreCircle = extrudeRotate({ segments: 48 }, translate([opts.radius * 0.5, 0, 0], negProfileCut));
            }
        }

        if (isCentreCut) {
            cutLobe = scission(subtract(cutLobe, centreCircle))[0];
        }

        const rotationAngles = [];
        for (let index = 1; index < opts.numLobes; index++) {
            rotationAngles.push(centralAngle * index);
        }

        const rotatedLobes = rotationAngles.map(angle => {
            return rotate([0, 0, angle], cutLobe);
        });

        return union(cutLobe, ...rotatedLobes)
    }

    return {
        buildFoil3d,
        /**
         * Builds a trefoil opening using a given 2d cross-section profile
         * @memberof models.prefab.foils3d
         * @instance
         * @param {Object} opts
         * @param {number} opts.radius - radius of container circle
         * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
         * @param {boolean} opts.cutCentre - if true, cuts a circular hole in centre of opening (only for 3D)
         * @param {geom2.Geom2} geomProfile - 2D cross-section profile
         */
        trefoil: (opts, geomProfile) => {
            return buildFoil3d({ ...opts, numLobes: 3 }, geomProfile);
        },
        /**
         * Builds a quatrefoil opening using a given 2d cross-section profile
         * @memberof models.prefab.foils3d
         * @instance
         * @param {Object} opts
         * @param {number} opts.radius - radius of container circle
         * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
         * @param {boolean} opts.cutCentre - if true, cuts a circular hole in centre of opening (only for 3D)
         * @param {geom2.Geom2} geomProfile - 2D cross-section profile
         */
        quatrefoil: (opts, geomProfile) => {
            return buildFoil3d({ ...opts, numLobes: 4 }, geomProfile);
        },
        /**
         * Builds a cinquefoil opening using a given 2d cross-section profile
         * @memberof models.prefab.foils3d
         * @instance
         * @param {Object} opts
         * @param {number} opts.radius - radius of container circle
         * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
         * @param {boolean} opts.cutCentre - if true, cuts a circular hole in centre of opening (only for 3D)
         * @param {geom2.Geom2} geomProfile - 2D cross-section profile
         */
        cinquefoil: (opts, geomProfile) => {
            return buildFoil3d({ ...opts, numLobes: 5 }, geomProfile);
        },
        /**
         * Builds a sexfoil opening using a given 2d cross-section profile
         * @memberof models.prefab.foils3d
         * @instance
         * @param {Object} opts
         * @param {number} opts.radius - radius of container circle
         * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
         * @param {boolean} opts.cutCentre - if true, cuts a circular hole in centre of opening (only for 3D)
         * @param {geom2.Geom2} geomProfile - 2D cross-section profile
         */
        sexfoil: (opts, geomProfile) => {
            return buildFoil3d({ ...opts, numLobes: 6 }, geomProfile);
        },
        /**
         * Builds an octofoil opening using a given 2d cross-section profile
         * @memberof models.prefab.foils3d
         * @instance
         * @param {Object} opts
         * @param {number} opts.radius - radius of container circle
         * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
         * @param {boolean} opts.cutCentre - if true, cuts a circular hole in centre of opening (only for 3D)
         * @param {geom2.Geom2} geomProfile - 2D cross-section profile
         */
        octofoil: (opts, geomProfile) => {
            return buildFoil3d({ ...opts, numLobes: 8 }, geomProfile);
        },
    }
}

module.exports = { init: foilBuilder };
