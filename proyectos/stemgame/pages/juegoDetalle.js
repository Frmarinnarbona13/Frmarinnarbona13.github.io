import { juegoAPI } from "../api/juegoAPI.js";
import { reseniaAPI } from "../api/reseniaAPI.js";
import { crearBarraNavegacion } from "../components/navbar.js";
import { crearFooter } from "../components/footer.js";
import { toggleAdmin, esAdmin } from "../config/adminConfig.js";

// Muestra la página de detalle de un juego concreto.
// Lee el id del juego de la URL (?id=5), pide el juego y sus reseñas al servidor
// y construye el HTML con la galería de imágenes, la información y el formulario de reseña.

/* -------------------------------------------------------
   Funciones de utilidad
------------------------------------------------------- */

// Convierte caracteres especiales en entidades HTML para evitar inyección de código.
function escapar(texto) {
  let textoSeguro = String(texto || "");
  textoSeguro = textoSeguro.replace(/&/g, "&amp;");
  textoSeguro = textoSeguro.replace(/</g, "&lt;");
  textoSeguro = textoSeguro.replace(/>/g, "&gt;");
  textoSeguro = textoSeguro.replace(/"/g, "&quot;");
  textoSeguro = textoSeguro.replace(/'/g, "&#39;");
  return textoSeguro;
}

// Genera 4 URLs de imagen distintas para el juego usando su id como semilla.
// Así cada juego tiene siempre las mismas imágenes aunque la página se recargue.
function generarImagenesJuego(juego) {
  let imagenes = [];
  let totalImagenes = 4;
  for (let numero = 1; numero <= totalImagenes; numero++) {
    imagenes.push(
      `https://picsum.photos/seed/stemgame-${juego.id}-${numero}/1200/675`,
    );
  }
  return imagenes;
}

// Genera el HTML de las estrellas de una reseña (de 1 a 5).
// Las estrellas llenas son ★ y las vacías ☆.
function pintarEstrellasResenia(valoracion) {
  let valor = Math.max(0, Math.min(5, Number(valoracion) || 0));
  let estrellasLlenas = "★".repeat(valor);
  let estrellasVacias = "☆".repeat(5 - valor);
  let resultado = `<span class="resenia-estrellas" aria-label="${valor} de 5">${estrellasLlenas}${estrellasVacias}</span>`;
  return resultado;
}

/* -------------------------------------------------------
   Funciones que generan bloques de HTML
------------------------------------------------------- */

// Genera el botón de compra que aparece si el juego tiene stock.
function crearBotonComprar() {
  let resultado = `<button class="btn btn-primary mt-3" id="boton-comprar">Comprar</button>`;
  return resultado;
}

// Genera el HTML de la galería de imágenes con imagen principal, flechas y miniaturas.
function crearGaleria(imagenes) {
  let miniaturas = "";

  // forEach recibe el índice como segundo parámetro, así evitamos el contador manual
  imagenes.forEach((urlImagen, indiceMiniatura) => {
    let claseActiva = indiceMiniatura == 0 ? "activa" : "";
    miniaturas += `
            <button type="button" data-indice="${indiceMiniatura}"
                    class="${claseActiva}"
                    aria-label="Imagen ${indiceMiniatura + 1}">
                <img src="${urlImagen}" alt="" loading="lazy" />
            </button>`;
  });

  let resultado = `
        <div class="galeria">
            <div class="galeria__principal">
                <img id="galeria-img" src="${imagenes[0]}" alt="Imagen del juego"
                     onerror="this.src='https://picsum.photos/seed/fallback/1200/675'" />
                <button type="button" class="galeria__flecha galeria__flecha--prev" id="galeria-prev" aria-label="Anterior">‹</button>
                <button type="button" class="galeria__flecha galeria__flecha--next" id="galeria-next" aria-label="Siguiente">›</button>
                <div class="galeria__indicador"><span id="galeria-indice">1</span> / ${imagenes.length}</div>
            </div>
            <div class="galeria__miniaturas" id="galeria-miniaturas">
                ${miniaturas}
            </div>
        </div>`;
  return resultado;
}

// Genera el HTML del formulario para publicar una reseña nueva.
// Incluye campo de nombre, selector de estrellas interactivo y área de texto.
function crearFormularioResenia() {
  let estrellasHTML = "";
  for (let numero = 1; numero <= 5; numero++) {
    estrellasHTML += `<span class="estrella" data-valor="${numero}" role="radio" aria-checked="false" tabindex="0">★</span>`;
  }

  let resultado = `
        <div class="form-resenia" id="form-resenia">
            <h3>Deja tu reseña</h3>
            <form id="form-nueva-resenia" novalidate>
                <div class="form-resenia__campo">
                    <label for="resenia-autor">Tu nombre</label>
                    <input type="text" id="resenia-autor" name="autor" required maxlength="80" />
                </div>
                <div class="form-resenia__campo">
                    <label>Valoración</label>
                    <div class="estrellas" id="estrellas-input" role="radiogroup" aria-label="Valoración de 1 a 5 estrellas">
                        ${estrellasHTML}
                    </div>
                    <input type="hidden" id="resenia-valoracion" name="valoracion" value="0" />
                </div>
                <div class="form-resenia__campo">
                    <label for="resenia-contenido">Tu reseña</label>
                    <textarea id="resenia-contenido" name="contenido" required maxlength="1000"
                              placeholder="Cuéntanos qué te ha parecido el juego..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Publicar reseña</button>
                <div class="form-resenia__mensaje" id="form-mensaje"></div>
            </form>
        </div>`;
  return resultado;
}

// Genera el HTML de la lista de reseñas de un juego.
// Si la lista está vacía muestra un mensaje de "sin reseñas todavía".
function renderResenias(lista) {
  let reseniaHTML = "";
  let resultado = "";

  if (!lista || lista.length == 0) {
    resultado =
      '<li class="list-group-item text-muted">Este juego no tiene reseñas todavía.</li>';
  } else {
    lista.forEach((resenia) => {
      let fechaTexto = "";
      if (resenia.fecha) {
        fechaTexto = new Date(resenia.fecha).toLocaleString("es-ES");
      }
      reseniaHTML += `
                <li class="list-group-item">
                    <div class="desarrolladora-flex justify-content-between align-items-center mb-2">
                        <strong>${escapar(resenia.autor)}</strong>
                        ${pintarEstrellasResenia(resenia.valoracion)}
                    </div>
                    <p class="mb-1">${escapar(resenia.contenido)}</p>
                    <small class="text-muted">
                        Publicado el ${fechaTexto}
                    </small>
                </li>`;
    });
    resultado = reseniaHTML;
  }

  return resultado;
}

/* -------------------------------------------------------
   Inicio de la página (se ejecuta al cargar el DOM)
------------------------------------------------------- */

// Monta la navbar, el footer, carga el juego desde la URL y construye toda la página.
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("navbar").innerHTML = crearBarraNavegacion();
  document
    .getElementById("toggle-admin")
    .addEventListener("click", (evento) => {
      evento.preventDefault();
      toggleAdmin();
    });

  if (esAdmin()) {
    document.body.classList.add("modo-admin");
  }

  const footerEl = document.getElementById("footer");
  if (footerEl) {
    footerEl.innerHTML = crearFooter();
  }

  const parametros = new URLSearchParams(window.location.search);
  const idJuego = parametros.get("id");
  const raiz = document.getElementById("root");
  let cargaExitosa = true;
  let juego = null;
  let resenias = [];

  if (!idJuego) {
    raiz.innerHTML = `<div class="container"><p class="text-danger">Falta el id del juego.</p></div>`;
    cargaExitosa = false;
  }

  if (cargaExitosa) {
    try {
      juego = await juegoAPI.obtenerPorId(idJuego);
      resenias = await juegoAPI.obtenerResenias(idJuego);
    } catch (errorCarga) {
      raiz.innerHTML = `<div class="container"><p class="text-danger">No se pudo cargar el juego: ${escapar(errorCarga.message)}</p></div>`;
      cargaExitosa = false;
    }
  }

  if (cargaExitosa) {
    document.title = `${juego.titulo} - STEMGAME`;

    const imagenes = generarImagenesJuego(juego);

    // Construir el texto de desarrolladoras
    let desarrolladorasTexto = "";
    if (juego.desarrolladoras && juego.desarrolladoras.length > 0) {
      let partesDesarrolladoras = [];
      juego.desarrolladoras.forEach((desarrolladora) => {
        let enlace = "";
        let textoDesarrolladora = "";
        if (desarrolladora.sitioWeb) {
          enlace = `<a href="${escapar(desarrolladora.sitioWeb)}" target="_blank" rel="noopener">${escapar(desarrolladora.nombre)}</a>`;
        } else {
          enlace = escapar(desarrolladora.nombre);
        }
        if (desarrolladora.pais) {
          textoDesarrolladora = `${enlace} <span class="text-muted">(${escapar(desarrolladora.pais)})</span>`;
        } else {
          textoDesarrolladora = enlace;
        }
        partesDesarrolladoras.push(textoDesarrolladora);
      });
      desarrolladorasTexto = partesDesarrolladoras.join(", ");
    } else {
      desarrolladorasTexto =
        '<span class="text-muted">Sin desarrolladoras asignadas</span>';
    }

    // Construir el HTML de la lista de plataformas
    let htmlPlataformas = "";
    if (juego.plataformas && juego.plataformas.length > 0) {
      juego.plataformas.forEach((plataforma) => {
        let fabricanteTexto = "";
        if (plataforma.fabricante) {
          fabricanteTexto = `<span class="text-muted"> — ${escapar(plataforma.fabricante)}</span>`;
        }
        htmlPlataformas += `
                    <li class="list-group-item">
                        <strong>${escapar(plataforma.nombre)}</strong>
                        ${fabricanteTexto}
                    </li>`;
      });
    } else {
      htmlPlataformas =
        '<li class="list-group-item text-muted">Sin plataformas asignadas.</li>';
    }

    // Botón de compra o mensaje de no disponible
    let seccionCompra = "";
    if (juego.stock > 0) {
      seccionCompra = crearBotonComprar();
    } else {
      seccionCompra =
        '<p class="text-danger mt-3"><strong>No disponible</strong></p>';
    }

    raiz.innerHTML = `
            <div class="container mt-4 mb-5">
                <a href="catalogo.html" class="btn btn-link mb-3">← Volver al catálogo</a>

                <h1 class="mb-4">${escapar(juego.titulo)}</h1>

                ${crearGaleria(imagenes)}

                <div class="card mb-4">
                    <div class="card-header">
                        <h2 class="h5 mb-0">Información del Juego</h2>
                    </div>
                    <div class="card-body">
                        <p><strong>Descripción:</strong> ${escapar(juego.descripcion)}</p>
                        <p><strong>Género:</strong> ${escapar(juego.genero)}</p>
                        <p><strong>Desarrolladora:</strong> ${desarrolladorasTexto}</p>
                        <p><strong>Clasificación PEGI:</strong> ${escapar(juego.clasificacionPEGI)}</p>
                        <p><strong>Precio Base:</strong> ${juego.precioBase.toFixed(2)} €</p>
                        <p><strong>Fecha de Salida:</strong> ${new Date(juego.fechaDeSalida).toLocaleDateString("es-ES")}</p>
                        <p><strong>Disponible:</strong> ${juego.stock > 0 ? "Sí" : "No"}</p>
                        <p><strong>Stock:</strong> ${juego.stock}</p>
                        ${seccionCompra}
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h2 class="h5 mb-0">Plataformas</h2>
                    </div>
                    <ul class="list-group list-group-flush">
                        ${htmlPlataformas}
                    </ul>
                </div>

                <h2 class="mt-4 mb-3">Reseñas</h2>
                <ul class="list-group mb-4" id="lista-resenias">
                    ${renderResenias(resenias)}
                </ul>

                ${crearFormularioResenia()}
            </div>`;

    /* -------------------------------------------------------
           Galería de imágenes
        ------------------------------------------------------- */
    let indiceActual = 0;
    const imgPrincipal = document.getElementById("galeria-img");
    const indicador = document.getElementById("galeria-indice");
    const miniaturas = document.querySelectorAll("#galeria-miniaturas button");

    // Cambia la imagen principal de la galería y marca la miniatura correspondiente como activa.
    // El módulo hace que al pasar del último vuelva al primero y viceversa.
    function mostrarImagen(nuevaPosicion) {
      let indiceTotal = nuevaPosicion + imagenes.length;
      indiceActual = indiceTotal % imagenes.length;
      imgPrincipal.src = imagenes[indiceActual];
      indicador.textContent = String(indiceActual + 1);
      for (let i = 0; i < miniaturas.length; i++) {
        miniaturas[i].classList.toggle("activa", i == indiceActual);
      }
    }

    document
      .getElementById("galeria-prev")
      .addEventListener("click", () => mostrarImagen(indiceActual - 1));
    document
      .getElementById("galeria-next")
      .addEventListener("click", () => mostrarImagen(indiceActual + 1));

    miniaturas.forEach((botonMiniatura) => {
      botonMiniatura.addEventListener("click", () =>
        mostrarImagen(Number(botonMiniatura.dataset.indice)),
      );
    });

    // Clic en la imagen principal abre el lightbox de zoom
    imgPrincipal.addEventListener("click", () =>
      abrirLightbox(imagenes[indiceActual]),
    );

    // Crea una capa oscura encima de la página con la imagen ampliada.
    // Se cierra al hacer clic en cualquier parte o al pulsar Escape.
    function abrirLightbox(src) {
      let capa = document.createElement("div");
      capa.className = "lightbox";
      capa.innerHTML = `
                <button class="lightbox__cerrar" aria-label="Cerrar zoom">✕</button>
                <img src="${src}" alt="Imagen ampliada" />`;
      const cerrar = () => capa.remove();
      capa.addEventListener("click", cerrar);
      document.addEventListener(
        "keydown",
        function alPulsarEscape(eventoTeclado) {
          if (eventoTeclado.key == "Escape") {
            cerrar();
            document.removeEventListener("keydown", alPulsarEscape);
          }
        },
      );
      document.body.appendChild(capa);
    }

    /* -------------------------------------------------------
           Botón de compra
        ------------------------------------------------------- */
    const botonComprar = document.getElementById("boton-comprar");
    if (botonComprar) {
      botonComprar.addEventListener("click", async () => {
        try {
          // Llama al backend (PUT) para que reste 1 al stock y devuelve el juego actualizado
          const juegoActualizado = await juegoAPI.comprar(idJuego);
          juego = juegoActualizado;

          // Refresca el stock que se muestra en la página
          const parrafos = raiz.querySelectorAll(".card-body p");
          parrafos.forEach((p) => {
            if (p.textContent.startsWith("Stock:")) {
              p.innerHTML = `<strong>Stock:</strong> ${juego.stock}`;
            }
          });

          alert(
            `Has comprado "${juego.titulo}" por ${juego.precioBase.toFixed(2)} €. Stock restante: ${juego.stock}`,
          );

          // Si ya no queda stock, ocultamos el botón de comprar
          if (juego.stock <= 0) {
            botonComprar.remove();
          }
        } catch (errorCompra) {
          alert(`No se pudo completar la compra: ${errorCompra.message}`);
        }
      });
    }

    /* -------------------------------------------------------
           Formulario de reseña con selección de estrellas
        ------------------------------------------------------- */
    const contenedorEstrellas = document.getElementById("estrellas-input");
    const estrellas = contenedorEstrellas.querySelectorAll(".estrella");
    const inputValoracion = document.getElementById("resenia-valoracion");
    let valoracionSeleccionada = 0;

    // Pinta las estrellas del formulario según el valor dado (0-5).
    // También actualiza el atributo aria-checked para accesibilidad.
    // forEach recibe el índice como segundo parámetro, así evitamos el contador manual.
    function pintar(valor) {
      estrellas.forEach((estrella, indice) => {
        estrella.classList.toggle("activa", indice < valor);
        estrella.setAttribute(
          "aria-checked",
          indice == valor - 1 ? "true" : "false",
        );
      });
    }

    estrellas.forEach((estrella) => {
      let valorEstrella = Number(estrella.dataset.valor);

      estrella.addEventListener("mouseenter", () => pintar(valorEstrella));

      estrella.addEventListener("click", () => {
        valoracionSeleccionada = valorEstrella;
        inputValoracion.value = String(valorEstrella);
        pintar(valorEstrella);
      });

      // Accesibilidad: seleccionar estrella con teclado
      estrella.addEventListener("keydown", (eventoTeclado) => {
        if (eventoTeclado.key == "Enter" || eventoTeclado.key == " ") {
          eventoTeclado.preventDefault();
          valoracionSeleccionada = valorEstrella;
          inputValoracion.value = String(valorEstrella);
          pintar(valorEstrella);
        }
      });
    });

    contenedorEstrellas.addEventListener("mouseleave", () =>
      pintar(valoracionSeleccionada),
    );

    /* -------------------------------------------------------
           Envío del formulario de reseña
        ------------------------------------------------------- */
    const formulario = document.getElementById("form-nueva-resenia");
    const mensajeFormulario = document.getElementById("form-mensaje");

    formulario.addEventListener("submit", async (eventoFormulario) => {
      let autor = document.getElementById("resenia-autor").value.trim();
      let contenido = document.getElementById("resenia-contenido").value.trim();
      let valoracion = Number(inputValoracion.value);
      let formularioValido =
        autor && contenido && valoracion >= 1 && valoracion <= 5;

      eventoFormulario.preventDefault();
      mensajeFormulario.className = "form-resenia__mensaje";
      mensajeFormulario.textContent = "";

      if (!formularioValido) {
        mensajeFormulario.classList.add("error");
        mensajeFormulario.textContent =
          "Rellena nombre, valoración (1-5) y reseña.";
      } else {
        let payload = { autor, contenido, valoracion };
        try {
          let reseniaCreada = await reseniaAPI.crearParaJuego(idJuego, payload);
          mensajeFormulario.classList.add("ok");
          mensajeFormulario.textContent = "¡Reseña publicada!";
          formulario.reset();
          valoracionSeleccionada = 0;
          pintar(0);

          // Refrescar la lista de reseñas
          try {
            resenias = await juegoAPI.obtenerResenias(idJuego);
          } catch {
            resenias.unshift(reseniaCreada || payload);
          }
          document.getElementById("lista-resenias").innerHTML =
            renderResenias(resenias);
        } catch (errorPublicacion) {
          mensajeFormulario.classList.add("error");
          mensajeFormulario.textContent = `No se pudo publicar la reseña: ${errorPublicacion.message}`;
        }
      }
    });
  }
});
