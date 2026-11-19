// Genera el HTML del pie de página con el año actual calculado automáticamente.
export function crearFooter() {
  return `
 <footer>
      <div>
        <p>
          © ${new Date().getFullYear()} STEMGAME. Todos los derechos reservados.
        </p>

        <a href="mailto:STEMGAME@gmail.com">
          Contacta con nosotros
        </a>
      </div>
    </footer>
    `;
}
