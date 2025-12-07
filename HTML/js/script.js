const xslFile = "xml/clasificacion.xsl";
// Define el archivo XML que quieres cargar por defecto: la temporada actual.
const xmlFile = "xml/clasificacion2025_2026.xml";

// Función auxiliar para cargar cualquier archivo (XML o XSL)
function cargarArchivo(filename, callback) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseXML);
    } else if (this.readyState == 4 && this.status != 200) {
      // Muestra error si el archivo no se encuentra (404) o hay otro problema
      document.getElementById("tabla-clasificacion").innerHTML =
        "<p>Error al cargar el archivo: " +
        filename +
        " (Revisa la ruta y el nombre del archivo)</p>";
    }
  };
  xhttp.open("GET", filename, true);
  xhttp.send();
}

// 1. Carga inicial del XSLT y el XML
cargarArchivo(xslFile, function (xslDoc) {
  // Si el XSLT carga correctamente, procedemos a cargar el XML
  cargarArchivo(xmlFile, function (xmlDoc) {
    if (xmlDoc) {
      // 2. Crear y aplicar el procesador XSLT
      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xslDoc);

      // 3. Transformación
      const resultDocument = xsltProcessor.transformToFragment(
        xmlDoc,
        document
      );

      // 4. Inserción en el contenedor
      const container = document.getElementById("tabla-clasificacion");
      container.innerHTML = ""; // Limpia cualquier mensaje de carga
      container.appendChild(resultDocument);
    }
  });
});
