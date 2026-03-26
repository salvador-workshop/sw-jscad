"use strict"

const standards = require("sw-jscad-std-specs/src/core/standards");

/**
 * Builds various 2D profiles
 * @memberof models
 * @namespace profiles
 */

const profileBuilder = ({ lib, swLib }) => {
  const { square, circle, rectangle, triangle, ellipse } = lib.primitives
  const { intersect, union, subtract } = lib.booleans
  const { rotate, align } = lib.transforms
  const { bezier } = lib.curves
  const { geom2, path2 } = lib.geometries

  const { constants, position } = swLib.core


  //-------------
  //  TRIANGLES
  //-------------

  const createRtTriangle = ({ base, height, ratio }) => {
    const validOpts = {
      short: base || height / ratio,
      long: height || base * ratio
    }
    const triOpts = position.triangle.rightTriangleOpts({ ...validOpts })
    return triangle(triOpts);
  }

  /**
   * Triangle profiles
   * @memberof models.profiles
   * @namespace triangle
   */
  const triangles = {
    /**
     * ...
     * @memberof models.profiles.triangle
     * @param {object} opts
     * @returns ...
     */
    equilateral: ({ base }) => {
      return triangle({ type: 'SSS', values: [base, base, base] })
    },
    /**
     * ...
     * @memberof models.profiles.triangle
     * @param {object} opts
     * @returns ...
     */
    right45: ({ base }) => {
      const triOpts = position.triangle.rightTriangleOpts({ short: base, long: base })
      return triangle(triOpts);
    },
    /**
     * ...
     * @memberof models.profiles.triangle
     * @param {object} opts
     * @returns ...
     */
    right30: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: 2 });
    },
    /**
     * ...
     * @memberof models.profiles.triangle
     * @param {object} opts
     * @returns ...
     */
    rightGolden: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.PHI });
    },
    /**
     * ...
     * @memberof models.profiles.triangle
     * @param {object} opts
     * @returns ...
     */
    rightSilver: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.SILVER_RATIO });
    },
    /**
     * ...
     * @memberof models.profiles.triangle
     * @param {object} opts
     * @returns ...
     */
    rightBronze: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.BRONZE_RATIO });
    },
    /**
     * ...
     * @memberof models.profiles.triangle
     * @param {object} opts
     * @returns ...
     */
    rightCopper: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.COPPER_RATIO });
    },
  }


  //--------------
  //  RECTANGLES
  //--------------

  const createRect = ({ length, width, ratio }) => {
    const validSize = [
      length || width * ratio,
      width || length / ratio
    ]
    return rectangle({ size: validSize });
  }

  /**
   * Rectangle profiles
   * @memberof models.profiles
   * @namespace rectangle
   */
  const rectangles = {
    /**
     * ...
     * @memberof models.profiles.rectangle
     * @param {object} opts
     * @returns ...
     */
    golden: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.PHI });
    },
    /**
     * ...
     * @memberof models.profiles.rectangle
     * @param {object} opts
     * @returns ...
     */
    sixtyThirty: ({ length, width }) => {
      return createRect({ length, width, ratio: 2 });
    },
    /**
     * ...
     * @memberof models.profiles.rectangle
     * @param {object} opts
     * @returns ...
     */
    silver: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.SILVER_RATIO });
    },
    /**
     * ...
     * @memberof models.profiles.rectangle
     * @param {object} opts
     * @returns ...
     */
    bronze: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.BRONZE_RATIO });
    },
    /**
     * ...
     * @memberof models.profiles.rectangle
     * @param {object} opts
     * @returns ...
     */
    copper: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.COPPER_RATIO });
    },
    /**
     * ...
     * @memberof models.profiles.rectangle
     * @param {object} opts
     * @returns ...
     */
    superGolden: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.SUPERGOLDEN_RATIO });
    },
    /**
     * ...
     * @memberof models.profiles.rectangle
     * @param {object} opts
     * @returns ...
     */
    plastic: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.PLASTIC_RATIO });
    },
  }


  //----------
  //  CURVES
  //----------

  const getBezierPts = (bezierCurve, segments) => {
    const points = [];
    const segmentsInput = segments - 1
    const totalLength = bezier.length(100, bezierCurve)
    const increment = totalLength / segmentsInput;
    for (let i = 0; i <= segmentsInput; i++) {
      const t = bezier.arcLengthToT({ distance: i * increment }, bezierCurve);
      const point = bezier.valueAt(t, bezierCurve);
      points.push(point);
    }
    return points;
  }

  const createRtCornerCurve = ({ length, width, ratio }) => {
    const validSize = [
      length || width * ratio,
      width || length / ratio
    ]
    const container = rectangle({ size: validSize })
    const bez = bezier.create([
      [0, 0],
      [0, validSize[1]],
      [validSize[0], validSize[1]]
    ])
    const segments = 12
    const bezPts = getBezierPts(bez, segments)
    const bezPath = path2.fromPoints({ closed: true }, [[0, validSize[1]], ...bezPts])
    const bezGeom = align({ modes: ['center', 'center', 'center'] }, geom2.fromPoints(path2.toPoints(bezPath)))
    return subtract(container, bezGeom)
  }

  /**
   * Curve profiles
   * @memberof models.profiles
   * @namespace curves
   */
  const curves = {
    rightCorner: {
      /**
       * ...
       * @memberof models.profiles.curves
       * @param {object} opts
       * @returns ...
       */
      golden: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: constants.PHI })
      },
      /**
       * ...
       * @memberof models.profiles.curves
       * @param {object} opts
       * @returns ...
       */
      sixtyThirty: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: 2 })
      },
      /**
       * ...
       * @memberof models.profiles.curves
       * @param {object} opts
       * @returns ...
       */
      silver: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: constants.SILVER_RATIO })
      },
      /**
       * ...
       * @memberof models.profiles.curves
       * @param {object} opts
       * @returns ...
       */
      bronze: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: constants.BRONZE_RATIO })
      },
      /**
       * ...
       * @memberof models.profiles.curves
       * @param {object} opts
       * @returns ...
       */
      copper: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: constants.COPPER_RATIO })
      },
      /**
       * ...
       * @memberof models.profiles.curves
       * @param {object} opts
       * @returns ...
       */
      superGolden: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: constants.SUPERGOLDEN_RATIO })
      },
      /**
       * ...
       * @memberof models.profiles.curves
       * @param {object} opts
       * @returns ...
       */
      plastic: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: constants.PLASTIC_RATIO })
      },
    },
    // smoothTriangle: {
    //   golden: ({ length, width }) => {
    //     const validSize = [
    //       length || width * constants.PHI,
    //       width || length / constants.PHI
    //     ]
    //     const bez = bezier.create([
    //       [0, 0],
    //       [0, validSize[1]],
    //       [validSize[0], validSize[1]]
    //     ])
    //     const segments = 12
    //     const bezPts = getBezierPts(bez, segments)
    //     return path2.fromPoints({}, bezPts)
    //   },
    // }
  }


  //-----------
  //  ELLIPSE
  //-----------

  const createEllipse = ({ length, width, ratio }) => {
    const validSize = [
      length || width * ratio,
      width || length / ratio
    ]
    return ellipse({ radius: validSize });
  }

  /**
   * Ellipse profiles
   * @memberof models.profiles
   * @namespace ellipse
   */
  const ellipses = {
    /**
     * ...
     * @memberof models.profiles.ellipse
     * @param {object} opts
     * @returns ...
     */
    golden: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.PHI })
    },
    /**
     * ...
     * @memberof models.profiles.ellipse
     * @param {object} opts
     * @returns ...
     */
    sixtyThirty: ({ length, width }) => {
      return createEllipse({ length, width, ratio: 2 })
    },
    /**
     * ...
     * @memberof models.profiles.ellipse
     * @param {object} opts
     * @returns ...
     */
    silver: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.SILVER_RATIO })
    },
    /**
     * ...
     * @memberof models.profiles.ellipse
     * @param {object} opts
     * @returns ...
     */
    bronze: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.BRONZE_RATIO })
    },
    /**
     * ...
     * @memberof models.profiles.ellipse
     * @param {object} opts
     * @returns ...
     */
    copper: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.COPPER_RATIO })
    },
    /**
     * ...
     * @memberof models.profiles.ellipse
     * @param {object} opts
     * @returns ...
     */
    superGolden: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.SUPERGOLDEN_RATIO })
    },
    /**
     * ...
     * @memberof models.profiles.ellipse
     * @param {object} opts
     * @returns ...
     */
    plastic: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.PLASTIC_RATIO })
    },
  }

  //----------
  //  OUTPUT
  //----------

  return {
    /**
     * Square with circular notches at corners.
     * @memberof models.profiles
     * @instance
     * @param {Object} opts 
     * @param {number} opts.sqLength - side length for bounding square 
     * @param {number} opts.notchRadius - radius of circular notch
     */
    sqCornerCircNotch: (opts) => {
      // TODO - fix implementation. Everything assumes that cornerRad === sqLen / 4.
      // So the bounding square probably would be off if it's changed.
      const sqLen = opts.sqLength;
      const halfUnit = sqLen / 2
      const cornerRad = opts.notchRadius || sqLen / 4;
      const centrePoints = [
        [halfUnit, halfUnit],
        [-halfUnit, halfUnit],
        [halfUnit, -halfUnit],
        [-halfUnit, -halfUnit],
      ];

      const baseSquare = square({ size: sqLen });
      const cornerCircles = union(centrePoints.map(cPt => {
        return circle({ radius: cornerRad, center: cPt });
      }));

      return subtract(baseSquare, cornerCircles);
    },
    /**
     * Square with circles at corners.
     * @memberof models.profiles
     * @instance
     * @param {Object} opts 
     * @param {number} opts.sqLength - side length for bounding square 
     * @param {number} opts.cornerRadius - radius of circular corner
     */
    sqCornerCircles: (opts) => {
      // TODO - fix implementation. Everything assumes that cornerRad === baseSqLen / 4.
      // So the bounding square probably would be off if it's changed.
      const sqLen = opts.sqLength;

      const baseSqLen = sqLen * 2 / 3;
      const halfUnit = baseSqLen / 2;
      const cornerRad = opts.cornerRadius || baseSqLen / 4;
      const centrePoints = [
        [halfUnit, halfUnit],
        [-halfUnit, halfUnit],
        [halfUnit, -halfUnit],
        [-halfUnit, -halfUnit],
      ];

      const baseSquare = square({ size: baseSqLen });
      const cornerCircles = union(centrePoints.map(cPt => {
        return circle({ radius: cornerRad, center: cPt });
      }));

      return union(baseSquare, cornerCircles);
    },
    /**
     * Octagonal
     * @memberof models.profiles
     * @instance
     * @param {Object} opts 
     * @param {number} opts.sqLength - side length for bounding square 
     */
    octagonal: (opts) => {
      const sqLen = opts.sqLength;
      // const octagonSideLen = Math.tan(Math.PI / 8) * (sqLen / 2) * 2;

      const baseSquare = square({ size: sqLen });
      const angledSquare = rotate([0, 0, Math.PI / 4], baseSquare);

      return intersect(baseSquare, angledSquare);
    },
    triangle: triangles,
    rectangle: rectangles,
    curves,
    ellipse: ellipses,
  }
}

module.exports = { init: profileBuilder }
