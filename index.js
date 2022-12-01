import Bottle from 'bottlejs';

import PluginConfig from './config/index.js';
import PluginInput from './input/index.js';
import PluginMap from './map/index.js';
import PluginSprite from './sprite/index.js';
import PluginPlayer from './player/index.js';
import PluginCanvas from './canvas/index.js';
import PluginWindow from './window/index.js';

const bottle = new Bottle();

/******** PLUGIN CONFIGURATION ********/
PluginConfig(bottle);
PluginCanvas(bottle);
PluginMap(bottle);
PluginInput(bottle);
PluginPlayer(bottle);
PluginSprite(bottle);
PluginWindow(bottle);

bottle.factory('myApp', async function (container) {
  const { WINDOW } = container.Plugins.Window;
  const { document, fetch, requestAnimationFrame } = WINDOW;
  const CANVAS = document.querySelector('#my-canvas');
  const CONFIG = container.Plugins.Config;

  const CONTEXT = CANVAS.getContext('2d');
  const DEFAULT_TILE_MAP_URL =
    'https://gist.githubusercontent.com/seanttaylor/f791ce0fd59907f8b8dd0e36c5fe9804/raw/df0938a6256988fcff3fe4a642eeee8fc796beb8/tanks-tilemap.xml';

  const { Sprite, SpriteConfiguration } = container.Plugins.Sprite;
  const { CanvasCoordinateConfiguration } = container.Plugins.Canvas;
  const { keyboardCtrl } = container.Plugins.Input;
  const mapPlugin = container.Plugins.Map;
  const playerPlugin = container.Plugins.Player;

  /******** INITIALIZE CONTEXT(S) ********/

  playerPlugin.setContext(CONTEXT);

  /**
   * Wrapper for `Canvas2DRenderingContext.clearRect` method
   * @param {CanvasCoordinateConfiguration} coords
   */
  function clearCanvas(coords) {
    CONTEXT.clearRect(...coords);
  }

  /**
   *
   */
  async function fetchGameMap(URL) {
    try {
      const getGameMap = await fetch(URL);
      return getGameMap.text();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Renders individual game objects
   * @param {CanvasRenderingContext2D} ctx - an instance of the context2d interface
   * @param {Object} playerTank
   */
  function render() {
    playerPlugin.render({ tileSheet: TILE_SHEET_IMG_RESOURCE, playerTank });
  }

  /**
   * Triggers rendering of game objects every frame
   */
  function animLoop() {
    // clearCanvas(CanvasCoordinateConfiguration(playerTank.getSprite()));
    // playerTank.moveDown();
    WINDOW.setTimeout(animLoop, 100);
    render();
  }

  /******** EVENT HANDLERS ********/
  WINDOW.addEventListener('keydown', onKeyDown);
  WINDOW.addEventListener('keyup', onKeyUp);

  /**
   * @param {Object} e - HTML event object
   *
   */
  function onKeyDown(e) {
    const { keys } = keyboardCtrl.getCurrentControlState({
      event: e,
      eventName: 'keydown',
    });

    // Up
    if (keys.MOVE_UP && !keys.MOVE_DOWN) {
      //PLAYER_TANK.y += -5;
      //player.moveDown(5);
      // cat.vy = -5;
    }

    // Down
    if (keys.MOVE_DOWN && !keys.MOVE_UP) {
      //PLAYER_TANK.y += 1;
      //player.moveDown(5);
      // cat.vy = 5;
    }

    // Left
    if (keys.MOVE_LEFT && !keys.MOVE_RIGHT) {
      //PLAYER_TANK.x += -5;
      //player.moveLeft(-5);
      // cat.vx = -5;
    }

    // Right
    if (keys.MOVE_RIGHT && !keys.MOVE_LEFT) {
      //PLAYER_TANK.x += 5;
      //player.moveRight(5);
      // cat.vx = 5;
    }
  }

  /**
   * @param {Object} e - HTML event object
   *
   */
  function onKeyUp(e) {
    const { keys } = keyboardCtrl.getCurrentControlState({
      event: e,
      eventName: 'keyup',
    });

    // Up
    if (keys.MOVE_UP && !keys.MOVE_DOWN) {
      //player.moveUp(-5);
      // cat.vy = -5;
    }

    // Down
    if (keys.MOVE_DOWN && !keys.MOVE_UP) {
      //player.moveDown(5);
      // cat.vy = 5;
    }

    // Left
    if (keys.MOVE_LEFT && !keys.MOVE_RIGHT) {
      //player.moveLeft(-5);
      // cat.vx = -5;
    }

    // Right
    if (keys.MOVE_RIGHT && !keys.MOVE_LEFT) {
      //player.moveRight(5);
      // cat.vx = 5;
    }
  }

  /******** MAIN ********/

  const APP_VERSION = 'v0.0.1';
  const TILE_SHEET_IMG_RESOURCE = new Image();
  const playerTank = playerPlugin.TankAPI(
    Sprite({
      // specifies a region from the tile sheet to use for the resulting sprite
      source: SpriteConfiguration({ x: 32, y: 0, width: 32, height: 32 }),
      // specifies the dimesions of the resulting sprite copied from the tile sheet
      sprite: SpriteConfiguration({ x: 64, y: 256, width: 32, height: 32 }),
    })
  );

  try {
    const mapXML = await fetchGameMap(DEFAULT_TILE_MAP_URL);
    await mapPlugin.loadTileMapXML(mapXML);
    mapPlugin.drawGameMap(CONTEXT);
  } catch (e) {
    console.error(e);
  }

  TILE_SHEET_IMG_RESOURCE.addEventListener('load', animLoop);
  TILE_SHEET_IMG_RESOURCE.src = CONFIG.assets.SPRITE_SHEET_URL;
});

/******** CONTAINER INITIALIZATION ********/
bottle.container.myApp;
