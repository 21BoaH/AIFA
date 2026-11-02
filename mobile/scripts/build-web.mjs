#!/usr/bin/env node
// Builds www/, the web content of the Android and iOS apps, from the website in ../AIFitnessAsisstant.
//
// The site loads MediaPipe from a CDN and its fonts from Google Fonts. The apps bundle both, so they work
// offline and never depend on a third-party server. Everything else is the site as it is, plus:
//   assets/css/app.css  safe areas (notch, status bar, gesture bar) and touch polish     <- src/app.css
//   assets/js/app.js    Android back button, and keeping the screen awake during a set  <- src/app.js
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const mobile = dirname(dirname(fileURLToPath(import.meta.url)));
const site = join(mobile, '..', 'AIFitnessAsisstant');
const www = join(mobile, 'www');
const modules = join(mobile, 'node_modules');

const walk = (dir) => readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
});
const rel = (from, path) => relative(from, path).split(sep).join('/');
const copy = (pkg, files, to) => {
    mkdirSync(join(www, to), { recursive: true });
    for (const file of files) cpSync(join(modules, pkg, file), join(www, to, basename(file)));
};

// 1. The site's pages and assets. Left out: the README, its screenshots and presentation images, the
//    design-system notes, original PNGs the pages replaced with WebP, and scripts no page loads.
const SITE = ['index.html', 'dashboard.html', 'pages', 'exercises', 'assets'];
const texts = walk(site).filter((f) => /\.(html|css|js)$/.test(f)).map((f) => [rel(site, f), readFileSync(f, 'utf8')]);
const usedElsewhere = (name) => texts.some(([file, text]) => file !== name && text.includes(basename(name)));
const unused = (path) => {
    const name = rel(site, path);
    if (name === '') return false;
    if (!SITE.includes(name.split('/')[0])) return true;
    if (name.startsWith('assets/images/docs')) return true;
    if (/^assets\/(images|js)\/[^/]+$/.test(name)) return !usedElsewhere(name);
    return false;
};
rmSync(www, { recursive: true, force: true });
cpSync(site, www, { recursive: true, filter: (src) => !unused(src) });

// 2. MediaPipe, from the same npm releases the site loads from the CDN. Only the full pose model is used
//    (modelComplexity 1); the non-SIMD WebAssembly build is the fallback for older phones.
copy('@mediapipe/pose', [
    'pose.js', 'pose_solution_packed_assets_loader.js', 'pose_solution_packed_assets.data', 'pose_web.binarypb',
    'pose_solution_simd_wasm_bin.js', 'pose_solution_simd_wasm_bin.wasm', 'pose_solution_simd_wasm_bin.data',
    'pose_solution_wasm_bin.js', 'pose_solution_wasm_bin.wasm', 'pose_landmark_full.tflite',
], 'vendor/mediapipe/pose');
copy('@mediapipe/camera_utils', ['camera_utils.js'], 'vendor/mediapipe/camera_utils');
copy('@mediapipe/control_utils', ['control_utils.js'], 'vendor/mediapipe/control_utils');
copy('@mediapipe/drawing_utils', ['drawing_utils.js'], 'vendor/mediapipe/drawing_utils');

// 3. Fonts: the families the site asks Google Fonts for, under the names its CSS uses
let fontCss = '/* Archivo (weight and width axes) and JetBrains Mono, bundled for offline use */\n';
for (const [pkg, sheet, from, to] of [
    ['@fontsource-variable/archivo', 'standard.css', 'Archivo Variable', 'Archivo'],
    ['@fontsource-variable/jetbrains-mono', 'index.css', 'JetBrains Mono Variable', 'JetBrains Mono'],
]) {
    const dir = basename(pkg);
    const css = readFileSync(join(modules, pkg, sheet), 'utf8').replaceAll(`'${from}'`, `'${to}'`);
    const files = [...css.matchAll(/url\(\.\/files\/([^)]+)\)/g)].map((m) => m[1]);
    copy(pkg, files.map((f) => `files/${f}`), `vendor/fonts/${dir}`);
    fontCss += css.replaceAll('url(./files/', `url(./${dir}/`);
}
writeFileSync(join(www, 'vendor/fonts/fonts.css'), fontCss);

// 4. The Capacitor runtime and plugins, as plain scripts (the pages don't use a bundler), and the app shell
copy('@capacitor/core', ['dist/capacitor.js'], 'vendor/capacitor');
cpSync(join(modules, '@capacitor/app/dist/plugin.js'), join(www, 'vendor/capacitor/app.js'));
cpSync(join(modules, '@capacitor-community/keep-awake/dist/plugin.js'), join(www, 'vendor/capacitor/keep-awake.js'));
cpSync(join(mobile, 'src/app.css'), join(www, 'assets/css/app.css'));
cpSync(join(mobile, 'src/app.js'), join(www, 'assets/js/app.js'));

// 5. Point every page at the local copies and add the app shell
const pages = walk(www).filter((f) => f.endsWith('.html'));
for (const file of pages) {
    const up = '../'.repeat(rel(www, dirname(file)).split('/').filter(Boolean).length);
    const eol = readFileSync(file, 'utf8').includes('\r\n') ? '\r\n' : '\n';
    let html = readFileSync(file, 'utf8');
    html = html.replaceAll('https://cdn.jsdelivr.net/npm/@mediapipe/', `${up}vendor/mediapipe/`);
    html = html.replace(/[ \t]*<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>\r?\n/g, '');
    html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2[^"]*" rel="stylesheet">/,
        `<link href="${up}vendor/fonts/fonts.css" rel="stylesheet">`);
    // App wording: taps, not clicks; the phone, not the browser
    html = html.replaceAll('Click Start to begin', 'Tap Start to begin');
    html = html.replace('Everything runs locally in your browser.', 'Everything runs on your phone.');
    // Draw edge to edge; app.css keeps content clear of the notch and the system bars
    html = html.replace('content="width=device-width, initial-scale=1.0"', 'content="width=device-width, initial-scale=1.0, viewport-fit=cover"');
    html = html.replace(/(<link rel="stylesheet" href="[./]*assets\/css\/common\.css">)/, `$1${eol}    <link rel="stylesheet" href="${up}assets/css/app.css">`);
    html = html.replace('</body>', [
        `    <script src="${up}vendor/capacitor/capacitor.js"></script>`,
        `    <script src="${up}vendor/capacitor/app.js"></script>`,
        `    <script src="${up}vendor/capacitor/keep-awake.js"></script>`,
        `    <script src="${up}assets/js/app.js"></script>`,
        '</body>'].join(eol));

    // Nothing may still load from the internet (links the user taps still open in the browser)
    const remote = html.match(/(src="https?:|<link[^>]*href="https?:|cdn\.jsdelivr|fonts\.g(oogleapis|static))/);
    if (remote) throw new Error(`${rel(www, file)} still loads ${remote[0]}`);
    for (const needed of ['viewport-fit=cover', 'assets/css/app.css', 'vendor/fonts/fonts.css', 'assets/js/app.js']) {
        if (!html.includes(needed)) throw new Error(`${rel(www, file)}: could not add ${needed}`);
    }
    writeFileSync(file, html);
}

const bytes = walk(www).reduce((sum, f) => sum + statSync(f).size, 0);
console.log(`www/ built: ${pages.length} pages, ${(bytes / 1048576).toFixed(1)} MB, no remote resources`);
