import { esAdmin } from "../config/adminConfig.js";

// Genera el HTML de la barra de navegación.
// Si el modo admin está activo, cambia el texto y el estilo del enlace de admin.
export function crearBarraNavegacion() {
  const adminActivo = esAdmin();
  const textoAdmin = adminActivo ? "Salir del modo admin" : "Modo admin";
  const claseAdmin = adminActivo
    ? "nav-link nav-link--admin-activo"
    : "nav-link";

  return `
        <nav class="navbar">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html" aria-label="Ir a la página de inicio">
                    <img src="img/logo.png" alt="STEMGAME" />
                </a>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="catalogo.html">Catálogo</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="sobreNosotros.html">Sobre Nosotros</a>
                    </li>
                    <li class="nav-item">
                        <a href="#" id="toggle-admin" class="${claseAdmin}">${textoAdmin}</a>
                    </li>
                </ul>
            </div>
        </nav>
    `;
}
