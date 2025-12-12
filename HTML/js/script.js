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