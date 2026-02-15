document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const proposalContent = document.getElementById('proposal-content');
    const successContent = document.getElementById('success-content');
    const container = document.querySelector('.container');

    // Yes Button Click
    yesBtn.addEventListener('click', () => {
        proposalContent.classList.add('hidden');
        successContent.classList.remove('hidden');
        createConfetti();
    });

    // No Button Interaction (Desktop: Mouseover, Mobile: Touchstart/Click)
    const moveNoBtn = (e) => {
        // Get window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Get button dimensions
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;

        // Calculate a new random position
        // Ensure it stays within the viewport but padding from edges
        const padding = 20;
        const maxLeft = windowWidth - btnWidth - padding;
        const maxTop = windowHeight - btnHeight - padding;

        const newLeft = Math.floor(Math.random() * (maxLeft - padding)) + padding;
        const newTop = Math.floor(Math.random() * (maxTop - padding)) + padding;

        // Apply new position
        noBtn.style.position = 'fixed'; // Escape the container flow
        noBtn.style.left = `${newLeft}px`;
        noBtn.style.top = `${newTop}px`;

        // Add a funny rotation
        const randomRotation = Math.floor(Math.random() * 40) - 20;
        noBtn.style.transform = `rotate(${randomRotation}deg)`;
    };

    noBtn.addEventListener('mouseover', moveNoBtn);
    noBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Just in case they manage to click it
        moveNoBtn();
    });
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent click on touch
        moveNoBtn();
    });

    // Simple confetti effect
    function createConfetti() {
        // You could add a library here, but a simple CSS/JS implementation
        // or just the heart animation is often enough for a lightweight app.
        // Let's add more floating hearts to the background for effect.
        const colors = ['#ff7675', '#fd79a8', '#e84393', '#d63031'];

        for (let i = 0; i < 50; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = '100vh';
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            heart.style.fontSize = Math.floor(Math.random() * 20 + 10) + 'px';
            heart.style.transition = `all ${Math.random() * 2 + 1}s ease-out`;
            heart.style.zIndex = '1000';

            document.body.appendChild(heart);

            setTimeout(() => {
                heart.style.top = '-20px';
                heart.style.opacity = '0';
            }, 100);

            setTimeout(() => {
                heart.remove();
            }, 3000);
        }
    }
});
