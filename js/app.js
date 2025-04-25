(() => {
    "use strict";
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767.98";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    const langSwitcher = document.querySelector(".lang-switcher");
    const langToggle = document.querySelector(".lang-toggle");
    langToggle.addEventListener("click", (() => {
        langSwitcher.classList.toggle("active");
    }));
    document.addEventListener("click", (e => {
        if (!langSwitcher.contains(e.target)) langSwitcher.classList.remove("active");
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const menuItems = document.querySelectorAll(".menu-item-has-children");
        if (window.innerWidth <= 1024) {
            menuItems.forEach((item => {
                const link = item.querySelector(".menu__link");
                link.addEventListener("click", (e => {
                    e.preventDefault();
                    const isOpen = item.classList.contains("open");
                    document.querySelectorAll(".menu-item-has-children.open").forEach((openItem => {
                        openItem.classList.remove("open");
                    }));
                    if (!isOpen) item.classList.add("open");
                }));
            }));
            document.addEventListener("click", (e => {
                const isClickInsideMenu = e.target.closest(".menu-item-has-children");
                if (!isClickInsideMenu) document.querySelectorAll(".menu-item-has-children.open").forEach((item => item.classList.remove("open")));
            }));
        }
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const lottieButtons = [ {
            buttonClass: ".lottie-button",
            bgClass: ".lottie-bg",
            autoplay: false,
            loop: false
        }, {
            buttonClass: ".lottie-button",
            bgClass: ".lottie-bg-hero",
            autoplay: false,
            loop: false
        }, {
            buttonClass: ".lottie-button-header",
            bgClass: ".lottie-bg-header",
            autoplay: true,
            loop: true
        } ];
        lottieButtons.forEach((({buttonClass, bgClass, autoplay, loop}) => {
            const buttons = document.querySelectorAll(buttonClass);
            buttons.forEach((button => {
                const lottieContainer = button.querySelector(bgClass);
                if (!lottieContainer) return;
                const animation = lottie.loadAnimation({
                    container: lottieContainer,
                    renderer: "svg",
                    loop,
                    autoplay,
                    path: "img/9gdAU8lkom.json"
                });
                if (!autoplay) button.addEventListener("mouseenter", (() => {
                    animation.goToAndPlay(0, true);
                }));
            }));
        }));
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const banner = document.querySelector(".banner-hero");
        const image = banner.querySelector(".banner-hero__img");
        banner.addEventListener("mousemove", (e => {
            const rect = banner.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * 10;
            const rotateY = (x - centerX) / centerX * -10;
            image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }));
        banner.addEventListener("mouseleave", (() => {
            image.style.transform = "rotateX(0deg) rotateY(0deg)";
        }));
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const blocks = document.querySelectorAll(".effect-block");
        blocks.forEach((block => {
            const svg = block.querySelector(".hover-effect");
            block.addEventListener("mousemove", (e => {
                const rect = block.getBoundingClientRect();
                const x = e.clientX - rect.left - svg.clientWidth / 2;
                const y = e.clientY - rect.top - svg.clientHeight / 2;
                svg.style.left = `${x}px`;
                svg.style.top = `${y}px`;
            }));
            block.addEventListener("mouseenter", (e => {
                const rect = block.getBoundingClientRect();
                const x = e.clientX - rect.left - svg.clientWidth / 2;
                const y = e.clientY - rect.top - svg.clientHeight / 2;
                svg.style.left = `${x}px`;
                svg.style.top = `${y}px`;
                svg.style.opacity = "1";
                svg.style.transform = "scale(1)";
            }));
            block.addEventListener("mouseleave", (e => {
                const rect = block.getBoundingClientRect();
                const x = e.clientX - rect.left - svg.clientWidth / 2;
                const y = e.clientY - rect.top - svg.clientHeight / 2;
                svg.style.left = `${x}px`;
                svg.style.top = `${y}px`;
                svg.style.opacity = "0";
                svg.style.transform = "scale(0.7)";
            }));
        }));
    }));
    window["FLS"] = true;
    menuInit();
})();