import Experience from "../Experience.js";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.room.children.forEach((child) => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child;
            }
        });
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;
        this.circleFourth = this.experience.world.floor.circleFourth;
        this.circleFifth = this.experience.world.floor.circleFifth;
        this.circleSixth = this.experience.world.floor.circleSixth;
        
        // Store bounce animation controllers
        this.bounceControllers = {};

        gsap.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.overflow = "visible";

        if (
            !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            this.setSmoothScroll();
        }
        this.setScrollTrigger();
    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            ease: 0.1,
            disableRaf: true,
        });

        gsap.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement,
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            fixedMarkers: true,
        });

        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(
                    ".gsap-marker-start, .gsap-marker-end, [asscroll]"
                ),
            });
        });
        return asscroll;
    }

    setSmoothScroll() {
        this.asscroll = this.setupASScroll();
    }

    setScrollTrigger() {
        window.scrollTo(0, 0);
        if (this.asscroll) {
            this.asscroll.currentPos = 0;
        }

        this.isContactFormVisible = false;

        // Show the floating nav now that the intro animation is complete
        this.floatingNav = document.getElementById('floating-nav');
        if (this.floatingNav) {
            gsap.set(this.floatingNav, { opacity: 0, y: -12, pointerEvents: 'none' });
            gsap.to(this.floatingNav, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', pointerEvents: 'auto' });
        }

        ScrollTrigger.matchMedia(
            {
                //Desktop - positions camera in desktop scenes
                "(min-width: 969px)": () => {
                    this.room.scale.set(0.11, 0.11, 0.11);
                    this.rectLight.width = 0.5;
                    this.rectLight.height = 0.7;
                    this.camera.orthographicCamera.position.set(0, 6.5, 10);
                    this.room.position.set(0, 0, 0);

                    // First section -----------------------------------------
                    this.firstMoveTimeline = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".first-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.3,
                            },
                        }
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: -2, y: 6.5, z: 10},
                        "same"
                    );


                    // Second section -----------------------------------------
                    this.secondMoveTimeline = new gsap.timeline({
                            scrollTrigger: {
                                trigger: ".second-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                                onEnter: () => {
                                    // Start looping bounce for Ghost Pacer glasses
                                    if (this.bounceControllers.ghostPacer) {
                                        this.bounceControllers.ghostPacer.stop();
                                    }

                                    this.bounceControllers.ghostPacer = this.experience.world.room.createLoopingBounce('ghost_pacer', {
                                        bounceHeight: 0.5,
                                        duration: 1,
                                        bounceTimes: 1,
                                        loopInterval: 1
                                    });

                                    this.bounceControllers.ghostPacer.start();
                                },
                                onLeave: () => {
                                    // Stop the bounce animation when leaving section
                                    if (this.bounceControllers.ghostPacer) {
                                        this.bounceControllers.ghostPacer.stop();
                                    }
                                }
                            },
                        }
                    ).to(
                        this.room.scale,
                        {x: 0.7, y: 0.7, z: 0.7},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: 8.5, y: 13, z: 10},
                        "same"
                    );

                    // Third section -----------------------------------------
                    this.thirdMoveTimeline = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".third-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                                onEnter: () => {
                                    // Start looping bounce for camera object
                                    if (this.bounceControllers.camera) {
                                        this.bounceControllers.camera.stop();
                                    }

                                    this.bounceControllers.camera = this.experience.world.room.createLoopingBounce('dslr', {
                                        bounceHeight: 0.5,
                                        duration: 1,
                                        bounceTimes: 1,
                                        loopInterval: 1
                                    });

                                    this.bounceControllers.camera.start();
                                },
                                onLeave: () => {
                                    // Stop the bounce animation when leaving section
                                    if (this.bounceControllers.camera) {
                                        this.bounceControllers.camera.stop();
                                    }
                                }
                            },
                        }
                    ).to(
                        this.room.scale,
                        {x: 0.7, y: 0.7, z: 0.7},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: -0.5, y: 11, z: 10},
                        "same"
                    );

                    // Fourth section -----------------------------------------
                    this.fourthMoveTimeline = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".fourth-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                                onEnter: () => {
                                    // Start looping bounce for computer object
                                    if (this.bounceControllers.computer) {
                                        this.bounceControllers.computer.stop();
                                    }

                                    this.bounceControllers.computer = this.experience.world.room.createLoopingBounce('computer', {
                                        bounceHeight: 0.5,
                                        duration: 1,
                                        bounceTimes: 1,
                                        loopInterval: 1
                                    });

                                    this.bounceControllers.computer.start();
                                },
                                onLeave: () => {
                                    // Stop the bounce animation when leaving section
                                    if (this.bounceControllers.computer) {
                                        this.bounceControllers.computer.stop();
                                    }
                                }
                            },
                        }
                    ).to(
                        this.room.scale,
                        {x: 0.3, y: 0.3, z: 0.3},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: -1, y: 8, z: 10},
                        "same"
                    );

                    // Fifth section -----------------------------------------
                    this.fifthMoveTimeline = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".fifth-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                                onEnter: () => {
                                    // Start looping bounce for notepad object
                                    if (this.bounceControllers.notepad) {
                                        this.bounceControllers.notepad.stop();
                                    }

                                    this.bounceControllers.notepad = this.experience.world.room.createLoopingBounce('notepad', {
                                        bounceHeight: 0.5,
                                        duration: 1,
                                        bounceTimes: 1,
                                        loopInterval: 1
                                    });

                                    this.bounceControllers.notepad.start();
                                },
                                onLeave: () => {
                                    // Stop the bounce animation when leaving section
                                    if (this.bounceControllers.notepad) {
                                        this.bounceControllers.notepad.stop();
                                    }
                                }
                            },
                        }
                    ).to(
                        this.room.scale,
                        {x: 0.11, y: 0.11, z: 0.11},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: -2, y: 6.5, z: 10},
                        "same"
                    );

                    // Sixth section -----------------------------------------
                    this.sixthMoveTimeline = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".sixth-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                                onUpdate: (self) => {
                                    const progress = self.progress;
                                    const fixedPortfolioInfo = document.getElementById('fixed-portfolio-info');
                                    const fixedContactContainer = document.getElementById('fixed-contact-container');

                                    if (progress >= 0.95 && !this.isContactFormVisible) {
                                        this.isContactFormVisible = true;
                                        if (fixedPortfolioInfo) {
                                            gsap.killTweensOf(fixedPortfolioInfo);
                                            fixedPortfolioInfo.style.display = 'block';
                                            gsap.to(fixedPortfolioInfo, { opacity: 1, duration: 0.5 });
                                        }
                                        if (fixedContactContainer) {
                                            gsap.killTweensOf(fixedContactContainer);
                                            fixedContactContainer.style.display = 'block';
                                            fixedContactContainer.style.pointerEvents = 'auto';
                                            fixedContactContainer.style.zIndex = '999999999';
                                            gsap.to(fixedContactContainer, { opacity: 1, duration: 0.5 });
                                        }
                                    } else if (progress < 0.95 && this.isContactFormVisible) {
                                        this.isContactFormVisible = false;
                                        if (fixedPortfolioInfo) {
                                            gsap.killTweensOf(fixedPortfolioInfo);
                                            gsap.to(fixedPortfolioInfo, {
                                                opacity: 0,
                                                duration: 0.3,
                                                onComplete: () => { fixedPortfolioInfo.style.display = 'none'; }
                                            });
                                        }
                                        if (fixedContactContainer) {
                                            gsap.killTweensOf(fixedContactContainer);
                                            fixedContactContainer.style.pointerEvents = 'none';
                                            gsap.to(fixedContactContainer, {
                                                opacity: 0,
                                                duration: 0.3,
                                                onComplete: () => { fixedContactContainer.style.display = 'none'; }
                                            });
                                        }
                                    }
                                }
                            },
                        }
                    ).to(
                        this.room.scale,
                        {x: 0.15, y: 0.15, z: 0.15},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: 0, y: 6.5, z: 9.25},
                        "same"
                    );
                },

                // Mobile - positions camera in mobile scenes
                "(max-width: 968px)": () => {

                    // Resets
                    this.room.scale.set(0.07, 0.07, 0.07);
                    this.room.position.set(0, 0, 0);
                    this.rectLight.width = 0.3;
                    this.rectLight.height = 0.4;
                    this.camera.orthographicCamera.position.set(0, 6.5, 10);

                    // First section -----------------------------------------
                    this.firstMoveTimeline = new gsap.timeline({
                        scrollTrigger: {
                            trigger: ".first-move",
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.6,
                        },
                    }).to(this.room.scale, {
                        x: 0.1,
                        y: 0.1,
                        z: 0.1,
                    });

                    // Second section -----------------------------------------
                    this.secondMoveTimeline = new gsap.timeline({
                        scrollTrigger: {
                            trigger: ".second-move",
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.6,
                            onEnter: () => {
                                // Start looping bounce for Ghost Pacer glasses
                                if (this.bounceControllers.ghostPacer) {
                                    this.bounceControllers.ghostPacer.stop();
                                }

                                this.bounceControllers.ghostPacer = this.experience.world.room.createLoopingBounce('ghost_pacer', {
                                    bounceHeight: 0.5,
                                    duration: 1,
                                    bounceTimes: 1,
                                    loopInterval: 1
                                });

                                this.bounceControllers.ghostPacer.start();
                            },
                            onLeave: () => {
                                // Stop the bounce animation when leaving section
                                if (this.bounceControllers.ghostPacer) {
                                    this.bounceControllers.ghostPacer.stop();
                                }
                            }
                        }
                    }).to(
                        this.room.scale,
                        {x: 0.6, y: 0.6, z: 0.6},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: 6, y: 12, z: 10},
                        "same"
                    );

                    // Third section -----------------------------------------
                    this.thirdMoveTimeline = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".third-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                                onEnter: () => {
                                    // Start looping bounce for camera object
                                    if (this.bounceControllers.camera) {
                                        this.bounceControllers.camera.stop();
                                    }

                                    this.bounceControllers.camera = this.experience.world.room.createLoopingBounce('dslr', {
                                        bounceHeight: 0.5,
                                        duration: 1,
                                        bounceTimes: 1,
                                        loopInterval: 1
                                    });

                                    this.bounceControllers.camera.start();
                                },
                                onLeave: () => {
                                    // Stop the bounce animation when leaving section
                                    if (this.bounceControllers.camera) {
                                        this.bounceControllers.camera.stop();
                                    }
                                }
                            },
                        }
                    ).to(
                        this.room.scale,
                        {x: 0.7, y: 0.7, z: 0.7},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: 1.25, y: 11, z: 10},
                        "same"
                    );

                    // Fourth section -----------------------------------------
                    this.fourthMoveTimeline = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".fourth-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                                onEnter: () => {
                                    // Start looping bounce for computer object
                                    if (this.bounceControllers.computer) {
                                        this.bounceControllers.computer.stop();
                                    }

                                    this.bounceControllers.computer = this.experience.world.room.createLoopingBounce('computer', {
                                        bounceHeight: 0.5,
                                        duration: 1,
                                        bounceTimes: 1,
                                        loopInterval: 1
                                    });

                                    this.bounceControllers.computer.start();
                                },
                                onLeave: () => {
                                    // Stop the bounce animation when leaving section
                                    if (this.bounceControllers.computer) {
                                        this.bounceControllers.computer.stop();
                                    }
                                }
                            },
                        }
                    ).to(
                        this.room.scale,
                        {x: 0.3, y: 0.3, z: 0.3},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: -2, y: 8, z: 10},
                        "same"
                    );

                    // Fifth section -----------------------------------------
                    this.fifthMoveTimeline = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".fifth-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                                onEnter: () => {
                                    // Start looping bounce for notepad object
                                    if (this.bounceControllers.notepad) {
                                        this.bounceControllers.notepad.stop();
                                    }

                                    this.bounceControllers.notepad = this.experience.world.room.createLoopingBounce('notepad', {
                                        bounceHeight: 0.5,
                                        duration: 1,
                                        bounceTimes: 1,
                                        loopInterval: 1
                                    });

                                    this.bounceControllers.notepad.start();
                                },
                                onLeave: () => {
                                    // Stop the bounce animation when leaving section
                                    if (this.bounceControllers.notepad) {
                                        this.bounceControllers.notepad.stop();
                                    }
                                }
                            },
                        }
                    ).to(
                        this.room.scale,
                        {x: 0.4, y: 0.4, z: 0.4},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: -1, y: 7, z: 8},
                        "same"
                    );

                    // Sixth section -----------------------------------------
                    this.sixthMoveTimeline = new gsap.timeline({
                        scrollTrigger: {
                            trigger: ".sixth-move",
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.6,
                        }
                    }).to(
                        this.room.scale,
                        {x: 0.10, y: 0.10, z: 0.10},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: 0, y: 6.5, z: 10},
                        "same"
                    );
                },

                // All - handles progress bar & animating floor circles
                all: () => {
                    this.sections = document.querySelectorAll(".section");
                    // this.sections.forEach((section) => {
                    //     this.progressWrapper =
                    //         section.querySelector(".progress-wrapper");
                    //     this.progressBar = section.querySelector(".progress-bar");
                    // });

                    // All animations
                    // First section -----------------------------------------
                    this.firstCircle = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".first-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                            },
                        }
                    ).to(
                        this.circleFirst.scale,
                        {x: 3, y: 3, z: 3}
                    );

                    // Second section -----------------------------------------
                    this.secondCircle = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".second-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                            },
                        }
                    ).to(
                        this.circleSecond.scale,
                        {x: 10, y: 10, z: 10},
                    );

                    // Third section -----------------------------------------
                    this.thirdCircle = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".third-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                            },
                        }
                    ).to(
                        this.circleThird.scale,
                        {x: 10, y: 10, z: 10},
                    );
                    // Fourth section -----------------------------------------
                    this.fourthCircle = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".fourth-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                            },
                        }
                    ).to(
                        this.circleFourth.scale,
                        {x: 10, y: 10, z: 10},
                    );
                    // Fifth section -----------------------------------------
                    this.fifthCircle = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".fifth-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                            },
                        }
                    ).to(
                        this.circleFifth.scale,
                        {x: 10, y: 10, z: 10},
                    );
                    // Sixth section -----------------------------------------
                    this.sixthCircle = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".sixth-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                            },
                        }
                    ).to(
                        this.circleSixth.scale,
                        {x: 10, y: 10, z: 10},
                    );

                    // Floating nav — hide during middle scroll sections, show at hero + bottom
                    const nav = this.floatingNav;
                    if (nav) {
                        const navHide = () => gsap.to(nav, { opacity: 0, y: -12, duration: 0.35, ease: 'power2.in', pointerEvents: 'none' });
                        const navShow = () => gsap.to(nav, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', pointerEvents: 'auto' });

                        // Hide when entering scrolling sections, show when scrolling back to hero
                        ScrollTrigger.create({
                            trigger: '.first-move',
                            start: 'top top',
                            onEnter: navHide,
                            onLeaveBack: navShow,
                        });

                        // Show when reaching the contact/bottom section, hide when leaving back up
                        ScrollTrigger.create({
                            trigger: '.sixth-move',
                            start: 'top top',
                            onEnter: navShow,
                            onLeaveBack: navHide,
                        });
                    }
                },
            });
    }

    resize() {
    }

    update() {
    }
}
