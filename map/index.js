import xml2js from 'xml2js';

const parser = new xml2js.Parser();

/**
 * Formats an XML tile map exported from the Tiled map editor
 * See (https://www.mapeditor.org/)
 * @param {Object} json - JSON that has been converted from and XML tile map
 * @returns {Object}
 */
function GameMapTMX(json) {
  const metadata = json.map.$;
  const mapCoords = json.map.layer[0].data[0]['_'];
  const coordsFilteredEmptyString = mapCoords
    .split('\n')
    .filter((c) => c !== '');
  const coordsStrippedTrailingComma = coordsFilteredEmptyString.map(
    (coordList) => {
      return coordList[coordList.length - 1] === ','
        ? coordList.slice(0, -1)
        : coordList;
    }
  );

  const coords = coordsStrippedTrailingComma.map((coordList) =>
    coordList.split(',').map((c) => Number(c))
  );

  return {
    metadata: {
      height: Number(metadata.height),
      width: Number(metadata.width),
      tileHeight: Number(metadata.tileheight),
      tileWidth: Number(metadata.tilewidth),
    },
    coords,
  };
}

/**
 * Controls the Game map
 * @returns {Object}
 */
function PluginMap() {
  const MAP_INDEX_OFFSET = -1;

  let mapRows = 10;
  let mapCols = 10;
  let tileMapXML = null;
  let myTileMap = null;

  /**
   * @param {String} tileMap - a raw XML document describing a game tile map
   */
  async function loadTileMapXML(tileMap) {
    tileMapXML = tileMap;

    try {
      const mapJSON = await parseXML(tileMap);
      const gameMapTMXConfig = GameMapTMX(mapJSON);

      myTileMap = gameMapTMXConfig.coords;
      mapRows = gameMapTMXConfig.metadata.height;
      mapCols = gameMapTMXConfig.width;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Converts an XML document to JSON
   * @param {String} xml
   * @returns {Promise}
   */
  function parseXML(xml) {
    const promise = new Promise((resolve, reject) => {
      parser.parseString(xml, function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });

    return promise;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  function drawGameMap(ctx) {
    console.log('drawing game map...');
  }

  return {
    drawGameMap,
    loadTileMapXML,
  };
}

export default function (bottle) {
  bottle.factory('Plugins.Map', function (container) {
    return PluginMap();
  });
}
