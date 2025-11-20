document.querySelectorAll('.photo-container').forEach(container => {

    const checkbox = container.querySelector('input[type="checkbox"]');
    const audio = container.querySelector('audio');

    audio.volume = 0.5;   // volumen inicial al 50%

    let fadeInterval = null;

    function fadeIn() {
        clearInterval(fadeInterval);
        audio.volume = 0;
        fadeInterval = setInterval(() => {
            if (audio.volume < 0.5) {
                audio.volume = Math.min(audio.volume + 0.05, 0.5);
            } else {
                clearInterval(fadeInterval);
            }
        }, 100);
    }

    function fadeOut(callback) {
        clearInterval(fadeInterval);
        fadeInterval = setInterval(() => {
            if (audio.volume > 0) {
                audio.volume = Math.max(audio.volume - 0.05, 0);
            } else {
                clearInterval(fadeInterval);
                if (callback) callback();
            }
        }, 100);
    }

    checkbox.addEventListener('change', () => {

        if (checkbox.checked) {

            // Detener otros audios
            document.querySelectorAll('audio').forEach(a => {
                if (a !== audio) {
                    a.pause();
                    a.currentTime = 0;
                }
            });

            audio.currentTime = 0;
            audio.play();
            fadeIn();

        } else {
            fadeOut(() => audio.pause());
        }
    });

    audio.addEventListener("ended", () => {
        fadeOut(() => {
            checkbox.checked = false;
            audio.currentTime = 0;
        });
    });

});
