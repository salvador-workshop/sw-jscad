"use strict"

/**
 * Core
 * @namespace core
 */

const coreInit = ({ stdSpecs, lib }) => {
    const nextCoreLayer = {}

    nextCoreLayer.position = require('./position').init({ stdSpecs, lib, swLib: { core: { ...stdSpecs, ...nextCoreLayer } } });
    nextCoreLayer.geometry = require('./geometry').init({ stdSpecs, lib, swLib: { core: { ...stdSpecs, ...nextCoreLayer } } });

    return nextCoreLayer;
}

module.exports = { init: coreInit };
