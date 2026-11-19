import { clienteAPI } from "../api/clienteAPI.js";
import { crearBarraNavegacion } from "../components/navbar.js";
import { crearFooter } from "../components/footer.js";

// Muestra la página de detalle de un cliente concreto.
// Lee el id del cliente de la URL (?id=5), pide el cliente al servidor
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

// Convierte una fecha a formato legible en español (DD/MM/YYYY).
// Devuelve "—" si la fecha no existe o no es válida.
function formatearFecha(fecha) {
  let resultado = "—";
  if (fecha) {
    let fechaObj = new Date(fecha);
    if (!isNaN(fechaObj)) {
      resultado = fechaObj.toLocaleDateString("es-ES");
    }
  }
  return resultado;
}

/* -------------------------------------------------------
   Inicio de la página (se ejecuta al cargar el DOM)
------------------------------------------------------- */

// Monta la navbar, el footer, carga el cliente desde la URL y construye la página.
document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("navbar").innerHTML = crearBarraNavegacion();

  const footerEl = document.getElementById("footer");
  if (footerEl) {
    footerEl.innerHTML = crearFooter();
  }

  const parametros = new URLSearchParams(window.location.search);
  const idCliente = parametros.get("id");
  const raiz = document.getElementById("root");
  let cargaExitosa = true;
  let cliente = null;

  // Comprobamos que el id viene en la URL
  if (!idCliente) {
    raiz.innerHTML = `<div class="container"><p class="text-danger">Falta el id del cliente.</p></div>`;
    cargaExitosa = false;
  }

  // Pedimos el cliente al servidor
  if (cargaExitosa) {
    try {
      cliente = await clienteAPI.obtenerPorId(idCliente);
    } catch (errorCarga) {
      raiz.innerHTML = `<div class="container"><p class="text-danger">No se pudo cargar el cliente: ${escapar(errorCarga.message)}</p></div>`;
      cargaExitosa = false;
    }
  }

  if (cargaExitosa) {
    document.title = `${escapar(cliente.nombre)} - STEMGAME`;

    let badgeSocio = "";
    if (cliente.esSocio) {
      badgeSocio = `<span class="badge-fabricante">Socio</span>`;
    } else {
      badgeSocio = `<span class="badge-fabricante" style="background:var(--color-texto-suave)">No socio</span>`;
    }

    raiz.innerHTML = `
            <div class="container mt-4 mb-5">
                <a href="admin.html" class="btn btn-link mb-3">← Volver al panel</a>

                <h1 class="mb-1">${escapar(cliente.nombre)} ${badgeSocio}</h1>
                <p class="text-muted mb-4">ID: ${escapar(String(cliente.id))}</p>

                <div class="card mb-4">
                    <div class="card-header">
                        <h2 class="h5 mb-0">Datos personales</h2>
                    </div>
                    <div class="card-body">
                        <p><strong>Nombre:</strong> ${escapar(cliente.nombre)}</p>
                        <p><strong>Email:</strong> ${escapar(cliente.email || "—")}</p>
                        <p><strong>Edad:</strong> ${escapar(String(cliente.edad ?? "—"))}</p>
                        <p><strong>Fecha de inscripción:</strong> ${formatearFecha(cliente.fechaDeInscripcion)}</p>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h2 class="h5 mb-0">Cuenta de socio</h2>
                    </div>
                    <div class="card-body">
                        <p><strong>Es socio:</strong> ${cliente.esSocio ? "Sí" : "No"}</p>
                        <p><strong>Puntos acumulados:</strong> ${escapar(String(cliente.puntosSocio ?? 0))}</p>
                    </div>
                </div>
            </div>`;
  }
});
