<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">
    <table>
      <thead>
        <tr>
          <th colspan="6" class="tableTemporada">
            Temporada: <xsl:value-of select="clasificacion/temporada"/> 
          </th>
        </tr>
        <tr class="tableTh">
          <th>Pos</th>
          <th>Equipo</th>
          <th>PJ</th>
          <th>PG</th>
          <th>PE</th>
          <th>PP</th>
          <th>GF</th>
          <th>GC</th>
          <th>Dif</th>
          <th>Pts</th>
        </tr>
      </thead>
      
      <tbody>
        <xsl:apply-templates select="clasificacion/equipo"/>
      </tbody>
    </table>
  </xsl:template>

  <xsl:template match="equipo">
    <tr>
      <td><xsl:value-of select="posicion"/></td>
      <td><xsl:value-of select="nombre"/></td>
      <td><xsl:value-of select="pj"/></td>
      <td><xsl:value-of select="pg"/></td>
      <td><xsl:value-of select="pe"/></td>
      <td><xsl:value-of select="pp"/></td>
      <td><xsl:value-of select="gf"/></td>
      <td><xsl:value-of select="gc"/></td>
      <td><xsl:value-of select="dif"/></td>
      <td><strong><xsl:value-of select="pts"/></strong></td>
    </tr>
  </xsl:template>

</xsl:stylesheet>