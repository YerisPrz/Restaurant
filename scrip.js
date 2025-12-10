// main.js - Unificado
// -------------------
// Cambia firebaseConfig con tus credenciales reales si usas Firebase.
const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "restauran-e7bb8",
};

// admin credentials (puedes cambiarlas)
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

// inicializar firebase (solo si los scripts de firebase ya cargaron)
if (window.firebase && (!firebase.apps || firebase.apps.length === 0)) {
    try { firebase.initializeApp(firebaseConfig); } catch(e){ console.warn(e); }
}
const db = (window.firebase && firebase.database) ? firebase.database() : null;

// helpers
const $ = id => document.getElementById(id) || null;
const formatMoney = n => "RD$" + Number(n).toLocaleString();
const uidShort = k => k ? String(k).substring(0,5) : "";

// fallback menu
const menuFallback = [
  { id:1, categoria:"Carnes", nombre:"Alitas Fritas", precio:375, img:"img/alitas.jpg" },
  { id:2, categoria:"Carnes", nombre:"Muslo Frito", precio:375, img:"img/muslo.jpg" },
  { id:3, categoria:"Carnes", nombre:"Chuletas Fritas", precio:350, img:"img/chuletas.jpg" },
  { id:4, categoria:"Carnes", nombre:"Longaniza Artesanal", precio:350, img:"img/longaniza.jpg" },
  { id:5, categoria:"Carnes", nombre:"Costillas de Cerdo", precio:475, img:"img/costillas.jpg" },
  { id:6, categoria:"Carnes", nombre:"Chicharrón", precio:500, img:"img/chicharron.jpg" },
  { id:7, categoria:"Carnes", nombre:"Pescado", precio:500, img:"img/pescado.jpg" },
  { id:8, categoria:"Carnes", nombre:"Salami", precio:240, img:"img/salami.jpg" },
  { id:9, categoria:"Carnes", nombre:"Mixto", precio:450, img:"img/mixto.jpg" },
  { id:10, categoria:"Carnes", nombre:"Bandeja Trío", precio:1000, img:"img/trio.jpg" },
  { id:11, categoria:"Carnes", nombre:"Bandeja Familiar", precio:2000, img:"img/familiar.jpg" },
  { id:12, categoria:"Light", nombre:"Churrasco", precio:950, img:"img/churrasco.jpg" }
];

// estado
let menu = [];
let carrito = [];
let menuFromFirebase = false;

// ----- RENDER MENÚ -----
function renderMenu(){
  const cont = $("menu"); if(!cont) return;
  cont.innerHTML = "";
  menu.forEach(item => {
    cont.innerHTML += `
      <div class="plato">
        <img src="${item.img||'img/default.jpg'}" alt="${item.nombre}" onerror="this.src='img/default.jpg'">
        <h3>${item.nombre}</h3>
        <p>${formatMoney(item.precio)}</p>
        <button onclick="addCart(${item.id})">Agregar</button>
      </div>
    `;
  });
}

// funciones globales para botones
window.addCart = function(id){
  const item = menu.find(m=>m.id===id);
  if(!item) return alert("Plato no encontrado");
  carrito.push(item);
  showCart();
};

function showCart(){
  const cont = $("carrito"), tot = $("total");
  if(!cont||!tot) return;
  cont.innerHTML = "";
  let total=0;
  carrito.forEach((p,i)=>{
    total+=Number(p.precio);
    cont.innerHTML += `<p>${p.nombre} - ${formatMoney(p.precio)} <button onclick="removeCart(${i})">❌</button></p>`;
  });
  tot.innerText = "Total: " + formatMoney(total);
}
window.removeCart = function(i){ carrito.splice(i,1); showCart(); };

window.generateInvoice = function(){ // alias para compatibilidad
  generarFactura();
};

function generarFactura(){
  if(carrito.length===0){ alert("El carrito está vacío."); return; }
  const pedido = { fecha: Date.now(), items: carrito, total: carrito.reduce((s,i)=>s+Number(i.precio),0) };
  if(db){
    db.ref("restaurante/pedidos").push(pedido)
      .then(()=>{ alert("✔ Pedido enviado a cocina"); carrito=[]; showCart(); })
      .catch(e=>{ console.error(e); alert("Error enviando pedido"); });
  } else {
    alert("Pedido creado localmente (sin Firebase).");
    carrito = []; showCart();
  }
}

// ----- ADMIN -----
window.addPlatoLocal = function(){ // helper no usado pero expuesto
  window.agregarPlato();
};

window.agregarPlato = function(){
  const n = $("nombre"), p = $("precio"), c = $("categoria"), i = $("img");
  if(!n||!p||!c||!i) return alert("Formulario admin inválido");
  const nombre=n.value.trim(), precio=Number(p.value), categoria=c.value.trim(), img=i.value.trim();
  if(!nombre||!precio||!categoria||!img) return alert("Todos los campos son obligatorios");
  if(db){
    db.ref("restaurante/menu").push({ nombre, precio, categoria, img })
      .then(()=>{ alert("Plato agregado"); n.value=""; p.value=""; c.value=""; i.value=""; })
      .catch(e=>{ console.error(e); alert("Error al agregar"); });
  } else {
    const newId = menu.length?Math.max(...menu.map(m=>m.id))+1:1;
    menu.push({ id:newId, nombre, precio, categoria, img });
    renderMenu(); renderAdminList();
    alert("Plato agregado localmente");
    n.value=""; p.value=""; c.value=""; i.value="";
  }
};

window.borrar = function(keyOrId){
  if(db && typeof keyOrId === "string" && keyOrId.length>5){
    if(!confirm("¿Borrar este plato?")) return;
    db.ref("restaurante/menu/"+keyOrId).remove().catch(e=>console.error(e));
    return;
  }
  const id = Number(keyOrId);
  const idx = menu.findIndex(m=>m.id===id);
  if(idx>=0){ menu.splice(idx,1); renderMenu(); renderAdminList(); }
};

function renderAdminList(snapshot){
  const cont = $("listaPlatos"); if(!cont) return;
  cont.innerHTML = "";
  if(menuFromFirebase && snapshot){
    snapshot.forEach(child=>{
      const val = child.val(), key = child.key;
      cont.innerHTML += `
        <div class="plato-admin">
          <img src="${val.img||'img/default.jpg'}" alt="${val.nombre}" onerror="this.src='img/default.jpg'">
          <h3>${val.nombre}</h3>
          <p>${formatMoney(val.precio)}</p>
          <button onclick="borrar('${key}')">Eliminar</button>
        </div>
      `;
    });
    return;
  }
  menu.forEach(item=>{
    cont.innerHTML += `
      <div class="plato-admin">
        <img src="${item.img||'img/default.jpg'}" alt="${item.nombre}" onerror="this.src='img/default.jpg'">
        <h3>${item.nombre}</h3>
        <p>${formatMoney(item.precio)}</p>
        <button onclick="borrar(${item.id})">Eliminar</button>
      </div>
    `;
  });
}

// ----- COCINA (lista pedidos en tiempo real) -----
function listenPedidos(){
  const cont = $("ordenes"); if(!cont) return;
  if(db){
    db.ref("restaurante/pedidos").on("value", snap=>{
      cont.innerHTML = "";
      snap.forEach(p=>{
        const orden = p.val();
        cont.innerHTML += `<div class="orden"><h2>🍽 Orden #${uidShort(p.key)}</h2><ul>${orden.items.map(it=>`<li>${it.nombre} - ${formatMoney(it.precio)}</li>`).join("")}</ul><p class="total">Total: ${formatMoney(orden.total)}</p></div>`;
      });
    });
  } else {
    cont.innerHTML = "<p>No hay conexión a Firebase</p>";
  }
}

// ----- LISTEN MENU FROM FIREBASE OR FALLBACK -----
function listenMenu(){
  if(!$("menu")) return;
  if(db){
    db.ref("restaurante/menu").on("value", snap=>{
      if(!snap.exists()){
        menu = menuFallback.map(m=>({ ...m }));
        menuFromFirebase=false; renderMenu(); renderAdminList();
        return;
      }
      const arr=[]; let nextId=1;
      snap.forEach(child=>{
        const val = child.val();
        arr.push({ id: nextId++, _key: child.key, nombre: val.nombre, precio: val.precio, categoria: val.categoria, img: val.img });
      });
      menu = arr; menuFromFirebase=true; renderMenu(); renderAdminList(snap);
    }, e=>{
      console.error("menu read error", e);
      menu = menuFallback.map(m=>({...m})); renderMenu(); renderAdminList();
    });
  } else {
    menu = menuFallback.map(m=>({...m})); renderMenu(); renderAdminList();
  }
}

// ----- DARK MODE -----
function initDarkMode(){
  const headerToggle = $("darkToggleHeader");
  const saved = localStorage.getItem("darkMode");
  if(saved === "1") document.body.classList.add("dark");
  if(headerToggle){
    headerToggle.addEventListener("click", ()=>{
      const isDark = document.body.classList.toggle("dark");
      localStorage.setItem("darkMode", isDark ? "1" : "0");
      headerToggle.innerText = isDark ? "Modo claro" : "Modo oscuro";
    });
    headerToggle.innerText = document.body.classList.contains("dark") ? "Modo claro" : "Modo oscuro";
  }
}

// ----- LOGIN SIMPLE -----
function abrirLogin(){ $("#loginModal").classList.add("show"); }
function cerrarLogin(){ $("#loginModal").classList.remove("show"); }
function doLogin(){
  const u = $("loginUser").value.trim(), p = $("loginPass").value;
  if(u===ADMIN_USER && p===ADMIN_PASS){
    cerrarLogin();
    sessionStorage.setItem("isAdmin","1");
    mostrar("adminView"); alert("Login correcto");
  } else {
    alert("Usuario/contraseña incorrectos");
  }
}
document.addEventListener("click", (e)=>{
  if(e.target && e.target.id === "loginBtn") doLogin();
});

// ----- VIEWS -----
window.mostrar = function(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  const el = $(id);
  if(el) el.classList.add("active");
};

// ----- INIT -----
function init(){
  if(window.__mainInit) return; window.__mainInit = true;
  listenMenu(); listenPedidos(); initDarkMode(); showCart();

  // si sesión admin activa abrimos admin
  if(sessionStorage.getItem("isAdmin")==="1") mostrar("adminView");
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
