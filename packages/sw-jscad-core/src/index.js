const coreModule = require('./core');
const utilsModule = require('./utils');
const modelModule = require('./models');

const init = ({ lib }) => {
    const stdSpecs = require('sw-jscad-std-specs').init({ lib });
    stdSpecs.constants.SILVER_RATIO = 1 + Math.sqrt(2)          // 2.4142
    stdSpecs.constants.BRONZE_RATIO = 3 + Math.sqrt(13) / 2     // 3.3028
    stdSpecs.constants.COPPER_RATIO = 2 + Math.sqrt(5)          // 4.2361
    stdSpecs.constants.SUPERGOLDEN_RATIO = 1.4655712319
    stdSpecs.constants.PLASTIC_RATIO = 1.3247179572

    const swJscad = {
        core: { ...stdSpecs, ...coreModule.init({ stdSpecs, lib }) },
    }

    swJscad.utils = utilsModule.init({ lib, swLib: swJscad });
    swJscad.models = modelModule.init({ lib, swLib: swJscad });

    return swJscad;
}

module.exports = { init };
