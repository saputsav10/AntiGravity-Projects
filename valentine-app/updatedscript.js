document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements for better performance
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const proposalContent = document.getElementById('proposal-content');
    const successContent = document.getElementById('success-content');
    const container = document.querySelector('.container');
    const body = document.body;
    
    // New elements for enhanced features
    const musicToggle = document.getElementById('music-toggle');
    const statsDisplay = document.getElementById('stats-display');
    
    // Game state tracking
    let noClickCount = 0;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let audioContext = null;
    let musicPlaying = false;
    
    // Initialize audio context for sound effects
    function initAudio() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    // Enhanced sound effects
    function playSuccessSound() {
        if (!audioContext) return;
        
        // Success chime sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.linearRampToValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    function playNoSound() {
        if (!audioContext) return;
        
        // Funny "boing" sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(100, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    // Enhanced confetti with multiple particle types
    function createEnhancedConfetti() {
        const particleTypes = ['❤', '💍', '💖', '✨', '🌟', '💫'];
        const colors = ['#ff7675', '#fd79a8', '#e84393', '#d63031', '#00b894', '#55a3ff'];
        
        for (let i = 0; i < 80; i++) {
            createParticle(particleTypes, colors);
        }
        
        // Background hearts animation
        createFloatingBackgroundHearts();
    }
    
    function createParticle(particleTypes, colors) {
        const particle = document.createElement('div');
        const symbol = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        particle.innerHTML = symbol;
        
        const size = Math.random() * 25 + 10;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 0.5;
        
        particle.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            font-size: ${size}px;
            color: ${colors[Math.floor(Math.random() * colors.length)]};
            pointer-events: none;
            z-index: 2000;
            transition: all ${duration}s ease-out ${delay}s;
            transform: translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
        `;
        
        body.appendChild(particle);
        
        setTimeout(() => {
            particle.style.top = '-50px';
            particle.style.opacity = '0';
            particle.style.transform += ' scale(0)';
        }, 100);
        
        setTimeout(() => particle.remove(), (duration + delay) * 1000 + 1000);
    }
    
    function createFloatingBackgroundHearts() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '💕';
                heart.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 50 + 20}vh;
                    font-size: ${Math.random() * 20 + 15}px;
                    color: #ff69b4;
                    pointer-events: none;
                    z-index: 1500;
                    animation: float ${Math.random() * 5 + 5}s infinite ease-in-out;
                    opacity: 0.7;
                `;
                body.appendChild(heart);
                
                setTimeout(() => heart.remove(), 10000);
            }, i * 200);
        }
    }
    
    // Add CSS animation keyframes (injected dynamically)
    function injectAnimations() {
        if (!document.getElementById('dynamic-styles')) {
            const style = document.createElement('style');
            style.id = 'dynamic-styles';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                .shake { animation: shake 0.5s ease-in-out; }
                .pulse { animation: pulse 1s infinite; }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Super enhanced No button movement with difficulty progression
    const moveNoBtn = (e) => {
        noClickCount++;
        playNoSound();
        updateStats();
        
        // Progressive difficulty - button gets faster and smaller
        const speed = Math.min(1 + noClickCount * 0.02, 2);
        const scale = Math.max(0.7 - noClickCount * 0.01, 0.4);
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const btnWidth = noBtn.offsetWidth * scale;
        const btnHeight = noBtn.offsetHeight * scale;
        
        const padding = 30 + noClickCount * 2;
        const maxLeft = windowWidth - btnWidth - padding;
        const maxTop = windowHeight - btnHeight - padding;
        
        const newLeft = Math.floor(Math.random() * (maxLeft - padding)) + padding;
        const newTop = Math.floor(Math.random() * (maxTop - padding)) + padding;
        
        // Smooth animated movement
        noBtn.style.transition = `all ${speed}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
        noBtn.style.position = 'fixed';
        noBtn.style.left = `${newLeft}px`;
        noBtn.style.top = `${newTop}px`;
        noBtn.style.transform = `rotate(${Math.floor(Math.random() * 60) - 30}deg) scale(${scale})`;
        
        // Add shake effect to Yes button when No is clicked
        yesBtn.classList.add('shake');
        setTimeout(() => yesBtn.classList.remove('shake'), 500);
        
        // Taunt messages based on click count
        showTauntMessage();
    };
    
    // Show funny taunt messages
    function showTauntMessage() {
        const taunts = [
            "Getting away won't be that easy! 😏",
            "Come on, you know the answer! 😉",
            "Stop running, say YES! 💍",
            "You're making this harder than it needs to be! 😤",
            "Persistent much? Just say YES! 🥺"
        ];
        
        if (noClickCount > 1 && noClickCount % 5 === 0) {
            const taunt = document.createElement('div');
            taunt.textContent = taunts[Math.floor(Math.random() * taunts.length)];
            taunt.style.cssText = `
                position: fixed;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255,255,255,0.95);
                padding: 15px 25px;
                border-radius: 25px;
                font-weight: bold;
                z-index: 3000;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
            `;
            body.appendChild(taunt);
            
            setTimeout(() => {
                taunt.style.opacity = '0';
                taunt.style.transform = 'translateX(-50%) translateY(-20px)';
                setTimeout(() => taunt.remove(), 500);
            }, 2000);
        }
    }
    
    // Update statistics display
    function updateStats() {
        if (statsDisplay) {
            statsDisplay.textContent = `No clicks: ${noClickCount} 🏃‍♂️💨`;
        }
    }
    
    // Music toggle functionality
    function toggleMusic() {
        musicPlaying = !musicPlaying;
        musicToggle.textContent = musicPlaying ? '🔇' : '🔊';
        if (musicPlaying && audioContext) {
            // Could integrate background music here
            console.log('Romantic music playing 🎵');
        }
    }
    
    // Yes button - enhanced celebration
    const handleYesClick = () => {
        playSuccessSound();
        
        // Hide proposal, show success
        proposalContent.classList.add('hidden');
        successContent.classList.remove('hidden');
        
        // Epic celebration sequence
        createEnhancedConfetti();
        body.classList.add('celebration-mode');
        
        // Lock the No button forever
        noBtn.style.display = 'none';
        
        // Show final stats
        setTimeout(() => {
            if (statsDisplay) {
                statsDisplay.textContent = `Took ${noClickCount} tries to say YES! 💍❤️`;
            }
        }, 1000);
    };
    
    // Event listeners with improved mobile support
    yesBtn.addEventListener('click', handleYesClick);
    
    // Multiple No button interactions
    const noEvents = isMobile ? ['touchstart', 'click'] : ['mouseover', 'click'];
    noEvents.forEach(event => {
        noBtn.addEventListener(event, (e) => {
            e.preventDefault();
            moveNoBtn(e);
        });
    });
    
    // Prevent scrolling on mobile when touching No button
    noBtn.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    
    // Music toggle
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Initialize everything
    initAudio();
    injectAnimations();
    updateStats();
    
    // Easter egg: Double tap Yes button for secret message
    let yesTapCount = 0;
    yesBtn.addEventListener('click', () => {
        yesTapCount++;
        if (yesTapCount === 2) {
            alert("You're perfect! 💕💕💕");
            yesTapCount = 0;
        }
    }, true);
    
    console.log('💍 Proposal App Enhanced Edition Loaded! 💍');
});
