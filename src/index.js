const coreModule = require('./core');
const utilsModule = require('./utils');
const detailsModule = require('./details');

const init = ({ lib }) => {
    const stdSpecs = require('sw-jscad-std-specs').init({ lib });
    const swJscad = {
        core: { ...stdSpecs, ...coreModule.init({ stdSpecs, lib }) },
    }

    swJscad.utils = utilsModule.init({ lib, swLib: swJscad });
    swJscad.details = detailsModule.init({ lib, swLib: swJscad });

    return swJscad;
}

module.exports = { init };
