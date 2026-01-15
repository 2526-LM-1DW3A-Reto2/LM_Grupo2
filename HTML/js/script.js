// FUNCIÓN DE CARGA PARA LA CLASIFICACIÓN DE EQUIPOS

// FUNCIÓN DE CARGA DE LAS PÁGINAS

$(document).ready(function () {
  // Escuchamos el click en cualquier botón con la clase btn-nav
  $(".btnMenu").on("click", function () {
    // Obtenemos el nombre del archivo desde el atributo data-archivo
    let archivo = $(this).data("archivo");

    // 1. Opcional: Podrías añadir una animación de carga
    $("#contenedorPrincipal").fadeOut(200, function () {
      // 2. Cargamos el contenido del archivo .html
      $(this).load(archivo, function (response, status, xhr) {
        if (status == "error") {
          $(this).html(
            "<p>Error al cargar el contenido: " + xhr.statusText + "</p>"
          );
        }

        // 3. Mostramos el contenedor con el nuevo contenido
        $(this).fadeIn(200);
      });
    });
  });
});

// Define las rutas y selectores
const xslFile = "xml/XSLT/clasificacion.xsl";
const xmlFileDefault = "xml/data/ligaBalonmano.xml"; // Archivo XML de la temporada actual
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
    url: "xml/data/ligaBalonmano.xml",
    dataType: "xml",
    success: function (xmlDoc) {
      // Busca todos los nodos <temporada>
      const temporadas = $(xmlDoc).find("temporada");
      const select = $("#selectorTemporada");

      if (select.length === 0) return; // Si no existe el select, no hacer nada

      // Limpiar opciones existentes
      select.empty();

      // Por cada temporada que encuentra en el XML
      temporadas.each(function () {
        const id = $(this).attr("id");
        const option = $("<option></option>")
          .val(id)
          .text(`Temporada ${id.replace("_", "/")}`);
        select.append(option);
      });

      // Cargar la última temporada por defecto
      if (temporadas.length > 0) {
        const ultimaTemporada = $(temporadas[temporadas.length - 1]).attr("id");
        select.val(ultimaTemporada);
        loadAndTransformXML(xmlFileDefault, ultimaTemporada);
      }
    },
    error: function () {
      console.error("Error al cargar temporadas");
    },
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

  // 4. Cargar jugadores si estamos en la página de jugadores
  if ($("#gridJugadores").length) {
    cargarJugadores();
  }

  // 5. Eventos de filtros de jugadores
  $(document).on("change", "#filtroEquipo", aplicarFiltros);
  $(document).on("change", "#filtroPosicion", aplicarFiltros);
  $(document).on("keyup", "#buscarJugador", aplicarFiltros);
});

// --- FUNCIONES PARA JUGADORES ---

function cargarJugadores() {
  // Mostrar mensaje de carga
  $("#mensajeCarga").show();
  if ($("#gridJugadores").length) {
    $("#gridJugadores").empty();
  }

  // Cargar el archivo XML
  $.ajax({
    url: "xml/data/ligaBalonmano.xml",
    dataType: "text",
    success: function (xmlText) {
      // Parseamos el XML
      const xmlDoc = $.parseXML(xmlText);

      // Cargar el archivo XSLT
      $.ajax({
        url: "xml/XSLT/jugadores.xsl",
        dataType: "text",
        success: function (xsltText) {
          // Parseamos el XSLT
          const xsltDoc = $.parseXML(xsltText);

          // Realizar la transformación
          const processor = new XSLTProcessor();
          processor.importStylesheet(xsltDoc);
          const resultDoc = processor.transformToFragment(xmlDoc, document);

          // Insertar el resultado en el contenedor
          if ($("#gridJugadores").length) {
            $("#gridJugadores").empty().append(resultDoc);
          }

          // Ocultar mensaje de carga
          $("#mensajeCarga").hide();

          // Cargar filtros dinámicamente
          cargarFiltros(xmlDoc);

          // Cargar estadísticas
          cargarEstadisticas(xmlDoc);

          // Aplicar filtros si existen
          aplicarFiltros();
        },
        error: function (xhr, status, error) {
          console.error("Error cargando XSLT:", error);
          $("#mensajeCarga").html(
            '<p style="color: red;">❌ Error al cargar el archivo XSLT.</p>'
          );
        },
      });
    },
    error: function (xhr, status, error) {
      console.error("Error cargando XML:", error);
      $("#mensajeCarga").html(
        '<p style="color: red;">❌ Error al cargar el archivo XML de jugadores.</p>'
      );
    },
  });
}

function cargarFiltros(xmlDoc) {
  // Obtener equipos únicos del XML
  const equipos = new Set();
  $(xmlDoc)
    .find("temporada")
    .each(function () {
      $(this)
        .find("equipo")
        .each(function () {
          // Obtener solo el elemento nombre directo, no anidado
          const nombreEquipo = $(this).children("nombre").first().text().trim();
          if (nombreEquipo) {
            equipos.add(nombreEquipo);
          }
        });
    });

  // Agregar opciones al select de equipos (ordenadas alfabéticamente)
  const $filtroEquipo = $("#filtroEquipo");
  const equiposOrdenados = Array.from(equipos).sort();
  equiposOrdenados.forEach(function (equipo) {
    $filtroEquipo.append($("<option></option>").val(equipo).text(equipo));
  });
}

function cargarEstadisticas(xmlDoc) {
  // Total de jugadores únicos
  const jugadoresUnicos = new Set();
  $(xmlDoc)
    .find("jugador")
    .each(function () {
      const nombre = $(this).find("nombre").text();
      jugadoresUnicos.add(nombre);
    });
  $("#totalJugadores").text(jugadoresUnicos.size);

  // Total de equipos
  const equipos = new Set();
  $(xmlDoc)
    .find("equipo")
    .each(function () {
      const nombreEquipo = $(this).find("nombre").text();
      if (nombreEquipo) {
        equipos.add(nombreEquipo);
      }
    });
  $("#totalEquipos").text(equipos.size);

  // Altura promedio
  let sumaAlturas = 0;
  let conteoAlturas = 0;
  $(xmlDoc)
    .find("jugador")
    .each(function () {
      const altura = parseFloat($(this).find("altura").text());
      if (!isNaN(altura)) {
        sumaAlturas += altura;
        conteoAlturas++;
      }
    });
  const alturaPromedio =
    conteoAlturas > 0 ? (sumaAlturas / conteoAlturas).toFixed(2) : 0;
  $("#edadPromedio").text(alturaPromedio + " m");

  // Nacionalidades (si existen en el XML)
  const nacionalidades = new Set();
  $(xmlDoc)
    .find("jugador")
    .each(function () {
      const nacionalidad = $(this).find("nacionalidad").text();
      if (nacionalidad) {
        nacionalidades.add(nacionalidad);
      }
    });
  $("#totalNacionalidades").text(nacionalidades.size);
}

function aplicarFiltros() {
  const equipoSeleccionado = $("#filtroEquipo").val();
  const posicionSeleccionada = $("#filtroPosicion").val();
  const nombreBuscado = $("#buscarJugador").val().toLowerCase();

  let contadorVisibles = 0;

  // Filtrar las tarjetas de jugadores
  $(".cardJugador").each(function () {
    const $card = $(this);

    // Obtener datos de la tarjeta
    const nombre = $card.find("h3").text().toLowerCase();

    // Obtener todo el contenido de texto
    const textoCompleto = $card.text();

    // Extraer el equipo (búsqueda más flexible)
    let equipoCard = "";
    const regexEquipo = /Equipo:\s*([^\n]+)/;
    const matchEquipo = textoCompleto.match(regexEquipo);
    if (matchEquipo) {
      equipoCard = matchEquipo[1].trim();
    }

    // Extraer la posición
    let posicionCard = "";
    const regexPosicion = /Posición:\s*([^\n]+)/;
    const matchPosicion = textoCompleto.match(regexPosicion);
    if (matchPosicion) {
      posicionCard = matchPosicion[1].trim();
    }

    // Aplicar filtros
    let mostrar = true;

    // Filtro por equipo
    if (equipoSeleccionado && equipoSeleccionado !== "todos") {
      if (!equipoCard || equipoCard !== equipoSeleccionado) {
        mostrar = false;
      }
    }

    // Filtro por posición
    if (posicionSeleccionada && posicionSeleccionada !== "todos") {
      if (!posicionCard || posicionCard !== posicionSeleccionada) {
        mostrar = false;
      }
    }

    // Filtro por nombre
    if (nombreBuscado && nombreBuscado.trim() !== "") {
      if (!nombre.includes(nombreBuscado)) {
        mostrar = false;
      }
    }

    // Mostrar u ocultar
    if (mostrar) {
      $card.show();
      contadorVisibles++;
    } else {
      $card.hide();
    }
  });

  // Mostrar mensaje si no hay resultados
  if (contadorVisibles === 0) {
    $("#noResultados").show();
  } else {
    $("#noResultados").hide();
  }
}

$(document).ready(function () {
  const xmlPath = "xml/data/ligaBalonmano.xml";
  const xslPath = "xml/XSLT/clasificacionCopia.xsl";
  const targetId = "#tablaClasificacion";

  // Cargamos ambos archivos simultáneamente usando $.when
  $.when($.ajax(xmlPath), $.ajax(xslPath))
    .done(function (xmlResponse, xslResponse) {
      const xml = xmlResponse[0];
      const xsl = xslResponse[0];

      // Validar si el navegador soporta XSLTProcessor (Navegadores modernos)
      if (window.XSLTProcessor) {
        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);

        const resultDocument = xsltProcessor.transformToFragment(xml, document);

        $(targetId).empty().append(resultDocument);
      }
      // Soporte para Internet Explorer (Legacy)
      else if (window.ActiveXObject || "ActiveXObject" in window) {
        const ex = xml.transformNode(xsl);
        $(targetId).html(ex);
      } else {
        console.error(
          "Tu navegador no soporta transformación XSLT en el cliente."
        );
      }
    })
    .fail(function () {
      console.error("Error al cargar los archivos XML o XSL.");
    });
});
