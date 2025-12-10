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
// REFERENCIA AL CONTENEDOR
// ===============================
const cont = document.getElementById("ordenes");

// ===============================
// ESCUCHAR PEDIDOS EN TIEMPO REAL
// ===============================
db.ref("restaurante/pedidos").on("value", snapshot => {
    if (!cont) return;

    cont.innerHTML = "";

    snapshot.forEach(p => {
        const orden = p.val();

        cont.innerHTML += `
            <div class="orden">
                <h2>🍽 Orden #${p.key.substring(0, 5)}</h2>

                <ul>
                    ${orden.items
                        .map(i => `<li>${i.nombre} - RD$${i.precio}</li>`)
                        .join("")}
                </ul>

                <p class="total">Total: RD$${orden.total}</p>
            </div>
        `;
    });
});
