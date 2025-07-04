import '../scss/styles.scss'
import { initImageDisplacement } from "./initImageDisplacement.js";
import { iosVhFix } from "./utils/ios-vh-fix.js"
import { ScrollLock } from "./utils/scroll-lock.js";
import { Preloader } from "./modules/preloader";

window.addEventListener('DOMContentLoaded', async () => {
    
    iosVhFix();
    const scrollLock = new ScrollLock();
    const preloader = new Preloader(scrollLock, 2000);
    preloader.init();

    try {
        // Initialize heavy stuff (PixiJS)
        await initImageDisplacement('.hero__image', 30, 60);
        await initImageDisplacement('.intro__image', 20, 20); 
        await initImageDisplacement('.advantages__image', 30, 80);
        await initImageDisplacement('.collection__image', 30, 30);
        await initImageDisplacement('.collection-vibe__image', 30, 60);

        // When Pixi is loaded, set loaded to true
        preloader.loaded = true;
    } catch (error) {
        console.error('Initialization failed:', error);
        preloader.loaded = true; // Still hide preloader even if error occurs
    }
})