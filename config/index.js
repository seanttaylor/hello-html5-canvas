/******** ASSETS ********/

const HELLO_WORLD_GIF_URL = 'https://tinyurl.com/23pzr79a';
const SPRITE_SHEET_URL = 'https://i.imgur.com/d7mhxFn.png';
const SPRITE_MAP = {
  PLAYER: {
    TANKS: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [0, 7],
      [1, 0],
    ],
    Y_OFFSET: 32,
    X_OFFSET: 32,
  },
};

/******** SETTINGS ********/

const STROKE_STYLE = 'black';
const FILL_STYLE = '#000000';

/**
 *
 */
function PluginConfig() {
  return {
    assets: {
      HELLO_WORLD_GIF_URL,
      SPRITE_SHEET_URL,
      SPRITE_MAP,
    },
    settings: {
      STROKE_STYLE,
      FILL_STYLE,
    },
  };
}

export default function (bottle) {
  bottle.factory('Plugins.Config', function (/* container */) {
    return PluginConfig();
  });
}
