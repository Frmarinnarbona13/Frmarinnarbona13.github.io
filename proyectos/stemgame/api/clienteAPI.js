import { fetchApi } from "../utils/apiUtils.js";

// Agrupa todas las llamadas al servidor relacionadas con clientes.
export const clienteAPI = {
  // Devuelve la lista completa de clientes
  obtenerTodos: () => fetchApi("GET", "/clientes"),

  // Devuelve un cliente por su id
  obtenerPorId: (id) => fetchApi("GET", `/clientes/${id}`),

  // Crea un cliente nuevo
  crear: (cliente) => fetchApi("POST", "/clientes", cliente),

  // Actualiza los datos de un cliente existente
  actualizar: (id, cliente) => fetchApi("PUT", `/clientes/${id}`, cliente),

  // Elimina un cliente por su id
  eliminar: (id) => fetchApi("DELETE", `/clientes/${id}`),
};
