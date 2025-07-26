"use strict"

const profilesInit = ({ lib, swLib }) => {
    const profiles = {
        ...require('./profiles').init({ lib, swLib }),
        // connections: require('./connections').init({ lib, swLib }),
        // edge: require('./edge').init({ lib, swLib }),
        foils2d: require('./foils-2d').init({ lib, swLib }),
        mesh2d: require('./mesh-2d').init({ lib, swLib }),
        // reinforcement: require('./reinforcement').init({ lib, swLib }),
        text2d: require('./text-2d').init({ lib, swLib }),
    }

    profiles.frameRect = require('./frame-rect').init({ lib, swLib: { ...swLib, models: { profiles } } })

    return profiles
}

module.exports = { init: profilesInit };
