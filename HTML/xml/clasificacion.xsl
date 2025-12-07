<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">
    <table>
      
      <thead>
        <tr class="tableTh">
          <th>Pos</th>
          <th>Equipo</th>
          <th class="right-align">PJ</th>
          <th class="right-align">PG</th>
          <th class="right-align">PE</th>
          <th class="right-align">PP</th>
          <th class="right-align">GF</th>
          <th class="right-align">GC</th>
          <th class="right-align">Dif.</th>
          <th class="right-align">Pts.</th>
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
      <td class="right-align"><xsl:value-of select="pj"/></td>
      <td class="right-align"><xsl:value-of select="pg"/></td>
      <td class="right-align"><xsl:value-of select="pe"/></td>
      <td class="right-align"><xsl:value-of select="pp"/></td>
      <td class="right-align"><xsl:value-of select="gf"/></td>
      <td class="right-align"><xsl:value-of select="gc"/></td>
      <td class="right-align"><xsl:value-of select="dif"/></td>
      <td class="right-align"><strong><xsl:value-of select="pts"/></strong></td>
    </tr>
  </xsl:template>

</xsl:stylesheet>