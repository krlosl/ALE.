const MAX_VOLUME = 0.1;
const FADE_STEP = 0.01;
const FADE_TIME = 80;

let currentAudio = null;
let fadeIntervals = new Map();

// comprueba si es un navegador en móvil
function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Limpia fade activo de un audio
function clearFade(audio) {
    if (fadeIntervals.has(audio)) {
        clearInterval(fadeIntervals.get(audio));
        fadeIntervals.delete(audio);
    }
}

// Fade in estable
function fadeIn(audio) {
    clearFade(audio);
    fadeIntervals.set(audio, setInterval(() => {
        if (audio.volume < MAX_VOLUME) {
            audio.volume = Math.min(audio.volume + FADE_STEP, MAX_VOLUME);
        } else {
            clearFade(audio);
        }
    }, FADE_TIME));
}

// Fade out estable
function fadeOut(audio, callback) {
    clearFade(audio);
    fadeIntervals.set(audio, setInterval(() => {
        if (audio.volume > 0) {
            audio.volume = Math.max(audio.volume - FADE_STEP, 0);
        } else {
            clearFade(audio);
            if (callback) callback();
        }
    }, FADE_TIME));
}

document.querySelectorAll('.photo-container').forEach(container => {
    const checkbox = container.querySelector('input[type="checkbox"]');
    const audio = container.querySelector('audio');

    audio.volume = 0;

checkbox.addEventListener("change", () => {

    if (checkbox.checked) {

        document.querySelectorAll("audio").forEach(a => clearFade(a));
        document.querySelectorAll('.photo-container').forEach(other => {
            const cb = other.querySelector('input[type="checkbox"]');
            const aud = other.querySelector('audio');

            if (aud !== audio) {
                cb.checked = false;
                aud.pause();
                aud.currentTime = 0;
                aud.volume = 0;
            }
        });
        currentAudio = audio;
        audio.currentTime = 0;
        audio.volume = 0;
        audio.play();
        fadeIn(audio);

    } else {
        fadeOut(audio, () => {
            audio.pause();
            audio.currentTime = 0;
            if (currentAudio === audio) currentAudio = null;
        });

    }

});

    audio.addEventListener("timeupdate", () => {
        if (audio.duration - audio.currentTime <= 13 && checkbox.checked) {
            fadeOut(audio, () => {
                checkbox.checked = false;
                audio.pause();
                audio.currentTime = 0;
                currentAudio = null;
            });
        }
    });
});
