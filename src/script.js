document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Countdown Timer (December 11, 2026, 3:00 PM) ---
    const weddingDate = new Date("2026-12-11T15:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const countdownContainer = document.getElementById("countdown");
        if (!countdownContainer) return;

        if (distance < 0) {
            countdownContainer.innerHTML = "<p class='col-span-4 text-center font-serif text-xl text-sage-800'>The wedding day has arrived!</p>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- 2. RSVP Form Handling ---
    const rsvpForm = document.getElementById("rsvpForm");
    const rsvpSuccess = document.getElementById("rsvpSuccess");
    const attendanceSelect = document.getElementById("attendanceSelect");
    const mealSection = document.getElementById("mealSection");

    if (attendanceSelect && mealSection) {
        attendanceSelect.addEventListener("change", (e) => {
            if (e.target.value === "no") {
                mealSection.style.display = "none";
            } else {
                mealSection.style.display = "block";
            }
        });
    }

    if (rsvpForm && rsvpSuccess) {
        rsvpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            rsvpForm.style.display = "none";
            rsvpSuccess.classList.remove("hidden");
        });
    }

    // --- 3. Photo Upload & Gallery Functionality ---
    const photoUploadInput = document.getElementById("photoUpload");
    const photoGrid = document.getElementById("photoGrid");

    if (photoUploadInput && photoGrid) {
        photoUploadInput.addEventListener("change", (e) => {
            const files = e.target.files;
            if (!files.length) return;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = function(uploadEvent) {
                    const imageUrl = uploadEvent.target.result;
                    
                    const card = document.createElement("div");
                    card.className = "group relative bg-white border border-sage-200 rounded-2xl overflow-hidden shadow-sm aspect-square";
                    card.innerHTML = `
                        <img src="${imageUrl}" alt="Uploaded guest photo" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-sage-900/60 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                            <span class="text-white text-xs font-light">Uploaded just now</span>
                        </div>
                    `;
                    
                    photoGrid.prepend(card);
                }

                reader.readAsDataURL(file);
            }
            
            photoUploadInput.value = "";
        });
    }

    // --- 4. Background Music Management & Auto-Start on First Interaction ---
    const musicToggleBtn = document.getElementById("musicToggleBtn");
    const weddingAudio = document.getElementById("weddingAudio");
    const musicIcon = document.getElementById("musicIcon");

    let isPlaying = false;

    function playAudio() {
        if (!weddingAudio) return;
        weddingAudio.play().then(() => {
            isPlaying = true;
            if (musicIcon) musicIcon.className = "fa-solid fa-volume-high";
            if (musicToggleBtn) musicToggleBtn.classList.add("animate-pulse");
        }).catch(error => {
            console.log("Waiting for user interaction to start audio:", error);
        });
    }

    function pauseAudio() {
        if (!weddingAudio) return;
        weddingAudio.pause();
        isPlaying = false;
        if (musicIcon) musicIcon.className = "fa-solid fa-music";
        if (musicToggleBtn) musicToggleBtn.classList.remove("animate-pulse");
    }

    if (musicToggleBtn && weddingAudio) {
        musicToggleBtn.addEventListener("click", () => {
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        });
    }

    // Try playing immediately when page loads
    playAudio();

    // Fallback: Instantly starts playing on the visitor's very first click anywhere on the page
    const startAudioOnFirstInteraction = () => {
        if (!isPlaying) {
            playAudio();
        }
        document.removeEventListener("click", startAudioOnFirstInteraction);
        document.removeEventListener("keydown", startAudioOnFirstInteraction);
    };

    document.addEventListener("click", startAudioOnFirstInteraction);
    document.addEventListener("keydown", startAudioOnFirstInteraction);
});