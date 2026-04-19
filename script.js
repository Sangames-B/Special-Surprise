/* --- 1. CONFIGURATION & STATE --- */ 
const VALID_NAMES = ["joe", "subalakshmi"];
const MOVE_LIMIT = 5; 
let noButtonMoveCount = 0; 

/* --- 2. INITIALIZATION --- */
document.addEventListener("DOMContentLoaded", () => {
    // Handle the Enter Key for the name input
    const nameInput = document.getElementById('name-input');
    if (nameInput) {
        nameInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); 
                checkName(); 
            }
        });
    }

    // Initialize the "No" button jumping logic
    const noBtn = document.getElementById('no-btn');
    if (noBtn) {
        noBtn.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                // Increment move count
                noButtonMoveCount++;
                
                // Trigger auto-penalty after 5 failed attempts
                if (noButtonMoveCount >= MOVE_LIMIT) {
                    triggerPenaltyLoop();
                    noButtonMoveCount = 0; 
                    return; 
                }

                // Switch to fixed position so it can jump anywhere
                noBtn.style.position = 'fixed'; 

                const padding = 50; 
                const availableWidth = window.innerWidth - noBtn.offsetWidth - (padding * 2);
                const availableHeight = window.innerHeight - noBtn.offsetHeight - (padding * 2);

                const randomX = Math.floor(Math.random() * availableWidth) + padding;
                const randomY = Math.floor(Math.random() * availableHeight) + padding;

                noBtn.style.left = `${randomX}px`;
                noBtn.style.top = `${randomY}px`;
            }
        });

        // Mobile click logic
        noBtn.addEventListener('click', () => {
            triggerPenaltyLoop();
        });
    }
});

/* --- 3. NAME CHECK LOGIC --- */
function checkName() {
    const input = document.getElementById('name-input').value.toLowerCase().trim();
    if (VALID_NAMES.includes(input)) {
        startAccessCountdown();
    } else {
        triggerIdiotPenalty();
    }
}

/* --- 4. PENALTY & ACCESS OVERLAYS --- */
function triggerIdiotPenalty() {
    const overlay = document.getElementById('idiot-overlay');
    const timerText = document.getElementById('idiot-timer');
    overlay.classList.remove('hidden');
    let count = 10;
    const interval = setInterval(() => {
        count--;
        timerText.innerText = count;
        if (count === 0) {
            clearInterval(interval);
            overlay.classList.add('hidden');
            document.getElementById('name-input').value = '';
            timerText.innerText = 3; 
        }
    }, 1000);
}

function startAccessCountdown() {
    document.getElementById('login-screen').classList.add('hidden');
    const overlay = document.getElementById('access-overlay');
    const timerText = document.getElementById('access-timer');
    overlay.classList.remove('hidden');
    let count = 3; // Keep it short for a snappy feel
    const interval = setInterval(() => {
        count--;
        timerText.innerText = count;
        if (count === 0) {
            clearInterval(interval);
            playTransitionVideo();
        }
    }, 1000);
}

/* --- 5. TRANSITIONS & QUESTION SCREEN --- */
function playTransitionVideo() {
    document.getElementById('access-overlay').classList.add('hidden');
    const container = document.getElementById('video-transition-container');
    const video = document.getElementById('transition-video');
    container.classList.remove('hidden');
    video.play();
    video.onended = () => {
        container.classList.add('hidden');
        showQuestion();
    };
}

function showQuestion() {
    document.querySelectorAll('.overlay, .screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('question-screen').classList.remove('hidden');
}

/* --- 6. THE NEW CONFETTI TRANSITION (TRIGGERED BY YES) --- */
function playConfettiTransition() {
    const confettiContainer = document.getElementById('confetti-overlay');
    const confettiVideo = document.getElementById('confetti-transition-video');
    const questionScreen = document.getElementById('question-screen');
    const finalScreen = document.getElementById('final-screen');

    // Show the confetti overlay and play
    confettiContainer.classList.remove('hidden', 'fade-out');
    confettiVideo.play();

    // Swap screens behind the confetti after 500ms (mid-video)
    setTimeout(() => {
        questionScreen.classList.add('hidden');
        finalScreen.classList.remove('hidden');
    }, 500); 

    // Hide overlay when confetti video finishes
    confettiVideo.onended = () => {
        confettiContainer.classList.add('fade-out');
        
        // Wait for the 0.8s transition to finish before adding .hidden
        setTimeout(() => {
            confettiContainer.classList.add('hidden');
        }, 800);
    };
}

/* --- 7. NO BUTTON PENALTY LOOP --- */
function triggerPenaltyLoop() {
    document.getElementById('question-screen').classList.add('hidden');
    const penaltyScreen = document.getElementById('penalty-screen');
    const timerText = document.getElementById('penalty-timer');
    penaltyScreen.classList.remove('hidden');
    let count = 3;
    const interval = setInterval(() => {
        count--;
        timerText.innerText = count;
        if (count === 0) {
            clearInterval(interval);
            showQuestion();
            timerText.innerText = 3; 
        }
    }, 1000);
}

/* --- 8. THE FINAL PARTY --- */
function startParty() {
    const finalVid = document.getElementById('final-video');
    finalVid.muted = false; // Unmute for celebration!
    finalVid.play();

    // 2. Handle the New Audio File
    const celebrateAudio = new Audio('assets/celebration_music.mp3'); // Change to your filename
    celebrateAudio.volume = 0.7; // Optional: Adjust volume from 0.0 to 1.0
    celebrateAudio.loop = true;
    celebrateAudio.play().catch(error => {
        console.log("Audio play failed. Browser might need more interaction:", error);
    });

    document.getElementById('play-music-btn').style.display = 'none';
}
