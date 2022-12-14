/**
 * @param {Object} config - an instance of the `PluginConfig` interface
 * @param {Object} canvas - an instance of the `PluginCanvas` interface
 * @returns {Object}
 */
function PluginPlayer({ config, canvas }) {
  const { CanvasCoordinateConfiguration } = canvas;
  const ANIMATION_FRAMES = [1, 2, 3, 4, 5, 6, 7, 8];
  let context = null;
  let frameIndex = 0;

  /**
   * Animates the player's tank
   * @param {Object} playerTank - an instance of the TankAPI interface
   * @param {Object} tileSheet - image resource containing the sprite sheet required for rendering the player tank
   */
  function render({ tileSheet, playerTank }) {
    // See HTML5 Canvas 2nd Ed., Fulton pp. ~ 147
    const tileSrcX = Math.floor(ANIMATION_FRAMES[frameIndex] % 8) * 32;
    const tileSrcY = Math.floor(ANIMATION_FRAMES[frameIndex] / 8) * 32;
    const mySprite = playerTank.getSprite();

    const source = CanvasCoordinateConfiguration({
      x: tileSrcX,
      y: tileSrcY,
      width: 32,
      height: 32,
    });
    const dest = CanvasCoordinateConfiguration({
      x: mySprite.x,
      y: mySprite.y,
      width: 32,
      height: 32,
    });

    context.drawImage(tileSheet, ...[...source, ...dest]);

    frameIndex++;

    if (frameIndex == ANIMATION_FRAMES.length) {
      frameIndex = 0;
    }
  }

  /**
   * @param {SpriteConfiguration} sprite
   * @returns {Object}
   */
  function TankAPI(sprite) {
    return {
      setXVelocity(vx) {
        sprite.vx = vx;
        sprite.x += vx;
      },
      getSprite() {
        return sprite;
      },
      /**
       * @param {Number} x - number of pixels to move the tank
       */
      moveRight(x = 1) {
        sprite.vx = x;
        sprite.x += sprite.vx;
      },
      /**
       * @param {Number} x - number of pixels to move the tank
       */
      moveLeft(x = 1) {
        sprite.vx = x;
        sprite.x -= sprite.vx;
      },
      /**
       * @param {Number} y - number of pixels to move the tank
       */
      moveUp(y = 1) {
        sprite.vy = y;
        sprite.y -= sprite.vy;
      },
      /**
       * @param {Number} y - number of pixels to move the tank
       */
      moveDown(y = 1) {
        sprite.vy = y;
        sprite.y += sprite.vy;
      },
    };
  }

  /**
   * Sets the current context for drawing to a canvas object
   * @param {CanvasRenderingContext2D} ctx - an instance of the context2d interface
   */
  function setContext(ctx) {
    context = ctx;
  }

  return {
    render,
    setContext,
    TankAPI,
  };
}

export default function (bottle) {
  bottle.factory('Plugins.Player', function (container) {
    return PluginPlayer({
      config: container.Config,
      canvas: container.Canvas,
    });
  });
}
