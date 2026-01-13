// FUNCIÓN DE CARGA PARA LA CLASIFICACIÓN DE EQUIPOS

// Define las rutas y selectores
const xslFile = "xml/XSLT/clasificacion.xsl";
const xmlFileDefault = "xml/data/general.xml"; // Archivo XML de la temporada actual
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
function loadAndTransformXML(xmlFileName, temporadaId) {
  if (!xslDoc) {
    $(containerId).html(
      "<p>Error: XSLT no cargado. No se puede realizar la transformación.</p>"
    );
    return;
  }

  $(containerId).html("Cargando clasificación...");

  loadFile(xmlFileName)
    .done(function (xmlDoc) {
      // 1. Crear y aplicar el procesador XSLT (JS Nativo)
      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xslDoc);

      // 2. Pasar el parámetro temporadaId al XSLT
      xsltProcessor.setParameter(null, "temporadaId", temporadaId);

      // 3. Transformación
      const resultDocument = xsltProcessor.transformToFragment(
        xmlDoc,
        document
      );

      // 4. Inserción en el contenedor usando jQuery
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

// --- Función para cargar dinámicamente las temporadas del XML ---
function cargarTemporadas() {
  $.ajax({
    url: 'xml/data/general.xml',
    dataType: 'xml',
    success: function(xmlDoc) {
      // Busca todos los nodos <temporada>
      const temporadas = $(xmlDoc).find('temporada');
      const select = $('#selectorTemporada');
      
      if (select.length === 0) return; // Si no existe el select, no hacer nada
      
      // Limpiar opciones existentes
      select.empty();
      
      // Por cada temporada que encuentra en el XML
      temporadas.each(function() {
        const id = $(this).attr('id');
        const option = $('<option></option>')
          .val(id)
          .text(`Temporada ${id.replace('_', '/')}`);
        select.append(option);
      });
      
      // Cargar la última temporada por defecto
      if (temporadas.length > 0) {
        const ultimaTemporada = $(temporadas[temporadas.length - 1]).attr('id');
        select.val(ultimaTemporada);
        loadAndTransformXML(xmlFileDefault, ultimaTemporada);
      }
    },
    error: function() {
      console.error('Error al cargar temporadas');
    }
  });
}

// --- Lógica Principal de Inicialización y Eventos ---
$(document).ready(function () {
  // 1. Cargar el XSLT una única vez al inicio de la página.
  loadFile(xslFile)
    .done(function (doc) {
      xslDoc = doc;

      // 💡 Cargar dinámicamente las temporadas del XML
      cargarTemporadas();
    })
    .fail(function () {
      $(containerId).html(
        "<p>Error crítico: No se pudo cargar el archivo XSLT.</p>"
      );
    });

  // 2. Manejo de cambio de temporada (si existe un selector)
  $(document).on("change", "#selectorTemporada", function () {
    const temporadaSeleccionada = $(this).val();
    loadAndTransformXML(xmlFileDefault, temporadaSeleccionada);
  });

  // 3. Añadir el Listener de Clic a los enlaces del menú
  $(linkClass).on("click", function (event) {
    event.preventDefault();

    const xmlToLoad = $(this).attr("href");

    loadAndTransformXML(xmlToLoad);
  });
});

