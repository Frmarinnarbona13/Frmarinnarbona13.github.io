import { fetchApi } from "../utils/apiUtils.js";

// Agrupa todas las llamadas al servidor relacionadas con juegos.
// Cada método devuelve una promesa con el resultado de la petición.
export const juegoAPI = {
  // Devuelve la lista completa de juegos
  obtenerTodos: () => fetchApi("GET", "/juegos"),

  // Devuelve un juego por su id
  obtenerPorId: (id) => fetchApi("GET", `/juegos/${id}`),

  // Busca un juego exacto por su título
  obtenerPorTitulo: (titulo) => fetchApi("GET", `/juegos/titulo/${titulo}`),

  // Devuelve las reseñas de un juego concreto
  obtenerResenias: (id) => fetchApi("GET", `/juegos/${id}/resenias`),

  // Crea un juego nuevo con los datos del objeto recibido
  crear: (juego) => fetchApi("POST", "/juegos", juego),

  // Actualiza un juego existente (se necesita el id y los nuevos datos)
  actualizar: (id, juego) => fetchApi("PUT", `/juegos/${id}`, juego),

  // Compra una unidad del juego: el servidor le resta 1 al stock
  comprar: (id) => fetchApi("PUT", `/juegos/${id}/comprar`),

  // Elimina un juego por su id
  eliminar: (id) => fetchApi("DELETE", `/juegos/${id}`),

  // Devuelve los juegos que pertenecen a un género concreto
  obtenerPorGenero: (genero) =>
    fetchApi("GET", `/juegos/genero/${encodeURIComponent(genero)}`),

  // Devuelve los juegos disponibles en una plataforma concreta
  obtenerPorPlataforma: (id) => fetchApi("GET", `/juegos/plataforma/${id}`),
};
