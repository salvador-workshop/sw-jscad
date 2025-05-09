const coreModule = require('./core');
const uxModule = require('./utils');
const utilsModule = require('./utils');
const buildersCoreModule = require('./builders-core');
const buildersModule = require('./builders');

const init = ({ lib }) => {
    let swLib = { ...coreModule.init({ lib }) }
    
    // UX and utils are initialized first
    swLib = { ...swLib, ...uxModule.init({ lib, swLib }) }
    swLib = { ...swLib, ...utilsModule.init({ lib, swLib }) }

    // Builders have access to SW utils functions
    swLib = { ...swLib, ...buildersCoreModule.init({ lib, swLib }) }
    swLib = { ...swLib, ...buildersModule.init({ lib, swLib }) }

    return swLib;
}

module.exports = { init };
