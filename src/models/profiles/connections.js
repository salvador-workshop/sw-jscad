const connectionsInit = ({ lib, swLib }) => {
    const { circle, rectangle, triangle } = lib.primitives
    const { union, subtract } = lib.booleans
    const { align, translate, mirror } = lib.transforms
    const { hull } = lib.hulls
    const { degToRad } = lib.utils

    const { position, maths } = swLib.core

    //---------------
    //  CONNECTIONS
    //---------------

    const connectionDefaults = {
        tolerance: maths.inchesToMm(1 / 128),
        fit: maths.inchesToMm(1 / 128),
        cornerRadius: maths.inchesToMm(1 / 4),
        dovetailAngle: degToRad(8),
        dovetailMargin: 1,
        tabAngle: degToRad(8),
        tabMargin: 1,
    }

    const createConnTrapezoid = ({ depth, width, angle, reverse = false }) => {
        const baseRect = rectangle({ size: [depth, width] })
        const baseRectCoords = position.getGeomCoords(baseRect)
        const triOpts = position.triangle.rightTriangleOpts({ long: depth, longAngle: angle })
        const triangleEnds = [
            align(
                { modes: ['center', 'max', 'center'], relativeTo: [0, baseRectCoords.back, 0] },
                mirror({ normal: [0, 1, 0] }, triangle(triOpts))
            ),
            align(
                { modes: ['center', 'min', 'center'], relativeTo: [0, baseRectCoords.front, 0] },
                triangle(triOpts)
            ),
        ]

        const outShape = subtract(baseRect, triangleEnds)

        if (reverse) {
            return mirror({ normal: [1, 0, 0] }, outShape)
        }
        return outShape
    }

    /**
     * Connection profiles
     * @memberof models.profiles
     * @namespace connections
     */
    const connections = {
        /**
         * ...
         * @memberof models.profiles.connections
         * @param {object} opts 
         * @returns ...
         */
        pegboard: ({
            spacing,
            radius,
            margin,
            cornerRadius = connectionDefaults.cornerRadius,
            fit = connectionDefaults.fit,
            tolerance = connectionDefaults.tolerance
        }) => {
            const diametre = radius * 2
            const totalGap = fit / 4 + (tolerance / 4)
            const specs = {
                ...connectionDefaults,
                diametre,
                fitDowelRadius: -totalGap + radius,
                fitHoleRadius: totalGap + radius,
                margin: margin || radius,
            }
            specs.totalWidth = specs.margin * 2 + (radius * 2 + spacing)
            const halfWidth = specs.totalWidth / 2
            specs.cornerPoints = [
                [halfWidth - cornerRadius, halfWidth - cornerRadius, 0],
                [-halfWidth + cornerRadius, halfWidth - cornerRadius, 0],
                [-halfWidth + cornerRadius, -halfWidth + cornerRadius, 0],
                [halfWidth - cornerRadius, -halfWidth + cornerRadius, 0],
            ]
            const halfUnit = spacing / 2
            specs.dowelPoints = [
                [halfUnit, halfUnit, 0],
                [-halfUnit, halfUnit, 0],
                [-halfUnit, -halfUnit, 0],
                [halfUnit, -halfUnit, 0],
            ]

            const corners = specs.cornerPoints.map(cPt => {
                return translate(cPt, circle({ radius: cornerRadius }))
            })
            const dowels = specs.dowelPoints.map(dPt => {
                return translate(dPt, circle({ radius: specs.fitDowelRadius }))
            })
            const dowelDies = specs.dowelPoints.map(dPt => {
                return translate(dPt, circle({ radius: specs.fitHoleRadius }))
            })

            const basePlate = hull(corners)
            const dowelAssembly = union(dowels)

            const male = dowelAssembly
            const female = subtract(basePlate, dowelDies)

            return {
                male,
                female,
                size: [specs.totalWidth, specs.totalWidth],
            }
        },
        /**
         * ...
         * @memberof models.profiles.connections
         * @param {object} opts
         * @returns ...
         */
        polygon: ({
            radius,
            segments,
            margin,
            cornerRadius = connectionDefaults.cornerRadius,
            fit = connectionDefaults.fit,
            tolerance = connectionDefaults.tolerance
        }) => {
            const diametre = radius * 2
            const totalGap = fit / 4 + (tolerance / 4)
            const specs = {
                ...connectionDefaults,
                diametre,
                fitDowelRadius: -totalGap + radius,
                fitHoleRadius: totalGap + radius,
                margin: margin || radius,
            }
            specs.totalWidth = specs.margin * 2 + specs.diametre
            const halfWidth = specs.totalWidth / 2
            specs.cornerPoints = [
                [halfWidth - cornerRadius, halfWidth - cornerRadius, 0],
                [-halfWidth + cornerRadius, halfWidth - cornerRadius, 0],
                [-halfWidth + cornerRadius, -halfWidth + cornerRadius, 0],
                [halfWidth - cornerRadius, -halfWidth + cornerRadius, 0],
            ]

            const dowel = circle({ radius: specs.fitDowelRadius, segments })
            const dowelDie = circle({ radius: specs.fitHoleRadius, segments })

            const corners = specs.cornerPoints.map(cPt => {
                return translate(cPt, circle({ radius: cornerRadius }))
            })
            const basePlate = hull(corners)

            const male = dowel
            const female = subtract(basePlate, dowelDie)

            return {
                male,
                female,
                size: [specs.totalWidth, specs.totalWidth],
            }
        },
        /**
         * Tab and Dovetail profiles are designed to fit right against the male edge.
         * With a margin (1mm default) extending into the female edge to ensure one shape that holds both dovetail ends.
         * @memberof models.profiles.connections
         * @param {*} opts 
         * @returns ...
         */
        tab: ({
            width,
            depth,
            margin = connectionDefaults.tabMargin,
            angle = connectionDefaults.tabAngle,
            fit = connectionDefaults.fit,
            tolerance = connectionDefaults.tolerance
        }) => {
            const specs = {
                ...connectionDefaults,
                totalWidth: margin * 2 + width,
                totalTabDepth: margin + depth,
            }

            const baseRect = rectangle({ size: [specs.totalTabDepth, specs.totalWidth] })
            const baseRectCoords = position.getGeomCoords(baseRect)

            const male = align(
                { modes: ['max', 'center', 'center'], relativeTo: [baseRectCoords.right, 0, 0] },
                createConnTrapezoid({ depth, width, angle })
            )
            const female = align(
                { modes: ['min', 'center', 'center'], relativeTo: [baseRectCoords.left, 0, 0] },
                subtract(baseRect, male)
            )

            return {
                male,
                female,
                size: [specs.totalTabDepth, specs.totalWidth],
            }
        },
        /**
         * Tab and Dovetail profiles are designed to fit right against the male edge.
         * With a margin (1mm default) extending into the female edge to ensure one shape that holds both dovetail ends.
         * @memberof models.profiles.connections
         * @param {*} opts 
         * @returns ...
         */
        dovetail: ({
            width,
            depth,
            margin = connectionDefaults.dovetailMargin,
            angle = connectionDefaults.dovetailAngle,
            fit = connectionDefaults.fit,
            tolerance = connectionDefaults.tolerance
        }) => {
            const specs = {
                ...connectionDefaults,
                totalWidth: margin * 2 + width,
                totalTabDepth: margin + depth,
            }

            const baseRect = rectangle({ size: [specs.totalTabDepth, specs.totalWidth] })
            const baseRectCoords = position.getGeomCoords(baseRect)

            const male = align(
                { modes: ['max', 'center', 'center'], relativeTo: [baseRectCoords.right, 0, 0] },
                createConnTrapezoid({ depth, width, angle, reverse: true })
            )
            const female = align(
                { modes: ['min', 'center', 'center'], relativeTo: [baseRectCoords.left, 0, 0] },
                subtract(baseRect, male)
            )

            return {
                male,
                female,
                size: [specs.totalTabDepth, specs.totalWidth],
            }
        },
    }

    return connections;
}

module.exports = { init: connectionsInit }