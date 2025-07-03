import { initHeroImageDisplacement } from "./heroImageDisplacement";
import { iosVhFix } from "./utils/ios-vh-fix.js"
import { ScrollLock } from "./utils/scroll-lock.js";
import { initPreloader } from "./modules/preloader.ts";

window.addEventListener('DOMContentLoaded', async () => {
    await initHeroImageDisplacement();
    (window as any).scrollLock = new ScrollLock();
    initPreloader()
    iosVhFix();
})