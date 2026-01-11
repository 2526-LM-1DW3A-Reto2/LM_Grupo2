// FUNCIÓN DE CARGA PARA LA CLASIFICACIÓN DE EQUIPOS

// Define las rutas y selectores
const xslFile = "xml/clasificacion/clasificacion.xsl";
const xmlFileDefault = "xml/clasificacion/clasificacion2025_2026.xml"; // Archivo XML de la temporada actual
const containerId = "#tablaClasificacion";
const linkClass = ".linkClasificacion";

let xslDoc = null; // Variable para almacenar el XSLT

function loadFile(fileName) {
  return $.ajax({
    url: fileName,
    dataType: "xml",
  });
}

// --- Función de Carga y Transformación ---
function loadAndTransformXML(xmlFileName) {
  if (!xslDoc) {
    $(containerId).html(
      "<p>Error: XSLT no cargado. No se puede realizar la transformación.</p>"
    );
    return;
  }

  $(containerId).html("Cargando clasificación de " + xmlFileName + "...");

  loadFile(xmlFileName)
    .done(function (xmlDoc) {
      // 1. Crear y aplicar el procesador XSLT (JS Nativo)
      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xslDoc);

      // 2. Transformación
      const resultDocument = xsltProcessor.transformToFragment(
        xmlDoc,
        document
      );

      // 3. Inserción en el contenedor usando jQuery
      $(containerId).empty();
      $(containerId).append(resultDocument);
    })
    .fail(function () {
      $(containerId).html(
        "<p>Error al cargar el XML: " +
          xmlFileName +
          " (Revisa que el archivo exista en esa ruta).</p>"
      );
    });
}

// --- Lógica Principal de Inicialización y Eventos ---
$(document).ready(function () {
  // 1. Cargar el XSLT una única vez al inicio de la página.
  loadFile(xslFile)
    .done(function (doc) {
      xslDoc = doc;

      // 💡 LLAMADA CRUCIAL AÑADIDA:
      // Una vez que el XSLT está listo, cargamos la tabla por defecto.
      loadAndTransformXML(xmlFileDefault);
    })
    .fail(function () {
      $(containerId).html(
        "<p>Error crítico: No se pudo cargar el archivo XSLT.</p>"
      );
    });

  // 2. Añadir el Listener de Clic a los enlaces del menú
  $(linkClass).on("click", function (event) {
    event.preventDefault();

    const xmlToLoad = $(this).attr("href");

    loadAndTransformXML(xmlToLoad);
  });
});

// FUNCIÓN DEl MENU DESPLEGABLE

// --- Lógica Principal de Inicialización y Eventos ---
$(document).ready(function () {
    $("#btnToggle").on("click", function() {
        $("#menu").toggle();
    });
});

// FUNCIÓN DE CARGA DE JORNADAS
$(document).ready(function() {
    
    // Define las rutas de los archivos y el ID del contenedor
    const xmlFile = "xml/jornadas/jornada5.xml";
    const xslFile = "xml/jornadas/jornada.xsl";
    const containerId = "#contJornada";
    
    let xslDoc = null; 

    // Función para cargar cualquier archivo XML o XSLT de forma asíncrona
    function loadFile(fileName) {
        return $.ajax({
            url: fileName,
            dataType: "xml"
        });
    }

    // Función para realizar la transformación XSLT e inyectar el resultado
    function transformAndDisplay(xmlDoc, xslDoc) {
        try {
            // 1. Crear el procesador XSLT
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xslDoc);
            
            // 2. Ejecutar la transformación
            const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
            
            // 3. Inyectar el resultado en el article
            $(containerId).empty().append(resultDocument);

        } catch (e) {
            $(containerId).html("<p>Error de Transformación XSLT. Revisa la sintaxis del XML o XSL.</p>");
        }
    }
    // ================================= 
// FUNCIONALIDAD PÁGINA DE JUGADORES
// ================================= 

// Base de datos de jugadores por temporada
const jugadoresPorTemporada = {
    "2025_2026": {
        nombre: "Temporada 2025/2026",
        jugadores: [
            // Barcelona
            { nombre: "Álvaro Mena", equipo: "Barcelona", posicion: "Lateral", dorsal: 7, edad: 28, nacionalidad: "España", altura: "185cm", peso: "82kg" },
            { nombre: "Carla Ríos", equipo: "Barcelona", posicion: "Extremo", dorsal: 11, edad: 25, nacionalidad: "España", altura: "172cm", peso: "68kg" },
            { nombre: "Ignacio Vela", equipo: "Barcelona", posicion: "Central", dorsal: 9, edad: 30, nacionalidad: "España", altura: "190cm", peso: "88kg" },
            { nombre: "Sofía Llorente", equipo: "Barcelona", posicion: "Portera", dorsal: 1, edad: 27, nacionalidad: "España", altura: "178cm", peso: "72kg" },
            
            // Granada
            { nombre: "Carlos Muñoz", equipo: "Granada", posicion: "Pivote", dorsal: 15, edad: 29, nacionalidad: "España", altura: "188cm", peso: "85kg" },
            { nombre: "Marta Domínguez", equipo: "Granada", posicion: "Lateral", dorsal: 8, edad: 24, nacionalidad: "España", altura: "175cm", peso: "70kg" },
            { nombre: "Andrés Cortés", equipo: "Granada", posicion: "Extremo", dorsal: 12, edad: 26, nacionalidad: "España", altura: "180cm", peso: "76kg" },
            { nombre: "Lucía Palacios", equipo: "Granada", posicion: "Central", dorsal: 10, edad: 28, nacionalidad: "España", altura: "182cm", peso: "74kg" },
            
            // Sevilla
            { nombre: "Marina Torres", equipo: "Sevilla", posicion: "Portera", dorsal: 13, edad: 31, nacionalidad: "España", altura: "176cm", peso: "71kg" },
            { nombre: "Fernando Vázquez", equipo: "Sevilla", posicion: "Lateral", dorsal: 6, edad: 27, nacionalidad: "España", altura: "184cm", peso: "80kg" },
            { nombre: "Ana Beltrán", equipo: "Sevilla", posicion: "Extremo", dorsal: 14, edad: 23, nacionalidad: "España", altura: "170cm", peso: "65kg" },
            { nombre: "Rubén Márquez", equipo: "Sevilla", posicion: "Pivote", dorsal: 5, edad: 29, nacionalidad: "España", altura: "186cm", peso: "84kg" },
            
            // Zaragoza
            { nombre: "Miguel Ortega", equipo: "Zaragoza", posicion: "Central", dorsal: 9, edad: 32, nacionalidad: "España", altura: "189cm", peso: "87kg" },
            { nombre: "Claudia Rivas", equipo: "Zaragoza", posicion: "Lateral", dorsal: 7, edad: 25, nacionalidad: "España", altura: "174cm", peso: "69kg" },
            { nombre: "Javier Torres", equipo: "Zaragoza", posicion: "Portero", dorsal: 1, edad: 28, nacionalidad: "España", altura: "192cm", peso: "90kg" },
            { nombre: "Isabel Salinas", equipo: "Zaragoza", posicion: "Extremo", dorsal: 11, edad: 26, nacionalidad: "España", altura: "171cm", peso: "66kg" },
            
            // Valencia
            { nombre: "Raúl Pérez", equipo: "Valencia", posicion: "Pivote", dorsal: 15, edad: 30, nacionalidad: "España", altura: "187cm", peso: "83kg" },
            { nombre: "Andrea Delgado", equipo: "Valencia", posicion: "Central", dorsal: 10, edad: 24, nacionalidad: "España", altura: "181cm", peso: "73kg" },
            { nombre: "Luis Navarro", equipo: "Valencia", posicion: "Lateral", dorsal: 8, edad: 27, nacionalidad: "España", altura: "183cm", peso: "79kg" },
            { nombre: "Marta Ramírez", equipo: "Valencia", posicion: "Portera", dorsal: 1, edad: 29, nacionalidad: "España", altura: "177cm", peso: "72kg" },
            
            // Athletic Club
            { nombre: "Pablo Martínez", equipo: "Athletic Club", posicion: "Extremo", dorsal: 12, edad: 26, nacionalidad: "España", altura: "179cm", peso: "75kg" },
            { nombre: "Alicia Gómez", equipo: "Athletic Club", posicion: "Lateral", dorsal: 7, edad: 25, nacionalidad: "España", altura: "173cm", peso: "68kg" },
            { nombre: "Daniel Reyes", equipo: "Athletic Club", posicion: "Central", dorsal: 9, edad: 31, nacionalidad: "España", altura: "188cm", peso: "86kg" },
            { nombre: "Elena López", equipo: "Athletic Club", posicion: "Pivote", dorsal: 5, edad: 28, nacionalidad: "España", altura: "176cm", peso: "71kg" }
        ]
    },
    "2024_2025": {
        nombre: "Temporada 2024/2025",
        jugadores: [
            // Barcelona
            { nombre: "Marc Rodríguez", equipo: "Barcelona", posicion: "Portero", dorsal: 1, edad: 29, nacionalidad: "España", altura: "193cm", peso: "92kg" },
            { nombre: "Laura Sánchez", equipo: "Barcelona", posicion: "Extremo", dorsal: 10, edad: 26, nacionalidad: "España", altura: "170cm", peso: "65kg" },
            { nombre: "David López", equipo: "Barcelona", posicion: "Central", dorsal: 8, edad: 31, nacionalidad: "España", altura: "188cm", peso: "85kg" },
            { nombre: "Clara Martín", equipo: "Barcelona", posicion: "Lateral", dorsal: 6, edad: 24, nacionalidad: "España", altura: "176cm", peso: "70kg" },
            
            // Granada
            { nombre: "Sergio Ruiz", equipo: "Granada", posicion: "Pivote", dorsal: 14, edad: 28, nacionalidad: "España", altura: "186cm", peso: "83kg" },
            { nombre: "Patricia Vega", equipo: "Granada", posicion: "Portera", dorsal: 13, edad: 27, nacionalidad: "España", altura: "180cm", peso: "75kg" },
            { nombre: "Jorge Navarro", equipo: "Granada", posicion: "Extremo", dorsal: 11, edad: 25, nacionalidad: "España", altura: "178cm", peso: "74kg" },
            { nombre: "Rosa Fernández", equipo: "Granada", posicion: "Central", dorsal: 9, edad: 30, nacionalidad: "España", altura: "183cm", peso: "76kg" },
            
            // Sevilla  
            { nombre: "Antonio Gil", equipo: "Sevilla", posicion: "Lateral", dorsal: 7, edad: 26, nacionalidad: "España", altura: "182cm", peso: "78kg" },
            { nombre: "Carmen Díaz", equipo: "Sevilla", posicion: "Extremo", dorsal: 15, edad: 24, nacionalidad: "España", altura: "169cm", peso: "64kg" },
            { nombre: "Manuel Torres", equipo: "Sevilla", posicion: "Portero", dorsal: 1, edad: 32, nacionalidad: "España", altura: "195cm", peso: "94kg" },
            { nombre: "Isabel Romero", equipo: "Sevilla", posicion: "Pivote", dorsal: 4, edad: 27, nacionalidad: "España", altura: "175cm", peso: "72kg" },
            
            // Zaragoza
            { nombre: "Alberto Pérez", equipo: "Zaragoza", posicion: "Central", dorsal: 10, edad: 33, nacionalidad: "España", altura: "190cm", peso: "89kg" },
            { nombre: "Beatriz Castro", equipo: "Zaragoza", posicion: "Lateral", dorsal: 8, edad: 23, nacionalidad: "España", altura: "172cm", peso: "67kg" },
            { nombre: "Francisco Mora", equipo: "Zaragoza", posicion: "Extremo", dorsal: 12, edad: 29, nacionalidad: "España", altura: "177cm", peso: "73kg" },
            { nombre: "Natalia Herrera", equipo: "Zaragoza", posicion: "Portera", dorsal: 1, edad: 26, nacionalidad: "España", altura: "179cm", peso: "74kg" },
            
            // Valencia
            { nombre: "Roberto Silva", equipo: "Valencia", posicion: "Pivote", dorsal: 16, edad: 31, nacionalidad: "España", altura: "185cm", peso: "82kg" },
            { nombre: "Sara Jiménez", equipo: "Valencia", posicion: "Central", dorsal: 11, edad: 25, nacionalidad: "España", altura: "180cm", peso: "71kg" },
            { nombre: "Javier Campos", equipo: "Valencia", posicion: "Lateral", dorsal: 9, edad: 28, nacionalidad: "España", altura: "184cm", peso: "80kg" },
            { nombre: "Ana Morales", equipo: "Valencia", posicion: "Extremo", dorsal: 7, edad: 22, nacionalidad: "España", altura: "168cm", peso: "63kg" },
            
            // Athletic Club
            { nombre: "Iñaki Aguirre", equipo: "Athletic Club", posicion: "Portero", dorsal: 1, edad: 30, nacionalidad: "España", altura: "194cm", peso: "93kg" },
            { nombre: "Amaia Etxebarria", equipo: "Athletic Club", posicion: "Lateral", dorsal: 6, edad: 24, nacionalidad: "España", altura: "174cm", peso: "69kg" },
            { nombre: "Jon Aramburu", equipo: "Athletic Club", posicion: "Central", dorsal: 8, edad: 27, nacionalidad: "España", altura: "187cm", peso: "84kg" },
            { nombre: "Nerea Uriarte", equipo: "Athletic Club", posicion: "Pivote", dorsal: 4, edad: 29, nacionalidad: "España", altura: "177cm", peso: "73kg" }
        ]
    }
};

// Variable global para temporada actual
let temporadaActual = "2025_2026";
let jugadoresActuales = [];

// Función para obtener las iniciales del jugador
function getInicialesJugador(nombre) {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
        return partes[0][0] + partes[partes.length - 1][0];
    }
    return partes[0][0];
}

// Función para obtener emoji de bandera según nacionalidad
function getBanderaJugador(nacionalidad) {
    const banderas = {
        'España': '🇪🇸',
        'Brasil': '🇧🇷',
        'Argentina': '🇦🇷',
        'Francia': '🇫🇷',
        'Italia': '🇮🇹',
        'Alemania': '🇩🇪',
        'Portugal': '🇵🇹'
    };
    return banderas[nacionalidad] || '🌍';
}

// Función para cargar temporada
function cargarTemporada(idTemporada) {
    temporadaActual = idTemporada;
    const datosTemporada = jugadoresPorTemporada[idTemporada];
    
    if (!datosTemporada) {
        console.error("Temporada no encontrada");
        return;
    }
    
    jugadoresActuales = datosTemporada.jugadores;
    
    // Actualizar estadísticas
    actualizarEstadisticasJugadores();
    
    // Poblar filtro de equipos
    poblarFiltroEquiposJugadores();
    
    // Renderizar jugadores
    renderizarJugadores(jugadoresActuales);
    
    // Ocultar mensaje de carga y mostrar grid
    $("#mensajeCarga").hide();
    $("#gridJugadores").show();
}

// Función para actualizar estadísticas
function actualizarEstadisticasJugadores() {
    const totalJugadores = jugadoresActuales.length;
    
    // Contar equipos únicos
    const equiposUnicos = new Set(jugadoresActuales.map(j => j.equipo));
    const totalEquipos = equiposUnicos.size;
    
    // Contar nacionalidades únicas
    const nacionalidades = new Set(jugadoresActuales.map(j => j.nacionalidad));
    const totalNacionalidades = nacionalidades.size;
    
    // Calcular edad promedio
    const sumaEdades = jugadoresActuales.reduce((sum, j) => sum + j.edad, 0);
    const edadPromedio = Math.round(sumaEdades / totalJugadores);
    
    $("#totalJugadores").text(totalJugadores);
    $("#totalEquipos").text(totalEquipos);
    $("#totalNacionalidades").text(totalNacionalidades);
    $("#edadPromedio").text(edadPromedio);
}

// Función para poblar el filtro de equipos
function poblarFiltroEquiposJugadores() {
    const $filtroEquipo = $("#filtroEquipo");
    $filtroEquipo.find('option:not(:first)').remove();
    
    // Obtener equipos únicos
    const equiposUnicos = [...new Set(jugadoresActuales.map(j => j.equipo))].sort();
    
    equiposUnicos.forEach(equipo => {
        $filtroEquipo.append(`<option value="${equipo}">${equipo}</option>`);
    });
}

// Función para renderizar jugadores
function renderizarJugadores(jugadoresFiltrados) {
    const grid = $("#gridJugadores");
    const noResultados = $("#noResultados");
    
    grid.empty();
    
    if (jugadoresFiltrados.length === 0) {
        grid.hide();
        noResultados.show();
        return;
    }
    
    grid.show();
    noResultados.hide();
    
    jugadoresFiltrados.forEach(jugador => {
        const card = `
            <article class="cardJugador">
                <div class="jugadorHeader">
                    <div class="jugadorAvatar">${getInicialesJugador(jugador.nombre)}</div>
                    <h3 class="jugadorNombre">${jugador.nombre}</h3>
                    <p class="jugadorEquipo">${jugador.equipo}</p>
                </div>
                <div class="jugadorInfo">
                    <div class="infoItem">
                        <span class="infoLabel">Posición</span>
                        <span class="infoValue">${jugador.posicion}</span>
                    </div>
                    <div class="infoItem">
                        <span class="infoLabel">Dorsal</span>
                        <span class="infoValue">#${jugador.dorsal}</span>
                    </div>
                    <div class="infoItem">
                        <span class="infoLabel">Edad</span>
                        <span class="infoValue">${jugador.edad} años</span>
                    </div>
                    <div class="infoItem">
                        <span class="infoLabel">Nacionalidad</span>
                        <span class="infoValue">
                            <span class="banderaNacionalidad">${getBanderaJugador(jugador.nacionalidad)}</span>
                            ${jugador.nacionalidad}
                        </span>
                    </div>
                    <div class="infoItem">
                        <span class="infoLabel">Altura</span>
                        <span class="infoValue">${jugador.altura}</span>
                    </div>
                    <div class="infoItem">
                        <span class="infoLabel">Peso</span>
                        <span class="infoValue">${jugador.peso}</span>
                    </div>
                </div>
            </article>
        `;
        grid.append(card);
    });
}

// Función de filtrado
function filtrarJugadores() {
    const equipoSeleccionado = $("#filtroEquipo").val();
    const posicionSeleccionada = $("#filtroPosicion").val();
    const busqueda = $("#buscarJugador").val().toLowerCase();
    
    let jugadoresFiltrados = jugadoresActuales;
    
    // Filtrar por equipo
    if (equipoSeleccionado !== 'todos') {
        jugadoresFiltrados = jugadoresFiltrados.filter(j => j.equipo === equipoSeleccionado);
    }
    
    // Filtrar por posición
    if (posicionSeleccionada !== 'todos') {
        jugadoresFiltrados = jugadoresFiltrados.filter(j => j.posicion === posicionSeleccionada);
    }
    
    // Filtrar por nombre
    if (busqueda) {
        jugadoresFiltrados = jugadoresFiltrados.filter(j => 
            j.nombre.toLowerCase().includes(busqueda)
        );
    }
    
    renderizarJugadores(jugadoresFiltrados);
}

// Inicializar funcionalidad de jugadores cuando el DOM esté listo
$(document).ready(function() {
    // Solo ejecutar si estamos en la página de jugadores
    if ($("#gridJugadores").length > 0) {
        // Poblar selector de temporadas
        const $selectorTemporada = $("#selectorTemporada");
        if ($selectorTemporada.length > 0) {
            for (const [id, datos] of Object.entries(jugadoresPorTemporada)) {
                $selectorTemporada.append(`<option value="${id}">${datos.nombre}</option>`);
            }
            
            // Event listener para cambio de temporada
            $selectorTemporada.on('change', function() {
                cargarTemporada($(this).val());
            });
        }
        
        // Cargar temporada actual por defecto
        cargarTemporada(temporadaActual);
        
        // Event listeners para filtros
        $("#filtroEquipo").on('change', filtrarJugadores);
        $("#filtroPosicion").on('change', filtrarJugadores);
        $("#buscarJugador").on('input', filtrarJugadores);
    }
});

    // --- Lógica Principal ---
    
    // 1. Cargar el XSLT primero
    loadFile(xslFile)
        .done(function (doc) {
            xslDoc = doc; // Guarda el documento XSLT
            
            // 2. Si el XSLT carga, cargar el XML de la jornada 5
            return loadFile(xmlFile); 
        })
        .then(function (xmlDoc) {
            // 3. Si ambos cargan, transformar y mostrar
            transformAndDisplay(xmlDoc, xslDoc);
        })
        .fail(function (jqXHR) {
            // Manejar errores de carga
            let errorMsg = `Error al cargar un archivo (${jqXHR.status}). Revisa las rutas: `;
            if (xslDoc === null) {
                errorMsg += xslFile;
            } else {
                errorMsg += xmlFile;
            }
            $(containerId).html(`<p>${errorMsg}</p>`);
        });

});