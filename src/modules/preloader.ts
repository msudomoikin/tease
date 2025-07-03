import type { ScrollLock } from "../utils/scroll-lock";

// preloader.ts
export class Preloader {
    private element: HTMLElement | null;
    private duration: number;
    private image: HTMLImageElement | null;
    private _loaded: boolean = false;
    private scrollLock: ScrollLock;

    constructor(scrollLock: ScrollLock, duration: number) {
        this.element = document.querySelector('[data-preloader="parent"]');
        this.image = document.querySelector('.preloader__image');
        this.duration = duration;
        this.scrollLock = scrollLock;
    }

    public get loaded(): boolean {
        return this._loaded;
    }

    public set loaded(value: boolean) {
        this._loaded = value;
        if (value) {
            this.startLoadingTimeout();
        }
    }

    private hide(): void {
        this.image?.addEventListener('animationiteration', () => {
            this.image?.classList.remove('fadeInOut-anim')
            this.image?.offsetWidth;
            this.image?.classList.add('is-hidden');
        })


        this.element?.offsetWidth;
        this.element?.classList.add('is-hidden');


        this.scrollLock.enableScrolling();
        console.log('Preloader hidden');
    }

    private startLoadingTimeout(): void {
        setTimeout(() => {
            this.hide();
        }, this.duration);
    }

    private listenForPageLoad(): void {
        window.addEventListener('load', () => {
            this.loaded = true;
        });
    }

    public init(): void {
        if (!this.element) return;

        this.scrollLock.disableScrolling();
        this.element.classList.add('is-loading');
        console.log(`Preloader duration: ${this.duration}ms`);
        this.listenForPageLoad();
    }
}