/**
 * Routine Manager & Automatic Rest Timer
 * Included in exercise pages to handle custom routines.
 *
 * Presentation lives in common.css (.modal / .timer-ring / .rest-widget);
 * this file only owns behaviour.
 */

const CHECK_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>';

class RoutineManager {
    constructor() {
        this.isRoutineMode = new URLSearchParams(window.location.search).get('routine') === 'true';
        this.routineData = null;
        this.currentStepIndex = 0;
        this.currentExercise = null;

        if (this.isRoutineMode) {
            this.init();
        }
    }

    init() {
        // Load data
        const savedData = localStorage.getItem('activeRoutine');
        const step = localStorage.getItem('routineStep');

        if (!savedData || !step) {
            console.error("No routine data found.");
            this.isRoutineMode = false;
            return;
        }

        try {
            this.routineData = JSON.parse(savedData);
            this.currentStepIndex = parseInt(step);
            this.currentExercise = this.routineData[this.currentStepIndex];

            if (!this.currentExercise) {
                this.isRoutineMode = false;
                return;
            }
        } catch (e) {
            console.error("Error parsing routine data", e);
            this.isRoutineMode = false;
            return;
        }

        // Wait for DOM to load to modify UI
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }

        // Listen for custom repCompleted event
        window.addEventListener('repCompleted', (e) => {
            this.handleRepCompleted(e.detail ? e.detail.count : 0);
        });
    }

    setupUI() {
        // Show the target alongside the running count
        const repLabel = document.querySelector('.rep-counter__label');
        if (repLabel) {
            repLabel.textContent = `Reps (target: ${this.currentExercise.targetReps})`;
        }

        // Repurpose the back link as a routine exit, keeping its icon intact
        const backBtn = document.querySelector('.lab__back');
        if (backBtn) {
            const label = backBtn.querySelector('.lab__back-label');
            if (label) label.textContent = 'Exit Routine';
            backBtn.onclick = (e) => {
                const confirmExit = confirm("Are you sure you want to exit the current routine?");
                if (!confirmExit) {
                    e.preventDefault();
                } else {
                    localStorage.removeItem('activeRoutine');
                    localStorage.removeItem('routineStep');
                }
            };
        }

        this.injectTimerModal();
    }

    handleRepCompleted(currentReps) {
        if (!this.isRoutineMode) return;

        if (currentReps >= this.currentExercise.targetReps) {
            this.completeExercise();
        }
    }

    completeExercise() {
        // Stop the camera by calling the global stopCamera function if it exists
        if (typeof window.stopCamera === 'function') {
            window.isRoutineRest = true;
            window.stopCamera();
            window.isRoutineRest = false;
        }

        const isLastExercise = this.currentStepIndex >= this.routineData.length - 1;

        if (isLastExercise) {
            this.showCompletionModal();
        } else {
            this.startRestTimer();
        }
    }

    injectTimerModal() {
        const modalHtml = `
            <div id="routineTimerModal" class="modal" role="dialog" aria-modal="true"
                 aria-labelledby="routineTimerHeading" hidden>
                <h2 class="modal__title" id="routineTimerHeading">Exercise Complete</h2>
                <p class="modal__subtitle" id="upNextText">Up Next: </p>

                <div class="timer-ring">
                    <div class="timer-ring__spinner" aria-hidden="true"></div>
                    <div class="timer-ring__value" id="timerValue" role="timer" aria-live="off">60</div>
                </div>
                <p class="modal__subtitle" aria-live="polite" id="restAnnounce"></p>

                <button type="button" id="skipRestBtn" class="btn btn--primary">Skip Rest</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('skipRestBtn').onclick = () => {
            this.goToNextExercise();
        };
    }

    startRestTimer() {
        const modal = document.getElementById('routineTimerModal');
        const timerValue = document.getElementById('timerValue');
        const upNextText = document.getElementById('upNextText');
        const announce = document.getElementById('restAnnounce');
        const skipBtn = document.getElementById('skipRestBtn');

        const nextExercise = this.routineData[this.currentStepIndex + 1];
        upNextText.textContent = `Up Next: ${nextExercise.name} (${nextExercise.targetReps} Reps)`;

        let timeLeft = this.currentExercise.restTime || 60;
        timerValue.textContent = timeLeft;
        modal.hidden = false;

        // Move focus into the dialog so keyboard users land on the only action.
        if (skipBtn) skipBtn.focus();
        if (announce) announce.textContent = `Resting ${timeLeft} seconds.`;

        if (timeLeft <= 0) {
            this.goToNextExercise();
            return;
        }

        this.timerInterval = setInterval(() => {
            timeLeft--;
            timerValue.textContent = timeLeft;

            // Announce sparingly rather than once per second.
            if (announce && (timeLeft === 10 || timeLeft === 3)) {
                announce.textContent = `${timeLeft} seconds left.`;
            }

            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.goToNextExercise();
            }
        }, 1000);
    }

    goToNextExercise() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        const nextIndex = this.currentStepIndex + 1;
        localStorage.setItem('routineStep', nextIndex.toString());

        const nextExercise = this.routineData[nextIndex];
        let nextUrl = nextExercise.url;
        if (!nextUrl.startsWith('../')) {
            nextUrl = '../exercises/' + nextUrl;
        }
        window.location.href = nextUrl + '?routine=true';
    }

    showCompletionModal() {
        const modalHtml = `
            <div id="routineCompleteModal" class="modal" role="dialog" aria-modal="true"
                 aria-labelledby="routineCompleteHeading">
                <div class="modal__icon">${CHECK_ICON}</div>
                <h2 class="modal__title" id="routineCompleteHeading">Routine Complete</h2>
                <p class="modal__subtitle">Awesome job. You&rsquo;ve crushed your custom workout routine.</p>

                <button type="button" id="finishRoutineBtn" class="btn btn--primary">Finish &amp; Return</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const finishBtn = document.getElementById('finishRoutineBtn');
        finishBtn.onclick = () => {
            localStorage.removeItem('activeRoutine');
            localStorage.removeItem('routineStep');
            window.location.href = '../dashboard.html';
        };
        finishBtn.focus();
    }
}

// Initialize immediately so it sets up listeners
const routineManager = new RoutineManager();

// Global manual rest timer function
window.startManualRestTimer = function (seconds) {
    let widget = document.getElementById('manualRestTimerModal');
    if (!widget) {
        const widgetHtml = `
            <aside id="manualRestTimerModal" class="rest-widget" aria-label="Rest timer" hidden>
                <h3 class="rest-widget__title">Rest Timer</h3>

                <div class="timer-ring">
                    <div class="timer-ring__spinner" aria-hidden="true"></div>
                    <div class="timer-ring__value" id="manualTimerValue" role="timer" aria-live="off">03:00</div>
                </div>

                <button type="button" id="manualSkipRestBtn" class="btn btn--ghost btn--block">Skip</button>
            </aside>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHtml);
        widget = document.getElementById('manualRestTimerModal');
    }

    const timerValue = document.getElementById('manualTimerValue');
    let timeLeft = seconds;

    function formatTime(s) {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    }

    timerValue.textContent = formatTime(timeLeft);
    widget.hidden = false;

    const btn = document.getElementById('manualSkipRestBtn');

    if (window.manualRestInterval) clearInterval(window.manualRestInterval);

    const finishRest = () => {
        clearInterval(window.manualRestInterval);
        widget.hidden = true;
        btn.onclick = null;
    };

    btn.onclick = finishRest;

    window.manualRestInterval = setInterval(() => {
        timeLeft--;
        timerValue.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            finishRest();
        }
    }, 1000);
};
