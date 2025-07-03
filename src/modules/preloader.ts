const preloader = document.querySelector('[data-preloader="parent"]') as HTMLElement;
const preloaderDuration = preloader?.dataset.preloaderDuration;

let loaded

const hide = () => {
    preloader?.classList.add('is-hidden');
    console.log('hide!');
}


const startLoadingTimeout = () => {
    setTimeout(() => {
        hide()
    }, parseInt(preloaderDuration!))
};

const listenForPageLoad = () => {
    window.addEventListener('load', () => {
        loaded = true;
        startLoadingTimeout();
    });
}

const getPreloader = () => {

    console.log(preloaderDuration);
    preloader.classList.add('is-loading');
    startLoadingTimeout();
    listenForPageLoad();
}

const initPreloader = () => {
    getPreloader();
};

export { initPreloader };