// Define las rutas y selectores
const xslFile = "xml/clasificacion.xsl";
const xmlFileDefault = "xml/clasificacion2025_2026.xml"; // Archivo XML de la temporada actual
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

  $.ajax({
    url: xmlFileName,
    dataType: "xml",
  })
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
