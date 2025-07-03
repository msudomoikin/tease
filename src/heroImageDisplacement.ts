import { Application, Assets, Container, DisplacementFilter, Sprite } from 'pixi.js';

export const initHeroImageDisplacement = async () => {
  // Get the image element from your markup first
  const heroImage = document.querySelector('.hero__image') as HTMLImageElement;

  // Wait for the image to load if it hasn't already
  if (!heroImage.complete) {
    await new Promise((resolve) => {
      heroImage.onload = resolve;
    });
  }

  // Get the exact position and size of the image
  const imageRect = heroImage.getBoundingClientRect();

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

  canvas.classList.add('hero__image')

  // Insert the canvas right after the image in the DOM
  heroImage.insertAdjacentElement('afterend', canvas);
  const displacementMan = '../images/displacement_map_repeat.jpg'


  // Create container
  const container = new Container();
  app.stage.addChild(container);

  // Load assets
  await Assets.load([
    displacementMan,
    heroImage.src
  ]);

  // Create sprite from your image (full size of the canvas)
  const imageSprite = Sprite.from(heroImage.src);
  imageSprite.width = imageRect.width;
  imageSprite.height = imageRect.height;
  container.addChild(imageSprite);

  // Create displacement sprite
  const displacementSprite = Sprite.from(displacementMan);
  displacementSprite.texture.source.addressMode = 'repeat';
  displacementSprite.width = imageRect.width;
  displacementSprite.height = imageRect.height;

  // Create and apply displacement filter
  const displacementFilter = new DisplacementFilter({
    sprite: displacementSprite,
    scale: { x: 60, y: 30 },
    antialias: true,
  });
  displacementFilter.padding = 10;

  imageSprite.filters = [displacementFilter];
  app.stage.addChild(displacementSprite);

  // actually dont need it, rubber especially w/o debounce

  // Handle window resize
  // const repositionElements = () => {
  //   const newRect = heroImage.getBoundingClientRect();

  //   // Resize the renderer
  //   app.renderer.resize(newRect.width, newRect.height);

  //   // Reposition the canvas
  //   canvas.style.left = `${newRect.left}px`;
  //   canvas.style.top = `${newRect.top}px`;
  //   canvas.style.width = `${newRect.width}px`;
  //   canvas.style.height = `${newRect.height}px`;

  //   // Resize sprites
  //   imageSprite.width = newRect.width;
  //   imageSprite.height = newRect.height;
  //   displacementSprite.width = newRect.width;
  //   displacementSprite.height = newRect.height;
  // };

  // window.addEventListener('resize', repositionElements);

  // Hide the original image
  heroImage.style.visibility = 'hidden';
  heroImage.style.display = 'none';

  // Animation loop
  app.ticker.add(() => {
    displacementSprite.x++; // Slower movement
    if (displacementSprite.x > displacementSprite.width) {
      displacementSprite.x = 0;
    }
  });
};