import { fetchApi } from "../utils/apiUtils.js";

// Agrupa todas las llamadas al servidor relacionadas con reseñas.
export const reseniaAPI = {
  // Devuelve todas las reseñas
  obtenerTodos: () => fetchApi("GET", "/resenias"),

  // Devuelve una reseña por su id
  obtenerPorId: (id) => fetchApi("GET", `/resenias/${id}`),

  // Crea una reseña nueva
  crear: (resenia) => fetchApi("POST", "/resenias", resenia),

  // Actualiza una reseña existente
  actualizar: (id, resenia) => fetchApi("PUT", `/resenias/${id}`, resenia),

  // Elimina una reseña por su id
  eliminar: (id) => fetchApi("DELETE", `/resenias/${id}`),

  // Crea una reseña asociada directamente a un juego concreto.
  // Se usa en la página de detalle de juego al enviar el formulario.
  crearParaJuego: (idJuego, resenia) =>
    fetchApi("POST", `/juegos/${idJuego}/resenias`, resenia),
};
