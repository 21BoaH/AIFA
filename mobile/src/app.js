// App shell for the Android and iOS apps (Capacitor). The website doesn't load this file.
(function () {
    'use strict';
    var cap = window.Capacitor;
    if (!cap || !cap.isNativePlatform || !cap.isNativePlatform()) return;

    // Android back button: back through the pages, and out of the app from the first one
    var App = window.capacitorApp && window.capacitorApp.App;
    if (App && cap.getPlatform() === 'android') {
        App.addListener('backButton', function (event) {
            if (event.canGoBack) window.history.back();
            else App.exitApp();
        });
    }

    // Keep the screen on while a set runs, so a plank or wall sit doesn't let the phone lock.
    // A tracker's Stop button is enabled exactly while its camera is running.
    var KeepAwake = window.capacitorKeepAwake && window.capacitorKeepAwake.KeepAwake;
    var stop = document.getElementById('stopButton');
    if (KeepAwake && stop) {
        var sync = function () {
            (stop.disabled ? KeepAwake.allowSleep() : KeepAwake.keepAwake()).catch(function () {});
        };
        new MutationObserver(sync).observe(stop, { attributes: true, attributeFilter: ['disabled'] });
        window.addEventListener('pagehide', function () { KeepAwake.allowSleep().catch(function () {}); });
    }
})();
