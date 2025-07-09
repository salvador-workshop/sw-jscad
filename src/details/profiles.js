"use strict"

/**
 * Builds various 2D profiles
 * @namespace details.profiles
 */

const EDGE_PROFILE_MARGIN = 1;

const profileBuilder = ({ lib, swLib }) => {
  const {
    square,
    circle,
    rectangle,
    triangle,
    ellipse,
  } = lib.primitives
  const { intersect, union, subtract } = lib.booleans
  const { rotate, align, translate, scale, mirror } = lib.transforms
  const { bezier } = lib.curves
  const { path2 } = lib.geometries
  const { measureCenter } = lib.measurements

  const { TAU } = lib.maths.constants

  const { geometry } = swLib.utils
  const { constants, position } = swLib.core

  const createRtTriangle = ({ base, height, ratio }) => {
    const validOpts = {
      short: base || height / ratio,
      long: height || base * ratio
    }
    const triOpts = geometry.triangle.rightTriangleOpts({ ...validOpts })
    return triangle(triOpts);
  }

  const triangles = {
    equilateral: ({ base }) => {
      return triangle({ type: 'SSS', values: [base, base, base] })
    },
    right45: ({ base }) => {
      const triOpts = geometry.triangle.rightTriangleOpts({ short: base, long: base })
      return triangle(triOpts);
    },
    right30: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: 2 });
    },
    rightGolden: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.PHI });
    },
    rightSilver: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.SILVER_RATIO });
    },
    rightBronze: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.BRONZE_RATIO });
    },
    rightCopper: ({ base, height }) => {
      return createRtTriangle({ base, height, ratio: constants.COPPER_RATIO });
    },
  }

  const createRect = ({ length, width, ratio }) => {
    const validSize = [
      length || width * ratio,
      width || length / ratio
    ]
    return rectangle({ size: validSize });
  }

  const rectangles = {
    golden: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.PHI });
    },
    sixtyThirty: ({ length, width }) => {
      return createRect({ length, width, ratio: 2 });
    },
    silver: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.SILVER_RATIO });
    },
    bronze: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.BRONZE_RATIO });
    },
    copper: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.COPPER_RATIO });
    },
    superGolden: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.SUPERGOLDEN_RATIO });
    },
    plastic: ({ length, width }) => {
      return createRect({ length, width, ratio: constants.PLASTIC_RATIO });
    },
  }

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
    const bez = bezier.create([
      [0, 0],
      [0, validSize[1]],
      [validSize[0], validSize[1]]
    ])
    const segments = 12
    const bezPts = getBezierPts(bez, segments)
    return path2.fromPoints({}, bezPts)
  }

  const curves = {
    rightCorner: {
      golden: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: constants.PHI })
      },
      sixtyThirty: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: 2 })
      },
      silver: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: constants.SILVER_RATIO })
      },
      bronze: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: constants.BRONZE_RATIO })
      },
      copper: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: constants.COPPER_RATIO })
      },
      superGolden: ({ length, width }) => {
        return createRtCornerCurve({ length, width, ratio: constants.SUPERGOLDEN_RATIO })
      },
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

  const createEllipse = ({ length, width, ratio }) => {
    const validSize = [
      length || width * ratio,
      width || length / ratio
    ]
    return ellipse({ radius: validSize });
  }

  const ellipses = {
    golden: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.PHI })
    },
    sixtyThirty: ({ length, width }) => {
      return createEllipse({ length, width, ratio: 2 })
    },
    silver: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.SILVER_RATIO })
    },
    bronze: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.BRONZE_RATIO })
    },
    copper: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.COPPER_RATIO })
    },
    superGolden: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.SUPERGOLDEN_RATIO })
    },
    plastic: ({ length, width }) => {
      return createEllipse({ length, width, ratio: constants.PLASTIC_RATIO })
    },
  }

  const straightBeam = ({ length, thickness, flangeThickness, insetWidth = 0, offsetWidth = 0, doubleFlanged = false }) => {
    const baseShape = rectangle({ size: [thickness, length] })
    const baseShapeCoords = position.getGeomCoords(baseShape)
    const offsetWidths = [insetWidth, offsetWidth]
    const fThickness = flangeThickness || thickness

    const offsetShapes = offsetWidths.map(offWidth => {
      if (offWidth == 0) {
        return null
      }
      return union(
        align(
          { modes: ['min', 'max', 'center'] },
          rectangle({ size: [offWidth, fThickness] }),
        ),
        align(
          { modes: ['min', 'min', 'center'] },
          triangles.right30({ base: offWidth }),
        ),
      )
    })

    const adjOffsetShapes = offsetShapes.map((offShape, idx) => {
      if (offShape == null) {
        return null
      }
      // default idx == 0 (inset)
      let adjOffShape = align(
        { modes: ['max', 'min', 'center'], relativeTo: [baseShapeCoords.left, baseShapeCoords.front, 0] },
        offShape
      )
      if (idx == 1) {
        // offset
        adjOffShape = align(
          { modes: ['min', 'min', 'center'], relativeTo: [baseShapeCoords.right, baseShapeCoords.front, 0] },
          mirror({ normal: [1, 0, 0], origin: [thickness / 2, 0, 0] }, offShape)
        )
      }
      return adjOffShape;
    })

    let finalShape = baseShape
    adjOffsetShapes.forEach((oShape, idx) => {
      if (oShape) {
        finalShape = union(finalShape, oShape)
      }
    })

    const mirrored = mirror({ normal: [0, 1, 0] }, finalShape)

    if (doubleFlanged) {
      return union(finalShape, mirrored)
    }

    return mirrored
  }

  const cBeam = ({ length, depth, thickness, flangeThickness, insetWidth, offsetWidth }) => {
    const beam1 = align({ modes: ['center', 'min', 'center'] }, rotate(
      [0, 0, TAU / -4],
      straightBeam({ length, thickness, flangeThickness })
    ))
    const beam2 = align(
      { modes: ['center', 'min', 'center'], relativeTo: [(length + thickness) / -2, 0, 0] },
      straightBeam({ length: depth, thickness, flangeThickness, insetWidth, offsetWidth })
    )
    const beam3 = align(
      { modes: ['center', 'min', 'center'], relativeTo: [(length + thickness) / 2, 0, 0] },
      straightBeam({ length: depth, thickness, flangeThickness, insetWidth, offsetWidth })
    )

    return union(beam1, beam2, beam3)
  }

  const polyBeam = ({ radius, segments, thickness, insetWidth, offsetWidth }) => {
    const beams = []
    const beam = align(
      { modes: ['min', 'min', 'center'], relativeTo: [-insetWidth - (thickness / 2), 0, 0] },
      straightBeam({ length: radius / 2, thickness, insetWidth, offsetWidth })
    )
    for (let idx = 0; idx < segments; idx++) {
      const angle = idx / segments * TAU
      const rotatedBeam = rotate([0, 0, angle], beam)
      beams.push(rotatedBeam)
    }

    return union(...beams)
  }

  const reinforcement = {
    straight: straightBeam,
    corner: ({ length, depth, thickness, flangeThickness, insetWidth = 0, offsetWidth = 0 }) => {
      const beam1 = align(
        { modes: ['min', 'center', 'center'], relativeTo: [insetWidth, 0, (thickness + offsetWidth) / 2] },
        rotate([0, 0, TAU / -4], straightBeam({ length, thickness, flangeThickness, insetWidth, offsetWidth }))
      )
      const beam2 = align({ modes: ['min', 'min', 'center'], relativeTo: [-insetWidth + thickness, 0, 0] },
        straightBeam({ length: depth, thickness, flangeThickness, insetWidth, offsetWidth })
      )

      return union(beam1, beam2)
    },
    cBeam,
    uBeam: cBeam,
    tBeam: ({ length, depth, thickness, flangeThickness, insetWidth, offsetWidth }) => {
      const beam1 = align({ modes: ['center', 'min', 'center'] }, rotate(
        [0, 0, TAU / -4],
        straightBeam({ length, thickness, flangeThickness, insetWidth, doubleFlanged: true })
      ))
      const beam2 = align(
        { modes: ['center', 'min', 'center'] },
        straightBeam({ length: depth, thickness, flangeThickness, insetWidth, offsetWidth })
      )

      return union(beam1, beam2)
    },
    doubleTBeam: ({ length, depth, thickness, flangeThickness, insetWidth, offsetWidth }) => {
      const beamPoints = [length / 3 - (length / 2), length * 2 / 3 - (length / 2)]
      const beam1 = align({ modes: ['center', 'min', 'center'] }, rotate(
        [0, 0, TAU / -4],
        straightBeam({ length, thickness, flangeThickness, insetWidth, doubleFlanged: true })
      ))
      const beam2 = align(
        { modes: ['center', 'min', 'center'], relativeTo: [beamPoints[0], 0, 0] },
        straightBeam({ length: depth, thickness, flangeThickness, insetWidth, offsetWidth })
      )
      const beam3 = align(
        { modes: ['center', 'min', 'center'], relativeTo: [beamPoints[1], 0, 0] },
        straightBeam({ length: depth, thickness, flangeThickness, insetWidth, offsetWidth })
      )

      return union(beam1, beam2, beam3)
    },
    triBeam: ({ radius, thickness, insetWidth, offsetWidth }) => {
      return polyBeam({ radius, segments: 3, thickness, insetWidth, offsetWidth })
    },
    crossBeam: ({ radius, thickness, insetWidth, offsetWidth }) => {
      return polyBeam({ radius, segments: 4, thickness, insetWidth, offsetWidth })
    },
    pentaBeam: ({ radius, thickness, insetWidth, offsetWidth }) => {
      return polyBeam({ radius, segments: 5, thickness, insetWidth, offsetWidth })
    },
    hexBeam: ({ radius, thickness, insetWidth, offsetWidth }) => {
      return polyBeam({ radius, segments: 6, thickness, insetWidth, offsetWidth })
    },
  }

  /**
   * Edge profile: Circular notch in bottom half
   * @memberof details.profiles.edge
   * @instance
   * @param {Object} opts 
   * @param {number} opts.totalThickness - total thickness of edge
   * @param {number} opts.topThickness - thickness of top (left intact by ornaments)
   * @param {number} opts.smallOffset - small offset between notch and main edge
   */
  const circNotch = (opts) => {
    const ornamentThickness = opts.totalThickness - opts.topThickness;
    const smallOffset = opts.smallOffset || ornamentThickness / 6;
    const notchRadius = ornamentThickness - (smallOffset * 2);
    const profileWidth = smallOffset * 2 + notchRadius;

    const baseRect = rectangle({ size: [profileWidth, opts.totalThickness] });
    const margin = rectangle({ size: [EDGE_PROFILE_MARGIN, opts.totalThickness] });
    const alignedMargin = align({ modes: ['max', 'center', 'none'], relativeTo: [profileWidth / -2, 0, 0] }, margin)
    const baseShape = union(baseRect, alignedMargin);

    const cutawayCircle = circle({ radius: notchRadius, center: [profileWidth / 2 - smallOffset, opts.totalThickness / -2 + smallOffset] });
    const cutawayCorner1 = square({
      size: smallOffset * 2, center: [
        profileWidth / -2 + smallOffset,
        opts.totalThickness / -2,
      ]
    });
    const cutawayCorner2 = square({
      size: smallOffset * 2, center: [
        profileWidth / 2,
        opts.totalThickness / 2 - opts.topThickness - smallOffset,
      ]
    });
    const cutaway = union(cutawayCircle, cutawayCorner1, cutawayCorner2);

    return align({ modes: ['center', 'center', 'none'] }, subtract(baseShape, cutaway));
  }

  /**
  * Edge profile: Circular portrusion in bottom half
  * @memberof details.profiles.edge
  * @instance
  * @param {Object} opts 
  * @param {number} opts.totalThickness - total thickness of edge
  * @param {number} opts.topThickness - thickness of top (left intact by ornaments)
  * @param {number} opts.smallOffset - small offset between portrusion and main edge
  */
  const circPortrusion = (opts) => {
    const ornamentThickness = opts.totalThickness - opts.topThickness;
    const smallOffset = opts.smallOffset || ornamentThickness / 8;
    const circRadius = ornamentThickness - (smallOffset * 3);
    const profileWidth = smallOffset * 3 + circRadius;

    const baseRect = rectangle({ size: [profileWidth, opts.totalThickness] });
    const margin = rectangle({ size: [EDGE_PROFILE_MARGIN, opts.totalThickness] });
    const alignedMargin = align({ modes: ['max', 'center', 'none'], relativeTo: [profileWidth / -2, 0, 0] }, margin)

    const cutaway = translate([0, opts.topThickness / -2], rectangle({ size: [profileWidth, ornamentThickness] }));
    const cutShape = subtract(baseRect, cutaway);
    const baseShape = union(cutShape, alignedMargin);

    const portCircle = circle({ radius: circRadius, center: [profileWidth / -2 + smallOffset, opts.totalThickness / 2 - opts.topThickness - smallOffset] });
    const portArc = intersect(baseRect, portCircle);
    const smallCorner1 = rectangle({
      size: [smallOffset, smallOffset * 2], center: [
        profileWidth / -2 + (smallOffset / 2),
        opts.totalThickness / -2 + (smallOffset * 2),
      ]
    });
    const smallCorner2 = square({
      size: smallOffset * 2, center: [
        profileWidth / 2 - (smallOffset * 2),
        opts.totalThickness / 2 - opts.topThickness,
      ]
    });
    const ornament = union(portArc, smallCorner1, smallCorner2)

    return align({ modes: ['center', 'center', 'none'] }, union(baseShape, ornament));
  }

  /**
   * Generates an edge flange profile
   * @param {string} type - "inset" or "offset"
   * @param {number} width 
   * @param {number} thickness 
   * @param {string[]} flipOpts - array of options for flipping ("vertical" or "horizontal")
   */
  const edgeFlange = (type = 'inset', width, thickness, flipOpts = []) => {
    let triangleAlignOpts = {}
    let triangleMirrorOpts = null
    let bearingSurfaceAlignOpts = {}
    let mirrorOpts = null

    const height = width * 2;

    if (type === 'inset') {
      triangleAlignOpts = { modes: ['max', 'min', 'center'], relativeTo: [0, 0, 0] }
      bearingSurfaceAlignOpts = { modes: ['max', 'max', 'center'], relativeTo: [0, 0, 0] }

      if (flipOpts.includes('vertical')) {
        triangleAlignOpts.modes = ['max', 'max', 'center']
        bearingSurfaceAlignOpts.modes = ['max', 'min', 'center']
        triangleMirrorOpts = { normal: [0, 1, 0], origin: [0, -height - thickness, 0] }
      }
    } else if (type === 'offset') {
      triangleAlignOpts = { modes: ['min', 'min', 'center'], relativeTo: [0, 0, 0] }
      bearingSurfaceAlignOpts = { modes: ['min', 'max', 'center'], relativeTo: [0, 0, 0] }
      mirrorOpts = { normal: [1, 0, 0] }

      if (flipOpts.includes('vertical')) {
        triangleAlignOpts.modes = ['max', 'max', 'center']
        bearingSurfaceAlignOpts.modes = ['max', 'min', 'center']
        triangleMirrorOpts = { normal: [0, 1, 0], origin: [0, -height - thickness, 0] }
      }
    } else {
      return null;
    }

    let triangleProfile = triangle.right30({ base: width, height });
    if (triangleMirrorOpts != null) {
      triangleProfile = mirror(triangleMirrorOpts, triangleProfile)
    }

    const triangleSection = align(
      triangleAlignOpts,
      triangleProfile
    )

    const bearingSurface = align(
      bearingSurfaceAlignOpts,
      rectangle({ size: [width, thickness] })
    )

    let finalShape = union(bearingSurface, triangleSection);
    if (mirrorOpts != null) {
      finalShape = mirror(mirrorOpts, finalShape)
    }

    return align({ modes: ['center', 'center', 'center'] }, finalShape)
  }

  /**
   * Edge profiles
   * @memberof details.profiles
   * @namespace edge
   */
  const edge = {
    circNotch,
    circPortrusion,
  }

  return {
    /**
     * Square with circular notches at corners.
     * @memberof details.profiles
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
     * @memberof details.profiles
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
     * @memberof details.profiles
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
    edge,
    edgeFlange,
    triangle: triangles,
    rectangle: rectangles,
    curves,
    ellipse: ellipses,
    reinforcement,
  }
}

module.exports = { init: profileBuilder }
