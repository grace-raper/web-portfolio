import Experience from "../Experience.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

// ─── STATE TABLES ─────────────────────────────────────────────────────────────
// Each entry defines the camera position and room scale AT THE END of the
// corresponding trigger zone. Index 0 is the hero state (before any trigger
// fires). Index [i+1] is the state after TRIGGERS[i] has played fully.
//
// These are the single source of truth for all camera and room.scale values.
// If a position or scale looks wrong at runtime, change it here — nowhere else.
// No other location in the codebase should hard-code these numbers.
//
// ARCHITECTURE NOTE: We intentionally do NOT use GSAP timelines or scrub for
// camera/scale. GSAP scrub creates internal _tween objects targeting
// timeline.totalTime — these are opaque and break permanently when killed.
// Instead, _applyState() interpolates directly between these table entries
// on every scroll tick via onUpdate. ASScroll (ease: 0.15) already provides
// the smooth-follow effect through the ScrollTrigger proxy; no additional
// GSAP lag is needed.

const DESKTOP_STATES = [
    { cam: { x: 0,    y: 6.5, z: 10   }, scale: 0.11 }, // [0] hero (initial state)
    { cam: { x: -2,   y: 6.5, z: 10   }, scale: 0.11 }, // [1] after first-move  — cam slides left
    { cam: { x: 8.5,  y: 13,  z: 10   }, scale: 0.7  }, // [2] after second-move — room zooms, cam upper-right
    { cam: { x: -0.5, y: 11,  z: 10   }, scale: 0.7  }, // [3] after third-move  — cam moves left, scale stays
    { cam: { x: -1,   y: 8,   z: 10   }, scale: 0.3  }, // [4] after fourth-move — room shrinks
    { cam: { x: -2,   y: 6.5, z: 10   }, scale: 0.11 }, // [5] after fifth-move  — room shrinks to hero scale
    { cam: { x: 0,    y: 6.5, z: 9.25 }, scale: 0.15 }, // [6] after sixth-move  — contact, slight zoom in
];

const MOBILE_STATES = [
    { cam: { x: 0,    y: 6.5, z: 10 }, scale: 0.07 }, // [0] hero
    { cam: { x: 0,    y: 6.5, z: 10 }, scale: 0.1  }, // [1] after first-move  — scale only, cam stays
    { cam: { x: 6,    y: 12,  z: 10 }, scale: 0.6  }, // [2] after second-move
    { cam: { x: 1.25, y: 11,  z: 10 }, scale: 0.7  }, // [3] after third-move
    { cam: { x: -2,   y: 8,   z: 10 }, scale: 0.3  }, // [4] after fourth-move
    { cam: { x: -1,   y: 7,   z: 8  }, scale: 0.4  }, // [5] after fifth-move
    { cam: { x: 0,    y: 6.5, z: 10 }, scale: 0.10 }, // [6] after sixth-move
];

// ─── TRIGGER SELECTORS ────────────────────────────────────────────────────────
// TRIGGERS[i] drives the interpolation from states[i] → states[i+1].
// The order must match the DOM order of *-move divider elements in index.html.

const TRIGGERS = [
    '.first-move',   // i=0 → interpolates states[0]→states[1]
    '.second-move',  // i=1 → interpolates states[1]→states[2]
    '.third-move',   // i=2 → interpolates states[2]→states[3]
    '.fourth-move',  // i=3 → interpolates states[3]→states[4]
    '.fifth-move',   // i=4 → interpolates states[4]→states[5]
    '.sixth-move',   // i=5 → interpolates states[5]→states[6]
];

// ─── SECTION SIDE-EFFECT CONFIG ───────────────────────────────────────────────
// Bounce animations are the ONLY side effects driven by scroll events.
// bounceObject: the object name passed to Room.createLoopingBounce()
// bounceKey:    key in this.bounceControllers (separate from bounceObject in
//               case two sections ever share the same object name)
// bounceOptions: passed verbatim to createLoopingBounce()

const SECTION_CONFIGS = [
    { bounceObject: null },
    {
        bounceObject: 'ghost_pacer',
        bounceKey:    'ghostPacer',
        bounceOptions: { bounceHeight: 0.5, duration: 1, bounceTimes: 1, loopInterval: 1 },
    },
    {
        bounceObject: 'dslr',
        bounceKey:    'camera',
        bounceOptions: { bounceHeight: 0.5, duration: 1, bounceTimes: 1, loopInterval: 1 },
    },
    {
        bounceObject: 'computer',
        bounceKey:    'computer',
        bounceOptions: { bounceHeight: 0.5, duration: 1, bounceTimes: 1, loopInterval: 1 },
    },
    {
        bounceObject: 'notepad',
        bounceKey:    'notepad',
        bounceOptions: { bounceHeight: 0.5, duration: 1, bounceTimes: 1, loopInterval: 1 },
    },
    { bounceObject: null },
];

// ─────────────────────────────────────────────────────────────────────────────

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene      = this.experience.scene;
        this.sizes      = this.experience.sizes;
        this.resources  = this.experience.resources;
        this.time       = this.experience.time;
        this.camera     = this.experience.camera;
        this.room       = this.experience.world.room.actualRoom;

        // Extract the RectAreaLight from room children
        this.room.children.forEach((child) => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child;
            }
        });

        // Floor circle meshes — used by _buildCameraTriggers for GSAP scrub animations.
        // These are the ONLY objects where GSAP scrub is used, because each circle
        // targets a unique Three.js object (no shared-property conflicts).
        this.circleFirst  = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird  = this.experience.world.floor.circleThird;
        this.circleFourth = this.experience.world.floor.circleFourth;
        this.circleFifth  = this.experience.world.floor.circleFifth;
        this.circleSixth  = this.experience.world.floor.circleSixth;

        // Bounce animation controllers keyed by SECTION_CONFIGS[i].bounceKey.
        // Values are objects returned by Room.createLoopingBounce() with
        // .start() and .stop() methods.
        this.bounceControllers = {};

        gsap.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.overflow = "visible";

        // ASScroll is only set up on non-mobile devices. On mobile, native
        // scroll is used and ScrollTrigger reads window.scrollY directly.
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.setSmoothScroll();
        }

        this.setScrollTrigger();
    }

    // ─── ASSCROLL SETUP ───────────────────────────────────────────────────────

    setupASScroll() {
        // ASScroll provides smooth-scroll with ease: 0.15. It is wired into
        // ScrollTrigger via scrollerProxy so that self.progress in onUpdate
        // callbacks reflects the smoothed position — this is the source of
        // the camera's smooth follow behavior. No GSAP scrub is needed on top.
        const asscroll = new ASScroll({
            ease: 0.15,
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
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
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

    // ─── CORE INTERPOLATION ───────────────────────────────────────────────────

    /**
     * Linearly interpolates camera position and room scale between two
     * state-table entries and writes the result directly to the Three.js objects.
     *
     * This is the ONLY method that writes camera.position and room.scale during
     * scroll. All writes go through here so ownership is unambiguous.
     *
     * WHY DIRECT THREE.JS WRITES (not GSAP):
     *   GSAP scrub creates internal _tween objects targeting timeline.totalTime.
     *   Once killed (e.g. by gsap.killTweensOf), ScrollTrigger's attempt to
     *   revive them via _tween.invalidate().restart() is unreliable — the tween
     *   is sometimes permanently dead, causing progressive animation failure.
     *   Direct Three.js writes are synchronous, permanent, and have no hidden state.
     *
     * WHY NO ADDITIONAL EASING:
     *   ASScroll (ease: 0.15) smooths the scroll position before ScrollTrigger
     *   reads it via the proxy. self.progress in onUpdate already reflects this
     *   smoothed value. Adding GSAP scrub lag on top caused timing artifacts
     *   (camera still catching up 600ms after scroll stopped).
     *
     * DEBUGGING: If camera or scale is wrong at a given scroll position, check
     *   the state-table entries at fromIdx and toIdx. If the value drifts after
     *   a snap, grep for any other code writing to camera.position or room.scale.
     *
     * @param {Array}  states   DESKTOP_STATES or MOBILE_STATES
     * @param {number} fromIdx  State index at progress=0 (start of trigger zone)
     * @param {number} toIdx    State index at progress=1 (end of trigger zone)
     * @param {number} progress Value in [0,1] from ScrollTrigger self.progress
     */
    _applyState(states, fromIdx, toIdx, progress) {
        const from = states[fromIdx];
        const to   = states[toIdx];
        const p    = progress;

        const cam = this.camera.orthographicCamera.position;
        cam.x = from.cam.x + (to.cam.x - from.cam.x) * p;
        cam.y = from.cam.y + (to.cam.y - from.cam.y) * p;
        cam.z = from.cam.z + (to.cam.z - from.cam.z) * p;

        const s = from.scale + (to.scale - from.scale) * p;
        this.room.scale.set(s, s, s);
    }

    // ─── CONTACT FORM VISIBILITY ──────────────────────────────────────────────

    /**
     * Shows or hides the fixed contact overlay based on sixth-move progress.
     *
     * Called inside sixth-move's onUpdate — which runs at RAF rate. The
     * isContactFormVisible flag is critical: without it, gsap.to() would be
     * called thousands of times per second while the user holds scroll still,
     * creating a tween backlog. Always guard state-change animations this way.
     *
     * Threshold 0.95: the contact section is nearly fully in view. Adjust here
     * if the form appears too early or too late.
     *
     * @param {number} progress self.progress from the sixth-move ScrollTrigger
     */
    _updateContactForm(progress) {
        const info    = document.getElementById('fixed-portfolio-info');
        const contact = document.getElementById('fixed-contact-container');

        if (progress >= 0.95 && !this.isContactFormVisible) {
            this.isContactFormVisible = true;
            if (info) {
                gsap.killTweensOf(info);
                info.style.display = 'block';
                gsap.to(info, { opacity: 1, duration: 0.5 });
            }
            if (contact) {
                gsap.killTweensOf(contact);
                contact.style.display       = 'block';
                contact.style.pointerEvents = 'auto';
                contact.style.zIndex        = '999999999';
                gsap.to(contact, { opacity: 1, duration: 0.5 });
            }
        } else if (progress < 0.95 && this.isContactFormVisible) {
            this.isContactFormVisible = false;
            if (info) {
                gsap.killTweensOf(info);
                gsap.to(info, {
                    opacity: 0, duration: 0.3,
                    onComplete: () => { info.style.display = 'none'; },
                });
            }
            if (contact) {
                gsap.killTweensOf(contact);
                contact.style.pointerEvents = 'none';
                gsap.to(contact, {
                    opacity: 0, duration: 0.3,
                    onComplete: () => { contact.style.display = 'none'; },
                });
            }
        }
    }

    // ─── SCROLL TRIGGER FACTORY ───────────────────────────────────────────────

    /**
     * Creates one ScrollTrigger per trigger zone and one floor-circle GSAP
     * timeline per trigger. This is the core of the scroll-driven experience.
     *
     * CAMERA / SCALE — owned exclusively by onUpdate.
     *   onUpdate fires on every scroll frame in both directions. self.progress
     *   (0→1) reflects ASScroll's smoothed currentPos via the proxy. We pass
     *   it directly to _applyState, which writes to Three.js. There is no GSAP
     *   tween involved — nothing to kill, nothing to revive.
     *
     *   Trigger zones do not overlap, so exactly one onUpdate is active at any
     *   scroll position. This gives camera and scale a single owner at all times.
     *
     * SIDE EFFECTS — owned exclusively by onEnter / onLeave / onEnterBack / onLeaveBack.
     *   These are edge-triggered (fire once per zone crossing). They manage
     *   bounce animations only and never touch camera.position or room.scale.
     *   The "stop before start" pattern prevents accumulation if the user scrolls
     *   fast enough to skip onLeave entirely.
     *
     * FLOOR CIRCLES — GSAP timeline with scrub (safe here).
     *   Each circle targets a unique Three.js object, so no shared-property
     *   conflicts exist. The GSAP scrub pattern is correct and appropriate here.
     *
     * COMMON ERROR SOURCE: Do NOT put gsap.to() or gsap.killTweensOf() inside
     *   onUpdate. onUpdate fires at ~60fps — creating tweens there causes
     *   thousands of GSAP objects per second and will tank performance.
     *   onUpdate must contain only pure synchronous computation.
     *
     * @param {Array} states   DESKTOP_STATES or MOBILE_STATES
     * @param {Array} circles  [circleFirst, ..., circleSixth] in trigger order
     */
    _buildCameraTriggers(states, circles) {
        TRIGGERS.forEach((selector, i) => {
            const cfg           = SECTION_CONFIGS[i];
            const isLastSection = i === TRIGGERS.length - 1;

            ScrollTrigger.create({
                trigger: selector,
                start:   'top top',
                end:     'bottom bottom',

                // ── Camera & scale ────────────────────────────────────────
                onUpdate: (self) => {
                    this._applyState(states, i, i + 1, self.progress);
                    if (isLastSection) {
                        this._updateContactForm(self.progress);
                    }
                },

                // ── Bounce animations ─────────────────────────────────────
                // Each callback does the same pattern: stop any running instance
                // (guard against double-start), then start fresh if appropriate.

                onEnter: () => {
                    if (!cfg.bounceObject) return;
                    const key = cfg.bounceKey;
                    if (this.bounceControllers[key]) this.bounceControllers[key].stop();
                    this.bounceControllers[key] = this.experience.world.room.createLoopingBounce(
                        cfg.bounceObject, cfg.bounceOptions
                    );
                    this.bounceControllers[key].start();
                },

                onLeave: () => {
                    if (!cfg.bounceObject) return;
                    const key = cfg.bounceKey;
                    if (this.bounceControllers[key]) this.bounceControllers[key].stop();
                },

                onEnterBack: () => {
                    if (!cfg.bounceObject) return;
                    const key = cfg.bounceKey;
                    if (this.bounceControllers[key]) this.bounceControllers[key].stop();
                    this.bounceControllers[key] = this.experience.world.room.createLoopingBounce(
                        cfg.bounceObject, cfg.bounceOptions
                    );
                    this.bounceControllers[key].start();
                },

                onLeaveBack: () => {
                    if (!cfg.bounceObject) return;
                    const key = cfg.bounceKey;
                    if (this.bounceControllers[key]) this.bounceControllers[key].stop();
                },
            });

            // Floor circle — GSAP scrub is safe (unique target per trigger).
            // circleFirst uses scale 3; all others use scale 10.
            const targetScale = (i === 0) ? 3 : 10;
            gsap.timeline({
                scrollTrigger: {
                    trigger: selector,
                    start:   'top top',
                    end:     'bottom bottom',
                    scrub:   0.6,
                },
            }).to(circles[i].scale, { x: targetScale, y: targetScale, z: targetScale });
        });
    }

    // ─── MAIN SETUP ───────────────────────────────────────────────────────────

    setScrollTrigger() {
        // Reset scroll to top on controls init (called after preloader completes).
        // If ASScroll is active, reset its internal position too — ASScroll's
        // currentPos is what ScrollTrigger reads via the proxy, so they must match.
        window.scrollTo(0, 0);
        if (this.asscroll) this.asscroll.currentPos = 0;

        this.isContactFormVisible = false;

        // Floating nav — present in the DOM from page load, faded in here once
        // the intro animation has completed and scroll is ready.
        this.floatingNav = document.getElementById('floating-nav');
        if (this.floatingNav) {
            gsap.set(this.floatingNav, { opacity: 0, y: -12, pointerEvents: 'none' });
            gsap.to(this.floatingNav, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', pointerEvents: 'auto' });
        }

        ScrollTrigger.matchMedia({

            // ── DESKTOP ───────────────────────────────────────────────────
            '(min-width: 969px)': () => {
                // Set Three.js state to match DESKTOP_STATES[0] (hero).
                // IMPORTANT: if DESKTOP_STATES[0] ever changes, update these
                // .set() calls to match — they establish the visual starting
                // point that _applyState interpolates FROM on first scroll.
                this.room.scale.set(0.11, 0.11, 0.11);
                this.rectLight.width  = 0.5;
                this.rectLight.height = 0.7;
                this.camera.orthographicCamera.position.set(0, 6.5, 10);
                this.room.position.set(0, 0, 0);

                this._buildCameraTriggers(DESKTOP_STATES, [
                    this.circleFirst, this.circleSecond, this.circleThird,
                    this.circleFourth, this.circleFifth, this.circleSixth,
                ]);
            },

            // ── MOBILE ────────────────────────────────────────────────────
            '(max-width: 968px)': () => {
                // Set Three.js state to match MOBILE_STATES[0] (hero).
                this.room.scale.set(0.07, 0.07, 0.07);
                this.rectLight.width  = 0.3;
                this.rectLight.height = 0.4;
                this.camera.orthographicCamera.position.set(0, 6.5, 10);
                this.room.position.set(0, 0, 0);

                this._buildCameraTriggers(MOBILE_STATES, [
                    this.circleFirst, this.circleSecond, this.circleThird,
                    this.circleFourth, this.circleFifth, this.circleSixth,
                ]);
            },

            // ── ALL ───────────────────────────────────────────────────────
            // Runs in addition to whichever breakpoint matched above.
            // Owns: floating nav show/hide, hero snap.
            // Does NOT own: camera, room.scale (those belong to the breakpoint blocks).
            all: () => {
                const nav     = this.floatingNav;
                const navHide = nav
                    ? () => gsap.to(nav, { opacity: 0, y: -12, duration: 0.35, ease: 'power2.in',  pointerEvents: 'none' })
                    : () => {};
                const navShow = nav
                    ? () => gsap.to(nav, { opacity: 1, y: 0,   duration: 0.4,  ease: 'power2.out', pointerEvents: 'auto' })
                    : () => {};

                // HERO SNAP
                // onLeaveBack fires when the smooth scroll position crosses back
                // above the first-move trigger (user has returned to the hero section).
                // At that point, _applyState has already stopped firing (the trigger
                // is no longer active), so we write the hero state directly with
                // Three.js .set() calls.
                //
                // WHY NO gsap.killTweensOf() HERE:
                //   In the new architecture, camera.position and room.scale are not
                //   owned by any GSAP tween — they are only written by _applyState
                //   via onUpdate. There is nothing to kill. The direct .set() is the
                //   complete and correct solution.
                //
                // COMMON ERROR SOURCE: If you add GSAP scrub timelines targeting
                //   camera or scale in the future, do NOT kill them with
                //   gsap.killTweensOf(timeline). Killing the timeline object kills
                //   ScrollTrigger's internal scrub _tween, permanently breaking the
                //   animation. If you must cancel a running animation on camera/scale,
                //   call gsap.killTweensOf(camera.position) — kill the target, not
                //   the timeline — and be aware this also kills child tweens.
                ScrollTrigger.create({
                    trigger: '.first-move',
                    start:   'top top',
                    onEnter: navHide,
                    onLeaveBack: () => {
                        navShow();
                        // Read current device to pick the right hero state.
                        // We check this.sizes.device here (not a captured variable
                        // from the matchMedia callback) so this stays correct through
                        // orientation changes without requiring a re-init.
                        const heroState = this.sizes.device === 'desktop'
                            ? DESKTOP_STATES[0]
                            : MOBILE_STATES[0];
                        this.camera.orthographicCamera.position.set(
                            heroState.cam.x, heroState.cam.y, heroState.cam.z
                        );
                        this.room.scale.set(heroState.scale, heroState.scale, heroState.scale);
                        this.room.position.set(0, 0, 0);
                    },
                });

                // Show nav when the contact section is reached; hide it when
                // the user scrolls back above sixth-move.
                ScrollTrigger.create({
                    trigger: '.sixth-move',
                    start:   'top top',
                    onEnter:     navShow,
                    onLeaveBack: navHide,
                });
            },
        });
    }

    // ─── LIFECYCLE ────────────────────────────────────────────────────────────

    resize() {
        // ScrollTrigger.refresh() is called automatically by the resize event
        // handler elsewhere in the codebase. Nothing extra is needed here.
    }

    update() {
        // Debug tick — uncomment to diagnose camera/scroll state at runtime.
        // Runs at ~60fps; the % 45 modulo throttles output to ~1.3 logs/sec.
        // Delete or re-comment before shipping to production.
        //
        // this._dbgTick = (this._dbgTick || 0) + 1;
        // if (this._dbgTick % 45 === 0) {
        //     const cam    = this.camera.orthographicCamera.position;
        //     const scroll = this.asscroll ? this.asscroll.currentPos.toFixed(1) : 'n/a';
        //     console.log(
        //         `[tick] cam(${cam.x.toFixed(3)}, ${cam.y.toFixed(3)}, ${cam.z.toFixed(3)})`,
        //         `scale=${this.room.scale.x.toFixed(3)}`,
        //         `pos.x=${this.room.position.x.toFixed(3)}`,
        //         `scroll=${scroll}`
        //     );
        // }
    }
}
