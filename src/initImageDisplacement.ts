import { Application, Assets, Container, DisplacementFilter, Sprite } from 'pixi.js';
import displacementMap from '../images/displacement_map_repeat.jpg';

export const initImageDisplacement = async (
  selector: string,
  scaleX: number = 60,
  scaleY: number = 30
) => {
  // Get the image element from your markup using the provided selector
  const targetImage = document.querySelector(selector) as HTMLImageElement;

  if (!targetImage) {
    console.error(`No image found with selector: ${selector}`);
    return;
  }

  // Wait for the image to load if it hasn't already
  if (!targetImage.complete) {
    await new Promise((resolve) => {
      targetImage.onload = resolve;
    });
  }

  // Get the exact position and size of the image
  const imageRect = targetImage.getBoundingClientRect();

  // Create a new application with the exact size of the image
  const app = new Application();
  await app.init({
    width: imageRect.width,
    height: imageRect.height,
    backgroundAlpha: 0,
    autoDensity: true, // For high DPI displays
    resolution: window.devicePixelRatio || 1
  });

  // Position the canvas exactly where the image is
  const canvas = app.canvas as HTMLCanvasElement;
  canvas.classList.add(selector.replace('.', '')); // Add class without the dot

  // Insert the canvas right after the image in the DOM
  targetImage.insertAdjacentElement('afterend', canvas);


  // Create container
  const container = new Container();
  app.stage.addChild(container);

  // Load assets
  await Assets.load([
    displacementMap,
    targetImage.src
  ]);

  // Create sprite from your image (full size of the canvas)
  const imageSprite = Sprite.from(targetImage.src);
  imageSprite.width = imageRect.width;
  imageSprite.height = imageRect.height;
  container.addChild(imageSprite);

  // Create displacement sprite
  const displacementSprite = Sprite.from(displacementMap);
  displacementSprite.texture.source.addressMode = 'repeat';
  displacementSprite.width = imageRect.width;
  displacementSprite.height = imageRect.height;

  // Create and apply displacement filter with customizable scale
  const displacementFilter = new DisplacementFilter({
    sprite: displacementSprite,
    scale: { x: scaleX, y: scaleY },
    antialias: true,
  });
  displacementFilter.padding = 10;

  imageSprite.filters = [displacementFilter];
  app.stage.addChild(displacementSprite);

  // Hide the original image
  targetImage.style.visibility = 'hidden';
  targetImage.style.display = 'none';

  // Animation loop
  app.ticker.add(() => {
    displacementSprite.x++; // Slower movement
    if (displacementSprite.x > displacementSprite.width) {
      displacementSprite.x = 0;
    }
  });
};