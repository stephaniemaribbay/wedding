
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIGURATION
    // ==========================================

    const googleAppsScriptUrl =
        "https://script.google.com/macros/s/AKfycbyQRg00_OyGNCtdgbcaoO-fu1HMGJpzRtyFT4GCmATaSfyom8GDz0BW3j9YU_7FN3rhiQ/exec";

    const MAX_PHOTOS = 10;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB


    // ==========================================
    // 1. BACKGROUND MUSIC
    // ==========================================

    const musicToggleBtn = document.getElementById("musicToggleBtn");
    const weddingAudio = document.getElementById("weddingAudio");
    const musicIcon = document.getElementById("musicIcon");

    let isPlaying = false;

    function updateMusicButton() {
        if (musicIcon) {
            musicIcon.className = isPlaying
                ? "fa-solid fa-volume-high"
                : "fa-solid fa-music";
        }

        if (musicToggleBtn) {
            musicToggleBtn.classList.toggle("animate-pulse", isPlaying);
        }
    }

    if (weddingAudio) {
        weddingAudio.volume = 0.4;

        // Browsers may block autoplay.
        // Wait for the guest's first interaction.
        const tryAutoplay = () => {
            weddingAudio.play()
                .then(() => {
                    isPlaying = true;
                    updateMusicButton();
                })
                .catch(() => {
                    console.log("Music is waiting for user interaction.");
                });

            window.removeEventListener("click", tryAutoplay);
            window.removeEventListener("keydown", tryAutoplay);
            window.removeEventListener("scroll", tryAutoplay);
        };

        weddingAudio.play()
            .then(() => {
                isPlaying = true;
                updateMusicButton();
            })
            .catch(() => {
                window.addEventListener("click", tryAutoplay, { once: true });
                window.addEventListener("keydown", tryAutoplay, { once: true });
                window.addEventListener("scroll", tryAutoplay, { once: true });
            });

        if (musicToggleBtn) {
            musicToggleBtn.addEventListener("click", async (e) => {
                e.stopPropagation();

                try {
                    if (isPlaying) {
                        weddingAudio.pause();
                        isPlaying = false;
                    } else {
                        await weddingAudio.play();
                        isPlaying = true;
                    }

                    updateMusicButton();

                } catch (error) {
                    console.error("Music playback error:", error);
                }
            });
        }
    }



    // ==========================================
    // 2. FALLING VINTAGE ROSES ANIMATION
    // ==========================================

    function triggerFlowers(amount = 30) {

        const roseColors = [
            "#c98787", // Dusty rose
            "#d9a3a0", // Blush pink
            "#b97979", // Vintage rose
            "#e4b9a9", // Soft peach
            "#a86f70", // Muted burgundy
            "#d6a6a0"  // Antique pink
        ];

        for (let i = 0; i < amount; i++) {

            const rose = document.createElement("div");

            const roseColor =
                roseColors[Math.floor(Math.random() * roseColors.length)];

            const size = Math.random() * 18 + 22;

            // Vintage rose illustration
            rose.innerHTML = `
                <svg viewBox="0 0 100 120"
                     width="${size}"
                     height="${size * 1.2}"
                     xmlns="http://www.w3.org/2000/svg">

                    <!-- Rose petals -->
                    <g fill="${roseColor}" stroke="#956b65" stroke-width="1">
                        <ellipse cx="50" cy="34" rx="15" ry="24"/>
                        <ellipse cx="34" cy="42" rx="15" ry="22"
                                 transform="rotate(-45 34 42)"/>
                        <ellipse cx="66" cy="42" rx="15" ry="22"
                                 transform="rotate(45 66 42)"/>
                        <ellipse cx="39" cy="56" rx="15" ry="21"
                                 transform="rotate(-25 39 56)"/>
                        <ellipse cx="61" cy="56" rx="15" ry="21"
                                 transform="rotate(25 61 56)"/>
                        <ellipse cx="50" cy="54" rx="13" ry="17"
                                 fill="#b97879"/>
                    </g>

                    <!-- Rose center -->
                    <path d="M45 51 Q38 39 50 36 Q63 40 55 51
                             Q48 59 45 51Z"
                          fill="#a9686b"
                          stroke="#956b65"
                          stroke-width="1"/>

                    <!-- Stem -->
                    <path d="M50 72 Q49 91 53 111"
                          fill="none"
                          stroke="#718064"
                          stroke-width="3"
                          stroke-linecap="round"/>

                    <!-- Leaves -->
                    <path d="M51 91 Q28 76 23 91 Q37 104 51 91Z"
                          fill="#879274"
                          stroke="#647257"
                          stroke-width="1"/>

                    <path d="M52 101 Q72 82 79 94 Q70 108 52 101Z"
                          fill="#a0a789"
                          stroke="#647257"
                          stroke-width="1"/>

                    <!-- Leaf details -->
                    <path d="M26 91 Q39 91 51 91
                             M76 95 Q64 98 52 101"
                          fill="none"
                          stroke="#647257"
                          stroke-width="0.8"/>
                </svg>
            `;

            rose.style.position = "fixed";
            rose.style.left = Math.random() * 100 + "vw";
            rose.style.top = "-100px";
            rose.style.zIndex = "9999";
            rose.style.pointerEvents = "none";
            rose.style.filter = "drop-shadow(2px 3px 3px #51463830)";
            rose.style.opacity = Math.random() * 0.4 + 0.6;

            document.body.appendChild(rose);

            const duration = Math.random() * 5000 + 5000;
            const drift = (Math.random() - 0.5) * 250;
            const rotation = Math.random() * 720 - 360;
            const sway = (Math.random() - 0.5) * 100;

            const animation = rose.animate(
                [
                    {
                        transform: "translate(0px, 0px) rotate(0deg)",
                        opacity: 0
                    },
                    {
                        transform: `translate(${sway}px, 150px) rotate(90deg)`,
                        opacity: 1,
                        offset: 0.15
                    },
                    {
                        transform: `translate(${drift}px, ${window.innerHeight + 150}px) rotate(${rotation}deg)`,
                        opacity: 0
                    }
                ],
                {
                    duration: duration,
                    easing: "ease-in-out"
                }
            );

            animation.onfinish = () => rose.remove();
        }
    }


    // ==========================================
    // 3. GOOGLE DRIVE PHOTO UPLOAD
    // ==========================================

    const dropZone = document.getElementById("dropZone");

    if (dropZone) {

        const originalDropZone = dropZone.innerHTML;

        function showUploadMessage(title, description, icon) {

            dropZone.innerHTML = `
                <div class="w-16 h-16 bg-[#e2e4d6] text-[#626c53]
                    rounded-full flex items-center justify-center
                    mx-auto mb-5 text-2xl">

                    <i class="${icon}"></i>

                </div>

                <h3 class="font-serif text-xl text-[#505c45] mb-2">
                    ${title}
                </h3>

                <p class="text-xs text-[#788064] uppercase tracking-wider">
                    ${description}
                </p>
            `;
        }

        function resetDropZone() {
            dropZone.innerHTML = originalDropZone;
        }

        function readFileAsDataURL(file) {
            return new Promise((resolve, reject) => {

                const reader = new FileReader();

                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);

                reader.readAsDataURL(file);
            });
        }

        // Event delegation allows the upload input to be recreated.
        dropZone.addEventListener("change", async (e) => {

            if (!e.target.matches("#photoUpload")) return;

            const files = Array.from(e.target.files || []);

            if (!files.length) return;

            // Maximum 10 photos
            if (files.length > MAX_PHOTOS) {

                alert("You can upload a maximum of 10 photos only.");

                e.target.value = "";
                return;
            }

            // Validate file type and size
            const invalidFile = files.find(file =>
                !file.type.startsWith("image/") ||
                file.size > MAX_FILE_SIZE ||
                file.size === 0
            );

            if (invalidFile) {

                alert(
                    "Please select valid image files. " +
                    "Each photo must be 10 MB or smaller."
                );

                e.target.value = "";
                return;
            }

            // Disable additional uploads while processing
            dropZone.style.pointerEvents = "none";

            showUploadMessage(
                "Preparing Your Memories...",
                `Processing ${files.length} photo(s)`,
                "fa-solid fa-spinner fa-spin"
            );

            try {

                // Upload sequentially to avoid overwhelming the script
                for (let i = 0; i < files.length; i++) {

                    const file = files[i];

                    showUploadMessage(
                        "Uploading Your Memories...",
                        `Uploading photo ${i + 1} of ${files.length}`,
                        "fa-solid fa-cloud-arrow-up fa-bounce"
                    );

                    const fullBase64 = await readFileAsDataURL(file);
                    const base64Data = fullBase64.split(",")[1];

                    await fetch(googleAppsScriptUrl, {
                        method: "POST",
                        mode: "no-cors",
                        headers: {
                            "Content-Type": "text/plain;charset=utf-8"
                        },
                        body: JSON.stringify({
                            base64: base64Data,
                            mimeType: file.type,
                            filename: file.name
                        })
                    });
                }

                showUploadMessage(
                    "Thank You for Sharing!",
                    "Your photo upload requests have been sent!",
                    "fa-solid fa-heart"
                );

                triggerFlowers(25);

                setTimeout(() => {
                    resetDropZone();
                    dropZone.style.pointerEvents = "auto";
                }, 5000);

            } catch (error) {

                console.error("Photo upload error:", error);

                showUploadMessage(
                    "Something Went Wrong",
                    "Please try uploading your photos again.",
                    "fa-solid fa-circle-exclamation"
                );

                setTimeout(() => {
                    resetDropZone();
                    dropZone.style.pointerEvents = "auto";
                }, 4000);
            }
        });
    }


    // ==========================================
    // 4. GUEST MESSAGE TO GOOGLE SHEETS
    // ==========================================

    const messageForm = document.getElementById("messageForm");
    const messageSuccess = document.getElementById("messageSuccess");

    if (messageForm && messageSuccess) {

        messageForm.addEventListener("submit", async (e) => {

            e.preventDefault();

            const nameInput = document.getElementById("messageName");
            const messageInput = document.getElementById("guestMessage");

            const submitButton =
                messageForm.querySelector("button[type='submit']");

            const name = nameInput.value.trim();
            const message = messageInput.value.trim();

            // Validate the guest's input
            if (!name || !message) {
                alert("Please enter your name and heartfelt message.");
                return;
            }

            if (name.length > 100 || message.length > 1000) {
                alert("Your name or message is too long.");
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = "SENDING YOUR MESSAGE...";

            try {

                await fetch(googleAppsScriptUrl, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify({
                        name: name,
                        message: message
                    })
                });

                // Display the thank-you message
                messageForm.classList.add("hidden");
                messageSuccess.classList.remove("hidden");

                // Vintage falling flowers!
                triggerFlowers(45);

                // Add a gentle fade-in effect
                messageSuccess.animate(
                    [
                        {
                            opacity: 0,
                            transform: "translateY(15px)"
                        },
                        {
                            opacity: 1,
                            transform: "translateY(0)"
                        }
                    ],
                    {
                        duration: 900,
                        easing: "ease-out"
                    }
                );

            } catch (error) {

                console.error("Message submission error:", error);

                alert(
                    "Unable to send your message. " +
                    "Please try again."
                );

                submitButton.disabled = false;
                submitButton.textContent = "SEND YOUR MESSAGE →";
            }
        });
    }


    // ==========================================
    // 5. MOBILE NAVIGATION (OPTIONAL)
    // ==========================================

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (mobileMenuBtn && mobileMenu) {

        mobileMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
            });
        });
    }

});
