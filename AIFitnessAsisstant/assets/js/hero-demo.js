/* ============================================================================
   Homepage pose demo.
   A synthetic athlete squats on a loop while the *real* rep logic from
   exercises/squat_web.html reads its joints: the same atan2 knee angle and the
   same DOWN (< 100°) → UP (> 160°) state machine drive the readouts.
   Decorative: the container carries an aria-label; motion stops under
   prefers-reduced-motion and while the demo is scrolled out of view.
   ========================================================================== */
(function () {
    'use strict';

    var root = document.querySelector('[data-pose-demo]');
    if (!root) return;

    var svg = root.querySelector('svg');
    var out = {
        angle: root.querySelector('[data-pd="angle"]'),
        stage: root.querySelector('[data-pd="stage"]'),
        reps:  root.querySelector('[data-pd="reps"]'),
        meter: root.querySelector('[data-pd="meter"]')
    };
    var NS = 'http://www.w3.org/2000/svg';

    /* ------------------------------------------------------------ Skeleton */
    // Segment lengths in SVG units, and the two key poses as segment angles in
    // degrees, clockwise from straight up. Joints are rebuilt every frame by
    // forward kinematics from the planted ankle, so limbs never stretch.
    var ANKLE = [198, 424];
    var LEN   = { shank: 94, thigh: 95, torso: 116, neck: 50, upper: 54, fore: 52 };
    var STAND = { shank: 5,  thigh: -5,  torso: 1,  neck: -4, arm: 172, fore: 166 };
    var SQUAT = { shank: 36, thigh: -83, torso: 47, neck: 40, arm: 92,  fore: 88 };

    function from(p, len, deg) {
        var r = deg * Math.PI / 180;
        return [p[0] + len * Math.sin(r), p[1] - len * Math.cos(r)];
    }

    // t: 0 = standing tall, 1 = bottom of the squat
    function pose(t) {
        var a = {};
        for (var k in STAND) a[k] = STAND[k] + (SQUAT[k] - STAND[k]) * t;
        var j = { ankle: ANKLE, toe: [ANKLE[0] + 36, ANKLE[1] + 4] };
        j.knee     = from(j.ankle, LEN.shank, a.shank);
        j.hip      = from(j.knee, LEN.thigh, a.thigh);
        j.shoulder = from(j.hip, LEN.torso, a.torso);
        j.head     = from(j.shoulder, LEN.neck, a.neck);
        j.elbow    = from(j.shoulder, LEN.upper, a.arm);
        j.wrist    = from(j.elbow, LEN.fore, a.fore);
        return j;
    }

    // Identical to calculateAngle() in the exercise pages.
    function calculateAngle(a, b, c) {
        var radians = Math.atan2(c[1] - b[1], c[0] - b[0]) -
                      Math.atan2(a[1] - b[1], a[0] - b[0]);
        var angle = Math.abs(radians * 180.0 / Math.PI);
        if (angle > 180.0) angle = 360 - angle;
        return angle;
    }

    /* ---------------------------------------------------------- SVG build */
    function make(tag, attrs, parent) {
        var el = document.createElementNS(NS, tag);
        for (var k in attrs) el.setAttribute(k, attrs[k]);
        (parent || svg).appendChild(el);
        return el;
    }

    var BONES = [['shoulder', 'elbow'], ['elbow', 'wrist'], ['shoulder', 'hip'],
                 ['hip', 'knee'], ['knee', 'ankle'], ['ankle', 'toe']];
    var DOTS  = ['shoulder', 'elbow', 'wrist', 'hip', 'ankle', 'toe'];

    make('ellipse', { cx: 214, cy: 432, rx: 92, ry: 7, 'class': 'pd-shadow' });
    make('line', { x1: 72, y1: 432, x2: 372, y2: 432, 'class': 'pd-ground' });

    function figure(cls, offset) {
        var g = make('g', { 'class': cls, transform: 'translate(' + offset + ')' });
        var parts = { neck: make('line', { 'class': 'pd-bone' }, g), bones: [], dots: {} };
        BONES.forEach(function (b) {
            parts.bones.push({ el: make('line', { 'class': 'pd-bone' }, g), a: b[0], b: b[1] });
        });
        parts.head = make('circle', { r: 17, 'class': 'pd-head' }, g);
        DOTS.forEach(function (d) { parts.dots[d] = make('circle', { r: 5, 'class': 'pd-dot' }, g); });
        return parts;
    }

    var far  = figure('pd-far', '-12 -5');   // the limbs on the far side of the body
    var near = figure('pd-near', '0 0');

    var wedge = make('path', { 'class': 'pd-wedge' });
    var arc   = make('path', { 'class': 'pd-arc' });
    var ring  = make('circle', { r: 15, 'class': 'pd-ring' });
    var key   = make('circle', { r: 7.5, 'class': 'pd-key' });
    var label = make('text', { 'class': 'pd-label', 'text-anchor': 'middle', 'dominant-baseline': 'middle' });

    function fmt(p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }

    function setLine(el, p, q) {
        el.setAttribute('x1', p[0].toFixed(1)); el.setAttribute('y1', p[1].toFixed(1));
        el.setAttribute('x2', q[0].toFixed(1)); el.setAttribute('y2', q[1].toFixed(1));
    }
    function setDot(el, p) {
        el.setAttribute('cx', p[0].toFixed(1)); el.setAttribute('cy', p[1].toFixed(1));
    }

    function drawFigure(parts, j) {
        // Neck stops at the rim of the head circle.
        var s = 1 - 17 / LEN.neck;
        var neckEnd = [j.shoulder[0] + (j.head[0] - j.shoulder[0]) * s,
                       j.shoulder[1] + (j.head[1] - j.shoulder[1]) * s];
        setLine(parts.neck, j.shoulder, neckEnd);
        parts.bones.forEach(function (b) { setLine(b.el, j[b.a], j[b.b]); });
        setDot(parts.head, j.head);
        for (var d in parts.dots) setDot(parts.dots[d], j[d]);
    }

    function drawAngle(j, angle) {
        var k = j.knee, R = 30;
        var a1 = Math.atan2(j.hip[1] - k[1], j.hip[0] - k[0]);
        var a2 = Math.atan2(j.ankle[1] - k[1], j.ankle[0] - k[0]);
        var d = a2 - a1;                               // sweep the short way round
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;

        var p1 = [k[0] + R * Math.cos(a1), k[1] + R * Math.sin(a1)];
        var p2 = [k[0] + R * Math.cos(a1 + d), k[1] + R * Math.sin(a1 + d)];
        var sweep = d > 0 ? 1 : 0;
        var arcCmd = 'A' + R + ' ' + R + ' 0 0 ' + sweep + ' ' + fmt(p2);

        arc.setAttribute('d', 'M' + fmt(p1) + ' ' + arcCmd);
        wedge.setAttribute('d', 'M' + fmt(k) + ' L' + fmt(p1) + ' ' + arcCmd + ' Z');
        setDot(ring, k);
        setDot(key, k);

        // Readout sits on the open side of the joint, clear of the limbs.
        var side = a1 + d / 2 + Math.PI;
        label.setAttribute('x', (k[0] + 48 * Math.cos(side)).toFixed(1));
        label.setAttribute('y', (k[1] + 48 * Math.sin(side)).toFixed(1));
        label.textContent = Math.round(angle) + '°';
    }

    /* --------------------------------------------------- Rep state machine */
    var stage = null;
    var reps = 0;
    var flashTimer = null;

    function track(angle) {
        // Squat logic: down when knee angle < 100, up when knee angle > 160
        if (angle < 100) {
            stage = 'down';
        } else if (angle > 160 && stage === 'down') {
            stage = 'up';
            reps = (reps + 1) % 100;
            root.classList.add('is-rep');
            clearTimeout(flashTimer);
            flashTimer = setTimeout(function () { root.classList.remove('is-rep'); }, 520);
        }
    }

    function render(t) {
        var j = pose(t);
        var angle = calculateAngle(j.hip, j.knee, j.ankle);
        drawFigure(far, j);
        drawFigure(near, j);
        drawAngle(j, angle);
        return angle;
    }

    function readouts(angle) {
        var depth = Math.max(0, Math.min(100, (160 - angle) / (160 - 100) * 100));
        out.angle.textContent = Math.round(angle) + '°';
        out.stage.textContent = stage ? stage.toUpperCase() : 'READY';
        out.reps.textContent = (reps < 10 ? '0' : '') + reps;
        out.meter.style.height = depth + '%';
    }

    /* ----------------------------------------------------------- Timeline */
    // Hold tall → descend → pause at depth → drive up. One rep every 3.4 s.
    var CYCLE = 3400;
    function ease(x) { return (1 - Math.cos(Math.PI * x)) / 2; }
    function depthAt(ms) {
        var m = ms % CYCLE;
        if (m < 700)  return 0;
        if (m < 1900) return ease((m - 700) / 1200);
        if (m < 2200) return 1;
        return 1 - ease((m - 2200) / 1200);
    }

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) {
        // A single still frame at the bottom of the rep.
        stage = 'down';
        reps = 4;
        readouts(render(1));
        root.classList.add('is-static');
        return;
    }

    var running = false;
    var start = null;
    var rafId = null;

    function frame(now) {
        if (start === null) start = now;
        var angle = render(depthAt(now - start));
        track(angle);
        readouts(angle);
        rafId = requestAnimationFrame(frame);
    }

    function play() {
        if (running) return;
        running = true;
        start = null;   // restart the cycle from standing
        rafId = requestAnimationFrame(frame);
    }
    function pause() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
    }

    readouts(render(0));

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { e.isIntersecting ? play() : pause(); });
        }).observe(root);
    } else {
        play();
    }
})();
