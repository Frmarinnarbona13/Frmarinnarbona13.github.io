// Importamos las APIs de cada entidad y los componentes de la interfaz
import { juegoAPI } from "../api/juegoAPI.js";
import { clienteAPI } from "../api/clienteAPI.js";
import { desarrolladoraAPI } from "../api/desarrolladoraAPI.js";
import { plataformaAPI } from "../api/plataformaAPI.js";
import { crearBarraNavegacion } from "../components/navbar.js";
import { crearFooter } from "../components/footer.js";
import { toggleAdmin, esAdmin } from "../config/adminConfig.js";
import { reseniaAPI } from "../api/reseniaAPI.js";

/* -------------------------------------------------------
   Funciones de utilidad
------------------------------------------------------- */

/**
 * Escapa caracteres especiales de HTML para evitar que el texto
 * se interprete como código. Siempre hay que usar esto antes de
 * meter texto de usuario en el HTML.
 */
function escapar(texto) {
  let textoSeguro = String(texto || "");
  textoSeguro = textoSeguro.replace(/&/g, "&amp;");
  textoSeguro = textoSeguro.replace(/</g, "&lt;");
  textoSeguro = textoSeguro.replace(/>/g, "&gt;");
  textoSeguro = textoSeguro.replace(/"/g, "&quot;");
  textoSeguro = textoSeguro.replace(/'/g, "&#39;");
  return textoSeguro;
}

/**
 * Convierte una fecha a formato YYYY-MM-DD para usarla en un input[type=date].
 * Devuelve cadena vacía si la fecha no es válida o no existe.
 */
function formatearFechaInput(fecha) {
  let resultado = "";
  if (fecha) {
    let fechaObj = new Date(fecha);
    if (!isNaN(fechaObj)) {
      resultado = fechaObj.toISOString().split("T")[0];
    }
  }
  return resultado;
}

/**
 * Convierte una fecha a formato legible en español (DD/MM/YYYY).
 * Devuelve cadena vacía si la fecha no es válida o no existe.
 */
function formatearFechaLectura(fecha) {
  let resultado = "";
  if (fecha) {
    let fechaObj = new Date(fecha);
    if (!isNaN(fechaObj)) {
      resultado = fechaObj.toLocaleDateString("es-ES");
    }
  }
  return resultado;
}

/* -------------------------------------------------------
   Configuración de cada recurso administrable
   Aquí definimos las columnas de la tabla y los campos del
   formulario para cada entidad (juegos, clientes, etc.).
------------------------------------------------------- */
const RECURSOS = {
  juegos: {
    nombre: "Juegos",
    icono: "🎮",
    detalleUrl: "juegoDetalle.html",
    api: juegoAPI,
    columnas: [
      { titulo: "ID", clave: "id" },
      { titulo: "Título", clave: "titulo" },
      { titulo: "Género", clave: "genero" },
      { titulo: "PEGI", clave: "clasificacionPEGI" },
      {
        titulo: "Precio (€)",
        clave: "precioBase",
        formato: function (valor) {
          return Number(valor).toFixed(2);
        },
      },
      { titulo: "Stock", clave: "stock" },
      {
        titulo: "Disponible",
        clave: "disponible",
        formato: function (valor) {
          return valor ? "Sí" : "No";
        },
      },
    ],
    campos: [
      { name: "titulo", label: "Título", tipo: "text", requerido: true },
      {
        name: "descripcion",
        label: "Descripción",
        tipo: "textarea",
        requerido: true,
      },
      { name: "genero", label: "Género", tipo: "text", requerido: true },
      {
        name: "clasificacionPEGI",
        label: "Clasificación PEGI",
        tipo: "number",
        min: 0,
        max: 18,
        requerido: true,
      },
      {
        name: "precioBase",
        label: "Precio (€)",
        tipo: "number",
        min: 0,
        step: 0.01,
        requerido: true,
      },
      {
        name: "stock",
        label: "Stock",
        tipo: "number",
        min: 0,
        requerido: true,
      },
      {
        name: "fechaDeSalida",
        label: "Fecha de salida",
        tipo: "date",
        requerido: true,
      },
      {
        name: "plataformas",
        label: "Plataformas",
        tipo: "checkboxes",
        fuente: "plataformas",
      },
      {
        name: "desarrolladoras",
        label: "Desarrolladoras",
        tipo: "checkboxes",
        fuente: "desarrolladoras",
      },
    ],
    defaults: { stock: 0, clasificacionPEGI: 3, precioBase: 0 },
    // Antes de guardar el juego, calculamos si está disponible según el stock
    prepararPayload: function (datos) {
      datos.disponible = Number(datos.stock) > 0;
      return datos;
    },
  },

  resenias: {
    nombre: "Reseñas",
    icono: "⭐",
    detalleUrl: "reseniaDetalle.html",
    api: reseniaAPI,
    columnas: [
      { titulo: "ID", clave: "id" },
      { titulo: "Autor", clave: "autor" },
      {
        titulo: "Valoración",
        clave: "valoracion",
        formato: function (valoracion) {
          return "★".repeat(valoracion) + "☆".repeat(5 - valoracion);
        },
      },
      {
        titulo: "Contenido",
        clave: "contenido",
        // Si el texto es muy largo lo recortamos para que quepa en la tabla
        formato: function (contenido) {
          let resultado = "";
          if (contenido && contenido.length > 60) {
            resultado = contenido.slice(0, 60) + "…";
          } else if (contenido) {
            resultado = contenido;
          }
          return resultado;
        },
      },
      {
        titulo: "Juego",
        // juegoTitulo viene del @JsonProperty de Resenia, ya que el objeto
        // juego completo no se serializa (@JsonBackReference lo oculta)
        clave: "juegoTitulo",
        formato: function (titulo) {
          let resultado = "—";
          if (titulo) {
            resultado = titulo;
          }
          return resultado;
        },
      },
      { titulo: "Fecha", clave: "fecha", formato: formatearFechaLectura },
    ],
    campos: [
      { name: "autor", label: "Autor", tipo: "text", requerido: true },
      {
        name: "contenido",
        label: "Contenido",
        tipo: "textarea",
        requerido: true,
      },
      {
        name: "valoracion",
        label: "Valoración (1-5)",
        tipo: "number",
        min: 1,
        max: 5,
        requerido: true,
      },
      { name: "fecha", label: "Fecha", tipo: "date", requerido: true },
    ],
    defaults: { valoracion: 5 },
  },

  clientes: {
    nombre: "Clientes",
    icono: "👤",
    detalleUrl: "clienteDetalle.html",
    api: clienteAPI,
    columnas: [
      { titulo: "ID", clave: "id" },
      { titulo: "Nombre", clave: "nombre" },
      { titulo: "Email", clave: "email" },
      { titulo: "Edad", clave: "edad" },
      {
        titulo: "Socio",
        clave: "esSocio",
        formato: function (esSocio) {
          return esSocio ? "Sí" : "No";
        },
      },
      { titulo: "Puntos", clave: "puntosSocio" },
      {
        titulo: "Inscripción",
        clave: "fechaDeInscripcion",
        formato: formatearFechaLectura,
      },
    ],
    campos: [
      { name: "nombre", label: "Nombre", tipo: "text", requerido: true },
      { name: "email", label: "Email", tipo: "email", requerido: true },
      {
        name: "edad",
        label: "Edad",
        tipo: "number",
        min: 0,
        max: 120,
        requerido: true,
      },
      { name: "esSocio", label: "¿Es socio?", tipo: "checkbox" },
      { name: "puntosSocio", label: "Puntos de socio", tipo: "number", min: 0 },
      {
        name: "fechaDeInscripcion",
        label: "Fecha de inscripción",
        tipo: "date",
      },
    ],
    defaults: { edad: 18, esSocio: false, puntosSocio: 0 },
  },

  desarrolladoras: {
    nombre: "Desarrolladoras",
    icono: "🏢",
    detalleUrl: "desarrolladoraDetalle.html",
    api: desarrolladoraAPI,
    columnas: [
      { titulo: "ID", clave: "id" },
      { titulo: "Nombre", clave: "nombre" },
      { titulo: "País", clave: "pais" },
      {
        titulo: "Sitio web",
        clave: "sitioWeb",
        // El enlace lo marcamos como raw=true para que no se escape el HTML del <a>
        formato: function (sitioWeb) {
          let resultado = "";
          if (sitioWeb) {
            resultado = `<a href="${escapar(sitioWeb)}" target="_blank" rel="noopener">${escapar(sitioWeb)}</a>`;
          }
          return resultado;
        },
        raw: true,
      },
    ],
    campos: [
      { name: "nombre", label: "Nombre", tipo: "text", requerido: true },
      { name: "pais", label: "País", tipo: "text", requerido: true },
      { name: "sitioWeb", label: "Sitio web", tipo: "url", requerido: true },
    ],
  },

  plataformas: {
    nombre: "Plataformas",
    icono: "🕹️",
    detalleUrl: "plataformaDetalle.html",
    api: plataformaAPI,
    columnas: [
      { titulo: "ID", clave: "id" },
      { titulo: "Nombre", clave: "nombre" },
      { titulo: "Fabricante", clave: "fabricante" },
    ],
    campos: [
      { name: "nombre", label: "Nombre", tipo: "text", requerido: true },
      {
        name: "fabricante",
        label: "Fabricante",
        tipo: "text",
        requerido: true,
      },
    ],
  },
};

/* -------------------------------------------------------
   Estado global de la página admin
------------------------------------------------------- */
let recursoActual = null; // nombre del recurso activo (ej: 'juegos')
let config = null; // configuración del recurso activo (columnas, campos, etc.)
let items = []; // lista de registros cargados desde la API
let fuentes = { plataformas: [], desarrolladoras: [] }; // datos para los checkboxes
let filaAbierta = null; // id del registro cuyo formulario está abierto en la tabla

/* -------------------------------------------------------
   Render de la tabla principal
------------------------------------------------------- */

/**
 * Genera y muestra la tabla de registros en la sección activa del panel.
 * Si no hay registros, muestra un mensaje de "No hay registros."
 */
function renderTabla() {
  const seccionTabla = document.getElementById("seccion-tabla");
  if (!seccionTabla) {
    return;
  }

  // Construir las cabeceras de la tabla con las columnas configuradas
  let cabecerasHTML = "";
  config.columnas.forEach((columna) => {
    cabecerasHTML += `<th>${escapar(columna.titulo)}</th>`;
  });

  // Capturamos detalleUrl aquí para pasársela a renderFila como parámetro explícito
  // y evitar que dependa del estado global de config en el momento de renderizar
  let detalleUrl = config.detalleUrl || "";

  // Construir las filas de la tabla con los datos cargados
  let filasHTML = "";
  if (items.length == 0) {
    filasHTML = `<tr><td colspan="${config.columnas.length + 1}" class="tabla-admin__vacio">No hay registros.</td></tr>`;
  } else {
    items.forEach((item) => {
      filasHTML += renderFila(item, detalleUrl);
    });
  }

  let textoRegistros =
    items.length == 1 ? "1 registro" : `${items.length} registros`;
  let textoNuevo = "Añadir " + config.nombre.slice(0, -1).toLowerCase();

  seccionTabla.innerHTML = `
        <div class="admin-tabla-cabecera">
            <span class="text-muted">${textoRegistros}</span>
            <button class="btn btn-primary" id="btn-nuevo">+ ${textoNuevo}</button>
        </div>
 
        <div class="zona-form-nuevo"></div>
 
        <div class="tabla-admin-wrap">
            <table class="tabla-admin">
                <thead>
                    <tr>
                        ${cabecerasHTML}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla-cuerpo">
                    ${filasHTML}
                </tbody>
            </table>
        </div>
    `;

  document
    .getElementById("btn-nuevo")
    .addEventListener("click", abrirFormNuevo);
  engancharFilas();
}

/**
 * Genera el HTML de una fila de la tabla para un registro concreto.
 * Incluye las celdas con los datos y los botones de editar y eliminar.
 *
 * @param item el objeto con los datos del registro (un juego, cliente, etc.)
 * @returns el HTML de la fila como cadena de texto
 */
function renderFila(item, detalleUrl) {
  // Construir las celdas de datos de esta fila
  let celdas = "";
  config.columnas.forEach((columna) => {
    let valorCelda = item[columna.clave];
    let mostrar = "";

    if (columna.formato) {
      // Si la columna tiene función de formato la aplicamos
      mostrar = columna.formato(valorCelda);
    } else if (valorCelda != null) {
      mostrar = valorCelda;
    }

    if (columna.raw) {
      // raw=true significa que el HTML ya está construido (ej: un enlace <a>)
      celdas += `<td>${mostrar}</td>`;
    } else {
      celdas += `<td>${escapar(mostrar)}</td>`;
    }
  });

  // Botón "Ver detalle": guarda la URL destino en data-url para que engancharFilas
  // la use con window.location.href y no haya ningún listener que la intercepte.
  let botonVer = "";
  if (detalleUrl) {
    botonVer = `<button class="btn-admin" data-accion="ver" data-url="${detalleUrl}?id=${item.id}" title="Ver detalle">👁️</button>`;
  }

  return `
        <tr class="tabla-admin__fila" data-id="${item.id}">
            ${celdas}
            <td class="tabla-admin__acciones">
                ${botonVer}
                <button class="btn-admin" data-accion="editar"   data-id="${item.id}" title="Editar">✏️</button>
                <button class="btn-admin" data-accion="eliminar" data-id="${item.id}" title="Eliminar">🗑️</button>
            </td>
        </tr>
        <tr class="tabla-admin__form-row" data-form-de="${item.id}" style="display:none;">
            <td colspan="${config.columnas.length + 1}"></td>
        </tr>
    `;
}

/**
 * Añade los listeners de click a los botones de editar y eliminar de cada fila.
 * Se llama después de cada renderTabla() para que los nuevos botones funcionen.
 */
function engancharFilas() {
  document
    .querySelectorAll(".tabla-admin__fila .btn-admin")
    .forEach((boton) => {
      boton.addEventListener("click", async (evento) => {
        let accion = boton.dataset.accion;

        evento.preventDefault();
        let id = Number(boton.dataset.id);

        // Navegar a la página de detalle usando window.location.href
        if (accion == "ver") {
          window.location.href = boton.dataset.url;
          return;
        }

        if (accion == "eliminar") {
          if (!confirm("¿Seguro que quieres eliminar este registro?")) {
            return;
          }
          try {
            await config.api.eliminar(id);
            // Quitar el elemento eliminado de la lista local
            let itemsActualizados = [];
            items.forEach((elemento) => {
              if (elemento.id !== id) {
                itemsActualizados.push(elemento);
              }
            });
            items = itemsActualizados;
            renderTabla();
          } catch (errorEliminar) {
            alert("No se pudo eliminar: " + errorEliminar.message);
          }
        }

        if (accion == "editar") {
          // Si la fila ya tiene el formulario abierto, lo cerramos
          if (filaAbierta == id) {
            cerrarForm();
            return;
          }
          abrirFormEdicion(id);
        }
      });
    });
}

/* -------------------------------------------------------
   Generación de formularios
------------------------------------------------------- */

/**
 * Genera el HTML del formulario para crear o editar un registro.
 *
 * @param item  el objeto con los datos actuales (vacío {} si es un registro nuevo)
 * @param modo  'crear' para nuevo registro, 'editar' para modificar uno existente
 * @returns el HTML del formulario como cadena de texto
 */
function generarFormHTML(item, modo) {
  let camposHTML = "";
  config.campos.forEach((campo) => {
    camposHTML += renderCampo(campo, item);
  });

  let textoBoton = modo == "editar" ? "Guardar cambios" : "Crear";
  let textoTitulo =
    (modo == "editar" ? "Editar" : "Nuevo") +
    " " +
    config.nombre.slice(0, -1).toLowerCase();

  return `
        <div class="form-admin" data-modo="${modo}" data-id="${item.id || ""}">
            <h3>${textoTitulo}</h3>
            <form class="form-admin__form" novalidate>
                <div class="form-grid">
                    ${camposHTML}
                </div>
                <div class="form-admin__acciones">
                    <button type="submit" class="btn btn-primary">${textoBoton}</button>
                    <button type="button" class="btn btn-link" data-accion="cancelar">Cancelar</button>
                </div>
                <div class="form-admin__mensaje"></div>
            </form>
        </div>
    `;
}

/**
 * Genera el HTML del campo de formulario correspondiente al tipo indicado en la config.
 * Soporta: textarea, checkbox, checkboxes (lista de checks), date, y campos de texto/número.
 *
 * @param campo el objeto de configuración del campo (name, label, tipo, etc.)
 * @param item  los datos actuales del registro (para rellenar el valor actual)
 * @returns el HTML del campo como cadena de texto
 */
function renderCampo(campo, item) {
  // Obtener el valor actual del campo (del item, o del default si no existe)
  let valor = "";
  if (item && item[campo.name] != null) {
    valor = item[campo.name];
  } else if (config.defaults && config.defaults[campo.name] != null) {
    valor = config.defaults[campo.name];
  }

  if (campo.tipo == "textarea") {
    return `
            <label class="form-grid__full">
                ${escapar(campo.label)}
                <textarea name="${campo.name}" ${campo.requerido ? "required" : ""} maxlength="1000">${escapar(valor)}</textarea>
            </label>`;
  }

  if (campo.tipo == "checkbox") {
    return `
            <label class="check-inline">
                <input type="checkbox" name="${campo.name}" ${valor ? "checked" : ""} />
                ${escapar(campo.label)}
            </label>`;
  }

  if (campo.tipo == "checkboxes") {
    // Lista de opciones disponibles (plataformas o desarrolladoras)
    let lista = fuentes[campo.fuente] || [];

    // Construir la lista de ids ya seleccionados en el item actual
    let idsActuales = [];
    if (item && item[campo.name]) {
      item[campo.name].forEach((elemento) => {
        idsActuales.push(elemento.id);
      });
    }

    // Generar un checkbox por cada opción disponible
    let opciones = "";
    lista.forEach((opcion) => {
      let estaSeleccionado = idsActuales.includes(opcion.id);
      opciones += `
                <label class="check-inline">
                    <input type="checkbox" name="${campo.name}" value="${opcion.id}"
                           ${estaSeleccionado ? "checked" : ""} />
                    ${escapar(opcion.nombre)}
                </label>`;
    });

    if (!opciones) {
      opciones = '<span class="text-muted">No hay opciones.</span>';
    }

    return `
            <fieldset class="form-grid__full">
                <legend>${escapar(campo.label)}</legend>
                <div class="checks-wrap">${opciones}</div>
            </fieldset>`;
  }

  if (campo.tipo == "date") {
    return `
            <label>
                ${escapar(campo.label)}
                <input type="date" name="${campo.name}" value="${formatearFechaInput(valor)}"
                       ${campo.requerido ? "required" : ""} />
            </label>`;
  }

  // Caso por defecto: text, number, email, url
  let atributosArray = [];
  atributosArray.push(`type="${campo.tipo}"`);
  atributosArray.push(`name="${campo.name}"`);
  atributosArray.push(`value="${escapar(valor)}"`);
  if (campo.requerido) {
    atributosArray.push("required");
  }
  if (campo.min !== undefined) {
    atributosArray.push(`min="${campo.min}"`);
  }
  if (campo.max !== undefined) {
    atributosArray.push(`max="${campo.max}"`);
  }
  if (campo.step !== undefined) {
    atributosArray.push(`step="${campo.step}"`);
  }
  let atributos = atributosArray.join(" ");

  return `<label>${escapar(campo.label)}<input ${atributos} /></label>`;
}

/**
 * Abre el formulario de creación de un nuevo registro en la zona superior de la tabla.
 */
function abrirFormNuevo() {
  cerrarForm();
  const zonaFormNuevo = document.querySelector(".zona-form-nuevo");
  zonaFormNuevo.innerHTML = generarFormHTML({}, "crear");
  zonaFormNuevo.scrollIntoView({ behavior: "smooth", block: "nearest" });
  engancharForm(zonaFormNuevo);
}

/**
 * Abre el formulario de edición de un registro existente dentro de la propia fila de la tabla.
 *
 * @param id el id del registro que queremos editar
 */
function abrirFormEdicion(id) {
  cerrarForm();

  // Buscar el item en la lista local
  let itemEncontrado = null;
  items.forEach((elemento) => {
    if (elemento.id == id && itemEncontrado == null) {
      itemEncontrado = elemento;
    }
  });
  if (!itemEncontrado) {
    return;
  }

  // Insertar el formulario en la fila oculta justo debajo del registro
  const filaFormulario = document.querySelector(
    `.tabla-admin__form-row[data-form-de="${id}"]`,
  );
  if (!filaFormulario) {
    return;
  }
  const celda = filaFormulario.querySelector("td");
  celda.innerHTML = generarFormHTML(itemEncontrado, "editar");
  filaFormulario.style.display = "";
  filaFormulario.scrollIntoView({ behavior: "smooth", block: "nearest" });
  filaAbierta = id;
  engancharForm(celda);
}

/**
 * Cierra y limpia cualquier formulario abierto (tanto el de nuevo como el de edición).
 */
function cerrarForm() {
  const zonaFormNuevo = document.querySelector(".zona-form-nuevo");
  if (zonaFormNuevo) {
    zonaFormNuevo.innerHTML = "";
  }
  document
    .querySelectorAll(".tabla-admin__form-row")
    .forEach((filaFormulario) => {
      filaFormulario.style.display = "none";
      filaFormulario.querySelector("td").innerHTML = "";
    });
  filaAbierta = null;
}

/**
 * Añade los listeners al formulario abierto: botón cancelar y envío del formulario.
 * Lee los datos del formulario, los valida y llama a la API para crear o actualizar.
 *
 * @param contenedor el elemento del DOM que contiene el formulario
 */
function engancharForm(contenedor) {
  const formWrap = contenedor.querySelector(".form-admin");
  const formulario = contenedor.querySelector(".form-admin__form");
  const mensaje = contenedor.querySelector(".form-admin__mensaje");
  const modo = formWrap.dataset.modo;
  const id = formWrap.dataset.id ? Number(formWrap.dataset.id) : null;

  contenedor
    .querySelector('[data-accion="cancelar"]')
    .addEventListener("click", cerrarForm);

  formulario.addEventListener("submit", async (eventoFormulario) => {
    eventoFormulario.preventDefault();
    mensaje.className = "form-admin__mensaje";
    mensaje.textContent = "";

    // Leer todos los valores del formulario
    const fd = new FormData(formulario);
    let payload = {};

    config.campos.forEach((campo) => {
      if (campo.tipo == "checkbox") {
        // Los checkboxes devuelven 'on' si están marcados, null si no
        payload[campo.name] = fd.get(campo.name) == "on";
      } else if (campo.tipo == "checkboxes") {
        // getAll devuelve un array con todos los valores marcados
        let valoresCheckbox = fd.getAll(campo.name);
        let valoresSeleccionados = [];
        valoresCheckbox.forEach((valorCheckbox) => {
          valoresSeleccionados.push({ id: Number(valorCheckbox) });
        });
        payload[campo.name] = valoresSeleccionados;
      } else if (campo.tipo == "number") {
        let valorNumero = fd.get(campo.name);
        if (valorNumero == "" || valorNumero == null) {
          payload[campo.name] = null;
        } else {
          payload[campo.name] = Number(valorNumero);
        }
      } else {
        let valorTexto = fd.get(campo.name) || "";
        payload[campo.name] = valorTexto.toString().trim();
      }
    });

    // Validar que los campos requeridos no estén vacíos
    let campoInvalido = "";
    config.campos.forEach((campo) => {
      if (
        campo.requerido &&
        (payload[campo.name] == "" || payload[campo.name] == null) &&
        campoInvalido == ""
      ) {
        campoInvalido = campo.label;
      }
    });

    if (campoInvalido) {
      mensaje.classList.add("error");
      mensaje.textContent = `Falta el campo "${campoInvalido}".`;
      return;
    }

    // Si el recurso tiene un hook de preparación (ej: calcular disponible en juegos), lo llamamos
    if (config.prepararPayload) {
      payload = config.prepararPayload(payload);
    }

    try {
      let resultado = null;

      if (modo == "editar" && id) {
        // Actualizar registro existente
        resultado = await config.api.actualizar(id, payload);

        // Actualizar el item en la lista local
        let indiceEncontrado = -1;
        items.forEach((elemento, indice) => {
          if (elemento.id == id && indiceEncontrado == -1) {
            indiceEncontrado = indice;
          }
        });

        if (indiceEncontrado >= 0) {
          if (resultado) {
            items[indiceEncontrado] = resultado;
          } else {
            // Si la API no devuelve el objeto actualizado, aplicamos el payload manualmente
            for (const clave in payload) {
              items[indiceEncontrado][clave] = payload[clave];
            }
          }
        }
      } else {
        // Crear registro nuevo
        resultado = await config.api.crear(payload);
        if (resultado) {
          items.push(resultado);
        }
      }

      renderTabla();
    } catch (errorGuardado) {
      mensaje.classList.add("error");
      mensaje.textContent = "Error guardando: " + errorGuardado.message;
    }
  });
}

/* -------------------------------------------------------
   Carga de datos desde la API
------------------------------------------------------- */

/**
 * Carga los registros del recurso activo y, si tiene checkboxes,
 * también carga las listas de plataformas y desarrolladoras disponibles.
 */
async function cargarDatos() {
  // Comprobar si este recurso necesita datos para checkboxes
  let necesitaFuentes = false;
  config.campos.forEach((campo) => {
    if (campo.tipo == "checkboxes") {
      necesitaFuentes = true;
    }
  });

  if (necesitaFuentes) {
    fuentes.plataformas = await plataformaAPI.obtenerTodos();
    fuentes.desarrolladoras = await desarrolladoraAPI.obtenerTodos();
  }

  items = await config.api.obtenerTodos();
}

/* -------------------------------------------------------
   Dashboard con pestañas: carga y muestra el recurso seleccionado
------------------------------------------------------- */

/**
 * Cambia al recurso indicado: actualiza el estado global, carga los datos
 * desde la API y renderiza la tabla en la sección activa del panel.
 *
 * @param nombreRecurso la clave del recurso a cargar (ej: 'juegos', 'clientes')
 */
async function cargarYRenderRecurso(nombreRecurso) {
  recursoActual = nombreRecurso;
  config = RECURSOS[nombreRecurso];
  filaAbierta = null;
  items = [];

  const seccionTabla = document.getElementById("seccion-tabla");
  seccionTabla.innerHTML = '<p class="texto-cargando">Cargando datos…</p>';

  try {
    await cargarDatos();
    renderTabla();
  } catch (errorCarga) {
    seccionTabla.innerHTML = `<p class="text-danger" style="padding:1.5rem">Error cargando datos: ${escapar(errorCarga.message)}</p>`;
  }
}

/**
 * Renderiza el panel de administración completo con la barra de pestañas.
 * Cada pestaña corresponde a un recurso (Juegos, Reseñas, Clientes, etc.).
 * Al hacer clic en una pestaña se carga y muestra su tabla con CRUD completo.
 */
function renderDashboard() {
  const root = document.getElementById("root");

  // Construir las pestañas a partir de la configuración de recursos
  let tabsHTML = "";
  Object.keys(RECURSOS).forEach((clave) => {
    let recurso = RECURSOS[clave];
    tabsHTML += `
            <button class="tab-admin" data-recurso="${clave}">
                <span class="tab-admin__icono">${recurso.icono}</span>
                ${escapar(recurso.nombre)}
            </button>`;
  });

  root.innerHTML = `
        <div class="container">
            <div class="admin-dashboard-header">
                <div>
                    <h1>Panel de Administración</h1>
                    <p class="text-muted">Selecciona una sección para ver y gestionar sus registros.</p>
                </div>
                <a href="index.html" class="btn btn-outline">← Volver al inicio</a>
            </div>
 
            <nav class="tabs-admin" role="tablist">
                ${tabsHTML}
            </nav>
 
            <div id="seccion-tabla" class="seccion-tabla">
                <p class="texto-cargando">Selecciona una pestaña para comenzar.</p>
            </div>
        </div>
    `;

  // Enganchar los listeners de las pestañas
  document.querySelectorAll(".tab-admin").forEach((boton) => {
    boton.addEventListener("click", async () => {
      document
        .querySelectorAll(".tab-admin")
        .forEach((b) => b.classList.remove("activa"));
      boton.classList.add("activa");
      await cargarYRenderRecurso(boton.dataset.recurso);
    });
  });

  // Activar la pestaña de Juegos por defecto
  const primerTab = document.querySelector(".tab-admin");
  if (primerTab) {
    primerTab.classList.add("activa");
    cargarYRenderRecurso("juegos");
  }
}

/* -------------------------------------------------------
   Inicio de la página (se ejecuta al cargar el DOM)
------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  // Montar la barra de navegación y el footer
  document.getElementById("navbar").innerHTML = crearBarraNavegacion();
  document
    .getElementById("toggle-admin")
    .addEventListener("click", (evento) => {
      evento.preventDefault();
      toggleAdmin();
    });

  const footerEl = document.getElementById("footer");
  if (footerEl) {
    footerEl.innerHTML = crearFooter();
  }

  // Si el usuario no es admin no puede ver esta página
  if (!esAdmin()) {
    document.getElementById("root").innerHTML = `
            <div class="container">
                <p class="text-danger">Necesitas estar en modo admin para acceder a esta página.</p>
                <a href="index.html" class="btn btn-link">← Volver al inicio</a>
            </div>`;
    return;
  }

  document.body.classList.add("modo-admin");
  document.title = "STEMGAME | Panel de Administración";

  renderDashboard();
});
