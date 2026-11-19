import { fetchApi } from "../utils/apiUtils.js";

// Agrupa todas las llamadas al servidor relacionadas con desarrolladoras.
export const desarrolladoraAPI = {
  // Devuelve la lista completa de desarrolladoras
  obtenerTodos: () => fetchApi("GET", "/desarrolladoras"),

  // Devuelve una desarrolladora por su id
  obtenerPorId: (id) => fetchApi("GET", `/desarrolladoras/${id}`),

  // Crea una desarrolladora nueva
  crear: (desarrolladora) =>
    fetchApi("POST", "/desarrolladoras", desarrolladora),

  // Actualiza los datos de una desarrolladora existente
  actualizar: (id, desarrolladora) =>
    fetchApi("PUT", `/desarrolladoras/${id}`, desarrolladora),

  // Elimina una desarrolladora por su id
  eliminar: (id) => fetchApi("DELETE", `/desarrolladoras/${id}`),
};
