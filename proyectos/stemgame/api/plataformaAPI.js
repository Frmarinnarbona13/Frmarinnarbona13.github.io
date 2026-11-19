import { fetchApi } from "../utils/apiUtils.js";

// Agrupa todas las llamadas al servidor relacionadas con plataformas.
export const plataformaAPI = {
  // Devuelve la lista completa de plataformas
  obtenerTodos: () => fetchApi("GET", "/plataformas"),

  // Devuelve una plataforma por su id
  obtenerPorId: (id) => fetchApi("GET", `/plataformas/${id}`),

  // Crea una plataforma nueva
  crear: (plataforma) => fetchApi("POST", "/plataformas", plataforma),

  // Actualiza los datos de una plataforma existente
  actualizar: (id, plataforma) =>
    fetchApi("PUT", `/plataformas/${id}`, plataforma),

  // Elimina una plataforma por su id
  eliminar: (id) => fetchApi("DELETE", `/plataformas/${id}`),
};
