// --- PRELOADER LOGIC ---
document.addEventListener('DOMContentLoaded', async () => {
    const preloader = document.getElementById('page-preloader');

    if (preloader) {
        // 1. Створюємо таймер безпеки: максимум 1 секунда (1000 мс)
        // Це гарантує, що для Google PageSpeed прелоадер зникне швидко
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));

        // 2. Створюємо проміс для Hero-відео
        const heroVideoPromise = new Promise((resolve) => {
            // Шукаємо ТІЛЬКИ перше відео (Hero section), щоб не чекати футер/інші відео
            // Якщо у вас є специфічний ID для hero відео, краще використати: document.getElementById('hero-video')
            const heroVideo = document.querySelector('video[autoplay]');

            // Якщо відео немає взагалі - одразу "резолвимо" (закриваємо прелоадер)
            if (!heroVideo) {
                resolve();
                return;
            }

            // Якщо відео вже має достатньо даних для відтворення (стан HAVE_FUTURE_DATA або вище)
            if (heroVideo.readyState >= 3) {
                resolve();
            } else {
                // Чекаємо подію 'canplay' або помилки
                heroVideo.addEventListener('canplay', () => resolve(), { once: true });
                heroVideo.addEventListener('error', () => resolve(), { once: true });
            }
        });

        // 3. Використовуємо Promise.race замість Promise.all
        // Логіка: "Хто перший встигне: або відео завантажиться, або пройде 1 секунда"
        await Promise.race([heroVideoPromise, timeoutPromise]);

        // 4. Приховуємо прелоадер
        preloader.classList.add('hidden');

        // Видаляємо з DOM після завершення CSS анімації (наприклад, 0.5с)
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- НАЛАШТУВАННЯ ---
    // Вставте сюди скопійований URL з Google Apps Script
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwLyTD1H9DdDTCZ5FVAW08odNXIPVeor69BdTGdYEu4xXJ858kvqQ7fB5VB1HHLug7K/exec";

    // --- MOBILE MENU ---
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileServicesList = document.getElementById('mobile-services-list');
    const mobileDropdownTrigger = document.querySelector('.mobile-dropdown-trigger');

    window.toggleMobileMenu = function () {
        mobileMenu.classList.toggle('active');
        const headerBurger = document.querySelector('.header-body .burger-btn');
        if (headerBurger) headerBurger.classList.toggle('active');
        const closeBtn = document.querySelector('.close-menu-btn .burger-btn');
        // Логіка для хрестика всередині меню, якщо він реалізований через той самий клас

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
                // Використовуємо no-cors, бо Google Script іноді блокує стандартні CORS відповіді,
                // але дані все одно записуються.
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(() => {
                    // Успіх
                    console.log('Дані відправлено');
                    formContent.style.display = 'none';
                    successMessage.style.display = 'flex';
                })
                .catch(error => {
                    console.error('Помилка:', error);
                    alert("Сталася помилка при відправці. Спробуйте пізніше.");
                })
                .finally(() => {
                    // Повертаємо кнопку (хоча форма вже сховається)
                    submitBtn.innerHTML = originalBtnText;
                });
        });
    }
});
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const body = document.body;

    // Перемикаємо клас active для меню
    menu.classList.toggle('active');

    // Перемикаємо клас menu-open для body (щоб анімувати бургер)
    body.classList.toggle('menu-open');

    // Блокуємо скрол коли меню відкрите
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

    // Перевірка, чи елементи існують, щоб не було помилок в консолі
    if (!list || !arrow) return;

    if (list.style.maxHeight) {
        // Якщо відкрито - закриваємо
        list.style.maxHeight = null;
        arrow.style.transform = 'rotate(0deg)';
    } else {
        // Якщо закрито - відкриваємо на повну висоту контенту
        const height = list.scrollHeight;
        list.style.maxHeight = height + "px";
        arrow.style.transform = 'rotate(180deg)';
    }
}

function toggleAcc(header) {
    const item = header.parentElement;
    const body = item.querySelector('.s5-acc-body');
    const isActive = item.classList.contains('active');

    // Логіка тільки для поточної картки (інші не чіпаємо)
    if (isActive) {
        // Якщо відкрита -> закриваємо
        item.classList.remove('active');
        body.style.maxHeight = null;
    } else {
        // Якщо закрита -> відкриваємо
        const height = body.scrollHeight;
        item.classList.add('active');
        body.style.maxHeight = height + "px";

        // Плавний підворот екрану до початку відкритої картки
        // (Щоб заголовок був зручно перед очима)
        setTimeout(() => {
            const headerOffset = 100; // Відступ для хедера
            const elementPosition = item.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }, 300); // Чекаємо поки картка почне відкриватись
    }
}

function toggleVideo(container) {
    const video = container.querySelector('video');
    const btn = container.querySelector('.s5-play-btn');

    if (!video) return; // Проверка на всяк випадок

    if (video.paused) {
        // Ставимо на паузу всі інші відео, щоб не було каші звуків
        document.querySelectorAll('video').forEach(v => {
            if (v !== video) {
                v.pause();
                // Показуємо кнопку на інших відео
                const otherBtn = v.parentElement.querySelector('.s5-play-btn');
                if (otherBtn) otherBtn.style.opacity = '1';
            }
        });

        video.play();
        btn.style.opacity = '0'; // Ховаємо кнопку
    } else {
        video.pause();
        btn.style.opacity = '1'; // Показуємо кнопку
    }
}
// // --- HERO VIDEO SPEED CONTROL ---
// document.addEventListener('DOMContentLoaded', function() {
//     const video = document.getElementById('hero-video');

//     if (video) {
//         // Встановлюємо швидкість відтворення:
//         // 1.0 = нормальна швидкість
//         // 0.5 = половина швидкості
//         video.playbackRate = 1; 
//     }
// });

// --- COOKIES LOGIC ---
const cookieBanner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('accept-cookies');
const declineBtn = document.getElementById('decline-cookies');

// Перевіряємо, чи був вибір раніше
if (!localStorage.getItem('cookiesChoice')) {
    // Якщо ні - показуємо банер через 2 секунди
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 2000);
} else {
    // Якщо вибір був "accepted", тут можна запускати аналітику
    if (localStorage.getItem('cookiesChoice') === 'accepted') {
        initAnalytics();
    }
}

if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesChoice', 'accepted');
        cookieBanner.classList.remove('show');
        initAnalytics(); // Запускаємо аналітику
    });
}

if (declineBtn) {
    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesChoice', 'declined');
        cookieBanner.classList.remove('show');
        // Нічого не запускаємо
    });
}

// Функція для запуску Google Analytics / Pixel
function initAnalytics() {
    console.log('Cookies Accepted: Analytics Started');
    // Сюди ви вставите код Google Analytics (GTM), коли він у вас буде.
    // Наприклад:
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'UA-XXXXX-Y');
}