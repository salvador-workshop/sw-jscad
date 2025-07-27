const reinforcementInit = ({ lib, swLib }) => {
    const { rectangle } = lib.primitives
    const { union } = lib.booleans
    const { rotate, align, mirror } = lib.transforms
    const { TAU } = lib.maths.constants

    const { position } = swLib.core
    const { profiles } = swLib.models

    //-----------------
    //  REINFORCEMENT
    //-----------------

    /**
     * ...
     * @memberof models.profiles.reinforcement
     * @param {object} opts 
     * @returns ...
     */
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
                    profiles.triangle.right30({ base: offWidth }),
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
    /**
     * ...
     * @memberof models.profiles.reinforcement
     * @param {object} opts 
     * @returns ...
     */
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

    /**
     * ...
     * @memberof models.profiles.reinforcement
     * @param {object} opts 
     * @returns ...
     */
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

    /**
     * Reinforcement profiles
     * @memberof models.profiles
     * @namespace reinforcement
     */
    const reinforcement = {
        straight: straightBeam,
        /**
         * ...
         * @memberof models.profiles.reinforcement
         * @param {object} opts
         * @returns ...
         */
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
        /**
         * ...
         * @memberof models.profiles.reinforcement
         * @param {object} opts 
         * @returns ...
         */
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
        /**
         * ...
         * @memberof models.profiles.reinforcement
         * @param {object} opts 
         * @returns ...
         */
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
        /**
         * ...
         * @memberof models.profiles.reinforcement
         * @param {object} opts 
         * @returns ...
         */
        triBeam: ({ radius, thickness, insetWidth, offsetWidth }) => {
            return polyBeam({ radius, segments: 3, thickness, insetWidth, offsetWidth })
        },
        /**
         * ...
         * @memberof models.profiles.reinforcement
         * @param {object} opts 
         * @returns ...
         */
        crossBeam: ({ radius, thickness, insetWidth, offsetWidth }) => {
            return polyBeam({ radius, segments: 4, thickness, insetWidth, offsetWidth })
        },
        /**
         * ...
         * @memberof models.profiles.reinforcement
         * @param {object} opts 
         * @returns ...
         */
        pentaBeam: ({ radius, thickness, insetWidth, offsetWidth }) => {
            return polyBeam({ radius, segments: 5, thickness, insetWidth, offsetWidth })
        },
        /**
         * ...
         * @memberof models.profiles.reinforcement
         * @param {object} opts 
         * @returns ...
         */
        hexBeam: ({ radius, thickness, insetWidth, offsetWidth }) => {
            return polyBeam({ radius, segments: 6, thickness, insetWidth, offsetWidth })
        },
    }

    return reinforcement;
}

module.exports = { init: reinforcementInit }