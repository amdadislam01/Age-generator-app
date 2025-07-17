document.addEventListener('DOMContentLoaded', function () {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Create animated particles
    createParticles();

    // Set max date to today
    const dobInput = document.getElementById('dob');
    const today = new Date().toISOString().split('T')[0];
    dobInput.setAttribute('max', today);

    // Add animation to input when focused
    dobInput.addEventListener('focus', function () {
        this.classList.add('ring-2', 'ring-indigo-400', 'shadow-md', 'bg-slate-700/50');
    });
    dobInput.addEventListener('blur', function () {
        this.classList.remove('ring-2', 'ring-indigo-400', 'shadow-md', 'bg-slate-700/50');
    });

    // Calculate age when button is clicked
    document.getElementById('calculateBtn').addEventListener('click', function () {
        // Add click animation
        this.classList.add('animate-pulse');
        setTimeout(() => {
            this.classList.remove('animate-pulse');
        }, 300);

        const dob = new Date(dobInput.value);
        const today = new Date();

        if (!dobInput.value) {
            showError('Please select your date of birth');
            return;
        }

        if (dob > today) {
            showError('Birth date cannot be in the future');
            return;
        }

        const age = calculateAge(dob, today);
        displayResult(age);
    });

    // Also calculate when Enter is pressed in the date field
    dobInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            document.getElementById('calculateBtn').click();
        }
    });

    // Handle window resize for particles
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => particle.remove());
            createParticles();
        }, 250);
    });
});

function createParticles() {
    const container = document.body;
    const particleCount = window.innerWidth < 768 ? 20 : 40;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random properties
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const opacity = Math.random() * 0.3 + 0.1;
        const animationDuration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;
        particle.style.animation = `float ${animationDuration}s ease-in-out ${delay}s infinite`;

        container.appendChild(particle);
    }
}

function calculateAge(birthDate, currentDate) {
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
    }

    if (days < 0) {
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        days = Math.floor((currentDate - lastMonth) / (1000 * 60 * 60 * 24)) + days + 1;
    }

    return { years, months, days };
}

function displayResult(age) {
    const resultDiv = document.getElementById('result');
    const ageResultDiv = document.getElementById('ageResult');
    const name = document.getElementById('name').value || 'Dear User';
    const dobValue = document.getElementById('dob').value;

    // Create the result HTML with animated numbers
    ageResultDiv.innerHTML = `
                <div class="text-center mb-4">
                    <p class="text-lg sm:text-xl font-medium text-indigo-300 animate-pulse">
                        ${name}
                    </p>
                </div>
                <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                    <div class="bg-slate-700/40 p-2 sm:p-4 rounded-lg border border-slate-600 transition-all duration-500 hover:border-indigo-400 hover:scale-105">
                        <div id="yearsDisplay" class="text-xl sm:text-3xl font-bold text-indigo-400 animate-bounce">${age.years}</div>
                        <div class="text-xs uppercase text-slate-400 mt-1">Years</div>
                    </div>
                    <div class="bg-slate-700/40 p-2 sm:p-4 rounded-lg border border-slate-600 transition-all duration-500 hover:border-purple-400 hover:scale-105">
                        <div id="monthsDisplay" class="text-xl sm:text-3xl font-bold text-purple-400 animate-bounce" style="animation-delay: 0.3s">${age.months}</div>
                        <div class="text-xs uppercase text-slate-400 mt-1">Months</div>
                    </div>
                    <div class="bg-slate-700/40 p-2 sm:p-4 rounded-lg border border-slate-600 transition-all duration-500 hover:border-pink-400 hover:scale-105">
                        <div id="daysDisplay" class="text-xl sm:text-3xl font-bold text-pink-400 animate-bounce" style="animation-delay: 0.6s">${age.days}</div>
                        <div class="text-xs uppercase text-slate-400 mt-1">Days</div>
                    </div>
                </div>
                <p class="mt-3 sm:mt-4 text-center text-slate-300 font-medium text-sm sm:text-base">
                    Born on <span class="text-indigo-300">${dobValue}</span>
                </p>
            `;

    // Add continuous color animation
    const colors = ['text-indigo-400', 'text-purple-400', 'text-pink-400', 'text-blue-400'];
    let currentIndex = 0;

    const elements = [
        document.getElementById('yearsDisplay'),
        document.getElementById('monthsDisplay'),
        document.getElementById('daysDisplay')
    ];

    const colorInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % colors.length;
        elements.forEach((el, i) => {
            if (el) { // Check if element exists
                const colorIndex = (currentIndex + i) % colors.length;
                el.classList.remove(...colors);
                el.classList.add(colors[colorIndex]);
            }
        });
    }, 2000);

    // Clear interval when calculating new age
    resultDiv.dataset.intervalId = colorInterval;

    resultDiv.classList.remove('hidden');
    resultDiv.classList.add('scale-100', 'opacity-100');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    const ageResultDiv = document.getElementById('ageResult');
    const name = document.getElementById('name').value || 'Dear User';

    // Clear any existing interval
    if (resultDiv.dataset.intervalId) {
        clearInterval(resultDiv.dataset.intervalId);
    }

    ageResultDiv.innerHTML = `
                <div class="text-rose-400 animate-pulse flex items-center text-sm sm:text-base">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    ${name}, ${message}
                </div>
            `;

    resultDiv.classList.remove('hidden');
    resultDiv.classList.add('scale-100', 'opacity-100');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        resultDiv.classList.add('hidden');
    }, 3000);
}