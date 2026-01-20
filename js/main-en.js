// --- PRELOADER LOGIC ---
document.addEventListener('DOMContentLoaded', async () => {
    const preloader = document.getElementById('page-preloader');

    if (preloader) {
        // 1. Створюємо таймер безпеки: максимум 1 секунда (1000 мс)
        // Ensures preloader disappears quickly for Google PageSpeed
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));

        // 2. Створюємо проміс для Hero-відео
        const heroVideoPromise = new Promise((resolve) => {
            // Search ONLY first video (Hero section) to avoid waiting for footer/others
            // If you have specific ID for hero video, use: document.getElementById('hero-video')
            const heroVideo = document.querySelector('video[autoplay]');

            // If no video - resolve immediately (close preloader)
            if (!heroVideo) {
                resolve();
                return;
            }

            // If video has enough data to play (state HAVE_FUTURE_DATA or higher)
            if (heroVideo.readyState >= 3) {
                resolve();
            } else {
                // Wait for 'canplay' event or error
                heroVideo.addEventListener('canplay', () => resolve(), { once: true });
                heroVideo.addEventListener('error', () => resolve(), { once: true });
            }
        });

        // 3. Використовуємо Promise.race замість Promise.all
        // Logic: "Whichever comes first: video loads or 1 second passes"
        await Promise.race([heroVideoPromise, timeoutPromise]);

        // 4. Приховуємо прелоадер
        preloader.classList.add('hidden');

        // Remove from DOM after CSS animation completes (e.g. 0.5s)
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- НАЛАШТУВАННЯ ---
    // Paste copied Google Apps Script URL here
    const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE"; // Placeholder for demo

    // --- MOBILE MENU ---
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileServicesList = document.getElementById('mobile-services-list');
    const mobileDropdownTrigger = document.querySelector('.mobile-dropdown-trigger');

    window.toggleMobileMenu = function () {
        mobileMenu.classList.toggle('active');
        const headerBurger = document.querySelector('.header-body .burger-btn');
        if (headerBurger) headerBurger.classList.toggle('active');
        const closeBtn = document.querySelector('.close-menu-btn .burger-btn');
        // Logic for cross inside menu, if implemented via same class

        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // --- MODAL LOGIC ---
    const modal = document.getElementById('contact-overlay');
    const form = document.getElementById('project-form');
    const formContent = document.getElementById('form-content');
    const successMessage = document.getElementById('success-message');
    const checkbox = document.getElementById('privacy-policy-check');
    const submitBtn = document.getElementById('submit-btn');

    document.addEventListener('click', function (e) {
        if (e.target.closest('.open-contact-modal')) {
            e.preventDefault();
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
            openModal();
        }
    });

    function openModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    window.closeModal = function () {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';

            setTimeout(() => {
                form.reset();
                formContent.style.display = 'block';
                successMessage.style.display = 'none';
                if (submitBtn) submitBtn.disabled = true;
                if (checkbox) checkbox.checked = false;
            }, 500);
        }
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    if (checkbox && submitBtn) {
        checkbox.addEventListener('change', function () {
            submitBtn.disabled = !this.checked;
        });
    }

    // --- ВІДПРАВКА ДАНИХ ---
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // 1. Блокуємо кнопку, щоб не натиснули двічі
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending...";

            // 2. Збираємо дані
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                contactMethod: document.getElementById('contactMethod').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toLocaleString()
            };

            // 3. Відправляємо на Google Script
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                // Use no-cors as Google Script sometimes blocks standard CORS responses,
                // but data is still recorded.
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(() => {
                    // Success
                    console.log('Дані відправлено');
                    formContent.style.display = 'none';
                    successMessage.style.display = 'flex';
                })
                .catch(error => {
                    console.error('Помилка:', error);
                    alert("Сталася помилка при відправці. Спробуйте пізніше.");
                })
                .finally(() => {
                    // Return button (though form will hide)
                    submitBtn.innerHTML = originalBtnText;
                });
        });
    }
});
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const body = document.body;

    // Toggle active class for menu
    menu.classList.toggle('active');

    // Toggle menu-open class for body (to animate burger)
    body.classList.toggle('menu-open');

    // Block scroll when menu is open
    if (menu.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = '';
    }
}
/* --- ПРАВИЛЬНА ФУНКЦІЯ --- */
function toggleMobileServices() {
    const list = document.getElementById('mobile-services-list');
    const arrow = document.querySelector('.services-toggle .arrow-icon');

    // Check if elements exist to avoid console errors
    if (!list || !arrow) return;

    if (list.style.maxHeight) {
        // If open - close
        list.style.maxHeight = null;
        arrow.style.transform = 'rotate(0deg)';
    } else {
        // If closed - open to full content height
        const height = list.scrollHeight;
        list.style.maxHeight = height + "px";
        arrow.style.transform = 'rotate(180deg)';
    }
}

function toggleAcc(header) {
    const item = header.parentElement;
    const body = item.querySelector('.s5-acc-body');
    const isActive = item.classList.contains('active');

    // Logic only for current card (others untouched)
    if (isActive) {
        // If open -> close
        item.classList.remove('active');
        body.style.maxHeight = null;
    } else {
        // If closed -> open
        const height = body.scrollHeight;
        item.classList.add('active');
        body.style.maxHeight = height + "px";

        // Smooth scroll to start of open card
        // (So header is comfortably visible)
        setTimeout(() => {
            const headerOffset = 100; // Header offset
            const elementPosition = item.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }, 300); // Wait for card to start opening
    }
}

function toggleVideo(container) {
    const video = container.querySelector('video');
    const btn = container.querySelector('.s5-play-btn');

    if (!video) return; // Check just in case

    if (video.paused) {
        // Pause all other videos to avoid sound clash
        document.querySelectorAll('video').forEach(v => {
            if (v !== video) {
                v.pause();
                // Show button on other videos
                const otherBtn = v.parentElement.querySelector('.s5-play-btn');
                if (otherBtn) otherBtn.style.opacity = '1';
            }
        });

        video.play();
        btn.style.opacity = '0'; // Hide button
    } else {
        video.pause();
        btn.style.opacity = '1'; // Show button
    }
}
// // --- HERO VIDEO SPEED CONTROL ---
// document.addEventListener('DOMContentLoaded', function() {
//     const video = document.getElementById('hero-video');

//     if (video) {
//         // Set playback speed:
//         // 1.0 = нормальна швидкість
//         // 0.5 = половина швидкості
//         video.playbackRate = 1; 
//     }
// });

// --- COOKIES LOGIC ---
const cookieBanner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('accept-cookies');
const declineBtn = document.getElementById('decline-cookies');

// Check if choice was made before
if (!localStorage.getItem('cookiesChoice')) {
    // If not - show banner after 2 seconds
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 2000);
} else {
    // If choice was "accepted", we can start analytics here
    if (localStorage.getItem('cookiesChoice') === 'accepted') {
        initAnalytics();
    }
}

if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesChoice', 'accepted');
        cookieBanner.classList.remove('show');
        initAnalytics(); // Start analytics
    });
}

if (declineBtn) {
    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesChoice', 'declined');
        cookieBanner.classList.remove('show');
        // Do not start anything
    });
}

// Function to start Google Analytics / Pixel
function initAnalytics() {
    console.log('Cookies Accepted: Analytics Started');
    // Insert Google Analytics (GTM) code here when you have it.
    // Example:
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'UA-XXXXX-Y');
}
