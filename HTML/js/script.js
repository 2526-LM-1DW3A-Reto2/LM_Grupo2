$(document).ready(function() {

    // 1. Cargar por defecto inicio.html
    $('#contenedorPrincipal').load('pages/inicio.html');

    // 2. Función para el menú
    $('.btnMenu').on('click', function() {
        $('.btnMenu').removeClass('active');
        $(this).addClass('active');

        let archivo = $(this).data('archivo');

        // CARGA CON CALLBACK: 
        // El tercer parámetro es una función que se ejecuta SOLO cuando el archivo ya cargó
        $('#contenedorPrincipal').load(archivo, function() {
            
            // Si el archivo que acabamos de cargar es el de la clasificación
            if (archivo.includes('clasificacion.html')) {
                ejecutarCargaXML(); 
            }
        });
    });
});

// Mueve tu lógica del XML a una función independiente
function ejecutarCargaXML() {
    $.when(
        $.ajax({ url: "xml/data/ligaBalonmano.xml", dataType: "text" }),
        $.ajax({ url: "xml/XSLT/clasificacionCopia.xsl", dataType: "text" })
    ).done(function(xmlRes, xslRes) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlRes[0], "text/xml");
        const xsl = parser.parseFromString(xslRes[0], "text/xml");

        const processor = new XSLTProcessor();
        processor.importStylesheet(xsl);
        const result = processor.transformToFragment(xml, document);

        // Ahora sí lo encontrará, porque el .load() ya terminó
        $("#tablaClasificacion").empty().append(result);
        console.log("XML inyectado con éxito tras el .load()");
    });
}