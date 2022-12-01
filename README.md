# Hello HTML5 Canvas

## Extracting Sprites from a Tile Sheet

1. Load the source image of the tile sheet in the canvas via `new Image()`
2. Specify the X and Y position of the source image on the canvas
3. Specify the width and height of the source image (i.e. tile sheet)
4. Use `SpriteConfiguration` to specify the source and destination coordinates of the source image and the resulting sprite image on the canvas (see the `canvas.drawImage` method)
5. Provide the `SpriteConfiguration` objects to the `Sprite` constructor. These methods provide the positional arguments for the `canvas.drawImage` method in the correct order returning them as an array.
