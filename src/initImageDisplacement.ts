import { Application, Assets, Container, DisplacementFilter, Sprite } from 'pixi.js';
import displacementMap from '../images/displacement_map_repeat.jpg';

export const initImageDisplacement = async (
  selector: string,
  scaleX: number = 60,
  scaleY: number = 30,
  cursorIntensity: number = 100 // New parameter for cursor effect strength
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
    autoDensity: true,
    resolution: window.devicePixelRatio || 1
  });

  // Position the canvas exactly where the image is
  const canvas = app.canvas as HTMLCanvasElement;
  canvas.classList.add(selector.replace('.', ''));
  canvas.style.pointerEvents = 'all'; // Enable pointer events for interaction
  
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

  // Create sprite from your image
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

  // Cursor interaction variables
  let mouseX = 0;
  let mouseY = 0;
  let isMouseOver = false;
  let targetScaleX = scaleX;
  let targetScaleY = scaleY;
  let currentScaleX = scaleX;
  let currentScaleY = scaleY;

  // Shared function to handle position updates
  const updatePosition = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = clientX - rect.left;
    mouseY = clientY - rect.top;
    
    // Calculate distance-based intensity
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distance = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );
    const maxDistance = Math.sqrt(
      Math.pow(centerX, 2) + Math.pow(centerY, 2)
    );
    
    // Intensity based on distance from center (closer = stronger effect)
    const intensity = 1 - (distance / maxDistance);
    
    // Apply cursor effect to displacement scale
    targetScaleX = scaleX + (cursorIntensity * intensity);
    targetScaleY = scaleY + (cursorIntensity * intensity * 0.5);
  };

  const resetEffect = () => {
    isMouseOver = false;
    // Reset to original scale when interaction ends
    targetScaleX = scaleX;
    targetScaleY = scaleY;
  };

  // Mouse event listeners
  canvas.addEventListener('mouseenter', () => {
    isMouseOver = true;
  });

  canvas.addEventListener('mouseleave', resetEffect);

  canvas.addEventListener('mousemove', (e) => {
    if (!isMouseOver) return;
    updatePosition(e.clientX, e.clientY);
  });

  // Touch event listeners
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling
    isMouseOver = true;
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling
    if (!isMouseOver) return;
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    resetEffect();
  });

  canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    resetEffect();
  });

  // Animation loop
  app.ticker.add(() => {
    // Animate base displacement
    displacementSprite.x++;
    if (displacementSprite.x > displacementSprite.width) {
      displacementSprite.x = 0;
    }

    // Smooth interpolation for cursor effect
    const lerpFactor = 0.1; // Adjust for smoother/snappier response
    currentScaleX += (targetScaleX - currentScaleX) * lerpFactor;
    currentScaleY += (targetScaleY - currentScaleY) * lerpFactor;

    // Apply the interpolated scale to the filter
    displacementFilter.scale.x = currentScaleX;
    displacementFilter.scale.y = currentScaleY;

    // Optional: Add subtle rotation based on mouse position
    if (isMouseOver) {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const offsetX = (mouseX - centerX) / centerX;
      const offsetY = (mouseY - centerY) / centerY;
      
      // Subtle displacement offset based on mouse position
      displacementSprite.y = offsetY * 5; // Adjust multiplier for effect strength
    } else {
      // Return to center when mouse leaves
      displacementSprite.y += (0 - displacementSprite.y) * 0.05;
    }
  });

  // Return cleanup function
  return () => {
    app.destroy();
    canvas.remove();
    targetImage.style.visibility = 'visible';
    targetImage.style.display = '';
  };
};