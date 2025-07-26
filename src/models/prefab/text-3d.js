"use strict"

/**
 * ...
 * @memberof models.prefab
 * @namespace text3d
 */

const DEFAULT_EXTRUDE_HEIGHT = 1;
const DEFAULT_PANEL_HEIGHT = 2;

const textUtils = ({ lib, swLib }) => {
    const { subtract } = lib.booleans
    const { cuboid } = lib.primitives
    const { align } = lib.transforms
    const { extrudeLinear } = lib.extrusions
    const { measureDimensions } = lib.measurements;

    const { text2d } = swLib.models.profiles

    /**
     * Creates a simple 3D line of text
     * @memberof models.prefab.text3d
     * @instance
     * @param {*} param0 
     * @returns ...
     */
    const flatText = (opts) => {
        if (opts.message === undefined || opts.message.length === 0) return []

        const message2D = text2d.basicText({
            message: opts.message,
            fontSize: opts.fontSize,
            charLineWidth: opts.charLineWidth
        })
        const message3D = extrudeLinear({ height: opts.extrudeHeight || DEFAULT_EXTRUDE_HEIGHT }, message2D)

        return align({ modes: ['center', 'center', 'center'] }, message3D)
    }

    return {
        flatText,
        /**
         * Creates a rectangular panel with engraved text
         * @memberof models.prefab.text3d
         * @instance
         * @param {*} opts 
         * @returns ...
         */
        textPanel: (opts) => {
            const extrudeHt = opts.extrudeHeight || DEFAULT_EXTRUDE_HEIGHT;

            const textModel = flatText({
                ...opts,
                extrudeHeight: extrudeHt,
            });
            const textModelDims = measureDimensions(textModel);
            const panelOffset = opts.panelOffset || 2;

            const textPanel = cuboid({
                size: [
                    textModelDims[0] + panelOffset,
                    textModelDims[1] + panelOffset,
                    opts.panelThickness || extrudeHt * 2
                ]
            })

            const embossedPanel = subtract(
                align({ modes: ['center', 'center', 'max'] }, textPanel),
                align({ modes: ['center', 'center', 'max'] }, textModel)
            )

            return align({ modes: ['center', 'center', 'center'] }, embossedPanel);
        }
    }
}

module.exports = { init: textUtils };
