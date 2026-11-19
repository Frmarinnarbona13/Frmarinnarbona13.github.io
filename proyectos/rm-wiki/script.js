const personajes = [
    { id: "1", nombre: "Rick Sanchez", imagen: "img/Rick_Sanchez.png", especie: "Humano", estado: "Vivo", dato: "Dimensión C-137" },
    { id: "2", nombre: "Morty smith", imagen: "img/Morty.png", especie: "Humano", estado: "Vivo", dato: "Dimensión PRIME" },
    { id: "3", nombre: "Beth smith", imagen: "img/Beth_Smith.png", especie: "Humana", estado: "Viva", dato: "Dimensión C-131" },
    { id: "4", nombre: "Beth Espacial", imagen: "img/SpaceBeth.png", especie: "Humana", estado: "Viva", dato: "Dimensión C-131" },
    { id: "5", nombre: "Jerry Smith", imagen: "img/Jerry_Smith.png", especie: "Humano", estado: "Vivo", dato: "Dimensión 5126" },
    { id: "6", nombre: "Summer Smith", imagen: "img/Summer_Smith.png", especie: "Humana", estado: "Viva", dato: "Dimensión C-131" }
];

const grid = document.querySelector('.grid');

if (grid) {
    const tarjetas = document.querySelectorAll('.card');
    const hero = document.querySelector('.page-hero');
    const contadorTexto = document.createElement('p');
    
    hero.appendChild(contadorTexto);
    
    const actualizarContador = () => {
        const cantidadFavoritos = document.querySelectorAll('.card.favorito').length;
        contadorTexto.textContent = `Personajes destacados: ${cantidadFavoritos}`;
    };
    contadorTexto.style.textAlign = 'center';
    contadorTexto.style.width = '100%'
    
    actualizarContador();
    
    tarjetas.forEach((tarjeta, index) => {
        const cardBody = tarjeta.querySelector('.card__body');
        const botonVerMas = tarjeta.querySelector('.btn');
        
        const idPersonaje = (index + 1).toString();
        botonVerMas.dataset.id = idPersonaje;
        
        botonVerMas.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.location.href = `detalle.html?id=${idPersonaje}`;
        });
        
        const btnFavorito = document.createElement('button');
        btnFavorito.textContent = '⭐';
        
        btnFavorito.style.display = 'block';
        btnFavorito.style.marginBottom = '10px';
        btnFavorito.style.cursor = 'pointer';
        
        cardBody.insertBefore(btnFavorito, botonVerMas);
        
        btnFavorito.addEventListener('click', () => {
        const imagenGira = tarjeta.querySelector('.card__img');
            const esFavorito = tarjeta.classList.contains('favorito');
            if (!esFavorito) {
                dispararAnimacion(imagenGira)
                tarjeta.classList.add('favorito');
                btnFavorito.textContent = 'Guardado';
            } else {
                tarjeta.classList.remove('favorito');
                btnFavorito.textContent = '⭐';
            }
            
            actualizarContador();
        });
    });
}

const detailArticle = document.querySelector('.detail');

if (detailArticle) {
    const parametros = new URLSearchParams(window.location.search);
    const idUrl = parametros.get("id");

    if (idUrl) {
        const personajeEncontrado = personajes.find(p => p.id === idUrl);

        if (personajeEncontrado) {
            document.querySelector('.detail__title').textContent = personajeEncontrado.nombre;
            document.querySelector('.detail__img').src = personajeEncontrado.imagen;
            document.querySelector('.detail__img').alt = `Imagen de ${personajeEncontrado.nombre}`;
            
            const listaFacts = document.querySelector('.detail__facts');
            listaFacts.innerHTML = `
                <li><strong>Categoría:</strong> Personaje</li>
                <li><strong>Especie:</strong> ${personajeEncontrado.especie}</li>
                <li><strong>Estado:</strong> ${personajeEncontrado.estado}</li>
            `;
        }
    }
}

const detailContent = document.querySelector('.detail__content');

if (detailArticle && detailContent) {
    const btnToggle = document.createElement('button');
    btnToggle.textContent = 'Ocultar ficha';
    btnToggle.className = 'btn';
    btnToggle.style.marginBottom = '20px'; 
    btnToggle.style.backgroundColor = '#555';
    
    detailArticle.insertBefore(btnToggle, detailContent);

    btnToggle.addEventListener('click', () => {
        if (detailContent.style.display === 'none') {
            detailContent.style.display = 'block';
            btnToggle.textContent = 'Ocultar ficha';
        } else {
            detailContent.style.display = 'none';
            btnToggle.textContent = 'Mostrar ficha';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.getElementById('btn-buscar');
    const btnAleatorio = document.getElementById('btn-aleatorio');

    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarPersonaje);
    }
    if (btnAleatorio) {
        btnAleatorio.addEventListener('click', mostrarAleatorio);
    }
});

async function buscarPersonaje() {
    let exito = false;
    
    const inputValor = document.getElementById('busqueda-personaje').value.trim();
    const contenedor = document.getElementById('resultado-busqueda');
    const contenedorError = document.getElementById('error-busqueda');

    contenedor.innerHTML = "";
    contenedorError.textContent = "";

    if (inputValor === "") {
        contenedorError.textContent = "Debes escribir un nombre o un id válido";
    } else {
        let urlApi = "";
        
        if (!isNaN(inputValor)) {
            urlApi = `https://rickandmortyapi.com/api/character/${inputValor}`;
        } else {
            urlApi = `https://rickandmortyapi.com/api/character/?name=${inputValor}`;
        }

        try {
            const respuesta = await fetch(urlApi);
            
            if (!respuesta.ok) {
                contenedorError.textContent = "No se ha encontrado ningún personaje con esos datos";
            } else {
                const datos = await respuesta.json();
                let personaje = null;

                if (datos.results) {
                    personaje = datos.results[0]; 
                } else {
                    personaje = datos;
                }

                contenedor.innerHTML = `
                    <article class="card">
                        <img class="card__img" src="${personaje.image}" alt="${personaje.name}" />
                        <div class="card__body">
                            <h2 class="card__title">${personaje.name}</h2>
                            <p class="card__meta">Especie: ${personaje.species}</p>
                            <p class="card__meta">Estado: ${personaje.status}</p>
                        </div>
                    </article>
                `;
                exito = true;
            }
        } catch (error) {
            contenedorError.textContent = "Error de conexión con la API.";
        }
    }

    return exito;
}

async function mostrarAleatorio() {
    let exito = false;
    
    const contenedor = document.getElementById('resultado-aleatorio');
    const contenedorError = document.getElementById('error-aleatorio');
    
    contenedor.innerHTML = "";
    contenedorError.textContent = "";

    try {
        const respuestaTotal = await fetch('https://rickandmortyapi.com/api/character');
        
        if (!respuestaTotal.ok) {
            contenedorError.textContent = "Error al obtener la cantidad total de personajes.";
        } else {
            const datosInfo = await respuestaTotal.json();
            const totalPersonajes = datosInfo.info.count;

            const idAleatorio = Math.floor(Math.random() * totalPersonajes) + 1; 
            const urlApi = `https://rickandmortyapi.com/api/character/${idAleatorio}`;

            const respuesta = await fetch(urlApi);
            
            if (!respuesta.ok) {
                contenedorError.textContent = "Error al obtener el personaje aleatorio.";
            } else {
                const personaje = await respuesta.json();
                
                contenedor.innerHTML = `
                    <article class="card">
                        <img class="card__img" src="${personaje.image}" alt="${personaje.name}" />
                        <div class="card__body">
                            <h2 class="card__title">${personaje.name}</h2>
                            <p class="card__meta">Especie: ${personaje.species}</p>
                            <p class="card__meta">Estado: ${personaje.status}</p>
                        </div>
                    </article>
                `;
                exito = true;
            }
        }
    } catch (error) {
        contenedorError.textContent = "Error de conexión con la API.";
    }

    return exito;
}


  function dispararAnimacion(imagenGira) {

  imagenGira.classList.remove('animar');
  void imagenGira.offsetWidth;
  imagenGira.classList.add('animar'); 
  
}