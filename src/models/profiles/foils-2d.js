"use strict"

/**
 * Builds "foil" shapes such as trefoils, quatrefoils, cinquefoils, etc. Input 2D profiles must be centred at (0, 0, 0)
 * @memberof models.profiles
 * @namespace foils2d
 */

const foilBuilder = ({ lib, swLib }) => {
    const { union } = lib.booleans
    const { rotate, align } = lib.transforms
    const { circle  } = lib.primitives

    /**
     * Builds a 2D n-foil opening
     * @memberof models.profiles.foils2d
     * @instance
     * @param {Object} opts
     * @param {number} opts.numLobes - number of lobes
     * @param {number} opts.radius - radius of container circle
     * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
     * @access private
     */
    const buildFoil2d = (opts) => {
        const centralAngle = Math.PI * 2 / opts.numLobes;
        const sinHalfCentral = Math.sin(centralAngle / 2);

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

        const lobeCircle = circle({ radius: lobeRadius });
        const alignedLobeCircle = align({ modes: ['none', 'min'], relativeTo: [0, -opts.radius] }, lobeCircle);
        let centreCircle = lobeCircle;
        if (opts.numLobes === 3) {
            // special case for trefoils
            if (lobeRadType === 'mean') {
                centreCircle = circle({ radius: opts.radius * 0.435 });
            }
            else if (lobeRadType === 'inSlice') {
                centreCircle = circle({ radius: opts.radius * 0.3 });
            }
        }

        const rotationAngles = [];
        for (let index = 1; index < opts.numLobes; index++) {
            rotationAngles.push(centralAngle * index);
        }

        const rotatedLobes = rotationAngles.map(angle => {
            return rotate([0, 0, angle], alignedLobeCircle);
        });

        return union(centreCircle, alignedLobeCircle, ...rotatedLobes);
    }

    return {
        buildFoil2d,
        /**
         * Builds a trefoil opening using a given 2d cross-section profile
         * @memberof models.profiles.foils2d
         * @instance
         * @param {Object} opts
         * @param {number} opts.radius - radius of container circle
         * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
         * @param {boolean} opts.cutCentre - if true, cuts a circular hole in centre of opening (only for 3D)
         * @param {geom2.Geom2} geomProfile - 2D cross-section profile
         */
        trefoil: (opts, geomProfile) => {
            return buildFoil2d({ ...opts, numLobes: 3 });
        },
        /**
         * Builds a quatrefoil opening using a given 2d cross-section profile
         * @memberof models.profiles.foils2d
         * @instance
         * @param {Object} opts
         * @param {number} opts.radius - radius of container circle
         * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
         * @param {boolean} opts.cutCentre - if true, cuts a circular hole in centre of opening (only for 3D)
         * @param {geom2.Geom2} geomProfile - 2D cross-section profile
         */
        quatrefoil: (opts, geomProfile) => {
            return buildFoil2d({ ...opts, numLobes: 4 });
        },
        /**
         * Builds a cinquefoil opening using a given 2d cross-section profile
         * @memberof models.profiles.foils2d
         * @instance
         * @param {Object} opts
         * @param {number} opts.radius - radius of container circle
         * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
         * @param {boolean} opts.cutCentre - if true, cuts a circular hole in centre of opening (only for 3D)
         * @param {geom2.Geom2} geomProfile - 2D cross-section profile
         */
        cinquefoil: (opts, geomProfile) => {
            return buildFoil2d({ ...opts, numLobes: 5 });
        },
        /**
         * Builds a sexfoil opening using a given 2d cross-section profile
         * @memberof models.profiles.foils2d
         * @instance
         * @param {Object} opts
         * @param {number} opts.radius - radius of container circle
         * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
         * @param {boolean} opts.cutCentre - if true, cuts a circular hole in centre of opening (only for 3D)
         * @param {geom2.Geom2} geomProfile - 2D cross-section profile
         */
        sexfoil: (opts, geomProfile) => {
            return buildFoil2d({ ...opts, numLobes: 6 });
        },
        /**
         * Builds an octofoil opening using a given 2d cross-section profile
         * @memberof models.profiles.foils2d
         * @instance
         * @param {Object} opts
         * @param {number} opts.radius - radius of container circle
         * @param {string} opts.lobeRadiusType - "inSlice", "halfRadius", "mean"
         * @param {boolean} opts.cutCentre - if true, cuts a circular hole in centre of opening (only for 3D)
         * @param {geom2.Geom2} geomProfile - 2D cross-section profile
         */
        octofoil: (opts, geomProfile) => {
            return buildFoil2d({ ...opts, numLobes: 8 });
        },
    }
}

module.exports = { init: foilBuilder };
