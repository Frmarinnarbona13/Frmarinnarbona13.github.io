import { juegoAPI } from "../api/juegoAPI.js";
import { plataformaAPI } from "../api/plataformaAPI.js";
import { crearBarraNavegacion } from "../components/navbar.js";
import { crearFooter } from "../components/footer.js";

/* -------------------------------------------------------
   Funciones de utilidad
------------------------------------------------------- */

// Convierte caracteres especiales en entidades HTML para evitar inyección de código.
// Por ejemplo, < se convierte en &lt; para que se muestre como texto y no como etiqueta.
function escapar(texto) {
  let textoSeguro = String(texto || "");
  textoSeguro = textoSeguro.replace(/&/g, "&amp;");
  textoSeguro = textoSeguro.replace(/</g, "&lt;");
  textoSeguro = textoSeguro.replace(/>/g, "&gt;");
  textoSeguro = textoSeguro.replace(/"/g, "&quot;");
  textoSeguro = textoSeguro.replace(/'/g, "&#39;");
  return textoSeguro;
}

// Imágenes "easter egg": de vez en cuando aparece una de estas en lugar
// de la imagen aleatoria normal. Para añadir más, basta con meterlas aquí.
const IMAGENES_SECRETAS = [
  "/img/trompet-hero.jpeg",
  "/img/gsa.png",
  "/img/tboi.jpeg",
];

// Probabilidad de que salga un easter egg (0.08 = 8% de las tarjetas).
const PROBABILIDAD_SECRETA = 0.08;

// Genera la URL de imagen para la tarjeta del juego.
// Normalmente devuelve una imagen aleatoria de picsum, pero con poca
// probabilidad devuelve una de las imágenes secretas como easter egg.
function imagenJuego(juego) {
  if (Math.random() < PROBABILIDAD_SECRETA) {
    let indice = Math.floor(Math.random() * IMAGENES_SECRETAS.length);
    return IMAGENES_SECRETAS[indice];
  }
  return `https://picsum.photos/seed/stemgame-${juego.id}/400/400`;
}

/* -------------------------------------------------------
   Funciones para generar HTML de tarjetas y secciones
------------------------------------------------------- */

// Genera el HTML de una tarjeta de juego para el catálogo.
// Incluye la imagen, el título, el género y la clasificación PEGI.
function tarjetaJuego(juego) {
  let titulo = escapar(juego.titulo);
  let tituloEnMinusculas = titulo.toLowerCase();
  let genero = escapar(juego.genero || "");
  let pegi = escapar(juego.clasificacionPEGI ?? "?");

  let resultado = `
        <li class="card-juego"
            data-titulo="${tituloEnMinusculas}"
            data-genero="${genero.toLowerCase()}">
            <a href="juegoDetalle.html?id=${juego.id}">
                <img class="card-juego__imagen"
                     src="${imagenJuego(juego)}"
                     alt="${titulo}"
                     loading="lazy"
                     onerror="this.src='https://picsum.photos/seed/stemgame-${juego.id}/460/215'" />
                <div class="card-juego__cuerpo">
                    <div class="card-juego__titulo">${titulo}</div>
                    <div class="card-juego__meta">
                        <span class="juego-genero">${genero || "—"}</span>
                        <span class="juego-pegi">PEGI ${pegi}</span>
                    </div>
                </div>
            </a>
        </li>`;
  return resultado;
}

// Genera el HTML de una sección de carrusel para una plataforma concreta.
// Si no hay juegos, devuelve un string vacío (la sección no aparece).
function seccionPlataforma(plataforma, juegos) {
  let idSeccion = `plataforma-${plataforma.id}`;
  let tarjetasHTML = "";
  let fabricanteHTML = "";
  let resultado = "";

  juegos.forEach((juego) => {
    tarjetasHTML += tarjetaJuego(juego);
  });

  if (plataforma.fabricante) {
    fabricanteHTML = `<span class="badge-fabricante">${escapar(plataforma.fabricante)}</span>`;
  }

  if (juegos.length > 0) {
    resultado = `
            <section class="seccion-plataforma" data-plataforma-id="${plataforma.id}">
                <div class="seccion-plataforma__header">
                    <h2 class="seccion-plataforma__titulo">
                        ${escapar(plataforma.nombre)}
                        ${fabricanteHTML}
                    </h2>
                </div>
                <div class="carrusel">
                    <button class="flecha-carrusel flecha-carrusel--prev" type="button"
                            aria-label="Anterior" data-dir="prev" data-target="${idSeccion}">‹</button>
                    <ul id="${idSeccion}" class="carrusel-pista">
                        ${tarjetasHTML}
                    </ul>
                    <button class="flecha-carrusel flecha-carrusel--next" type="button"
                            aria-label="Siguiente" data-dir="next" data-target="${idSeccion}">›</button>
                </div>
            </section>`;
  }

  return resultado;
}

// Genera el HTML de la sección de resultados cuando hay filtros activos.
// Muestra todos los juegos en una cuadrícula en lugar de agruparlos por plataforma.
function seccionResultados(juegos) {
  let tarjetasHTML = "";
  let resultado = "";

  if (juegos.length == 0) {
    resultado = `<p class="sin-resultados">No se ha encontrado ningún juego con esos filtros.</p>`;
  } else {
    juegos.forEach((juego) => {
      tarjetasHTML += tarjetaJuego(juego);
    });
    resultado = `
            <section class="seccion-resultados">
                <div class="seccion-plataforma__header">
                    <h2 class="seccion-plataforma__titulo">Resultados (${juegos.length})</h2>
                </div>
                <ul class="grid-resultados">
                    ${tarjetasHTML}
                </ul>
            </section>`;
  }

  return resultado;
}

/* -------------------------------------------------------
   Inicio de la página (se ejecuta al cargar el DOM)
------------------------------------------------------- */

// Al cargar la página pedimos todos los juegos y plataformas al servidor.
// Después montamos el catálogo agrupado por plataforma y activamos los filtros.
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("navbar").innerHTML = crearBarraNavegacion();

  const footerEl = document.getElementById("footer");
  if (footerEl) {
    footerEl.innerHTML = crearFooter();
  }

  const root = document.getElementById("root");
  let juegosTodos = [];
  let plataformas = [];
  let cargaExitosa = true;

  // Pedimos los datos al servidor; si falla mostramos un mensaje de error
  try {
    juegosTodos = await juegoAPI.obtenerTodos();
    plataformas = await plataformaAPI.obtenerTodos();
  } catch (errorCarga) {
    root.innerHTML = `<div class="container"><p class="text-danger">Error cargando datos: ${escapar(errorCarga.message)}</p></div>`;
    cargaExitosa = false;
  }

  if (cargaExitosa) {
    // Sacar lista única de géneros sin repetir
    const generosVistos = {};
    const generos = [];
    for (const juego of juegosTodos) {
      if (juego.genero && !generosVistos[juego.genero]) {
        generosVistos[juego.genero] = true;
        generos.push(juego.genero);
      }
    }
    generos.sort();

    // Construir las opciones del select de géneros
    let opcionesGeneros = "";
    generos.forEach((genero) => {
      opcionesGeneros += `<option value="${escapar(genero)}">${escapar(genero)}</option>`;
    });

    // Construir las opciones del select de plataformas
    let opcionesPlataformas = "";
    plataformas.forEach((plataforma) => {
      opcionesPlataformas += `<option value="${plataforma.id}">${escapar(plataforma.nombre)}</option>`;
    });

    root.innerHTML = `
            <div class="container">
                <div class="catalogo-header">
                    <h1 class="mb-0">Catálogo de Juegos</h1>
                    <div class="buscador">
                        <select id="filtro-genero" class="filtro-select">
                            <option value="">Todos los géneros</option>
                            ${opcionesGeneros}
                        </select>
                        <select id="filtro-plataforma" class="filtro-select">
                            <option value="">Todas las plataformas</option>
                            ${opcionesPlataformas}
                        </select>
                        <input type="search" id="input-busqueda"
                               placeholder="Buscar por título o género... 🔍" autocomplete="off" />
                    </div>
                </div>
                <div id="contenedor-secciones"></div>
            </div>`;

    const contenedor = document.getElementById("contenedor-secciones");
    const inputBusqueda = document.getElementById("input-busqueda");
    const selectGenero = document.getElementById("filtro-genero");
    const selectPlataforma = document.getElementById("filtro-plataforma");

    /* -------------------------------------------------------
           Render agrupado por plataforma (vista por defecto)
        ------------------------------------------------------- */
    // Agrupa los juegos recibidos por plataforma y pinta una sección de carrusel por cada una.
    function renderAgrupado(juegos) {
      let juegosPorPlataforma = {};
      let seccionesHTML = "";

      // Inicializar un array vacío para cada plataforma conocida
      plataformas.forEach((plataforma) => {
        juegosPorPlataforma[plataforma.id] = [];
      });

      // Asignar cada juego a sus plataformas correspondientes
      juegos.forEach((juego) => {
        if (Array.isArray(juego.plataformas)) {
          juego.plataformas.forEach((plataforma) => {
            if (!juegosPorPlataforma[plataforma.id]) {
              juegosPorPlataforma[plataforma.id] = [];
            }
            juegosPorPlataforma[plataforma.id].push(juego);
          });
        }
      });

      // Generar el HTML de cada sección de plataforma
      plataformas.forEach((plataforma) => {
        let juegosDePlataforma = juegosPorPlataforma[plataforma.id] || [];
        seccionesHTML += seccionPlataforma(plataforma, juegosDePlataforma);
      });

      // Los juegos sin ninguna plataforma asignada no se muestran en el catálogo
      contenedor.innerHTML = seccionesHTML;
      activarCarruseles();
    }

    /* -------------------------------------------------------
           Render filtrado (lista plana de resultados)
        ------------------------------------------------------- */
    // Muestra los juegos en cuadrícula cuando hay filtros activos (sin agrupar por plataforma).
    function renderFiltrado(juegos) {
      contenedor.innerHTML = seccionResultados(juegos);
    }

    /* -------------------------------------------------------
           Lógica de las flechas del carrusel
        ------------------------------------------------------- */
    // Añade los eventos de clic a las flechas del carrusel y actualiza si están desactivadas.
    // Se llama cada vez que se pinta la vista agrupada porque el DOM se regenera.
    function activarCarruseles() {
      let anchuraCard = 240 + 16; // ancho de la tarjeta + gap

      function actualizarFlechas(pista) {
        let botonAnterior = document.querySelector(
          `.flecha-carrusel--prev[data-target="${pista.id}"]`,
        );
        let botonSiguiente = document.querySelector(
          `.flecha-carrusel--next[data-target="${pista.id}"]`,
        );
        if (botonAnterior && botonSiguiente) {
          botonAnterior.disabled = pista.scrollLeft <= 2;
          botonSiguiente.disabled =
            pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 2;
        }
      }

      document.querySelectorAll(".flecha-carrusel").forEach((boton) => {
        boton.addEventListener("click", () => {
          let pista = document.getElementById(boton.dataset.target);
          let desplazamiento = 0;
          if (pista) {
            if (boton.dataset.dir == "next") {
              desplazamiento = anchuraCard * 2;
            } else {
              desplazamiento = -anchuraCard * 2;
            }
            pista.scrollBy({ left: desplazamiento, behavior: "smooth" });
          }
        });
      });

      document.querySelectorAll(".carrusel-pista").forEach((pista) => {
        actualizarFlechas(pista);
        pista.addEventListener("scroll", () => actualizarFlechas(pista), {
          passive: true,
        });
      });
    }

    /* -------------------------------------------------------
           Lógica de filtros combinados (género + plataforma + texto)
        ------------------------------------------------------- */
    // Lee los tres filtros (género, plataforma y texto) y vuelve a pintar el catálogo.
    // Si no hay ningún filtro activo, muestra la vista agrupada por plataforma.
    // Si hay filtros, pide los datos al servidor y aplica el filtro de texto encima.
    async function aplicarFiltros() {
      let genero = selectGenero.value;
      let plataformaId = selectPlataforma.value;
      let texto = inputBusqueda.value.trim().toLowerCase();
      let hayFiltros = genero || plataformaId || texto;
      let juegos = juegosTodos;
      let hayError = false;

      if (!hayFiltros) {
        renderAgrupado(juegosTodos);
      } else {
        try {
          if (genero && plataformaId) {
            // Pedir por género y filtrar por plataforma en el cliente
            let juegosPorGenero = await juegoAPI.obtenerPorGenero(genero);
            let juegosFiltrados = [];
            juegosPorGenero.forEach((juego) => {
              if (Array.isArray(juego.plataformas)) {
                // La guardia (juegoYaAgregado) evita añadir el mismo juego más de una vez
                let juegoYaAgregado = false;
                juego.plataformas.forEach((plataforma) => {
                  if (
                    String(plataforma.id) == String(plataformaId) &&
                    !juegoYaAgregado
                  ) {
                    juegosFiltrados.push(juego);
                    juegoYaAgregado = true;
                  }
                });
              }
            });
            juegos = juegosFiltrados;
          } else if (genero) {
            juegos = await juegoAPI.obtenerPorGenero(genero);
          } else if (plataformaId) {
            juegos = await juegoAPI.obtenerPorPlataforma(plataformaId);
          }
        } catch (errorFiltro) {
          contenedor.innerHTML = `<p class="text-danger">Error filtrando: ${escapar(errorFiltro.message)}</p>`;
          hayError = true;
        }

        if (!hayError) {
          // Aplicar filtro de texto encima del resultado anterior
          if (texto) {
            let juegosPorTexto = [];
            juegos.forEach((juego) => {
              let tituloJuego = (juego.titulo || "").toLowerCase();
              let generoJuego = (juego.genero || "").toLowerCase();
              if (tituloJuego.includes(texto) || generoJuego.includes(texto)) {
                juegosPorTexto.push(juego);
              }
            });
            juegos = juegosPorTexto;
          }
          renderFiltrado(juegos);
        }
      }
    }

    // Escuchar cambios en los filtros
    selectGenero.addEventListener("change", aplicarFiltros);
    selectPlataforma.addEventListener("change", aplicarFiltros);
    inputBusqueda.addEventListener("input", aplicarFiltros);

    // Mostrar todos los juegos agrupados al cargar
    renderAgrupado(juegosTodos);
  }
});
