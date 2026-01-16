$(document).ready(function () {
  // 1. Cargar por defecto inicio.html y luego cargar datos dinámicos
  $("#contenedorPrincipal").load("pages/inicio.html", function () {
    cargarDatosInicio();
  });

  // 2. Función para el menú
  $(".btnMenu").on("click", function () {
    $(".btnMenu").removeClass("active");
    $(this).addClass("active");

    let archivo = $(this).data("archivo");

    // CARGA CON CALLBACK:
    // El tercer parámetro es una función que se ejecuta SOLO cuando el archivo ya cargó
    $("#contenedorPrincipal").load(archivo, function () {
      // Si el archivo que acabamos de cargar es el de inicio
      if (archivo.includes("inicio.html")) {
        cargarDatosInicio();
      }
      // Si el archivo que acabamos de cargar es el de la clasificación
      if (archivo.includes("clasificacion.html")) {
        cargarTemporadas();
      }
      // Si el archivo que acabamos de cargar es el de jugadores
      if (archivo.includes("jugadores.html")) {
        cargarTemporadasJugadores();
      }
      // Si el archivo que acabamos de cargar es el de equipos
      if (archivo.includes("equipos.html")) {
        cargarTemporadasEquipos();
      }
      // Si el archivo que acabamos de cargar es el de calendario
      if (archivo.includes("calendario.html")) {
        cargarTemporadasCalendario();
      }
    });
  });
});

// ==================== INICIO ====================

// Variables globales para inicio
let xmlDocInicio = null;
let xslDocInicio = null;

// Cargar datos dinámicos de la página de inicio
function cargarDatosInicio() {
  const xmlUrl = "xml/data/general.xml";
  const xslUrl = "xml/XSLT/inicio.xsl";

  $.when(
    $.ajax({ url: xmlUrl, dataType: "xml" }),
    $.ajax({ url: xslUrl, dataType: "xml" }),
  )
    .done(function (xmlResp, xslResp) {
      xmlDocInicio = xmlResp[0];
      xslDocInicio = xslResp[0];

      // Obtener la última temporada
      const temporadas = $(xmlDocInicio).find("temporada");
      const ultimaTemporada = temporadas.last().attr("id");

      // Transformar y mostrar
      cargarContenidoInicio(ultimaTemporada);
    })
    .fail(function (err) {
      console.error("Error cargando XML/XSLT de inicio:", err);
      $("#contenidoInicioXSLT").html(
        '<p class="mensajeError">No se pudieron cargar los datos. Si estás abriendo el archivo directamente (file://), sirve el sitio desde un servidor local.</p>',
      );
    });
}

// Cargar el contenido de inicio con la temporada especificada
function cargarContenidoInicio(temporadaId) {
  const $contenedor = $("#contenidoInicioXSLT");
  if (!$contenedor.length || !xmlDocInicio || !xslDocInicio) return;

  try {
    const processor = new XSLTProcessor();
    processor.importStylesheet(xslDocInicio);
    processor.setParameter(null, "temporadaId", temporadaId);
    const fragment = processor.transformToFragment(xmlDocInicio, document);
    $contenedor.empty().append(fragment);

    // Configurar eventos de los botones "Ver más"
    configurarBotonesVerMas();
  } catch (e) {
    console.error("Error transformando XSLT de inicio:", e);
    $contenedor.html(
      '<p class="mensajeError">No se pudo renderizar el contenido de inicio.</p>',
    );
  }
}

// Configurar los botones "Ver más" para navegar a otras páginas
function configurarBotonesVerMas() {
  $(".btnVerMas")
    .off("click")
    .on("click", function () {
      const archivo = $(this).data("archivo");
      $(".btnMenu").removeClass("active");
      $(".btnMenu[data-archivo='" + archivo + "']").addClass("active");

      $("#contenedorPrincipal").load(archivo, function () {
        if (archivo.includes("clasificacion.html")) cargarTemporadas();
        if (archivo.includes("jugadores.html")) cargarTemporadasJugadores();
        if (archivo.includes("equipos.html")) cargarTemporadasEquipos();
        if (archivo.includes("calendario.html")) cargarTemporadasCalendario();
      });
    });
}

// ==================== CLASIFICACIÓN ====================

// Variable global para almacenar el XML y XSL de clasificación
let xmlDocGlobal = null;
let xslDocGlobal = null;

// Cargar las temporadas disponibles en el desplegable
function cargarTemporadas() {
  const xmlUrl = "xml/data/general.xml";
  const xslUrl = "xml/XSLT/clasificacion.xsl";

  $.when(
    $.ajax({ url: xmlUrl, dataType: "xml" }),
    $.ajax({ url: xslUrl, dataType: "xml" }),
  )
    .done(function (xmlResp, xslResp) {
      xmlDocGlobal = xmlResp[0];
      xslDocGlobal = xslResp[0];

      // Obtener todas las temporadas del XML
      const temporadas = $(xmlDocGlobal).find("temporada");
      const $select = $("#selectTemporada");

      // Limpiar opciones existentes (excepto la primera)
      $select.find("option:not(:first)").remove();

      // Añadir una opción por cada temporada
      temporadas.each(function () {
        const id = $(this).attr("id");
        // Formatear el id para mostrar (ej: 2021_2022 -> 2021/2022)
        const textoMostrar = id.replace("_", "/");
        $select.append(
          $("<option>", {
            value: id,
            text: "Temporada " + textoMostrar,
          }),
        );
      });

      // Evento cuando cambia la selección de temporada
      $select.off("change").on("change", function () {
        const temporadaSeleccionada = $(this).val();
        if (temporadaSeleccionada) {
          cargarClasificacionTemporada(temporadaSeleccionada);
        } else {
          $("#tablaClasificacion").html(
            '<p style="text-align: center; color: #666;">Selecciona una temporada para ver la clasificación</p>',
          );
        }
      });

      // Cargar automáticamente la última temporada si existe
      if (temporadas.length > 0) {
        const ultimaTemporada = temporadas.last().attr("id");
        $select.val(ultimaTemporada);
        cargarClasificacionTemporada(ultimaTemporada);
      }
    })
    .fail(function (err) {
      console.error("Error cargando XML/XSLT:", err);
      $("#tablaClasificacion").html(
        '<p class="mensajeError">No se pudieron cargar los datos. Si estás abriendo el archivo directamente (file://), sirve el sitio desde un servidor local.</p>',
      );
    });
}

// Cargar la clasificación de una temporada específica
function cargarClasificacionTemporada(temporadaId) {
  const $contenedor = $("#tablaClasificacion");
  if (!$contenedor.length || !xmlDocGlobal || !xslDocGlobal) return;

  try {
    const processor = new XSLTProcessor();
    processor.importStylesheet(xslDocGlobal);
    // Pasar el parámetro de temporada al procesador XSLT
    processor.setParameter(null, "temporadaId", temporadaId);
    const fragment = processor.transformToFragment(xmlDocGlobal, document);
    $contenedor.empty().append(fragment);
  } catch (e) {
    console.error("Error transformando XSLT:", e);
    $contenedor.html(
      '<p class="mensajeError">No se pudo renderizar la clasificación.</p>',
    );
  }
}

// ==================== JUGADORES ====================

// Variables globales para jugadores
let xmlDocJugadores = null;
let xslDocJugadores = null;
let temporadaActualJugadores = null;

// Cargar las temporadas disponibles para jugadores
function cargarTemporadasJugadores() {
  const xmlUrl = "xml/data/general.xml";
  const xslUrl = "xml/XSLT/jugadores.xsl";

  $.when(
    $.ajax({ url: xmlUrl, dataType: "xml" }),
    $.ajax({ url: xslUrl, dataType: "xml" }),
  )
    .done(function (xmlResp, xslResp) {
      xmlDocJugadores = xmlResp[0];
      xslDocJugadores = xslResp[0];

      // Obtener todas las temporadas del XML
      const temporadas = $(xmlDocJugadores).find("temporada");
      const $select = $("#selectorTemporadaJugadores");

      // Limpiar opciones existentes (excepto la primera)
      $select.find("option:not(:first)").remove();

      // Añadir una opción por cada temporada
      temporadas.each(function () {
        const id = $(this).attr("id");
        const textoMostrar = id.replace("_", "/");
        $select.append(
          $("<option>", {
            value: id,
            text: "Temporada " + textoMostrar,
          }),
        );
      });

      // Evento cuando cambia la selección de temporada
      $select.off("change").on("change", function () {
        const temporadaSeleccionada = $(this).val();
        if (temporadaSeleccionada) {
          temporadaActualJugadores = temporadaSeleccionada;
          cargarJugadoresTemporada(temporadaSeleccionada);
          cargarFiltrosJugadores(temporadaSeleccionada);
        } else {
          $("#gridJugadores").html(
            '<p style="text-align: center; color: #666;">Selecciona una temporada para ver los jugadores</p>',
          );
        }
      });

      // Configurar eventos de filtros
      configurarFiltrosJugadores();

      // Ocultar mensaje de carga
      $("#mensajeCarga").hide();

      // Cargar automáticamente la última temporada si existe
      if (temporadas.length > 0) {
        const ultimaTemporada = temporadas.last().attr("id");
        $select.val(ultimaTemporada);
        temporadaActualJugadores = ultimaTemporada;
        cargarJugadoresTemporada(ultimaTemporada);
        cargarFiltrosJugadores(ultimaTemporada);
      }
    })
    .fail(function (err) {
      console.error("Error cargando XML/XSLT:", err);
      $("#mensajeCarga").html(
        '<p class="mensajeError">No se pudieron cargar los datos. Si estás abriendo el archivo directamente (file://), sirve el sitio desde un servidor local.</p>',
      );
    });
}

// Cargar los jugadores de una temporada específica
function cargarJugadoresTemporada(temporadaId) {
  const $contenedor = $("#gridJugadores");
  if (!$contenedor.length || !xmlDocJugadores || !xslDocJugadores) return;

  try {
    const processor = new XSLTProcessor();
    processor.importStylesheet(xslDocJugadores);
    processor.setParameter(null, "temporadaId", temporadaId);
    const fragment = processor.transformToFragment(xmlDocJugadores, document);
    $contenedor.empty().append(fragment);

    // Actualizar estadísticas
    actualizarEstadisticasJugadores(temporadaId);

    // Limpiar filtros
    limpiarFiltros();
  } catch (e) {
    console.error("Error transformando XSLT:", e);
    $contenedor.html(
      '<p class="mensajeError">No se pudo renderizar los jugadores.</p>',
    );
  }
}

// Cargar los filtros de equipos y posiciones desde el XML
function cargarFiltrosJugadores(temporadaId) {
  const $filtroEquipo = $("#filtroEquipo");
  const $filtroPosicion = $("#filtroPosicion");

  // Limpiar opciones existentes
  $filtroEquipo.find("option:not(:first)").remove();
  $filtroPosicion.find("option:not(:first)").remove();

  // Obtener equipos únicos de la temporada
  const equipos = [];
  $(xmlDocJugadores)
    .find(`temporada[id="${temporadaId}"] equipo`)
    .each(function () {
      const nombreEquipo = $(this).find("> nombre").text();
      if (nombreEquipo && equipos.indexOf(nombreEquipo) === -1) {
        equipos.push(nombreEquipo);
      }
    });

  // Ordenar equipos alfabéticamente
  equipos.sort();

  // Añadir opciones de equipos
  equipos.forEach(function (equipo) {
    $filtroEquipo.append(
      $("<option>", {
        value: equipo,
        text: equipo,
      }),
    );
  });

  // Obtener posiciones únicas de la temporada
  const posiciones = [];
  $(xmlDocJugadores)
    .find(`temporada[id="${temporadaId}"] jugador posicion`)
    .each(function () {
      const posicion = $(this).text();
      if (posicion && posiciones.indexOf(posicion) === -1) {
        posiciones.push(posicion);
      }
    });

  // Ordenar posiciones alfabéticamente
  posiciones.sort();

  // Añadir opciones de posiciones
  posiciones.forEach(function (posicion) {
    $filtroPosicion.append(
      $("<option>", {
        value: posicion,
        text: posicion,
      }),
    );
  });
}

// Configurar eventos de filtros
function configurarFiltrosJugadores() {
  // Evento de búsqueda por nombre
  $("#buscarJugador")
    .off("input")
    .on("input", function () {
      aplicarFiltrosJugadores();
    });

  // Evento de filtro por equipo
  $("#filtroEquipo")
    .off("change")
    .on("change", function () {
      aplicarFiltrosJugadores();
    });

  // Evento de filtro por posición
  $("#filtroPosicion")
    .off("change")
    .on("change", function () {
      aplicarFiltrosJugadores();
    });

  // Evento de limpiar filtros
  $("#btnLimpiarFiltros")
    .off("click")
    .on("click", function () {
      limpiarFiltros();
      aplicarFiltrosJugadores();
    });
}

// Aplicar todos los filtros a los jugadores
function aplicarFiltrosJugadores() {
  const nombreBusqueda = $("#buscarJugador").val().toLowerCase().trim();
  const equipoSeleccionado = $("#filtroEquipo").val();
  const posicionSeleccionada = $("#filtroPosicion").val();

  let jugadoresVisibles = 0;

  $(".fichaJugador").each(function () {
    const $ficha = $(this);
    const nombre = $ficha.data("nombre") || "";
    const equipo = $ficha.data("equipo") || "";
    const posicion = $ficha.data("posicion") || "";

    let mostrar = true;

    // Filtrar por nombre
    if (nombreBusqueda && nombre.indexOf(nombreBusqueda) === -1) {
      mostrar = false;
    }

    // Filtrar por equipo
    if (equipoSeleccionado !== "todos" && equipo !== equipoSeleccionado) {
      mostrar = false;
    }

    // Filtrar por posición
    if (posicionSeleccionada !== "todos" && posicion !== posicionSeleccionada) {
      mostrar = false;
    }

    if (mostrar) {
      $ficha.show();
      jugadoresVisibles++;
    } else {
      $ficha.hide();
    }
  });

  // Mostrar mensaje si no hay resultados
  if (jugadoresVisibles === 0) {
    $("#noResultados").show();
  } else {
    $("#noResultados").hide();
  }

  // Actualizar estadísticas basándose en los jugadores visibles
  actualizarEstadisticasJugadoresFiltrados();
}

// Limpiar todos los filtros
function limpiarFiltros() {
  $("#buscarJugador").val("");
  $("#filtroEquipo").val("todos");
  $("#filtroPosicion").val("todos");
}

// Actualizar estadísticas de jugadores (inicial, desde XML)
function actualizarEstadisticasJugadores(temporadaId) {
  // Llamar a la función que calcula desde los elementos visibles
  // Esto se ejecuta después de cargar los jugadores
  setTimeout(function () {
    actualizarEstadisticasJugadoresFiltrados();
  }, 50);
}

// Actualizar estadísticas basándose en los jugadores visibles (filtrados)
function actualizarEstadisticasJugadoresFiltrados() {
  const $jugadoresVisibles = $(".fichaJugador:visible");

  // Total de jugadores visibles
  const totalJugadores = $jugadoresVisibles.length;
  $("#totalJugadores").text(totalJugadores);

  // Equipos únicos de los jugadores visibles
  const equipos = [];
  $jugadoresVisibles.each(function () {
    const equipo = $(this).data("equipo");
    if (equipo && equipos.indexOf(equipo) === -1) {
      equipos.push(equipo);
    }
  });
  $("#totalEquipos").text(equipos.length);

  // Nacionalidades únicas de los jugadores visibles
  const nacionalidades = [];
  $jugadoresVisibles.each(function () {
    const nac = $(this).data("nacionalidad");
    if (nac && nacionalidades.indexOf(nac) === -1) {
      nacionalidades.push(nac);
    }
  });
  $("#totalNacionalidades").text(nacionalidades.length);

  // Edad promedio de los jugadores visibles
  let sumaEdades = 0;
  let contadorEdades = 0;
  $jugadoresVisibles.each(function () {
    const edad = parseInt($(this).data("edad"));
    if (!isNaN(edad)) {
      sumaEdades += edad;
      contadorEdades++;
    }
  });
  const edadPromedio =
    contadorEdades > 0 ? (sumaEdades / contadorEdades).toFixed(1) : 0;
  $("#edadPromedio").text(edadPromedio);
}

// ==================== EQUIPOS ====================

// Variables globales para equipos
let xmlDocEquipos = null;
let xslDocEquipos = null;
let temporadaActualEquipos = null;

// Cargar las temporadas disponibles para equipos
function cargarTemporadasEquipos() {
  const xmlUrl = "xml/data/general.xml";
  const xslUrl = "xml/XSLT/equipos.xsl";

  $.when(
    $.ajax({ url: xmlUrl, dataType: "xml" }),
    $.ajax({ url: xslUrl, dataType: "xml" }),
  )
    .done(function (xmlResp, xslResp) {
      xmlDocEquipos = xmlResp[0];
      xslDocEquipos = xslResp[0];

      // Obtener todas las temporadas del XML
      const temporadas = $(xmlDocEquipos).find("temporada");
      const $select = $("#selectorTemporadaEquipos");

      // Limpiar opciones existentes (excepto la primera)
      $select.find("option:not(:first)").remove();

      // Añadir una opción por cada temporada
      temporadas.each(function () {
        const id = $(this).attr("id");
        const textoMostrar = id.replace("_", "/");
        $select.append(
          $("<option>", {
            value: id,
            text: "Temporada " + textoMostrar,
          }),
        );
      });

      // Evento cuando cambia la selección de temporada
      $select.off("change").on("change", function () {
        const temporadaSeleccionada = $(this).val();
        if (temporadaSeleccionada) {
          temporadaActualEquipos = temporadaSeleccionada;
          cargarEquiposTemporada(temporadaSeleccionada);
        } else {
          $("#gridEquipos").html(
            '<p style="text-align: center; color: #666;">Selecciona una temporada para ver los equipos</p>',
          );
        }
      });

      // Cargar automáticamente la última temporada si existe
      if (temporadas.length > 0) {
        const ultimaTemporada = temporadas.last().attr("id");
        $select.val(ultimaTemporada);
        temporadaActualEquipos = ultimaTemporada;
        cargarEquiposTemporada(ultimaTemporada);
      }
    })
    .fail(function (err) {
      console.error("Error cargando XML/XSLT:", err);
      $("#gridEquipos").html(
        '<p class="mensajeError">No se pudieron cargar los datos. Si estás abriendo el archivo directamente (file://), sirve el sitio desde un servidor local.</p>',
      );
    });
}

// Cargar los equipos de una temporada específica
function cargarEquiposTemporada(temporadaId) {
  const $contenedor = $("#gridEquipos");
  if (!$contenedor.length || !xmlDocEquipos || !xslDocEquipos) return;

  try {
    const processor = new XSLTProcessor();
    processor.importStylesheet(xslDocEquipos);
    processor.setParameter(null, "temporadaId", temporadaId);
    const fragment = processor.transformToFragment(xmlDocEquipos, document);
    $contenedor.empty().append(fragment);

    // Configurar eventos de botones "Ver Plantilla"
    configurarBotonesVerPlantilla();
  } catch (e) {
    console.error("Error transformando XSLT:", e);
    $contenedor.html(
      '<p class="mensajeError">No se pudo renderizar los equipos.</p>',
    );
  }
}

// Configurar eventos de los botones "Ver Plantilla" y "Ver Partidos"
function configurarBotonesVerPlantilla() {
  // Botón Ver Plantilla
  $(".btnVerPlantilla")
    .off("click")
    .on("click", function () {
      const equipoNombre = $(this).data("equipo");
      const temporada = temporadaActualEquipos;

      // Guardar en sessionStorage para usarlo en la página de jugadores
      sessionStorage.setItem("filtroEquipoDesdeEquipos", equipoNombre);
      sessionStorage.setItem("temporadaDesdeEquipos", temporada);

      // Navegar a la página de jugadores
      $(".btnMenu").removeClass("active");
      $(".btnMenu[data-archivo='pages/jugadores.html']").addClass("active");

      $("#contenedorPrincipal").load("pages/jugadores.html", function () {
        cargarTemporadasJugadoresConFiltro(temporada, equipoNombre);
      });
    });

  // Botón Ver Partidos
  $(".btnVerPartidos")
    .off("click")
    .on("click", function () {
      const equipoNombre = $(this).data("equipo");
      const temporada = temporadaActualEquipos;

      // Guardar en sessionStorage para usarlo en la página de calendario
      sessionStorage.setItem("filtroEquipoDesdeEquipos", equipoNombre);
      sessionStorage.setItem("temporadaDesdeEquipos", temporada);

      // Navegar a la página de calendario
      $(".btnMenu").removeClass("active");
      $(".btnMenu[data-archivo='pages/calendario.html']").addClass("active");

      $("#contenedorPrincipal").load("pages/calendario.html", function () {
        cargarTemporadasCalendarioConFiltro(temporada, equipoNombre);
      });
    });
}

// Cargar jugadores con filtro preseleccionado (desde equipos)
function cargarTemporadasJugadoresConFiltro(temporadaId, equipoNombre) {
  const xmlUrl = "xml/data/general.xml";
  const xslUrl = "xml/XSLT/jugadores.xsl";

  $.when(
    $.ajax({ url: xmlUrl, dataType: "xml" }),
    $.ajax({ url: xslUrl, dataType: "xml" }),
  )
    .done(function (xmlResp, xslResp) {
      xmlDocJugadores = xmlResp[0];
      xslDocJugadores = xslResp[0];

      // Obtener todas las temporadas del XML
      const temporadas = $(xmlDocJugadores).find("temporada");
      const $select = $("#selectorTemporadaJugadores");

      // Limpiar opciones existentes (excepto la primera)
      $select.find("option:not(:first)").remove();

      // Añadir una opción por cada temporada
      temporadas.each(function () {
        const id = $(this).attr("id");
        const textoMostrar = id.replace("_", "/");
        $select.append(
          $("<option>", {
            value: id,
            text: "Temporada " + textoMostrar,
          }),
        );
      });

      // Evento cuando cambia la selección de temporada
      $select.off("change").on("change", function () {
        const temporadaSeleccionada = $(this).val();
        if (temporadaSeleccionada) {
          temporadaActualJugadores = temporadaSeleccionada;
          cargarJugadoresTemporada(temporadaSeleccionada);
          cargarFiltrosJugadores(temporadaSeleccionada);
        } else {
          $("#gridJugadores").html(
            '<p style="text-align: center; color: #666;">Selecciona una temporada para ver los jugadores</p>',
          );
        }
      });

      // Configurar eventos de filtros
      configurarFiltrosJugadores();

      // Ocultar mensaje de carga
      $("#mensajeCarga").hide();

      // Cargar la temporada especificada
      $select.val(temporadaId);
      temporadaActualJugadores = temporadaId;
      cargarJugadoresTemporada(temporadaId);
      cargarFiltrosJugadores(temporadaId);

      // Aplicar el filtro de equipo después de un pequeño delay
      setTimeout(function () {
        $("#filtroEquipo").val(equipoNombre);
        aplicarFiltrosJugadores();

        // Limpiar sessionStorage
        sessionStorage.removeItem("filtroEquipoDesdeEquipos");
        sessionStorage.removeItem("temporadaDesdeEquipos");
      }, 100);
    })
    .fail(function (err) {
      console.error("Error cargando XML/XSLT:", err);
      $("#mensajeCarga").html(
        '<p class="mensajeError">No se pudieron cargar los datos.</p>',
      );
    });
}

// ==================== CALENDARIO ====================

// Variables globales para calendario
let xmlDocCalendario = null;
let xslDocCalendario = null;
let temporadaActualCalendario = null;

// Cargar las temporadas disponibles para calendario
function cargarTemporadasCalendario() {
  const xmlUrl = "xml/data/general.xml";
  const xslUrl = "xml/XSLT/calendario.xsl";

  $.when(
    $.ajax({ url: xmlUrl, dataType: "xml" }),
    $.ajax({ url: xslUrl, dataType: "xml" }),
  )
    .done(function (xmlResp, xslResp) {
      xmlDocCalendario = xmlResp[0];
      xslDocCalendario = xslResp[0];

      // Obtener todas las temporadas del XML
      const temporadas = $(xmlDocCalendario).find("temporada");
      const $select = $("#selectorTemporadaCalendario");

      // Limpiar opciones existentes (excepto la primera)
      $select.find("option:not(:first)").remove();

      // Añadir una opción por cada temporada
      temporadas.each(function () {
        const id = $(this).attr("id");
        const textoMostrar = id.replace("_", "/");
        $select.append(
          $("<option>", {
            value: id,
            text: "Temporada " + textoMostrar,
          }),
        );
      });

      // Evento cuando cambia la selección de temporada
      $select.off("change").on("change", function () {
        const temporadaSeleccionada = $(this).val();
        if (temporadaSeleccionada) {
          temporadaActualCalendario = temporadaSeleccionada;
          cargarCalendarioTemporada(temporadaSeleccionada);
          cargarFiltrosCalendario(temporadaSeleccionada);
        } else {
          $("#calendarioContainer").html(
            '<p style="text-align: center; color: #666;">Selecciona una temporada para ver el calendario de partidos</p>',
          );
        }
      });

      // Configurar eventos de filtros
      configurarFiltrosCalendario();

      // Cargar automáticamente la última temporada si existe
      if (temporadas.length > 0) {
        const ultimaTemporada = temporadas.last().attr("id");
        $select.val(ultimaTemporada);
        temporadaActualCalendario = ultimaTemporada;
        cargarCalendarioTemporada(ultimaTemporada);
        cargarFiltrosCalendario(ultimaTemporada);
      }
    })
    .fail(function (err) {
      console.error("Error cargando XML/XSLT:", err);
      $("#calendarioContainer").html(
        '<p class="mensajeError">No se pudieron cargar los datos. Si estás abriendo el archivo directamente (file://), sirve el sitio desde un servidor local.</p>',
      );
    });
}

// Cargar el calendario de una temporada específica
function cargarCalendarioTemporada(temporadaId) {
  const $contenedor = $("#calendarioContainer");
  if (!$contenedor.length || !xmlDocCalendario || !xslDocCalendario) return;

  try {
    const processor = new XSLTProcessor();
    processor.importStylesheet(xslDocCalendario);
    processor.setParameter(null, "temporadaId", temporadaId);
    const fragment = processor.transformToFragment(xmlDocCalendario, document);
    $contenedor.empty().append(fragment);

    // Actualizar estadísticas
    actualizarEstadisticasCalendario(temporadaId);

    // Limpiar filtro de equipo
    $("#filtroEquipoCalendario").val("todos");
  } catch (e) {
    console.error("Error transformando XSLT:", e);
    $contenedor.html(
      '<p class="mensajeError">No se pudo renderizar el calendario.</p>',
    );
  }
}

// Cargar los filtros de equipos desde el XML
function cargarFiltrosCalendario(temporadaId) {
  const $filtroEquipo = $("#filtroEquipoCalendario");

  // Limpiar opciones existentes (excepto la primera)
  $filtroEquipo.find("option:not(:first)").remove();

  // Obtener equipos únicos de la temporada
  const equipos = [];
  $(xmlDocCalendario)
    .find(`temporada[id="${temporadaId}"] equipo`)
    .each(function () {
      const nombreEquipo = $(this).find("> nombre").text();
      if (nombreEquipo && equipos.indexOf(nombreEquipo) === -1) {
        equipos.push(nombreEquipo);
      }
    });

  // Ordenar equipos alfabéticamente
  equipos.sort();

  // Añadir opciones de equipos
  equipos.forEach(function (equipo) {
    $filtroEquipo.append(
      $("<option>", {
        value: equipo,
        text: equipo,
      }),
    );
  });
}

// Configurar eventos de filtros del calendario
function configurarFiltrosCalendario() {
  // Evento de filtro por equipo
  $("#filtroEquipoCalendario")
    .off("change")
    .on("change", function () {
      aplicarFiltrosCalendario();
    });

  // Evento de limpiar filtros
  $("#btnLimpiarFiltrosCalendario")
    .off("click")
    .on("click", function () {
      $("#filtroEquipoCalendario").val("todos");
      aplicarFiltrosCalendario();
    });
}

// Aplicar filtros al calendario
function aplicarFiltrosCalendario() {
  const equipoSeleccionado = $("#filtroEquipoCalendario").val();

  // Si está seleccionado "todos", mostrar todo
  if (equipoSeleccionado === "todos") {
    $(".fichaPartido").show();
    $(".jornadaBloque").show();
    actualizarEstadisticasCalendario(temporadaActualCalendario);
    return;
  }

  // Filtrar partidos por equipo
  let partidosVisibles = 0;

  $(".fichaPartido").each(function () {
    const $ficha = $(this);
    const local = $ficha.data("local") || "";
    const visitante = $ficha.data("visitante") || "";

    // Mostrar si el equipo juega como local o visitante
    if (local === equipoSeleccionado || visitante === equipoSeleccionado) {
      $ficha.show();
      partidosVisibles++;
    } else {
      $ficha.hide();
    }
  });

  // Ocultar jornadas sin partidos visibles
  $(".jornadaBloque").each(function () {
    const $jornada = $(this);
    const partidosVisiblesEnJornada = $jornada.find(
      ".fichaPartido:visible",
    ).length;
    if (partidosVisiblesEnJornada === 0) {
      $jornada.hide();
    } else {
      $jornada.show();
    }
  });

  // Actualizar estadísticas filtradas
  actualizarEstadisticasFiltradas(equipoSeleccionado);
}

// Actualizar estadísticas del calendario
function actualizarEstadisticasCalendario(temporadaId) {
  const $temporada = $(xmlDocCalendario).find(`temporada[id="${temporadaId}"]`);

  // Total de jornadas
  const totalJornadas = $temporada.find("jornada").length;
  $("#totalJornadas").text(totalJornadas);

  // Partidos jugados y pendientes
  let partidosJugados = 0;
  let partidosPendientes = 0;

  $temporada.find("partido").each(function () {
    const estado = $(this).find("estado").text();
    if (estado === "Finalizado") {
      partidosJugados++;
    } else {
      partidosPendientes++;
    }
  });

  $("#partidosJugados").text(partidosJugados);
  $("#partidosPendientes").text(partidosPendientes);
}

// Actualizar estadísticas cuando hay filtro de equipo
function actualizarEstadisticasFiltradas(equipoNombre) {
  // Contar solo los partidos visibles del equipo seleccionado
  let jornadas = 0;
  let jugados = 0;
  let pendientes = 0;

  $(".jornadaBloque:visible").each(function () {
    jornadas++;
  });

  $(".fichaPartido:visible").each(function () {
    const estado = $(this).data("estado");
    if (estado === "Finalizado") {
      jugados++;
    } else {
      pendientes++;
    }
  });

  $("#totalJornadas").text(jornadas);
  $("#partidosJugados").text(jugados);
  $("#partidosPendientes").text(pendientes);
}

// Cargar calendario con filtro preseleccionado (desde equipos)
function cargarTemporadasCalendarioConFiltro(temporadaId, equipoNombre) {
  const xmlUrl = "xml/data/general.xml";
  const xslUrl = "xml/XSLT/calendario.xsl";

  $.when(
    $.ajax({ url: xmlUrl, dataType: "xml" }),
    $.ajax({ url: xslUrl, dataType: "xml" }),
  )
    .done(function (xmlResp, xslResp) {
      xmlDocCalendario = xmlResp[0];
      xslDocCalendario = xslResp[0];

      // Obtener todas las temporadas del XML
      const temporadas = $(xmlDocCalendario).find("temporada");
      const $select = $("#selectorTemporadaCalendario");

      // Limpiar opciones existentes (excepto la primera)
      $select.find("option:not(:first)").remove();

      // Añadir una opción por cada temporada
      temporadas.each(function () {
        const id = $(this).attr("id");
        const textoMostrar = id.replace("_", "/");
        $select.append(
          $("<option>", {
            value: id,
            text: "Temporada " + textoMostrar,
          }),
        );
      });

      // Evento cuando cambia la selección de temporada
      $select.off("change").on("change", function () {
        const temporadaSeleccionada = $(this).val();
        if (temporadaSeleccionada) {
          temporadaActualCalendario = temporadaSeleccionada;
          cargarCalendarioTemporada(temporadaSeleccionada);
          cargarFiltrosCalendario(temporadaSeleccionada);
        } else {
          $("#calendarioContainer").html(
            '<p style="text-align: center; color: #666;">Selecciona una temporada para ver el calendario de partidos</p>',
          );
        }
      });

      // Configurar eventos de filtros
      configurarFiltrosCalendario();

      // Cargar la temporada especificada
      $select.val(temporadaId);
      temporadaActualCalendario = temporadaId;
      cargarCalendarioTemporada(temporadaId);
      cargarFiltrosCalendario(temporadaId);

      // Aplicar el filtro de equipo después de un pequeño delay
      setTimeout(function () {
        $("#filtroEquipoCalendario").val(equipoNombre);
        aplicarFiltrosCalendario();

        // Limpiar sessionStorage
        sessionStorage.removeItem("filtroEquipoDesdeEquipos");
        sessionStorage.removeItem("temporadaDesdeEquipos");
      }, 100);
    })
    .fail(function (err) {
      console.error("Error cargando XML/XSLT:", err);
      $("#calendarioContainer").html(
        '<p class="mensajeError">No se pudieron cargar los datos.</p>',
      );
    });
}
