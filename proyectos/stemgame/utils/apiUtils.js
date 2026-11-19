// =====================================================================
// VERSIÓN DEMO PARA EL PORTFOLIO
// En el proyecto original esta función llamaba al servidor Spring Boot
// (http://localhost:8080/api/v1). Aquí se sustituye por una API simulada
// en el navegador, con las mismas rutas y el mismo formato JSON, para que
// el frontend real se pueda probar sin servidor. Los cambios se guardan en
// localStorage de este navegador.
// =====================================================================

const CLAVE = "stemgame-demo-db-v1";

function semilla() {
  const plataformas = [
    { id: 1, nombre: "PC", fabricante: "Varios" },
    { id: 2, nombre: "PlayStation 5", fabricante: "Sony" },
    { id: 3, nombre: "Xbox Series X", fabricante: "Microsoft" },
    { id: 4, nombre: "Nintendo Switch", fabricante: "Nintendo" },
  ];
  const desarrolladoras = [
    { id: 1, nombre: "Nintendo", pais: "Japón", sitioWeb: "https://www.nintendo.com" },
    { id: 2, nombre: "FromSoftware", pais: "Japón", sitioWeb: "https://www.fromsoftware.jp" },
    { id: 3, nombre: "Supergiant Games", pais: "Estados Unidos", sitioWeb: "https://www.supergiantgames.com" },
    { id: 4, nombre: "Team Cherry", pais: "Australia", sitioWeb: "https://www.teamcherry.com.au" },
    { id: 5, nombre: "CD Projekt Red", pais: "Polonia", sitioWeb: "https://www.cdprojektred.com" },
    { id: 6, nombre: "Nicalis", pais: "Estados Unidos", sitioWeb: "https://www.nicalis.com" },
  ];
  const j = (id, titulo, genero, pegi, precio, fecha, stock, plats, devs, descripcion) => ({
    id, titulo, genero, clasificacionPEGI: pegi, precioBase: precio, fechaDeSalida: fecha,
    disponible: stock > 0, stock, descripcion,
    plataformas: plats.map((p) => plataformas[p - 1]),
    desarrolladoras: devs.map((d) => desarrolladoras[d - 1]),
  });
  const juegos = [
    j(1, "Hades", "Roguelike", 12, 24.5, "2020-09-17", 15, [1, 2, 3, 4], [3], "Escapa del inframundo griego combate a combate."),
    j(2, "Hollow Knight", "Metroidvania", 7, 14.99, "2017-02-24", 22, [1, 2, 3, 4], [4], "Explora el reino en ruinas de Hallownest."),
    j(3, "Elden Ring", "RPG de acción", 16, 59.99, "2022-02-25", 8, [1, 2, 3], [2], "Un mundo abierto enorme creado junto a G. R. R. Martin."),
    j(4, "The Legend of Zelda: Tears of the Kingdom", "Aventura", 12, 69.99, "2023-05-12", 5, [4], [1], "Hyrule desde el cielo hasta las profundidades."),
    j(5, "The Binding of Isaac: Rebirth", "Roguelike", 16, 14.99, "2014-11-04", 30, [1, 2, 4], [6], "Mazmorras aleatorias y cientos de objetos."),
    j(6, "The Witcher 3: Wild Hunt", "RPG", 18, 29.99, "2015-05-19", 12, [1, 2, 3, 4], [5], "Geralt busca a Ciri en un mundo en guerra."),
    j(7, "Super Mario Odyssey", "Plataformas", 7, 49.99, "2017-10-27", 0, [4], [1], "Mario recorre reinos con la ayuda de Cappy."),
    j(8, "Sekiro: Shadows Die Twice", "Acción", 18, 39.99, "2019-03-22", 6, [1, 2, 3], [2], "Un shinobi en el Japón de la era Sengoku."),
    j(9, "Bastion", "RPG de acción", 12, 9.99, "2011-07-20", 18, [1, 4], [3], "Reconstruye el mundo mientras un narrador cuenta tu historia."),
    j(10, "Cyberpunk 2077", "RPG", 18, 49.99, "2020-12-10", 9, [1, 2, 3], [5], "Mercenario en Night City."),
  ];
  const clientes = [
    { id: 1, nombre: "Lucía Romero", edad: 24, email: "lucia@correo.com", esSocio: true, puntosSocio: 320, fechaDeInscripcion: "2025-03-14" },
    { id: 2, nombre: "Pablo Ortega", edad: 31, email: "pablo@correo.com", esSocio: false, puntosSocio: 0, fechaDeInscripcion: "2025-06-02" },
    { id: 3, nombre: "Marta Gil", edad: 19, email: "marta@correo.com", esSocio: true, puntosSocio: 145, fechaDeInscripcion: "2025-09-21" },
    { id: 4, nombre: "Javier Ruiz", edad: 27, email: "javier@correo.com", esSocio: false, puntosSocio: 0, fechaDeInscripcion: "2026-01-08" },
  ];
  const r = (id, juegoId, clienteId, valoracion, contenido, fecha) => ({
    id, juegoId, clienteId, valoracion, contenido, fecha,
    autor: clientes[clienteId - 1].nombre,
  });
  const resenias = [
    r(1, 1, 1, 5, "El mejor roguelike que he jugado. Cada partida es distinta.", "2026-02-11T18:20:00"),
    r(2, 1, 3, 4, "Muy adictivo y la banda sonora es increíble.", "2026-03-02T21:05:00"),
    r(3, 2, 2, 5, "Precioso y difícil a partes iguales.", "2026-01-19T16:40:00"),
    r(4, 3, 4, 5, "Explorar este mundo es una pasada.", "2026-02-27T22:10:00"),
    r(5, 3, 1, 4, "Algunos jefes se hacen eternos, pero merece la pena.", "2026-03-15T19:30:00"),
    r(6, 4, 3, 5, "La construcción con Ultramano da para horas.", "2026-04-04T12:00:00"),
    r(7, 5, 2, 4, "Mil objetos, mil combinaciones.", "2026-04-20T23:45:00"),
    r(8, 6, 4, 5, "Historias secundarias mejores que muchos juegos enteros.", "2026-05-01T17:15:00"),
    r(9, 8, 1, 3, "Demasiado difícil para mí, pero muy bien hecho.", "2026-05-18T20:00:00"),
    r(10, 9, 3, 4, "Corto pero con muchísimo encanto.", "2026-06-06T10:25:00"),
  ];
  return { plataformas, desarrolladoras, juegos, clientes, resenias };
}

function cargar() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) return JSON.parse(guardado);
  } catch {}
  return semilla();
}
let db = cargar();
function guardar() {
  try { localStorage.setItem(CLAVE, JSON.stringify(db)); } catch {}
}

const copia = (x) => (x == null ? x : JSON.parse(JSON.stringify(x)));
const sigId = (lista) => lista.reduce((m, x) => Math.max(m, x.id), 0) + 1;

function juegoConRelaciones(juego) {
  return {
    ...juego,
    plataformas: (juego.plataformas || []).map((p) => db.plataformas.find((x) => x.id == p.id) || p),
    desarrolladoras: (juego.desarrolladoras || []).map((d) => db.desarrolladoras.find((x) => x.id == d.id) || d),
    resenias: db.resenias.filter((r) => r.juegoId == juego.id).map(reseniaJson),
  };
}
function reseniaJson(r) {
  const juego = db.juegos.find((j) => j.id == r.juegoId);
  const cliente = db.clientes.find((c) => c.id == r.clienteId);
  return { ...r, juegoTitulo: juego ? juego.titulo : null, clienteNombre: cliente ? cliente.nombre : null };
}
function normalizarJuego(body, base = {}) {
  const j = { ...base, ...body };
  j.plataformas = (body.plataformas || base.plataformas || []).map((p) => ({ id: Number(p.id ?? p) }));
  j.desarrolladoras = (body.desarrolladoras || base.desarrolladoras || []).map((d) => ({ id: Number(d.id ?? d) }));
  j.stock = Number(j.stock ?? 0);
  j.disponible = j.stock > 0 && j.disponible !== false;
  delete j.resenias;
  return j;
}

class ErrorHttp extends Error {
  constructor(estado, mensaje) { super(mensaje); this.estado = estado; }
}
const noEncontrado = () => { throw new ErrorHttp(404, "No encontrado"); };

// Tabla de rutas: [método, patrón, función]
const RUTAS = [
  ["GET", /^\/juegos$/, () => db.juegos.map(juegoConRelaciones)],
  ["GET", /^\/juegos\/titulo\/(.+)$/, ([t]) => {
    const j = db.juegos.find((x) => x.titulo.toLowerCase() == decodeURIComponent(t).toLowerCase());
    return j ? juegoConRelaciones(j) : noEncontrado();
  }],
  ["GET", /^\/juegos\/genero\/(.+)$/, ([g]) => db.juegos.filter((x) => x.genero.toLowerCase() == decodeURIComponent(g).toLowerCase()).map(juegoConRelaciones)],
  ["GET", /^\/juegos\/plataforma\/(\d+)$/, ([id]) => db.juegos.filter((x) => x.plataformas.some((p) => p.id == id)).map(juegoConRelaciones)],
  ["GET", /^\/juegos\/(\d+)\/resenias$/, ([id]) => db.resenias.filter((r) => r.juegoId == id).map(reseniaJson)],
  ["POST", /^\/juegos\/(\d+)\/resenias$/, ([id], body) => {
    if (!db.juegos.some((j) => j.id == id)) noEncontrado();
    const nueva = { ...body, id: sigId(db.resenias), juegoId: Number(id), valoracion: Number(body.valoracion), fecha: new Date().toISOString().slice(0, 19) };
    db.resenias.push(nueva);
    return reseniaJson(nueva);
  }],
  ["PUT", /^\/juegos\/(\d+)\/comprar$/, ([id]) => {
    const j = db.juegos.find((x) => x.id == id) || noEncontrado();
    if (j.stock <= 0) throw new ErrorHttp(400, "Sin stock");
    j.stock--; j.disponible = j.stock > 0;
    return juegoConRelaciones(j);
  }],
  ["GET", /^\/juegos\/(\d+)$/, ([id]) => juegoConRelaciones(db.juegos.find((x) => x.id == id) || noEncontrado())],
  ["POST", /^\/juegos$/, (_, body) => {
    const j = normalizarJuego(body); j.id = sigId(db.juegos); db.juegos.push(j); return juegoConRelaciones(j);
  }],
  ["PUT", /^\/juegos\/(\d+)$/, ([id], body) => {
    const i = db.juegos.findIndex((x) => x.id == id); if (i < 0) noEncontrado();
    db.juegos[i] = normalizarJuego(body, db.juegos[i]); db.juegos[i].id = Number(id);
    return juegoConRelaciones(db.juegos[i]);
  }],
  ["DELETE", /^\/juegos\/(\d+)$/, ([id]) => {
    db.juegos = db.juegos.filter((x) => x.id != id);
    db.resenias = db.resenias.filter((r) => r.juegoId != id);
    return null;
  }],
];

// Rutas CRUD genéricas para el resto de entidades
function crud(ruta, coleccion, salida = (x) => x, alBorrar = () => {}) {
  RUTAS.push(
    ["GET", new RegExp(`^/${ruta}$`), () => db[coleccion].map(salida)],
    ["GET", new RegExp(`^/${ruta}/(\\d+)$`), ([id]) => salida(db[coleccion].find((x) => x.id == id) || noEncontrado())],
    ["POST", new RegExp(`^/${ruta}$`), (_, body) => {
      const nuevo = { ...body, id: sigId(db[coleccion]) }; db[coleccion].push(nuevo); return salida(nuevo);
    }],
    ["PUT", new RegExp(`^/${ruta}/(\\d+)$`), ([id], body) => {
      const i = db[coleccion].findIndex((x) => x.id == id); if (i < 0) noEncontrado();
      db[coleccion][i] = { ...db[coleccion][i], ...body, id: Number(id) }; return salida(db[coleccion][i]);
    }],
    ["DELETE", new RegExp(`^/${ruta}/(\\d+)$`), ([id]) => {
      db[coleccion] = db[coleccion].filter((x) => x.id != id); alBorrar(Number(id)); return null;
    }],
  );
}
crud("plataformas", "plataformas", (x) => x, (id) => db.juegos.forEach((j) => (j.plataformas = j.plataformas.filter((p) => p.id != id))));
crud("desarrolladoras", "desarrolladoras", (x) => x, (id) => db.juegos.forEach((j) => (j.desarrolladoras = j.desarrolladoras.filter((d) => d.id != id))));
crud("clientes", "clientes", (x) => x, (id) => (db.resenias = db.resenias.filter((r) => r.clienteId != id)));
crud("resenias", "resenias", reseniaJson);

// Misma firma que la función original
export async function fetchApi(method = "GET", path, body = null) {
  await new Promise((ok) => setTimeout(ok, 120)); // pequeña latencia, como un servidor real
  const limpio = path.split("?")[0];
  for (const [m, patron, accion] of RUTAS) {
    const coincide = m == method && limpio.match(patron);
    if (!coincide) continue;
    try {
      const resultado = accion(coincide.slice(1), copia(body));
      if (method != "GET") guardar();
      console.log(`[API simulada] ${method} ${path} → 200`);
      return copia(resultado);
    } catch (e) {
      const estado = e.estado || 500;
      console.error(`[API simulada] ${method} ${path} → ${estado}`);
      throw new Error(`HTTP ${estado} en ${path}`);
    }
  }
  throw new Error(`HTTP 404 en ${path}`);
}

// Aviso visible de que es una demo
function mostrarAviso() {
  if (document.getElementById("aviso-demo")) return;
  const aviso = document.createElement("div");
  aviso.id = "aviso-demo";
  aviso.innerHTML = 'Demo del portfolio: el servidor Spring Boot está simulado en tu navegador. <button type="button">Restablecer datos</button>';
  aviso.style.cssText = "position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;background:#14162e;color:#f4f1ff;border:1px solid #9d7bff;border-radius:10px;padding:.6rem 1rem;font:500 14px system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4);display:flex;gap:.75rem;align-items:center;max-width:calc(100vw - 24px)";
  aviso.querySelector("button").style.cssText = "background:#9d7bff;color:#14162e;border:0;border-radius:6px;padding:.3rem .6rem;font:600 13px system-ui;cursor:pointer;white-space:nowrap";
  aviso.querySelector("button").onclick = () => { try { localStorage.removeItem(CLAVE); } catch {} location.reload(); };
  document.body.appendChild(aviso);
}
if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", mostrarAviso);
else mostrarAviso();
