import { Application, applyMatrix, Assets, Container, DisplacementFilter, Sprite } from 'pixi.js';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ resizeTo: window, backgroundAlpha: 0 });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Position the canvas absolutely over your existing content
  app.canvas.style.position = 'absolute';
  app.canvas.style.top = '0';
  app.canvas.style.left = '0';
  app.canvas.style.zIndex = '-1'; // Adjust as needed to position over/under other elements
  app.canvas.style.background = 'transparent'
  // Get the image element from your markup
  const heroImage = document.querySelector('.hero__image') as HTMLImageElement;


  // Create container
  const container = new Container();
  app.stage.addChild(container);

  
  // Load displacement map
  await Assets.load(['https://pixijs.com/assets/pixi-filters/displacement_map_repeat.jpg', heroImage.src]);

  // Create sprite from your image
  const imageSprite = Sprite.from(heroImage.src);

  // Position the sprite to match your original image's position
  const imageRect = heroImage.getBoundingClientRect();
  imageSprite.x = imageRect.left;
  imageSprite.y = imageRect.top;
  container.addChild(imageSprite);


  const displacementSprite = Sprite.from('https://pixijs.com/assets/pixi-filters/displacement_map_repeat.jpg');
  displacementSprite.texture.source.addressMode = 'repeat';

  // Create displacement filter
  const displacementFilter = new DisplacementFilter({
    sprite: displacementSprite,
    scale: { x: 30, y: 60 } // Adjust scale as needed
  });

  displacementFilter.padding = 10;
  displacementSprite.position = imageSprite.position;

  app.stage.addChild(displacementSprite);
  imageSprite.filters = [displacementFilter];

  app.stage.addChild(imageSprite)

  
  // Hide the original image (or keep it if you want a fallback)
  heroImage!.style.visibility = 'hidden';

  // Handle window resize to keep sprite positioned correctly
  window.addEventListener('resize', () => {
    const rect = heroImage.getBoundingClientRect();
    imageSprite.position.set(rect.left, rect.top);
    displacementSprite.position.set(rect.left, rect.top);
  });

  // Animation loop
  app.ticker.add(() => {
    displacementSprite.x++;
    if (displacementSprite.x > displacementSprite.width) {
      displacementSprite.x = 0;
    }
  });
})();