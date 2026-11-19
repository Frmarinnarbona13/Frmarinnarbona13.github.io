import { crearBarraNavegacion } from "../components/navbar.js";
import { crearFooter } from "../components/footer.js";
import { toggleAdmin, esAdmin } from "../config/adminConfig.js";

// Cuando el DOM está listo, montamos la navbar, el footer y el contenido principal.
// Si el usuario es admin, muestra el panel de gestión; si no, muestra la página de inicio normal.
document.addEventListener("DOMContentLoaded", () => {
  // Montamos la barra de navegación y el botón de toggle del modo admin
  document.getElementById("navbar").innerHTML = crearBarraNavegacion();
  document
    .getElementById("toggle-admin")
    .addEventListener("click", (evento) => {
      evento.preventDefault();
      toggleAdmin();
    });

  // Si el admin está activo, añadimos la clase al body para que el CSS muestre los botones de edición
  if (esAdmin()) {
    document.body.classList.add("modo-admin");
  }

  const footerEl = document.getElementById("footer");
  if (footerEl) {
    footerEl.innerHTML = crearFooter();
  }

  const root = document.getElementById("root");

  if (esAdmin()) {
    // En modo admin mostramos un panel de acceso rápido al área de gestión
    root.innerHTML = `
            <div class="container">
                <section class="admin-bienvenida">
                    <div class="admin-bienvenida__texto">
                        <h1>Panel de Administración</h1>
                        <p class="text-muted">
                            Estás en modo administrador. Accede al panel para gestionar todos los recursos
                            de STEMGAME: juegos, reseñas, clientes, desarrolladoras y plataformas.
                        </p>
                        <a href="admin.html" class="btn btn-primary">Ir al panel de administración →</a>
                    </div>
                </section>
            </div>`;
  } else {
    root.innerHTML = `
            <div class="container">
                <section class="hero">
                    <h1>Bienvenido a STEMGAME</h1>
                    <p>
                        Tu plataforma para descubrir videojuegos educativos y de ciencia,
                        tecnología, ingeniería y matemáticas. Explora títulos, lee reseñas
                        y encuentra el siguiente juego que despertará tu curiosidad.
                    </p>
                    <div class="acciones">
                        <a href="catalogo.html" class="btn btn-primary">Ver catálogo</a>
                        <a href="sobreNosotros.html" class="btn btn-outline">Sobre nosotros</a>
                    </div>
                </section>

                <section class="seccion-titulo">
                    <h2>¿Qué encontrarás en STEMGAME?</h2>
                    <p>Una experiencia pensada para jugadores curiosos y educadores.</p>
                </section>

                <div class="features">
                    <div class="feature">
                        <div class="icono">🎮</div>
                        <h3>Catálogo amplio</h3>
                        <p>Explora juegos clasificados por género, plataforma y clasificación PEGI.</p>
                    </div>
                    <div class="feature">
                        <div class="icono">🔬</div>
                        <h3>Enfoque STEM</h3>
                        <p>Selección de títulos que combinan diversión y aprendizaje en ciencia y tecnología.</p>
                    </div>
                    <div class="feature">
                        <div class="icono">⭐</div>
                        <h3>Reseñas reales</h3>
                        <p>Lee la opinión de la comunidad antes de elegir tu próximo juego.</p>
                    </div>
                    <div class="feature">
                        <div class="icono">🚀</div>
                        <h3>Siempre actualizado</h3>
                        <p>Novedades, lanzamientos y desarrolladoras emergentes en un solo lugar.</p>
                    </div>
                </div>

                <section class="seccion-titulo">
                    <h2>Empieza ahora</h2>
                    <p>Encuentra tu próximo juego favorito en cuestión de segundos.</p>
                    <div class="acciones">
                        <a href="catalogo.html" class="btn btn-primary">Explorar catálogo</a>
                    </div>
                </section>
            </div>`;
  }
});
