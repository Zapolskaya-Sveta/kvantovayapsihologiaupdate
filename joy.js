/* =================================================================
   БАЗА ДАННЫХ ТОВАРОВ
   ================================================================= */
const DEFAULT_PRODUCTS = [
    { id: 1, title: "Медитация 'Денежный Поток'", description: "Раскрытие финансового потенциала и снятие блоков.", price: 1500, image: "img/Frame(4).png" },
    { id: 2, title: "Медитация 'Исполнение Желаний'", description: "Техника материализации мыслей и целей.", price: 1500, image: "img/Frame (6).png" },
    { id: 3, title: "Медитация 'Активация Сердца'", description: "Обретение баланса и исцеление обид.", price: 990, image: "img/Group 194.png" },
    { id: 4, title: "Курс 'Сила Рода'", description: "Глубинная проработка родовых сценариев. 4 недели.", price: 12000, image: "img/Frame.png" },
    { id: 5, title: "Личная консультация (Online)", description: "Разбор вашей ситуации по видеосвязи. 60 мин.", price: 5000, image: "img/session.png" },
    { id: 6, title: "Закрытый Клуб J.O.Y", description: "Доступ к сообществу на 1 месяц.", price: 3000, image: "img/club.png" },
    { id: 7, title: "Медитация 'Антистресс'", description: "Быстрое снятие напряжения после рабочего дня.", price: 700, image: "img/Frame(2).png" },
    { id: 8, title: "Пакет 'Перерождение'", description: "Комплекс из 5 медитаций и чек-листов.", price: 4500, image: "img/Frame(5).png" },
    { id: 9, title: "Медитация 'Утренняя Настройка'", description: "Заряд бодрости и позитива на весь день.", price: 500, image: "img/Frame(3).png" },
    { id: 10, title: "Курс 'Женская Энергия'", description: "Возвращение к своей природе и ресурсному состоянию.", price: 8500, image: "img/Frame(1).png" }
];

document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация базы товаров
    if (!localStorage.getItem('joyProducts')) {
        localStorage.setItem('joyProducts', JSON.stringify(DEFAULT_PRODUCTS));
    }

    // --- 1. ИНТЕРФЕЙС ГЛАВНОЙ ---
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const sectionId = this.getAttribute('href');
            if (sectionId && sectionId !== '#' && sectionId.length > 1) {
                const section = document.querySelector(sectionId);
                if (section) {
                    e.preventDefault();
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Расчет высоты фона (Верстка)
    function adjustSectionHeights() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const style = window.getComputedStyle(section);
            const bgUrl = style.backgroundImage.slice(4, -1).replace(/"/g, "");
            if (bgUrl && bgUrl !== 'none') {
                const bgImage = new Image();
                bgImage.src = bgUrl;
                bgImage.onload = function() {
                    if (window.innerWidth > 768) {
                        const aspectRatio = bgImage.height / bgImage.width;
                        const minHeight = window.innerWidth * aspectRatio;
                        section.style.minHeight = `${minHeight}px`;
                    } else {
                        section.style.minHeight = 'auto';
                    }
                };
            }
        });
    }
    adjustSectionHeights();
    window.addEventListener('resize', adjustSectionHeights);

    // Анимация цитат
    const quotes = document.querySelectorAll('.dissolve-quote');
    if (quotes.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.3 });
        quotes.forEach(quote => observer.observe(quote));
    }

    // Слайдер
    const slider = document.getElementById('slider');
    if (slider) {
        window.slideRight = function() {
            slider.style.transition = 'transform 0.5s ease';
            slider.style.transform = `translateX(-285px)`;
            setTimeout(() => {
                slider.appendChild(slider.children[0]);
                slider.style.transition = 'none';
                slider.style.transform = 'translateX(0)';
            }, 500);
        };
        window.slideLeft = function() {
            slider.style.transition = 'none';
            slider.insertBefore(slider.lastElementChild, slider.firstElementChild);
            slider.style.transform = `translateX(-285px)`;
            requestAnimationFrame(() => {
                slider.style.transition = 'transform 0.5s ease';
                slider.style.transform = 'translateX(0)';
            });
        };
    }

    // --- МОДАЛЬНЫЕ ОКНА ---
    setupModal('appointmentModal', '.appointment-button, .mobile-appointment-button, .appointment-button-white, .testimonial-button');
    
    const medModal = document.getElementById('meditationModal');
    if (medModal) {
        document.querySelectorAll('.main-button').forEach(btn => {
            if (btn.textContent.includes('ПОЛУЧИТЬ МЕДИТАЦИЮ')) {
                btn.onclick = (e) => {
                    e.preventDefault();
                    medModal.classList.add('active');
                    medModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                };
            }
        });
        const closeBtn = medModal.querySelector('.close-btn');
        if(closeBtn) closeBtn.onclick = () => { medModal.classList.remove('active'); medModal.style.display = 'none'; document.body.style.overflow = ''; };
    }

    // Маска телефона
    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput && typeof IMask !== 'undefined') {
        const countrySelector = document.getElementById('countrySelector');
        const flagIcon = document.getElementById('flagIcon');
        let phoneMask = IMask(phoneInput, { mask: '+{7} (000) 000-00-00' });
        if (countrySelector) {
            countrySelector.addEventListener('change', function() {
                if (this.value === 'ru') {
                    if(flagIcon) flagIcon.src = 'https://flagcdn.com/w40/ru.png';
                    phoneMask.updateOptions({ mask: '+{7} (000) 000-00-00' });
                } else {
                    if(flagIcon) flagIcon.src = 'https://flagcdn.com/w40/by.png';
                    phoneMask.updateOptions({ mask: '+375 (00) 000-00-00' });
                }
            });
        }
    }

    // Инициализация
    initAuth();
    updateCartCount();
    
    if (document.body.classList.contains('catalog-body')) loadCatalog();
    if (document.body.classList.contains('cabinet-body')) initCabinet();
});

// Хелперы
function setupModal(id, selector) {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
    }
    const close = modal.querySelector('.close-btn') || document.getElementById('closeModal');
    if (close) close.onclick = () => { modal.style.display = 'none'; document.body.style.overflow = ''; };
    window.addEventListener('click', (e) => { if(e.target === modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }});
}

window.flipResult = function(circle) { if(circle) circle.classList.toggle('flipped'); }
window.toggleHiddenText = function() {
    const t = document.getElementById('hiddenText');
    t.style.display = t.style.display === 'block' ? 'none' : 'block';
}
window.selectOption = function(el) {
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
}

/* =================================================================
   АВТОРИЗАЦИЯ
   ================================================================= */
function initAuth() {
    document.querySelectorAll('.fa-user').forEach(icon => {
        if (!icon.closest('.sidebar')) {
            const wrapper = icon.parentElement;
            wrapper.onclick = (e) => {
                e.preventDefault();
                if (localStorage.getItem('joyUser')) window.location.href = 'cabinet.html';
                else openAuthModal();
            };
        }
    });
}

window.openAuthModal = function(e) { if(e) e.preventDefault(); document.getElementById('registrationForm').style.display = 'flex'; }
window.closeAuthModal = function() { document.getElementById('registrationForm').style.display = 'none'; }
window.toggleAuth = function(type) {
    document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = type === 'register' ? 'block' : 'none';
    document.getElementById('tabLogin').style.borderBottom = type === 'login' ? '2px solid #E0C6AD' : 'none';
    document.getElementById('tabRegister').style.borderBottom = type === 'register' ? '2px solid #E0C6AD' : 'none';
}

window.handleLogin = function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    
    if(email === 'admin@joy.com' && pass === 'admin123') {
        localStorage.setItem('joyUser', JSON.stringify({name: 'Admin', role: 'admin', email: 'admin@joy.com'}));
        window.location.href = 'cabinet.html';
    } else {
        const usersDB = JSON.parse(localStorage.getItem('joyUsersDB')) || [];
        const user = usersDB.find(u => u.email === email && u.pass === pass);
        if (user) {
            localStorage.setItem('joyUser', JSON.stringify({name: user.name, role: 'user', email: user.email}));
            window.location.href = 'cabinet.html';
        } else {
            alert('Неверный логин или пароль');
        }
    }
}

window.handleRegister = function(e) {
    e.preventDefault();
    const name = document.querySelector('#registerForm input[type="text"]').value;
    const email = document.querySelector('#registerForm input[type="email"]').value;
    const pass = document.querySelector('#registerForm input[type="password"]').value;

    let usersDB = JSON.parse(localStorage.getItem('joyUsersDB')) || [];
    if(usersDB.find(u => u.email === email)) {
        alert('Пользователь уже существует');
        return;
    }
    // Сохраняем начальные пустые данные профиля
    usersDB.push({ name, email, pass, date: new Date().toLocaleDateString(), dob: '', place: '', hobby: '' });
    localStorage.setItem('joyUsersDB', JSON.stringify(usersDB));
    localStorage.setItem('joyUser', JSON.stringify({name, role: 'user', email}));
    window.location.href = 'cabinet.html';
}

/* =================================================================
   КАТАЛОГ И КОРЗИНА
   ================================================================= */
function loadCatalog() {
    const grid = document.getElementById('catalog-grid');
    if(!grid) return;
    const products = JSON.parse(localStorage.getItem('joyProducts')) || [];
    grid.innerHTML = '';
    
    products.forEach(p => {
        grid.innerHTML += `
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="catalog-item">
                    <div class="img-circle"><img src="${p.image}" alt="${p.title}" onerror="this.src='img/Frame.png'"></div>
                    <h5>${p.title}</h5>
                    <p class="desc">${p.description}</p>
                    <div class="price">${p.price} руб.</div>
                    <button class="main-button small-btn" onclick="addToCart(${p.id})">В корзину</button>
                </div>
            </div>`;
    });
}

window.addToCart = function(id) {
    if (!localStorage.getItem('joyUser')) {
        alert('Пожалуйста, войдите в аккаунт, чтобы добавить товар в корзину.');
        openAuthModal();
        return;
    }

    let cart = JSON.parse(localStorage.getItem('joyCart')) || [];
    if (!cart.find(i => i.id === id)) {
        const products = JSON.parse(localStorage.getItem('joyProducts'));
        const product = products.find(p => p.id === id);
        cart.push(product);
        localStorage.setItem('joyCart', JSON.stringify(cart));
        updateCartCount();
        showToast();
    } else {
        alert('Этот товар уже в корзине');
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('joyCart')) || [];
    const el = document.getElementById('cartCount');
    if(el) el.innerText = cart.length;
}

function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');
    if (!container) return;
    
    const cart = JSON.parse(localStorage.getItem('joyCart')) || [];
    container.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">Ваша корзина пуста</p>';
    } else {
        cart.forEach((item, index) => {
            total += +item.price;
            container.innerHTML += `
                <div class="cart-item-row">
                    <img src="${item.image}" class="cart-img" onerror="this.src='img/Frame.png'">
                    <div class="cart-info">
                        <h6>${item.title}</h6>
                        <span>${item.price} руб.</span>
                    </div>
                    <button class="btn btn-sm text-danger" onclick="removeFromCart(${index})">&times;</button>
                </div>`;
        });
    }
    if(totalEl) totalEl.innerText = total;
}

window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem('joyCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('joyCart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function showToast() {
    const t = document.getElementById('toast');
    if(t) { t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000); }
}

/* =================================================================
   ЗАПИСЬ (ОТ КЛИЕНТА К АДМИНУ)
   ================================================================= */
window.submitAppointment = function(e) {
    e.preventDefault();
    const modal = document.getElementById('appointmentModal');
    
    const topic = document.getElementById('appointTopic').value;
    const age = document.getElementById('appointAge').value;
    const reqText = document.getElementById('appointRequest').value;
    const contactMethod = document.getElementById('appointContact').value;
    const phone = document.getElementById('phoneInput').value;
    const nameVal = document.getElementById('appointName').value;
    const isAnon = document.getElementById('noName').checked;

    const currentUser = JSON.parse(localStorage.getItem('joyUser'));
    const userEmail = currentUser ? currentUser.email : 'guest';

    const newApp = {
        id: Date.now(),
        userEmail: userEmail,
        topic, age, reqText, contactMethod, phone,
        name: isAnon ? "Аноним" : nameVal,
        status: 'new',
        time: ''
    };

    let apps = JSON.parse(localStorage.getItem('joyAppointments')) || [];
    apps.push(newApp);
    localStorage.setItem('joyAppointments', JSON.stringify(apps));

    alert('Заявка отправлена! Администратор свяжется с вами.');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

/* =================================================================
   КАБИНЕТ (АДМИН / КЛИЕНТ)
   ================================================================= */
function initCabinet() {
    const user = JSON.parse(localStorage.getItem('joyUser'));
    if (!user) { window.location.href = 'index.html'; return; }

    document.getElementById('userNameDisplay').innerText = user.name;
    document.getElementById('userRoleDisplay').innerText = user.role === 'admin' ? 'Администратор' : 'Клиент';

    if (user.role === 'admin') {
        document.getElementById('adminLinks').style.display = 'block';
        showTab('admin-appointments'); 
    } else {
        document.getElementById('userLinks').style.display = 'block';
        showTab('profile'); 
    }
}

window.showTab = function(tabId) {
    document.querySelectorAll('.content-tab').forEach(t => t.style.display = 'none');
    const tab = document.getElementById('tab-' + tabId);
    if(tab) tab.style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if(tabId === 'admin-appointments') loadAdminApps();
    if(tabId === 'admin-products') loadAdminProducts();
    if(tabId === 'admin-users') loadAdminUsers();
    if(tabId === 'sessions') loadUserApps();
    if(tabId === 'cart') renderCart();
    // ИСПРАВЛЕНО: Теперь данные профиля грузятся сразу при переключении
    if(tabId === 'profile') loadProfileData();
}

/* --- АДМИН: ЗАЯВКИ --- */
function loadAdminApps() {
    const list = document.getElementById('adminAppointList');
    const apps = JSON.parse(localStorage.getItem('joyAppointments')) || [];
    list.innerHTML = apps.length ? '' : 'Нет новых заявок';
    apps.forEach(a => {
        list.innerHTML += `
            <div class="appoint-card">
                <strong>${a.topic}</strong> (Клиент: ${a.name}, Тел: ${a.phone})<br>
                <small>${a.reqText || ''}</small><br>
                ${a.status === 'new' 
                    ? `<div class="mt-2"><input type="datetime-local" id="time-${a.id}"> 
                       <button class="btn btn-sm btn-primary ml-2" onclick="assignTime(${a.id})">Назначить</button></div>` 
                    : `<span class="text-success font-weight-bold">Назначено: ${a.time}</span>`}
            </div>`;
    });
}

window.assignTime = function(id) {
    const tVal = document.getElementById('time-'+id).value;
    if(!tVal) return alert('Выберите время');
    let apps = JSON.parse(localStorage.getItem('joyAppointments')) || [];
    const idx = apps.findIndex(a => a.id === id);
    if(idx !== -1) {
        apps[idx].status = 'assigned';
        apps[idx].time = tVal.replace('T', ' ');
        localStorage.setItem('joyAppointments', JSON.stringify(apps));
        loadAdminApps();
    }
}

/* --- АДМИН: ТОВАРЫ --- */
function loadAdminProducts() {
    const list = document.getElementById('adminProductList');
    const products = JSON.parse(localStorage.getItem('joyProducts')) || [];
    list.innerHTML = '';
    products.forEach((p, index) => {
        list.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><b>${p.title}</b> (${p.price} руб.)</span>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${index})">Удалить</button>
            </li>`;
    });
}

window.addProduct = function(e) {
    e.preventDefault();
    const title = document.getElementById('prodTitle').value;
    const price = document.getElementById('prodPrice').value;
    const desc = document.getElementById('prodDesc').value;
    let products = JSON.parse(localStorage.getItem('joyProducts')) || [];
    products.push({ id: Date.now(), title, price, description: desc, image: "img/Frame.png" });
    localStorage.setItem('joyProducts', JSON.stringify(products));
    document.getElementById('productForm').reset();
    loadAdminProducts();
    alert('Товар добавлен в каталог!');
}

window.deleteProduct = function(index) {
    if(!confirm('Удалить товар?')) return;
    let products = JSON.parse(localStorage.getItem('joyProducts'));
    products.splice(index, 1);
    localStorage.setItem('joyProducts', JSON.stringify(products));
    loadAdminProducts();
}

/* --- АДМИН: ПОЛЬЗОВАТЕЛИ (ВСЕ ПОЛЯ) --- */
function loadAdminUsers() {
    const list = document.getElementById('adminUsersList');
    const users = JSON.parse(localStorage.getItem('joyUsersDB')) || [];
    list.innerHTML = '';
    if (users.length === 0) { list.innerHTML = '<tr><td colspan="5">Нет пользователей</td></tr>'; return; }
    
    users.forEach(u => {
        // ИСПРАВЛЕНО: Отображение всех данных, которые ввел клиент
        list.innerHTML += `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.dob || '-'}</td>
                <td>${u.place || '-'}</td>
                <td>${u.hobby || '-'}</td>
            </tr>`;
    });
}

/* --- КЛИЕНТ: ЗАПИСИ --- */
function loadUserApps() {
    const list = document.getElementById('userAppointList');
    const apps = JSON.parse(localStorage.getItem('joyAppointments')) || [];
    const user = JSON.parse(localStorage.getItem('joyUser'));
    const myApps = apps.filter(a => a.userEmail === user.email || a.name === user.name); 
    if(myApps.length === 0) { list.innerHTML = '<p class="text-muted">У вас нет записей</p>'; return; }
    list.innerHTML = '';
    myApps.forEach(a => {
        list.innerHTML += `
            <div class="session-card p-3 mb-2 border rounded bg-white">
                <h5>${a.topic}</h5>
                <p>Статус: ${a.status === 'assigned' 
                    ? `<b class="text-success">Подтверждено: ${a.time}</b>` 
                    : '<span class="text-warning">Ожидает назначения времени...</span>'}</p>
            </div>`;
    });
}

window.logout = function() { localStorage.removeItem('joyUser'); window.location.href = 'index.html'; }

/* =================================================================
   ПРОФИЛЬ (СОХРАНЕНИЕ В БАЗУ + COOKIE)
   ================================================================= */
window.saveToCookies = function(e) {
    e.preventDefault();
    const name = document.getElementById('cName').value;
    const email = document.getElementById('cEmail').value;
    const dob = document.getElementById('cDob').value;
    const place = document.getElementById('cPlace').value;
    const hobby = document.getElementById('cHobby').value;

    // 1. Сохраняем в COOKIE (Задание 2)
    document.cookie = `joyName=${encodeURIComponent(name)}; path=/; max-age=604800`;
    document.cookie = `joyEmail=${encodeURIComponent(email)}; path=/; max-age=604800`;
    document.cookie = `joyDob=${encodeURIComponent(dob)}; path=/; max-age=604800`;
    document.cookie = `joyPlace=${encodeURIComponent(place)}; path=/; max-age=604800`;
    document.cookie = `joyHobby=${encodeURIComponent(hobby)}; path=/; max-age=604800`;

    // 2. Сохраняем в LOCALSTORAGE (Чтобы данные не терялись и админ их видел)
    const currentUser = JSON.parse(localStorage.getItem('joyUser'));
    if (currentUser) {
        let usersDB = JSON.parse(localStorage.getItem('joyUsersDB')) || [];
        // Находим пользователя в базе по старому email
        const index = usersDB.findIndex(u => u.email === currentUser.email);
        
        if (index !== -1) {
            // Обновляем запись в базе
            usersDB[index].name = name;
            usersDB[index].email = email;
            usersDB[index].dob = dob;
            usersDB[index].place = place;
            usersDB[index].hobby = hobby;
            
            localStorage.setItem('joyUsersDB', JSON.stringify(usersDB));
            
            // Обновляем текущую сессию
            currentUser.name = name;
            currentUser.email = email;
            localStorage.setItem('joyUser', JSON.stringify(currentUser));
        }
    }

    alert('Данные профиля сохранены и обновлены!');
}

// Загрузка данных в поля при входе в профиль
function loadProfileData() {
    let name = "", email = "", dob = "", place = "", hobby = "";

    // 1. Пробуем взять из базы (надежнее)
    const currentUser = JSON.parse(localStorage.getItem('joyUser'));
    if (currentUser) {
        const usersDB = JSON.parse(localStorage.getItem('joyUsersDB')) || [];
        const userInDb = usersDB.find(u => u.email === currentUser.email);
        if (userInDb) {
            name = userInDb.name || "";
            email = userInDb.email || "";
            dob = userInDb.dob || "";
            place = userInDb.place || "";
            hobby = userInDb.hobby || "";
        }
    }

    // 2. Если в базе пусто, пробуем Cookie (для сдачи задания)
    if (!name) {
        const getC = (n) => { const v = document.cookie.match('(^|;) ?' + n + '=([^;]*)(;|$)'); return v ? decodeURIComponent(v[2]) : null; };
        name = getC('joyName') || "";
        email = getC('joyEmail') || "";
        dob = getC('joyDob') || "";
        place = getC('joyPlace') || "";
        hobby = getC('joyHobby') || "";
    }

    // Заполняем поля
    if(document.getElementById('cName')) document.getElementById('cName').value = name;
    if(document.getElementById('cEmail')) document.getElementById('cEmail').value = email;
    if(document.getElementById('cDob')) document.getElementById('cDob').value = dob;
    if(document.getElementById('cPlace')) document.getElementById('cPlace').value = place;
    if(document.getElementById('cHobby')) document.getElementById('cHobby').value = hobby;
}

window.clearCookies = function() {
    // Очистка куки
    ['joyName', 'joyEmail', 'joyDob', 'joyPlace', 'joyHobby'].forEach(k => document.cookie = `${k}=; path=/; max-age=0`);
    
    // Очистка полей формы
    document.getElementById('cName').value = '';
    document.getElementById('cEmail').value = '';
    document.getElementById('cDob').value = '';
    document.getElementById('cPlace').value = '';
    document.getElementById('cHobby').value = '';
    
    alert('Cookie очищены (данные в базе остались для безопасности)');
}