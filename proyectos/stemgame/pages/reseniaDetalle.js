import { reseniaAPI } from "../api/reseniaAPI.js";
import { crearBarraNavegacion } from "../components/navbar.js";
import { crearFooter } from "../components/footer.js";

// Muestra la página de detalle de una reseña concreta.
// Lee el id de la URL (?id=7), pide la reseña al servidor
// y muestra todos sus atributos junto con un enlace al juego al que pertenece.

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

// Convierte una fecha a formato legible en español.
// Devuelve "—" si la fecha no existe o no es válida.
function formatearFecha(fecha) {
  let resultado = "—";
  if (fecha) {
    let fechaObj = new Date(fecha);
    if (!isNaN(fechaObj)) {
      resultado = fechaObj.toLocaleString("es-ES");
    }
  }
  return resultado;
}

// Genera el HTML de las estrellas de valoración (de 1 a 5).
// Las estrellas llenas son ★ y las vacías ☆.
function pintarEstrellas(valoracion) {
  let valor = Math.max(0, Math.min(5, Number(valoracion) || 0));
  let estrellasLlenas = "★".repeat(valor);
  let estrellasVacias = "☆".repeat(5 - valor);
  return `<span class="resenia-estrellas" aria-label="${valor} de 5">${estrellasLlenas}${estrellasVacias}</span>`;
}

/* -------------------------------------------------------
   Inicio de la página (se ejecuta al cargar el DOM)
------------------------------------------------------- */

// Monta la navbar, el footer, carga la reseña y construye la página.
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("navbar").innerHTML = crearBarraNavegacion();

  const footerEl = document.getElementById("footer");
  if (footerEl) {
    footerEl.innerHTML = crearFooter();
  }

  const parametros = new URLSearchParams(window.location.search);
  const idResenia = parametros.get("id");
  const raiz = document.getElementById("root");
  let cargaExitosa = true;
  let resenia = null;

  // Comprobamos que el id viene en la URL
  if (!idResenia) {
    raiz.innerHTML = `<div class="container"><p class="text-danger">Falta el id de la reseña.</p></div>`;
    cargaExitosa = false;
  }

  // Pedimos la reseña al servidor
  if (cargaExitosa) {
    try {
      resenia = await reseniaAPI.obtenerPorId(idResenia);
    } catch (errorCarga) {
      raiz.innerHTML = `<div class="container"><p class="text-danger">No se pudo cargar la reseña: ${escapar(errorCarga.message)}</p></div>`;
      cargaExitosa = false;
    }
  }

  if (cargaExitosa) {
    document.title = `Reseña de ${escapar(resenia.autor)} - STEMGAME`;

    // Si tiene juego asociado construimos un enlace a su página de detalle
    let enlaceJuego = "—";
    if (resenia.juegoTitulo && resenia.juegoId) {
      enlaceJuego = `<a href="juegoDetalle.html?id=${resenia.juegoId}">${escapar(resenia.juegoTitulo)}</a>`;
    } else if (resenia.juegoTitulo) {
      enlaceJuego = escapar(resenia.juegoTitulo);
    }

    raiz.innerHTML = `
            <div class="container mt-4 mb-5">
                <a href="admin.html" class="btn btn-link mb-3">← Volver al panel</a>

                <h1 class="mb-1">Reseña de ${escapar(resenia.autor)}</h1>
                <p class="text-muted mb-4">ID: ${escapar(String(resenia.id))}</p>

                <div class="card mb-4">
                    <div class="card-header">
                        <h2 class="h5 mb-0">Contenido de la reseña</h2>
                    </div>
                    <div class="card-body">
                        <p><strong>Autor:</strong> ${escapar(resenia.autor)}</p>
                        <p><strong>Valoración:</strong> ${pintarEstrellas(resenia.valoracion)}</p>
                        <p><strong>Fecha:</strong> ${formatearFecha(resenia.fecha)}</p>
                        <p><strong>Juego:</strong> ${enlaceJuego}</p>
                        <hr />
                        <p class="mt-3">${escapar(resenia.contenido)}</p>
                    </div>
                </div>
            </div>`;
  }
});
