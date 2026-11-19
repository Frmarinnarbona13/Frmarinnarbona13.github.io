import { crearBarraNavegacion } from "../components/navbar.js";
import { crearFooter } from "../components/footer.js";
import { toggleAdmin, esAdmin } from "../config/adminConfig.js";

// Monta la navbar, el footer y el contenido estático de la página "Sobre nosotros".
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("navbar").innerHTML = crearBarraNavegacion();
  document.getElementById("toggle-admin").addEventListener("click", (boton) => {
    boton.preventDefault();
    toggleAdmin();
  });

  // Activar la clase de admin en el body si corresponde
  if (esAdmin()) {
    document.body.classList.add("modo-admin");
  }

  const footerEl = document.getElementById("footer");
  if (footerEl) footerEl.innerHTML = crearFooter();

  const root = document.getElementById("root");

  root.innerHTML = `
        <div class="container sobre-nosotros">
            <section class="hero">
                <h1>Sobre Nosotros</h1>
                <p>
                    Somos un equipo apasionado por los videojuegos y la educación STEM.
                    STEMGAME nace para acercar títulos que enseñan ciencia, tecnología,
                    ingeniería y matemáticas a jugadores de todas las edades.
                </p>
            </section>

            <div class="bloque">
                <h2>Nuestra misión</h2>
                <p>
                    Construir un catálogo de referencia donde encontrar juegos que
                    combinan entretenimiento y aprendizaje. Creemos que jugar es una
                    de las formas más poderosas de descubrir el mundo y, por eso,
                    seleccionamos cuidadosamente cada título.
                </p>
            </div>

            <div class="bloque">
                <h2>Qué hacemos</h2>
                <p>
                    Catalogamos juegos con información detallada: género, plataformas,
                    desarrolladoras, clasificación PEGI, precio y disponibilidad.
                    Además, recogemos reseñas de la comunidad para que tomes la mejor
                    decisión antes de jugar.
                </p>
            </div>

            <div class="bloque">
                <h2>Nuestros valores</h2>
                <div class="features" style="margin-top: 1rem;">
                    <div class="feature">
                        <div class="icono">🎯</div>
                        <h3>Curación</h3>
                        <p>Cada juego se revisa antes de aparecer en el catálogo.</p>
                    </div>
                    <div class="feature">
                        <div class="icono">🤝</div>
                        <h3>Comunidad</h3>
                        <p>Damos voz a jugadores, educadores y desarrolladores.</p>
                    </div>
                    <div class="feature">
                        <div class="icono">📚</div>
                        <h3>Educación</h3>
                        <p>Apostamos por el aprendizaje a través del juego.</p>
                    </div>
                </div>
            </div>

            <div class="bloque">
                <h2>El equipo</h2>
                <p>El proyecto está desarrollado por estudiantes de 1º DAW como proyecto final.</p>
                <div class="equipo">
                    <div class="miembro">
                        <div class="avatar">FM</div>
                        <h4>Francisco Marín</h4>
                        <p>Desarrollo Full Stack</p>
                    </div>
                    <div class="miembro">
                        <div class="avatar">N</div>
                        <h4>IA Gpt</h4>
                        <p>Desarrollo de Diseño y ayudas esporádicas</p>
                    </div>
                </div>
            </div>

            <div class="bloque">
                <h2>Contacto</h2>
                <p>
                    ¿Tienes una sugerencia, una reseña o quieres colaborar?
                    Escríbenos a
                    <a href="mailto:STEMGAME@gmail.com">STEMGAME@gmail.com</a>
                    y te responderemos lo antes posible.
                </p>
            </div>
        </div>`;
});
