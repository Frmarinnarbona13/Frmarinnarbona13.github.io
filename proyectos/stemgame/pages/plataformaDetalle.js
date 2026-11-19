import { plataformaAPI } from "../api/plataformaAPI.js";
import { juegoAPI } from "../api/juegoAPI.js";
import { crearBarraNavegacion } from "../components/navbar.js";
import { crearFooter } from "../components/footer.js";

// Muestra la página de detalle de una plataforma concreta.
// Lee el id de la URL (?id=3), pide la plataforma y sus juegos al servidor
// y muestra todos los atributos junto con la lista de juegos disponibles.

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

/* -------------------------------------------------------
   Inicio de la página (se ejecuta al cargar el DOM)
------------------------------------------------------- */

// Monta la navbar, el footer, carga la plataforma y sus juegos, y construye la página.
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("navbar").innerHTML = crearBarraNavegacion();

  const footerEl = document.getElementById("footer");
  if (footerEl) {
    footerEl.innerHTML = crearFooter();
  }

  const parametros = new URLSearchParams(window.location.search);
  const idPlataforma = parametros.get("id");
  const raiz = document.getElementById("root");
  let cargaExitosa = true;
  let plataforma = null;
  let juegos = [];

  // Comprobamos que el id viene en la URL
  if (!idPlataforma) {
    raiz.innerHTML = `<div class="container"><p class="text-danger">Falta el id de la plataforma.</p></div>`;
    cargaExitosa = false;
  }

  // Pedimos la plataforma y sus juegos al servidor
  if (cargaExitosa) {
    try {
      plataforma = await plataformaAPI.obtenerPorId(idPlataforma);
      juegos = await juegoAPI.obtenerPorPlataforma(idPlataforma);
    } catch (errorCarga) {
      raiz.innerHTML = `<div class="container"><p class="text-danger">No se pudo cargar la plataforma: ${escapar(errorCarga.message)}</p></div>`;
      cargaExitosa = false;
    }
  }

  if (cargaExitosa) {
    document.title = `${escapar(plataforma.nombre)} - STEMGAME`;

    // Construimos la lista de juegos de esta plataforma
    let juegoFilas = "";
    if (juegos.length == 0) {
      juegoFilas =
        '<li class="list-group-item text-muted">No hay juegos registrados en esta plataforma.</li>';
    } else {
      juegos.forEach((juego) => {
        juegoFilas += `
                    <li class="list-group-item">
                        <a href="juegoDetalle.html?id=${juego.id}">${escapar(juego.titulo)}</a>
                        <span class="text-muted"> — ${escapar(juego.genero || "")}</span>
                    </li>`;
      });
    }

    raiz.innerHTML = `
            <div class="container mt-4 mb-5">
                <a href="admin.html" class="btn btn-link mb-3">← Volver al panel</a>

                <h1 class="mb-1">${escapar(plataforma.nombre)}</h1>
                <p class="text-muted mb-4">ID: ${escapar(String(plataforma.id))}</p>

                <div class="card mb-4">
                    <div class="card-header">
                        <h2 class="h5 mb-0">Información de la plataforma</h2>
                    </div>
                    <div class="card-body">
                        <p><strong>Nombre:</strong> ${escapar(plataforma.nombre)}</p>
                        <p><strong>Fabricante:</strong> ${escapar(plataforma.fabricante || "—")}</p>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h2 class="h5 mb-0">Juegos disponibles (${juegos.length})</h2>
                    </div>
                    <ul class="list-group list-group-flush">
                        ${juegoFilas}
                    </ul>
                </div>
            </div>`;
  }
});
