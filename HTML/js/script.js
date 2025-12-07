// Asegúrate de que este nombre coincida con tu archivo XML
const xmlFile = "xml/clasificacion.xml";

// 1. Crear el objeto XMLHttpRequest para la solicitud
const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  // Verificar que la solicitud haya finalizado (readyState 4) y sea exitosa (status 200)
  if (this.readyState == 4 && this.status == 200) {
    displayClassification(this.responseXML);
  }
};

// 2. Abrir y enviar la solicitud GET
xhttp.open("GET", xmlFile, true);
xhttp.send();

function displayClassification(xmlDoc) {
  const tableContainer = document.getElementById("tabla-clasificacion");

  // Obtener todos los elementos <equipo> del XML
  const equipos = xmlDoc.getElementsByTagName("equipo");

  // Si no hay equipos, mostrar un mensaje y salir
  if (equipos.length === 0) {
    tableContainer.innerHTML =
      "<p>No se encontraron datos de equipos en el XML.</p>";
    return;
  }

  // 3. Crear la estructura de la tabla HTML
  let table = "<table>";

  // Cabecera de la tabla (usando las etiquetas abreviadas)
  table += "<thead>";
  table += "<tr class='tableTh'>";
  table += "<th>Pos.</th>";
  table += "<th>Equipo</th>";
  table += "<th class='right-align'>PJ</th>";
  table += "<th class='right-align'>PG</th>";
  table += "<th class='right-align'>PE</th>";
  table += "<th class='right-align'>PP</th>";
  table += "<th class='right-align'>GF</th>";
  table += "<th class='right-align'>GC</th>";
  table += "<th class='right-align'>DG</th>";
  table += "<th class='right-align'>Pts.</th>";
  table += "</tr>";
  table += "</thead>";

  // 4. Recorrer cada elemento <equipo> y añadir una fila
  for (let i = 0; i < equipos.length; i++) {
    const equipo = equipos[i];
    table += "<tr>";

    // Función auxiliar para obtener el valor de la etiqueta de forma segura
    const getValue = (tag) => {
      const element = equipo.getElementsByTagName(tag)[0];
      return element ? element.childNodes[0].nodeValue : "N/A";
    };

    // Añadir celdas de datos (TD)
    table += "<td>" + getValue("posicion") + "</td>";
    table += "<td>" + getValue("nombre") + "</td>";
    table += "<td class='right-align'>" + getValue("pj") + "</td>";
    table += "<td class='right-align'>" + getValue("pg") + "</td>";
    table += "<td class='right-align'>" + getValue("pe") + "</td>";
    table += "<td class='right-align'>" + getValue("pp") + "</td>";
    table += "<td class='right-align'>" + getValue("gf") + "</td>";
    table += "<td class='right-align'>" + getValue("gc") + "</td>";
    table += "<td class='right-align'>" + getValue("dif") + "</td>";
    table +=
      "<td class='right-align'><strong>" + getValue("pts") + "</strong></td>"; // Puntos en negrita

    table += "</tr>";
  }

  // Cerrar la tabla
  table += "</table>";

  // 5. Insertar la tabla generada en la sección del HTML
  tableContainer.innerHTML = table;
}
