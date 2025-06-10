"use strict"

/**
 * Core
 * @namespace core
 */

const init = ({ stdSpecs, lib }) => {
    const nextCoreLayer = {}

    nextCoreLayer.position = require('./position').init({ stdSpecs, lib, swLib: { core: { ...stdSpecs, ...nextCoreLayer } } });
    nextCoreLayer.text = require('./text').init({ stdSpecs, lib, swLib: { core: { ...stdSpecs, ...nextCoreLayer } } });
    nextCoreLayer.parts = require('./parts').init({ stdSpecs, lib, swLib: { core: { ...stdSpecs, ...nextCoreLayer } } });

    return nextCoreLayer;
}

module.exports = { init };
