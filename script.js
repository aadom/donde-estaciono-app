// DATOS DE LA APLICACIÓN MEJORADOS
const appData = {
    currentUser: null,
    currentEvent: null,
    currentParking: null,
    currentReservation: null,
    selectedPaymentMethod: 'card',
    currentTheme: 'default',
    parkingConfig: {
        cars: 50,
        pickups: 20,
        large: 10,
        motor: 0,
        carPrice: 7000,
        pickupPrice: 8500,
        largePrice: 10000,
        motorPrice: 3000
    },
    vehicleTypes: {
        car: { label: 'Autos', available: true, count: 50, icon: '🚗' },
        pickup: { label: '4x4', available: true, count: 20, icon: '🛻' },
        suv: { label: 'Pickups', available: true, count: 15, icon: '🚚' },
        motor: { label: 'Motos', available: false, count: 0, icon: '🏍️' }
    }
};

// EVENTOS PRECARGADOS
const eventsData = [{
        id: 1,
        name: "Concierto Coldplay",
        location: "Estadio River Plate",
        date: "25 Nov 2024 - 21:00",
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        type: "concierto",
        icon: "🎵",
        category: "música",
        lat: -34.6037,
        lng: -58.3816
    },
    {
        id: 2,
        name: "Lollapalooza Argentina",
        location: "Hipódromo de San Isidro",
        date: "30 Mar 2024 - 12:00",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        type: "festival",
        icon: "🎪",
        category: "festival",
        lat: -34.6037,
        lng: -58.3816
    },
    {
        id: 3,
        name: "Taylor Swift - The Eras Tour",
        location: "Estadio River Plate",
        date: "10 Nov 2024 - 20:30",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        type: "concierto",
        icon: "🎵",
        category: "música",
        lat: -34.6037,
        lng: -58.3816
    }
];

// ESTACIONAMIENTOS PRECARGADOS
const parkingsData = [{
        id: 1,
        name: "Parking Premium River",
        address: "Av. Pres. Figueroa Alcorta 7597",
        distance: "1.2 km",
        price: 7000,
        rating: 4.8,
        reviews: 500,
        type: "premium",
        lat: -34.5456,
        lng: -58.4491,
        spots: 45
    },
    {
        id: 2,
        name: "Estacionamiento Central",
        address: "Av. Libertador 7421",
        distance: "0.8 km",
        price: 5500,
        rating: 4.5,
        reviews: 320,
        type: "standard",
        lat: -34.5478,
        lng: -58.4512,
        spots: 32
    },
    {
        id: 3,
        name: "Garaje Seguro",
        address: "Av. Monroe 3456",
        distance: "1.5 km",
        price: 6000,
        rating: 4.9,
        reviews: 150,
        type: "premium",
        lat: -34.5432,
        lng: -58.4478,
        spots: 28
    }
];

// VARIABLES GLOBALES
let map = null;
let mapMarkers = L.layerGroup();
let adminChart = null;
let reportsCharts = [];

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar todas las pantallas excepto login
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id !== 'loginScreen') {
            screen.classList.add('hidden');
        }
    });

    // Inicializar componentes
    initializeSearch();
    setupEventListeners();
    loadEventsGallery();

    // Mensaje de bienvenida del chatbot
    setTimeout(() => {
        if (document.getElementById('chatbotMessages')) {
            addChatMessage("¡Hola! Soy tu asistente de ¿Donde Estaciono?. Selecciona una opción rápida o escribe tu consulta.", 'bot');
        }
    }, 2000);
});

// CONFIGURACIÓN DE EVENT LISTENERS
function setupEventListeners() {
    // Cierre del menú con la X
    document.getElementById('closeMenu').addEventListener('click', toggleMenu);

    // Teclas de escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal('cancelModal');
            document.getElementById('chatbotContainer').classList.remove('active');
            toggleMenu();
        }
    });

    // Enter para enviar mensajes en el chatbot
    document.getElementById('chatbotInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatbotMessage();
        }
    });

    // Cerrar modales haciendo click fuera
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// FUNCIONES DE NAVEGACIÓN
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    const targetScreen = document.getElementById(screenName + 'Screen');
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }

    // Inicializar componentes específicos de cada pantalla
    switch (screenName) {
        case 'welcome':
            loadEventsGallery();
            loadFeaturedEvents();
            break;
        case 'results':
            initializeMap();
            break;
        case 'details':
            generateReservationQR();
            break;
        case 'success':
            generateSuccessQR();
            break;
        case 'reports':
            initializeReportsCharts();
            break;
    }
}

function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');

    if (sideMenu.classList.contains('active')) {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        sideMenu.classList.add('active');
        overlay.classList.add('active');
    }
}

function navigateTo(section) {
    toggleMenu();

    switch (section) {
        case 'welcome':
            showScreen('welcome');
            break;
        case 'profile':
            showScreen('profile');
            break;
        case 'reports':
            showScreen('reports');
            break;
        case 'settings':
            showScreen('settings');
            break;
        case 'help':
            toggleChatbot();
            break;
        case 'about':
            showAbout();
            break;
    }
}

// NUEVA FUNCIÓN: CARGAR GALERÍA DE EVENTOS
function loadEventsGallery() {
    const gallery = document.getElementById('eventsGallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    eventsData.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.onclick = () => selectEvent(event.id);

        eventCard.innerHTML = `
            <div class="event-image" style="background-image: url('${event.image}')">
                <div class="event-badge">${event.icon}</div>
            </div>
            <div class="event-content">
                <div class="event-name">${event.name}</div>
                <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${event.location}
                </div>
                <div class="event-date">
                    <i class="fas fa-calendar"></i>
                    ${event.date}
                </div>
            </div>
        `;

        gallery.appendChild(eventCard);
    });
}

// PANTALLA 0: LOGIN
function togglePassword() {
    const passwordInput = document.getElementById('loginPassword');
    const eyeIcon = document.querySelector('.show-password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}

function login() {
    const user = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPassword').value;

    if (user && password) {
        // Simular carga
        showLoading('Iniciando sesión...');

        setTimeout(() => {
            hideLoading();

            appData.currentUser = {
                username: user,
                name: "Juan Sánchez",
                email: user.includes('@') ? user : user + "@email.com",
                isAdmin: user.toLowerCase().includes('admin')
            };

            showScreen('welcome');
            loadEventsGallery();
            loadFeaturedEvents();

            if (appData.currentUser.isAdmin) {
                document.getElementById('adminMode').checked = true;
                toggleAdminMode();
            }

            showToast('¡Bienvenido ' + appData.currentUser.name + '!', 'success');
        }, 1500);
    } else {
        showToast('Por favor completa usuario y contraseña', 'error');
    }
}

function showRegister() {
    showToast('Funcionalidad de registro - Próximamente', 'info');
}

function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        appData.currentUser = null;
        showScreen('login');
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPassword').value = '';
        showToast('Sesión cerrada correctamente', 'info');
    }
}

// PANTALLA 1: BIENVENIDA
function loadFeaturedEvents() {
    const tabContent = document.getElementById('tabContent');

    let content = `
        <div class="events-banner">
            <div class="banner-title">🎉 Eventos en Tendencia</div>
            <div class="banner-slider">
                <img src="https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Concierto" class="banner-image">
                <div class="banner-content">
                    <div class="event-name">Concierto Coldplay</div>
                    <div class="event-date">25 Noviembre - Estadio River Plate</div>
                </div>
            </div>
        </div>
        <div class="events-grid">
    `;

    eventsData.forEach(event => {
        content += `
            <div class="event-card" onclick="selectEvent(${event.id})">
                <div class="event-image" style="background-image: url('${event.image}')">
                    <div class="event-badge">${event.icon}</div>
                </div>
                <div class="event-content">
                    <div class="event-name">${event.name}</div>
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${event.location}
                    </div>
                    <div class="event-date">
                        <i class="fas fa-calendar"></i>
                        ${event.date}
                    </div>
                </div>
            </div>
        `;
    });

    content += `</div>`;
    tabContent.innerHTML = content;
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    event.target.classList.add('active');

    const tabContent = document.getElementById('tabContent');

    if (tabName === 'favoritos') {
        loadFeaturedEvents();
    } else {
        tabContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-${getTabIcon(tabName)}"></i>
                <h3>${getTabTitle(tabName)}</h3>
                <p>${getTabDescription(tabName)}</p>
            </div>
        `;
    }
}

function getTabIcon(tabName) {
    const icons = {
        'historial': 'history',
        'seguidos': 'heart'
    };
    return icons[tabName] || 'star';
}

function getTabTitle(tabName) {
    const titles = {
        'historial': 'Historial de Eventos',
        'seguidos': 'Artistas Seguidos'
    };
    return titles[tabName] || 'Tus Favoritos';
}

function getTabDescription(tabName) {
    const descriptions = {
        'historial': 'Aquí verás todos los eventos a los que has asistido',
        'seguidos': 'Mantente actualizado con tus artistas favoritos'
    };
    return descriptions[tabName] || 'Tus eventos y lugares favoritos aparecerán aquí';
}

// BÚSQUEDA
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();

        if (query.length === 0) {
            searchSuggestions.classList.remove('active');
            return;
        }

        const matches = eventsData.filter(event =>
            event.name.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query) ||
            event.type.toLowerCase().includes(query)
        );

        showSearchSuggestions(matches, query);
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-box')) {
            searchSuggestions.classList.remove('active');
        }
    });
}

function showSearchSuggestions(matches, query) {
    const searchSuggestions = document.getElementById('searchSuggestions');
    searchSuggestions.innerHTML = '';

    if (matches.length === 0) {
        searchSuggestions.innerHTML = `
            <div class="suggestion-item">
                <div class="suggestion-icon">🔍</div>
                <div class="suggestion-text">
                    <h4>No se encontraron resultados</h4>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            </div>
        `;
    } else {
        matches.forEach(event => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion-item';
            suggestion.innerHTML = `
                <div class="suggestion-icon">${event.icon}</div>
                <div class="suggestion-text">
                    <h4>${event.name}</h4>
                    <p>${event.location} • ${event.date}</p>
                </div>
            `;

            suggestion.addEventListener('click', () => {
                document.getElementById('searchInput').value = event.name;
                searchSuggestions.classList.remove('active');
                selectEvent(event.id);
            });

            searchSuggestions.appendChild(suggestion);
        });
    }

    searchSuggestions.classList.add('active');
}

// PANTALLA 2: RESULTADOS CON MAPA
function selectEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;

    appData.currentEvent = event;

    document.getElementById('resultsTitle').textContent = `Estacionamientos - ${event.location}`;
    document.getElementById('resultsCount').textContent = `${parkingsData.length} estacionamientos encontrados`;

    loadParkingsList();
    showScreen('results');

    // Inicializar mapa si no está inicializado
    if (!map) {
        initializeMap();
    }

    // Centrar mapa en el evento
    map.setView([event.lat, event.lng], 15);
    updateMapMarkers(event);
}

function initializeMap() {
    if (map) return;

    // Crear mapa centrado en Buenos Aires
    map = L.map('map').setView([-34.6037, -58.3816], 13);

    // Agregar capa de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Agregar grupo de marcadores
    mapMarkers.addTo(map);
}

function updateMapMarkers(event) {
    // Limpiar marcadores anteriores
    mapMarkers.clearLayers();

    // Agregar marcador del evento (estadio)
    const eventIcon = L.divIcon({
        html: '<div class="event-marker">🏟️</div>',
        iconSize: [30, 30],
        className: 'event-marker'
    });

    L.marker([event.lat, event.lng], { icon: eventIcon })
        .addTo(mapMarkers)
        .bindPopup(`
            <strong>${event.name}</strong><br>
            ${event.location}<br>
            ${event.date}
        `);

    // Agregar marcadores de estacionamientos
    parkingsData.forEach(parking => {
        const parkingIcon = L.divIcon({
            html: `<div class="parking-marker">🅿️</div>`,
            iconSize: [25, 25],
            className: 'parking-marker'
        });

        L.marker([parking.lat, parking.lng], { icon: parkingIcon })
            .addTo(mapMarkers)
            .bindPopup(`
                <strong>${parking.name}</strong><br>
                📍 ${parking.distance}<br>
                ⭐ ${parking.rating} (${parking.reviews} reseñas)<br>
                💰 $${parking.price}<br>
                🚗 ${parking.spots} plazas disponibles
            `)
            .on('click', () => {
                selectParking(parking.id);
            });
    });
}

function loadParkingsList() {
    const parkingsList = document.getElementById('parkingsList');
    parkingsList.innerHTML = '';

    parkingsData.forEach(parking => {
        const parkingCard = document.createElement('div');
        parkingCard.className = `parking-card ${parking.type === 'premium' ? 'featured' : ''}`;
        parkingCard.innerHTML = `
            <div class="parking-header">
                <div class="parking-title">
                    <h3 class="parking-name">${parking.name}</h3>
                    <div class="parking-price">$${parking.price.toLocaleString()}</div>
                </div>
                <div class="parking-rating">
                    <span class="stars">${'★'.repeat(Math.floor(parking.rating))}${'☆'.repeat(5-Math.floor(parking.rating))}</span>
                    <span class="rating">${parking.rating} (${parking.reviews} reseñas)</span>
                </div>
            </div>
            <div class="parking-details">
                <div class="parking-address">
                    <i class="fas fa-map-marker-alt"></i>
                    ${parking.address}
                </div>
                <div class="parking-distance">
                    <i class="fas fa-route"></i>
                    ${parking.distance} del evento
                </div>
            </div>
            <div class="parking-actions">
                <button class="btn btn-secondary" onclick="viewOnMap(${parking.lat}, ${parking.lng})">
                    <i class="fas fa-map"></i>
                    Ver en mapa
                </button>
                <button class="btn btn-primary" onclick="selectParking(${parking.id})">
                    <i class="fas fa-check"></i>
                    Seleccionar
                </button>
            </div>
        `;

        parkingsList.appendChild(parkingCard);
    });
}

function selectParking(parkingId) {
    const parking = parkingsData.find(p => p.id === parkingId);
    if (!parking) return;

    appData.currentParking = parking;

    // Actualizar información en pantalla de pago
    document.getElementById('paymentEventName').textContent = appData.currentEvent.name;
    document.getElementById('paymentEventDate').textContent = appData.currentEvent.date;
    document.getElementById('paymentParkingName').textContent = parking.name;
    document.getElementById('paymentParkingAddress').textContent = parking.address;
    document.getElementById('paymentParkingDistance').textContent = `📍 ${parking.distance} del evento`;
    document.getElementById('paymentTotal').textContent = `$${parking.price.toLocaleString()}`;

    setupPaymentOptions();
    showScreen('payment');
}

function viewOnMap(lat, lng) {
    if (map) {
        map.setView([lat, lng], 16);
    }
}

function toggleFilters() {
    showToast('Filtros: Precio • Distancia • Calificación • Tipo', 'info');
}

function toggleSort() {
    showToast('Ordenar por: Precio • Distancia • Calificación', 'info');
}

// PANTALLA 3: PAGO MEJORADA
function setupPaymentOptions() {
    const paymentMethods = document.querySelectorAll('.payment-method-card');

    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const methodType = this.dataset.method;
            selectPaymentMethod(methodType);
        });
    });
}

function selectPaymentMethod(methodType) {
    appData.selectedPaymentMethod = methodType;

    // Actualizar UI
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('active');
        const checkIcon = card.querySelector('.method-check i');
        checkIcon.className = 'fas fa-circle';
    });

    const selectedCard = document.querySelector(`[data-method="${methodType}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
        const checkIcon = selectedCard.querySelector('.method-check i');
        checkIcon.className = 'fas fa-check-circle';
    }

    // Mostrar/ocultar detalles según el método
    document.querySelectorAll('.method-details').forEach(details => {
        details.style.display = 'none';
    });

    if (methodType === 'card') {
        const cardDetails = document.querySelector('[data-method="card"] .method-details');
        if (cardDetails) {
            cardDetails.style.display = 'block';
        }
    }
}

function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/.{1,4}/g);
    let formattedValue = matches ? matches.join(' ') : value;
    input.value = formattedValue;
}

function formatExpiryDate(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

function changeVehicle() {
    showToast('Seleccionar vehículo - Próximamente', 'info');
}

function processPayment() {
    // Validaciones básicas
    if (appData.selectedPaymentMethod === 'card') {
        const cardNumber = document.querySelector('input[placeholder="1234 5678 9012 3456"]').value;
        const expiry = document.querySelector('input[placeholder="MM/AA"]').value;
        const cvv = document.querySelector('.cvv-input').value;
        const name = document.querySelector('input[placeholder="Como figura en la tarjeta"]').value;

        if (!cardNumber || !expiry || !cvv || !name) {
            showToast("Por favor completa todos los datos de la tarjeta", 'error');
            return;
        }

        if (cardNumber.replace(/\s/g, '').length !== 16) {
            showToast("El número de tarjeta debe tener 16 dígitos", 'error');
            return;
        }

        if (!expiry.match(/^\d{2}\/\d{2}$/)) {
            showToast("Formato de fecha inválido (MM/AA)", 'error');
            return;
        }
    }

    showPaymentLoading();

    // Simular procesamiento de pago
    setTimeout(() => {
        hidePaymentLoading();
        showSuccessScreen();
    }, 2000);
}

function showPaymentLoading() {
    const payBtn = document.querySelector('.pay-button');
    payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando pago...';
    payBtn.disabled = true;
}

function hidePaymentLoading() {
    const payBtn = document.querySelector('.pay-button');
    payBtn.innerHTML = '<i class="fas fa-lock"></i> Confirmar y Pagar $7.000';
    payBtn.disabled = false;
}

// NUEVO: PANTALLA DE PAGO EXITOSO
function showSuccessScreen() {
    // Generar datos de reserva
    const reservationId = "PE-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

    appData.currentReservation = {
        reservationId: reservationId,
        event: appData.currentEvent.name,
        parking: appData.currentParking.name,
        date: appData.currentEvent.date,
        vehicle: "Toyota Corolla (ABC 123)",
        price: appData.currentParking.price,
        address: appData.currentParking.address,
        validUntil: "26/11/2024 02:00"
    };

    // Actualizar información en pantalla de éxito
    document.getElementById('successReservationCode').textContent = reservationId;
    document.getElementById('successEventName').textContent = appData.currentEvent.name;
    document.getElementById('successParkingName').textContent = appData.currentParking.name;
    document.getElementById('successEventDate').textContent = appData.currentEvent.date;
    document.getElementById('successTotalAmount').textContent = `$${appData.currentParking.price.toLocaleString()}`;

    showScreen('success');
    generateSuccessQR();
}

// NUEVO: GENERAR QR PARA PANTALLA DE ÉXITO
function generateSuccessQR() {
    const qrData = JSON.stringify({
        reservationId: appData.currentReservation.reservationId,
        event: appData.currentEvent.name,
        parking: appData.currentParking.name,
        date: appData.currentEvent.date,
        validUntil: "26/11/2024 02:00"
    });

    const qrContainer = document.getElementById('successQRCode');
    qrContainer.innerHTML = '';

    // Crear un QR real usando una API externa
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`;

    const qrImage = document.createElement('img');
    qrImage.src = qrUrl;
    qrImage.alt = 'Código QR de reserva';
    qrImage.onerror = function() {
        // Fallback si la API falla
        qrContainer.innerHTML = '<div style="color: red; text-align: center;">Error QR<br><small>Intenta nuevamente</small></div>';
    };

    qrContainer.appendChild(qrImage);
}

// NUEVO: DESCARGAR QR DE ÉXITO
function downloadSuccessQR() {
    showToast('📄 Descargando código QR...', 'info');
    setTimeout(() => {
        showToast('✅ Código QR descargado exitosamente', 'success');
    }, 1500);
}

// NUEVO: COMPARTIR QR DE ÉXITO
function shareSuccessQR() {
    const shareText = `Mi reserva en ¿Donde Estaciono?\nEvento: ${appData.currentEvent.name}\nEstacionamiento: ${appData.currentParking.name}\nCódigo: ${appData.currentReservation.reservationId}\nMuestra este QR en el estacionamiento`;

    if (navigator.share) {
        navigator.share({
            title: 'Mi Reserva - ¿Donde Estaciono?',
            text: shareText
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('✅ Información copiada al portapapeles!', 'success');
        });
    }
}

// PANTALLA 4: PERFIL MEJORADO CON ESCANER QR
function toggleAdminMode() {
    const adminMode = document.getElementById('adminMode').checked;
    const userSection = document.getElementById('userSection');
    const adminSection = document.getElementById('adminSection');
    const userBadge = document.querySelector('.badge.user');
    const adminBadge = document.querySelector('.badge.admin');
    const qrScannerSection = document.getElementById('qrScannerSection');

    if (adminMode) {
        userSection.classList.add('hidden');
        adminSection.classList.remove('hidden');
        qrScannerSection.classList.remove('hidden');
        userBadge.classList.add('hidden');
        adminBadge.classList.remove('hidden');
        loadAdminContent();
        initializeAdminChart();
        showToast('Modo administrador activado', 'success');
    } else {
        userSection.classList.remove('hidden');
        adminSection.classList.add('hidden');
        qrScannerSection.classList.add('hidden');
        userBadge.classList.remove('hidden');
        adminBadge.classList.add('hidden');
        showToast('Modo usuario activado', 'info');
    }
}

function loadAdminContent() {
    // Cargar configuración actual
    document.getElementById('carsCount').textContent = appData.parkingConfig.cars;
    document.getElementById('pickupsCount').textContent = appData.parkingConfig.pickups;
    document.getElementById('largeCount').textContent = appData.parkingConfig.large;
    document.getElementById('motorCount').textContent = appData.parkingConfig.motor;
    document.getElementById('carPrice').value = appData.parkingConfig.carPrice;
    document.getElementById('pickupPrice').value = appData.parkingConfig.pickupPrice;
    document.getElementById('largePrice').value = appData.parkingConfig.largePrice;
    document.getElementById('motorPrice').value = appData.parkingConfig.motorPrice;

    // Actualizar iconos de vehículos
    updateVehicleIcons();
}

// NUEVO: ABRIR ESCANER QR
function openQRScanner() {
    showScreen('scanner');
}

// NUEVO: SIMULAR ESCANEO QR
function simulateQRScan() {
    showToast('🔍 Escaneando código QR...', 'info');
    setTimeout(() => {
        showToast('✅ Código QR validado correctamente', 'success');
        setTimeout(() => {
            showScreen('profile');
        }, 1500);
    }, 2000);
}

function toggleVehicleAvailability(type) {
    appData.vehicleTypes[type].available = !appData.vehicleTypes[type].available;
    updateVehicleIcons();
    updateAdminChart();
    showToast(`${appData.vehicleTypes[type].label} ${appData.vehicleTypes[type].available ? 'disponible' : 'no disponible'}`, 'info');
}

function updateVehicleIcons() {
    Object.keys(appData.vehicleTypes).forEach(type => {
        const vehicle = appData.vehicleTypes[type];
        const iconElement = document.querySelector(`.vehicle-icon-admin[data-type="${type}"]`);
        if (iconElement) {
            iconElement.className = `vehicle-icon-admin ${vehicle.available ? 'available' : 'unavailable'}`;
            iconElement.setAttribute('data-type', type);
            iconElement.querySelector('.vehicle-count').textContent = vehicle.count;
        }
    });
}

// NUEVO: AGREGAR CONTADOR PARA MOTOS
function changeCount(type, change) {
    const countElement = document.getElementById(`${type}Count`);
    let currentCount = parseInt(countElement.textContent);
    let newCount = currentCount + change;

    if (newCount >= 0) {
        countElement.textContent = newCount;
        appData.parkingConfig[type] = newCount;
        updateParkingVisualization();
    }
}

function updateParkingVisualization() {
    const totalSpots = appData.parkingConfig.cars + appData.parkingConfig.pickups + appData.parkingConfig.large + appData.parkingConfig.motor;
    const occupiedSpots = Math.floor(totalSpots * 0.3);

    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = occupiedSpots;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = `$${(occupiedSpots * appData.parkingConfig.carPrice).toLocaleString()}`;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = `${Math.round((occupiedSpots / totalSpots) * 100)}%`;
}

function initializeAdminChart() {
    const ctx = document.getElementById('adminChart').getContext('2d');

    if (adminChart) {
        adminChart.destroy();
    }

    const labels = Object.keys(appData.vehicleTypes).map(key => appData.vehicleTypes[key].label);
    const data = Object.keys(appData.vehicleTypes).map(key => appData.vehicleTypes[key].count);
    const backgroundColors = Object.keys(appData.vehicleTypes).map(key =>
        appData.vehicleTypes[key].available ? '#27ae60' : '#e53e3e'
    );

    adminChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Plazas Disponibles',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateAdminChart() {
    if (adminChart) {
        const data = Object.keys(appData.vehicleTypes).map(key => appData.vehicleTypes[key].count);
        const backgroundColors = Object.keys(appData.vehicleTypes).map(key =>
            appData.vehicleTypes[key].available ? '#27ae60' : '#e53e3e'
        );

        adminChart.data.datasets[0].data = data;
        adminChart.data.datasets[0].backgroundColor = backgroundColors;
        adminChart.data.datasets[0].borderColor = backgroundColors;
        adminChart.update();
    }
}

function saveParkingConfig() {
    appData.parkingConfig.carPrice = parseInt(document.getElementById('carPrice').value);
    appData.parkingConfig.pickupPrice = parseInt(document.getElementById('pickupPrice').value);
    appData.parkingConfig.largePrice = parseInt(document.getElementById('largePrice').value);
    appData.parkingConfig.motorPrice = parseInt(document.getElementById('motorPrice').value);

    showToast('✅ Configuración guardada exitosamente!', 'success');
    updateParkingVisualization();
}

function addVehicle() {
    showToast('Agregar vehículo - Próximamente', 'info');
}

function editVehicle(vehicleId) {
    showToast(`Editando vehículo ID: ${vehicleId}`, 'info');
}

function addPaymentMethod() {
    showToast('Agregando método de pago...', 'info');
}

function showAllReservations() {
    showToast('Mostrando todas las reservas...', 'info');
}

function showReservationDetails(reservationId) {
    showScreen('details');
}

// PANTALLA 5: DETALLES DE RESERVA
function shareReservation() {
    const shareText = `Mi reserva en ¿Donde Estaciono?\nEvento: ${appData.currentEvent?.name || 'Concierto Coldplay'}\nEstacionamiento: ${appData.currentParking?.name || 'Premium River Plate'}\nCódigo: ${appData.currentReservation?.reservationId || 'PE-2024-7892'}`;

    if (navigator.share) {
        navigator.share({
            title: 'Mi Reserva - ¿Donde Estaciono?',
            text: shareText
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('✅ Reserva copiada al portapapeles!', 'success');
        });
    }
}

function refreshQR() {
    showToast('Actualizando código QR...', 'info');
    generateReservationQR();
}

function generateReservationQR() {
    const qrData = JSON.stringify({
        reservationId: (appData.currentReservation && appData.currentReservation.reservationId) || "PE-2024-7892",
        event: (appData.currentEvent && appData.currentEvent.name) || "Concierto Coldplay",
        parking: (appData.currentParking && appData.currentParking.name) || "Premium River Plate",
        date: (appData.currentEvent && appData.currentEvent.date) || "25 Nov 2024",
        vehicle: "Toyota Corolla (ABC 123)",
        validUntil: "26/11/2024 02:00"
    });

    const qrContainer = document.getElementById('qrCode');
    qrContainer.innerHTML = '';

    // Crear un QR real usando una API externa
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    const qrImage = document.createElement('img');
    qrImage.src = qrUrl;
    qrImage.alt = 'Código QR de reserva';
    qrImage.onerror = function() {
        // Fallback si la API falla
        qrContainer.innerHTML = '<div style="color: red; text-align: center;">Error QR<br><small>Intenta nuevamente</small></div>';
    };

    qrContainer.appendChild(qrImage);
}

function openDirections() {
    const address = encodeURIComponent("Av. Pres. Figueroa Alcorta 7597, C1428 CABA");
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(mapsUrl, '_blank');
}

function addToCalendar() {
    showToast('Evento agregado a tu calendario!', 'success');
}

function downloadTicket() {
    showToast('Descargando comprobante en PDF...', 'info');
}

function contactSupport() {
    toggleChatbot();
}

function cancelReservation() {
    document.getElementById('cancelModal').classList.add('active');
}

function confirmCancel() {
    showToast('Reserva cancelada exitosamente. Reembolso procesado.', 'success');
    closeModal('cancelModal');
    updateReservationStatus('cancelled');
    setTimeout(() => {
        showScreen('profile');
    }, 1500);
}

function updateReservationStatus(status) {
    const statusBadge = document.querySelector('.status-badge');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (status === 'cancelled') {
        statusBadge.innerHTML = '<i class="fas fa-times-circle"></i><span>Reserva Cancelada</span>';
        statusBadge.className = 'status-badge cancelled';
        statusBadge.style.background = 'var(--danger)';

        timelineItems.forEach(item => item.classList.remove('active'));
    }
}

// PANTALLA 8: REPORTES MEJORADOS
function exportReport() {
    showToast('Exportando reporte en PDF...', 'info');
}

function clearFilters() {
    document.getElementById('periodSelect').value = 'month';
    document.getElementById('parkingSelect').value = 'all';
    document.getElementById('eventTypeSelect').value = 'all';
    document.getElementById('sortSelect').value = 'revenue';
    showToast('Filtros limpiados', 'success');
}

function applyFilters() {
    showToast('Aplicando filtros...', 'info');
    updateCharts();
}

function updateCharts() {
    showToast('Actualizando gráficos...', 'info');
    // Aquí iría la lógica para actualizar los gráficos
}

function viewEventDetails(eventId) {
    showToast(`Viendo detalles del evento ${eventId}`, 'info');
}

function showAllEvents() {
    showToast('Mostrando todos los eventos', 'info');
}

function initializeReportsCharts() {
    // Limpiar gráficos anteriores
    reportsCharts.forEach(chart => {
        if (chart) chart.destroy();
    });
    reportsCharts = [];

    // Gráfico de reservas por día
    const bookingsCtx = document.getElementById('bookingsChart').getContext('2d');
    const bookingsChart = new Chart(bookingsCtx, {
        type: 'line',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
            datasets: [{
                label: 'Este Mes',
                data: [45, 52, 38, 61, 55, 58, 63, 70, 65, 72, 68, 75, 80, 78, 82, 85, 88, 90, 87, 92, 95, 98, 102, 105, 110, 108, 112, 115, 118, 120],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Mes Anterior',
                data: [40, 45, 35, 50, 48, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 108, 110, 112],
                borderColor: '#e9ecef',
                backgroundColor: 'transparent',
                tension: 0.4,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    reportsCharts.push(bookingsChart);

    // Gráfico de distribución por tipo
    const distributionCtx = document.getElementById('distributionChart').getContext('2d');
    const distributionChart = new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Conciertos', 'Deportes', 'Festivales', 'Teatro', 'Otros'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    '#3498db',
                    '#27ae60',
                    '#f39c12',
                    '#9b59b6',
                    '#e74c3c'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    reportsCharts.push(distributionChart);

    // Gráfico de ingresos por estacionamiento
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: ['Premium River', 'Central', 'Garaje Seguro', 'Norte', 'Sur'],
            datasets: [{
                label: 'Ingresos ($)',
                data: [3150000, 2450000, 1890000, 1560000, 1320000],
                backgroundColor: '#27ae60'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    reportsCharts.push(revenueChart);

    // Gráfico de tendencia mensual
    const trendCtx = document.getElementById('monthlyTrendChart').getContext('2d');
    const trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Ingresos 2024',
                data: [850000, 920000, 780000, 950000, 1100000, 1250000, 1350000, 1420000, 1380000, 1450000, 1245000, 980000],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    reportsCharts.push(trendChart);
}

// PANTALLA 9: CONFIGURACIÓN
function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    appData.currentTheme = theme;

    // Actualizar opciones activas
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');

    showToast(`Tema ${getThemeName(theme)} aplicado`, 'success');
}

function getThemeName(theme) {
    const names = {
        'default': 'Azul Original',
        'dark': 'Oscuro',
        'green': 'Verde',
        'purple': 'Púrpura'
    };
    return names[theme] || theme;
}

// CHATBOT DE SOPORTE IA
let chatHistory = [];

function toggleChatbot() {
    const chatbot = document.getElementById('chatbotContainer');
    chatbot.classList.toggle('active');

    if (chatbot.classList.contains('active')) {
        document.getElementById('chatbotInput').focus();
    }
}

function selectQuickOption(option) {
    const messages = {
        'reserva': "Para ayudarte con tu reserva, necesito:\n1. Tu número de reserva\n2. La fecha del evento\n¿Cuál es tu número de reserva?",
        'pago': "Entiendo que tienes una consulta sobre pagos. ¿El problema es con:\nA) Método de pago rechazado\nB) Reembolso pendiente\nC) Facturación\nSelecciona A, B o C",
        'qr': "Sobre códigos QR:\n- El QR se genera automáticamente al confirmar la reserva\n- Si no se muestra, prueba refrescando la pantalla\n- Debes mostrarlo al ingresar al estacionamiento\n¿Necesitas regenerar tu código QR?",
        'admin': "Para acceder al modo administrador:\n1. Ve a tu perfil\n2. Activa el switch 'Modo Admin'\n3. Podrás gestionar plazas y ver reportes\n¿Necesitas ayuda con alguna función específica del admin?"
    };

    addChatMessage(messages[option], 'bot');
}

function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();

    if (message === '') return;

    addChatMessage(message, 'user');
    input.value = '';

    // Simular typing
    const typingIndicator = addTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator(typingIndicator);
        const response = generateBotResponse(message);
        addChatMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message;

    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    chatHistory.push({ sender, message, timestamp: new Date() });
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return typingDiv;
}

function removeTypingIndicator(typingElement) {
    if (typingElement && typingElement.parentNode) {
        typingElement.parentNode.removeChild(typingElement);
    }
}

function generateBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hola') || lowerMessage.includes('buenas')) {
        return "¡Hola! Soy tu asistente de ¿Donde Estaciono?. ¿Tu consulta es sobre: reservas, pagos, problemas técnicos u otra cosa?";
    }

    if (lowerMessage.includes('reserva') || lowerMessage.includes('estacionamiento')) {
        return "Para ayudarte con tu reserva, necesito:\n1. Tu número de reserva\n2. La fecha del evento\n¿Cuál es tu número de reserva?";
    }

    if (lowerMessage.includes('pago') || lowerMessage.includes('tarjeta') || lowerMessage.includes('mercado pago')) {
        return "Entiendo que tienes una consulta sobre pagos. ¿El problema es con:\nA) Método de pago rechazado\nB) Reembolso pendiente\nC) Facturación\nSelecciona A, B o C";
    }

    if (lowerMessage.includes('problema') || lowerMessage.includes('error') || lowerMessage.includes('no funciona')) {
        return "Lamento los inconvenientes. Para resolverlo rápido necesito:\n1. ¿Qué pantalla o función específica tiene el problema?\n2. ¿Cuándo empezó el problema?\n¿Podrías darme esos detalles?";
    }

    if (lowerMessage.includes('qr') || lowerMessage.includes('código')) {
        return "Sobre códigos QR:\n- El QR se genera automáticamente al confirmar la reserva\n- Si no se muestra, prueba refrescando la pantalla\n- Debes mostrarlo al ingresar al estacionamiento\n¿Necesitas regenerar tu código QR?";
    }

    if (lowerMessage.includes('admin') || lowerMessage.includes('administrador')) {
        return "Para acceder al modo administrador:\n1. Ve a tu perfil\n2. Activa el switch 'Modo Admin'\n3. Podrás gestionar plazas y ver reportes\n¿Necesitas ayuda con alguna función específica del admin?";
    }

    if (userMessage.length > 50) {
        return "Entiendo tu situación. Para ayudarte mejor necesito información específica:\n- Número de reserva (si aplica)\n- ¿Cuál es exactamente el problema?\n- ¿En qué pantalla ocurre?\nCon estos datos te ayudo más rápido.";
    }

    return "¡Hola! Soy tu asistente de ¿Donde Estaciono?. ¿Tu consulta es sobre:\n- Reservas y estacionamientos\n- Problemas con pagos\n- Códigos QR y acceso\n- Modo administrador\n- Otros temas\n¿Cuál de estos describe mejor tu consulta?";
}

// FUNCIONES GENERALES Y UTILIDADES
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function showLoading(message = 'Cargando...') {
    // En una aplicación real, aquí se mostraría un spinner de carga
    console.log('Loading:', message);
}

function hideLoading() {
    // Ocultar spinner de carga
    console.log('Loading complete');
}

function showToast(message, type = 'info') {
    // Crear toast notification
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    // Remover después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function showAbout() {
    showToast('¿Donde Estaciono? v2.0\nTu solución de estacionamiento para eventos', 'info');
}

// ANIMACIONES CSS PARA TOAST
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);