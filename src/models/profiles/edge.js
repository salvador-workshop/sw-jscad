const edgeInit = ({ lib, swLib }) => {
    const EDGE_PROFILE_MARGIN = 1;

    const { square, circle, rectangle } = lib.primitives
    const { intersect, union, subtract } = lib.booleans
    const { align, translate } = lib.transforms

    //--------
    //  EDGE
    //--------

    /**
     * Edge profile: Circular notch in bottom half
     * @memberof models.profiles.edge
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
    * @memberof models.profiles.edge
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
     * Edge profiles
     * @memberof models.profiles
     * @namespace edge
     */
    const edge = {
        circNotch,
        circPortrusion,
    }

    return edge;
}

module.exports = { init: edgeInit }