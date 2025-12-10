// ===============================
// CONFIGURACIÓN FIREBASE
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
// AGREGAR PLATO
// ===============================
function agregarPlato() {
    const nombre = document.getElementById("nombre").value.trim();
    const precio = Number(document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value.trim();
    const img = document.getElementById("img").value.trim();

    if (!nombre || !precio || !categoria || !img) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    db.ref("restaurante/menu").push({
        nombre,
        precio,
        categoria,
        img
    });

    alert("Plato agregado correctamente");

    // Limpiar inputs
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("img").value = "";
}

// ===============================
// LISTAR PLATOS EN ADMIN
// ===============================
db.ref("restaurante/menu").on("value", snap => {
    const cont = document.getElementById("listaPlatos");
    if (!cont) return;

    cont.innerHTML = "";

    snap.forEach(p => {
        const plato = p.val();

        cont.innerHTML += `
            <div class="plato-admin">
                <img src="${plato.img}" alt="${plato.nombre}">
                <h3>${plato.nombre}</h3>
                <p>RD$${plato.precio}</p>
                <button onclick="borrar('${p.key}')">Eliminar</button>
            </div>
        `;
    });
});

// ===============================
// ELIMINAR PLATO
// ===============================
function borrar(id) {
    if (confirm("¿Seguro que deseas eliminar este plato?")) {
        db.ref("restaurante/menu/" + id).remove();
    }
}
