import { desarrolladoraAPI } from "../api/desarrolladoraAPI.js";
import { crearBarraNavegacion } from "../components/navbar.js";
import { crearFooter } from "../components/footer.js";

// Muestra la página de detalle de una desarrolladora concreta.
// Lee el id de la URL (?id=2), pide la desarrolladora al servidor
// y muestra todos sus atributos en tarjetas de solo lectura.

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

// Monta la navbar, el footer, carga la desarrolladora y construye la página.
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("navbar").innerHTML = crearBarraNavegacion();

  const footerEl = document.getElementById("footer");
  if (footerEl) {
    footerEl.innerHTML = crearFooter();
  }

  const parametros = new URLSearchParams(window.location.search);
  const idDesarrolladora = parametros.get("id");
  const raiz = document.getElementById("root");
  let cargaExitosa = true;
  let desarrolladora = null;

  // Comprobamos que el id viene en la URL
  if (!idDesarrolladora) {
    raiz.innerHTML = `<div class="container"><p class="text-danger">Falta el id de la desarrolladora.</p></div>`;
    cargaExitosa = false;
  }

  // Pedimos la desarrolladora al servidor
  if (cargaExitosa) {
    try {
      desarrolladora = await desarrolladoraAPI.obtenerPorId(idDesarrolladora);
    } catch (errorCarga) {
      raiz.innerHTML = `<div class="container"><p class="text-danger">No se pudo cargar la desarrolladora: ${escapar(errorCarga.message)}</p></div>`;
      cargaExitosa = false;
    }
  }

  if (cargaExitosa) {
    document.title = `${escapar(desarrolladora.nombre)} - STEMGAME`;

    // Si tiene sitio web construimos un enlace clicable; si no, mostramos "—"
    let enlaceSitioWeb = "—";
    if (desarrolladora.sitioWeb) {
      enlaceSitioWeb = `<a href="${escapar(desarrolladora.sitioWeb)}" target="_blank" rel="noopener">${escapar(desarrolladora.sitioWeb)}</a>`;
    }

    raiz.innerHTML = `
            <div class="container mt-4 mb-5">
                <a href="admin.html" class="btn btn-link mb-3">← Volver al panel</a>

                <h1 class="mb-1">${escapar(desarrolladora.nombre)}</h1>
                <p class="text-muted mb-4">ID: ${escapar(String(desarrolladora.id))}</p>

                <div class="card mb-4">
                    <div class="card-header">
                        <h2 class="h5 mb-0">Información de la desarrolladora</h2>
                    </div>
                    <div class="card-body">
                        <p><strong>Nombre:</strong> ${escapar(desarrolladora.nombre)}</p>
                        <p><strong>País:</strong> ${escapar(desarrolladora.pais || "—")}</p>
                        <p><strong>Sitio web:</strong> ${enlaceSitioWeb}</p>
                    </div>
                </div>
            </div>`;
  }
});
