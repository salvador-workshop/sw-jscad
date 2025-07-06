"use strict"

/**
 * Builds cross-section profiles in gothic style.
 * Output profiles are centred at (0, 0, 0).
 * Edge profiles have a 1mm margin between all details and the flat (host) side.
 * @namespace details.profiles
 */

const EDGE_PROFILE_MARGIN = 1;

const profileBuilder = ({ lib }) => {
  const { square, circle, rectangle } = lib.primitives
  const { intersect, union, subtract } = lib.booleans
  const { rotate, align, translate } = lib.transforms

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
  const edgeFlangeProfile = (type = 'inset', width, thickness, flipOpts = []) => {
    let triangleAlignOpts = {}
    let triangleMirrorOpts = null
    let bearingSurfaceAlignOpts = {}
    let mirrorOpts = null

    const height = geometry.triangle.solve30DegRtTriangle({ short: width }).long;

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

    let triangleProfile = triangle({ type: 'SAS', values: [width, TAU / 4, height] });
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
    /**
    * Edge profiles
    * @memberof details.profiles
    * @namespace edge
    */
    edge: {
      /**
       * Edge profile: Circular notch in bottom half
       * @memberof details.profiles.edge
       * @instance
       * @param {Object} opts 
       * @param {number} opts.totalThickness - total thickness of edge
       * @param {number} opts.topThickness - thickness of top (left intact by ornaments)
       * @param {number} opts.smallOffset - small offset between notch and main edge
       */
      circNotch: (opts) => {
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
      },
      circPortrusion,
      edgeFlangeProfile,
    }
  }
}

module.exports = { init: profileBuilder }
