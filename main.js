// Estado del carrito
let carrito = {};

// Elementos del DOM
const domElements = {
    cartBtn: document.querySelector('.cart-btn'),
    cartBadge: document.getElementById('contador-carrito'),
    cartSidebar: document.getElementById('menuCarrito'),
    cartList: document.getElementById('lista-carrito'),
    cartTotal: document.getElementById('total-carrito'),
    emptyCartBtn: document.getElementById('btnVaciar')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
});

function toggleCarrito() {
    domElements.cartSidebar.classList.toggle('active');
    document.body.style.overflow = domElements.cartSidebar.classList.contains('active') ? 'hidden' : '';
}

function agregarAlCarrito(id, nombre, precio) {
    if (carrito[id]) {
        carrito[id].cantidad++;
    } else {
        carrito[id] = { nombre, cantidad: 1, precio };
    }
    actualizarCarrito();
    mostrarNotificacion(nombre, carrito[id].cantidad); // Nueva notificación detallada
}


function actualizarCarrito() {
    const listaCarrito = domElements.cartList;
    const totalCarrito = domElements.cartTotal;
    const contadorCarrito = domElements.cartBadge;
    const btnVaciar = domElements.emptyCartBtn;
    let total = 0;
    let cantidadTotal = 0;
    let mensajeDescuento = '';

    if (listaCarrito) {
        listaCarrito.innerHTML = Object.entries(carrito).map(([id, item]) => {
            let subtotal = item.precio * item.cantidad;

            // Aplicar descuentos según la cantidad
            if (item.cantidad === 2) {
                subtotal = 95000; // Precio fijo para 2 unidades
                mensajeDescuento = 'Descuento por compra superior a una unidad';
            } else if (item.cantidad === 3) {
                subtotal = 120000; // Precio fijo para 3 unidades
                mensajeDescuento = 'Descuento por compra superior a una unidad';
            } else if (item.cantidad >= 4) {
                subtotal = item.precio * item.cantidad; // Precio normal
                mensajeDescuento = ''; // No hay descuento
            }

            total += subtotal;
            cantidadTotal += item.cantidad;

            return `
                <div class="cart-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${item.nombre}</h6>
                            <p class="text-muted mb-0">$${subtotal.toLocaleString()} (${item.cantidad} unidades)</p>
                        </div>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary" onclick="modificarCantidad(${id}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="btn btn-outline-secondary" onclick="modificarCantidad(${id}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    if (totalCarrito) totalCarrito.textContent = `$${total.toLocaleString()}`;
    if (contadorCarrito) {
        contadorCarrito.textContent = cantidadTotal;
        contadorCarrito.style.display = cantidadTotal > 0 ? 'block' : 'none';
    }
    if (btnVaciar) btnVaciar.style.display = cantidadTotal > 0 ? 'block' : 'none';

    // Mostrar mensaje de descuento si aplica
    if (mensajeDescuento) {
        listaCarrito.innerHTML += `<strong><p class="text-danger text-center">${mensajeDescuento}</p></strong>`;
    }
}

function modificarCantidad(id, cambio) {
    if (!carrito[id]) return;

    carrito[id].cantidad += cambio;
    if (carrito[id].cantidad <= 0) {
        delete carrito[id];
    }

    actualizarCarrito();
}

function vaciarCarrito() {
    if (!confirm('¿Estás seguro de que deseas vaciar el carrito?')) return;

    carrito = {};
    actualizarCarrito();
    mostrarNotificacion('Carrito vaciado');
}

function mostrarNotificacion(nombreProducto, cantidad) {
    const notificacion = document.getElementById('notificacion-carrito');
    const mensajeNotificacion = document.getElementById('mensaje-notificacion');
    const nombreProductoElem = document.getElementById('nombre-producto');
    const cantidadProductoElem = document.getElementById('cantidad-producto');

    nombreProductoElem.textContent = nombreProducto;
    cantidadProductoElem.textContent = `Cantidad en carrito: ${cantidad}`;

    notificacion.classList.add('mostrar');

    // Ocultar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 3000);
}

function cerrarNotificacion() {
    document.getElementById('notificacion-carrito').classList.remove('mostrar');
}


function comprarPorWhatsApp() {
    if (Object.keys(carrito).length === 0) {
        mostrarNotificacion('El carrito está vacío');
        return;
    }

    let mensaje = "¡Hola! Me gustaría realizar el siguiente pedido:\n\n";
    let total = 0;

    Object.entries(carrito).forEach(([_, item]) => {
        let subtotal = item.precio * item.cantidad;

        if (item.cantidad === 2) subtotal = 95000;
        if (item.cantidad === 3) subtotal = 120000;

        mensaje += `${item.nombre} x${item.cantidad} - $${subtotal.toLocaleString()}\n`;
        total += subtotal;
    });

    mensaje += `\nTotal: $${total.toLocaleString()}`;

    const numeroWhatsApp = "573202274408";
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    carrito = {};
    actualizarCarrito();

    window.open(url, "_blank");
}
document.addEventListener("DOMContentLoaded", function () {
    const chatWidget = document.querySelector(".chat-widget");
    const chatBtn = document.querySelector(".chat-btn");
    const closeChat = document.querySelector(".close-chat");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const pages = document.querySelectorAll(".faq-page");

    let currentPage = 0;

    chatBtn.addEventListener("click", function () {
        chatWidget.classList.add("active");
    });

    closeChat.addEventListener("click", function () {
        chatWidget.classList.remove("active");
    });

    // Función para actualizar la página activa
    function updateFAQPage() {
        pages.forEach((page, index) => {
            page.classList.toggle("active", index === currentPage);
        });

        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === pages.length - 1;
    }

    nextBtn.addEventListener("click", function () {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updateFAQPage();
        }
    });

    prevBtn.addEventListener("click", function () {
        if (currentPage > 0) {
            currentPage--;
            updateFAQPage();
        }
    });

    // Mostrar respuesta al hacer clic en la pregunta
    document.querySelectorAll(".faq-question").forEach((question) => {
        question.addEventListener("click", function () {
            this.nextElementSibling.classList.toggle("visible");
        });
    });

    updateFAQPage(); // Inicializa la primera página
});

function toggleChat() {
    const chat = document.querySelector(".chat-widget");
    const carrito = document.getElementById("menuCarrito");

    // Si el carrito está activo, lo cerramos antes de abrir el chat
    if (carrito.classList.contains("active")) {
        carrito.classList.remove("active");
        document.body.style.overflow = "";
    }

    chat.classList.toggle("active");
}

function closeChat() {
    document.querySelector(".chat-widget").classList.remove("active");
    resetChat();
}

function mostrarRespuesta(element) {
    element.nextElementSibling.classList.toggle("visible");
}

function resetChat() {
    document.querySelectorAll(".faq-answer").forEach(answer => {
        answer.classList.remove("visible");
    });
}
