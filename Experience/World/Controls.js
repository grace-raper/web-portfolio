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
        ScrollTrigger.matchMedia(
            {
                //Desktop - positions camera in desktop scenes
                "(min-width: 969px)": () => {
                    console.log("fired desktop");

                    this.room.scale.set(0.11, 0.11, 0.11);
                    this.rectLight.width = 0.5;
                    this.rectLight.height = 0.7;
                    this.camera.orthographicCamera.position.set(0, 6.5, 10);
                    console.log(this.camera.orthographicCamera.top)
                    console.log(this.camera.orthographicCamera.bottom)
                    console.log(this.camera.orthographicCamera.left)
                    console.log(this.camera.orthographicCamera.right)
                    this.room.position.set(0, 0, 0);

                    // First section -----------------------------------------
                    this.firstMoveTimeline = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".first-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.3,
                                invalidateOnRefresh: true,
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
                                invalidateOnRefresh: true,
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
                                invalidateOnRefresh: true,
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
                                invalidateOnRefresh: true,
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
                                invalidateOnRefresh: true,
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
                                invalidateOnRefresh: true,
                            },
                        }
                    ).to(
                        this.room.scale,
                        {x: 0.7, y: 0.7, z: 0.7},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: 7.5, y: 12, z: 10},
                        "same"
                    );
                },

                // Mobile - positions camera in mobile scenes
                "(max-width: 968px)": () => {
                    console.log("fired mobile");

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
                            invalidateOnRefresh: true,
                        },
                    }).to(this.room.scale, {
                        x: 0.1,
                        y: 0.1,
                        z: 0.1,
                    });

                    // Second section -----------------------------------------
                    this.secondMoveTimeline = new gsap.timeline(
                        {
                            scrollTrigger: {
                                trigger: ".second-move",
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.6,
                                invalidateOnRefresh: true,
                            },
                        }
                    ).to(
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
                                invalidateOnRefresh: true,
                            },
                        }
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
                                invalidateOnRefresh: true,
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
                                invalidateOnRefresh: true,
                            },
                        }
                    ).to(
                        this.room.scale,
                        {x: 0.09, y: 0.09, z: 0.09},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: 0, y: 6.5, z: 10},
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
                                invalidateOnRefresh: true,
                            },
                        }
                    ).to(
                        this.room.scale,
                        {x: 0.7, y: 0.7, z: 0.7},
                        "same"
                    ).to(
                        this.camera.orthographicCamera.position,
                        {x: 5.5, y: 12, z: 10},
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
                },
            });
    }

    resize() {
    }

    update() {
    }
}
