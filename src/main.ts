import { initHeroImageDisplacement } from "./heroImageDisplacement";
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
        await initHeroImageDisplacement();

        // When Pixi is loaded, set loaded to true
        preloader.loaded = true;
    } catch (error) {
        console.error('Initialization failed:', error);
        preloader.loaded = true; // Still hide preloader even if error occurs
    } finally {
        preloader
    }

})