// ===============================
// FIREBASE CONFIG
// ===============================
const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "restauran-e7bb8",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===============================
// VARIABLES GLOBALES
// ===============================
let carrito = [];
let menu = []; // ← Se llena desde menu.js


// ===============================
// AGREGAR AL CARRITO
// ===============================
function agregarCarrito(id) {
    const item = menu.find(p => p.id === id);

    if (!item) {
        console.error("No se encontró el plato con id:", id);
        return;
    }

    carrito.push(item);
    mostrarCarrito();
}


// ===============================
// MOSTRAR CARRITO
// ===============================
function mostrarCarrito() {
    const div = document.getElementById("carrito");
    const totalTag = document.getElementById("total");

    if (!div || !totalTag) return;

    div.innerHTML = "";

    let total = 0;

    carrito.forEach((p, i) => {
        total += p.precio;

        div.innerHTML += `
            <p>
                ${p.nombre} - RD$${p.precio}
                <button onclick="quitar(${i})" style="margin-left:10px;">❌</button>
            </p>
        `;
    });

    totalTag.innerText = "Total: RD$" + total;
}


// ===============================
// QUITAR DEL CARRITO
// ===============================
function quitar(i) {
    carrito.splice(i, 1);
    mostrarCarrito();
}


// ===============================
// GENERAR FACTURA / ENVIAR A COCINA
// ===============================
function generarFactura() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const pedido = {
        fecha: Date.now(),
        items: carrito,
        total: carrito.reduce((t, p) => t + p.precio, 0)
    };

    db.ref("restaurante/pedidos").push(pedido);

    alert("✔ Pedido enviado a cocina!");

    carrito = [];
    mostrarCarrito();
}
