// ===============================
// MENU LOCAL (HARDCODED)
// ===============================
const menu = [
    { id: 1, categoria: "Carnes", nombre: "Alitas Fritas", precio: 375, img: "imgs/alitas.jpg" },
    { id: 2, categoria: "Carnes", nombre: "Muslo Frito", precio: 375, img: "imgs/muslo.jpg" },
    { id: 3, categoria: "Carnes", nombre: "Chuletas Fritas", precio: 350, img: "imgs/chuletas.jpg" },
    { id: 4, categoria: "Carnes", nombre: "Longaniza Artesanal", precio: 350, img: "imgs/longaniza.jpg" },
    { id: 5, categoria: "Carnes", nombre: "Costillas de Cerdo", precio: 475, img: "imgs/costillas.jpg" },
    { id: 6, categoria: "Carnes", nombre: "Chicharrón", precio: 500, img: "imgs/chicharron.jpg" },
    { id: 7, categoria: "Carnes", nombre: "Pescado", precio: 500, img: "imgs/pescado.jpg" },
    { id: 8, categoria: "Carnes", nombre: "Salami", precio: 240, img: "imgs/salami.jpg" },
    { id: 9, categoria: "Carnes", nombre: "Mixto", precio: 450, img: "imgs/mixto.jpg" },
    { id: 10, categoria: "Carnes", nombre: "Bandeja Trío", precio: 1000, img: "imgs/trio.jpg" },
    { id: 11, categoria: "Carnes", nombre: "Bandeja Familiar", precio: 2000, img: "imgs/familiar.jpg" },
    { id: 12, categoria: "Light", nombre: "Churrasco", precio: 950, img: "imgs/churrasco.jpg" }
];


// ===============================
// RENDERIZAR MENÚ
// ===============================
function renderMenu() {
    const cont = document.getElementById("menu");
    if (!cont) return;

    cont.innerHTML = ""; // Limpia antes de renderizar

    menu.forEach(item => {
        cont.innerHTML += `
            <div class="plato">
                <img src="${item.img}" alt="${item.nombre}" onerror="this.src='imgs/default.jpg'">
                <h3>${item.nombre}</h3>
                <p>RD$${item.precio}</p>
                <button onclick="agregarCarrito(${item.id})">Agregar</button>
            </div>
        `;
    });
}

renderMenu();
