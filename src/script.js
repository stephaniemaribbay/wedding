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

    // --- 2. Background Music Auto-Play & Toggle ---
    const musicToggleBtn = document.getElementById("musicToggleBtn");
    const weddingAudio = document.getElementById("weddingAudio");
    const musicIcon = document.getElementById("musicIcon");

    let isPlaying = false;

    if (weddingAudio) {
        weddingAudio.volume = 0.4;

        const playAudio = () => {
            weddingAudio.play().then(() => {
                isPlaying = true;
                if (musicIcon) musicIcon.className = "fa-solid fa-volume-high";
                if (musicToggleBtn) musicToggleBtn.classList.add("animate-pulse");
                
                window.removeEventListener("click", playAudio);
                window.removeEventListener("scroll", playAudio);
                window.removeEventListener("keydown", playAudio);
            }).catch(error => {
                console.log("Waiting for user interaction to play audio...");
            });
        };

        playAudio();
        window.addEventListener("click", playAudio, { once: true });
        window.addEventListener("scroll", playAudio, { once: true });
        window.addEventListener("keydown", playAudio, { once: true });

        if (musicToggleBtn) {
            musicToggleBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (isPlaying) {
                    weddingAudio.pause();
                    if (musicIcon) musicIcon.className = "fa-solid fa-music";
                    if (musicToggleBtn) musicToggleBtn.classList.remove("animate-pulse");
                    isPlaying = false;
                } else {
                    weddingAudio.play().then(() => {
                        if (musicIcon) musicIcon.className = "fa-solid fa-volume-high";
                        if (musicToggleBtn) musicToggleBtn.classList.add("animate-pulse");
                        isPlaying = true;
                    });
                }
            });
        }
    }

    // --- 3. RSVP Form Handling ---
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

    // --- 4. Photo Upload & Google Drive Integration ---
    const photoUploadInput = document.getElementById("photoUpload");
    const photoGrid = document.getElementById("photoGrid");

    const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbyQRg00_OyGNCtdgbcaoO-fu1HMGJpzRtyFT4GCmATaSfyom8GDz0BW3j9YU_7FN3rhiQ/exec"; 

    if (photoUploadInput && photoGrid) {
        photoUploadInput.addEventListener("change", (e) => {
            const files = e.target.files;
            if (!files.length) return;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = function(uploadEvent) {
                    const fullBase64 = uploadEvent.target.result;
                    const base64Data = fullBase64.split(',')[1]; 

                    // Send to Google Drive via Apps Script (Fixed condition)
                    if (googleAppsScriptUrl && googleAppsScriptUrl !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
                        fetch(googleAppsScriptUrl, {
                            method: "POST",
                            body: JSON.stringify({
                                base64: base64Data,
                                mimeType: file.type,
                                filename: file.name
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log("Photo uploaded to Google Drive successfully!", data);
                        })
                        .catch(error => console.error("Error uploading to Google Drive:", error));
                    }

                    // Display instantly in browser gallery
                    const card = document.createElement("div");
                    card.className = "group relative bg-white border border-sage-200 rounded-2xl overflow-hidden shadow-sm aspect-square";
                    card.innerHTML = `
                        <img src="${fullBase64}" alt="Uploaded guest photo" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
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
});