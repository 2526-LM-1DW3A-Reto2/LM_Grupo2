<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- Parámetro para seleccionar la temporada -->
    <xsl:param name="temporadaId" select="''"/>
    
    <xsl:template match="/federacionBalonmano">
        <table class="tableClasificacion">
            <thead>
                <tr>
                    <th>Pos</th>
                    <th>Equipo</th>
                    <th>PJ</th>
                    <th>V</th>
                    <th>E</th>
                    <th>D</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>DIF</th>
                    <th>PTS</th>
                </tr>
            </thead>
            <tbody>
                <!-- Ordenar por: puntos (desc), victorias (desc), empates (desc), diferencia de goles (desc) -->
                <xsl:for-each select="temporadas/temporada[@id=$temporadaId]/equipos/equipo">
                    <xsl:sort select="(ganados * 3) + empatados" data-type="number" order="descending"/>
                    <xsl:sort select="ganados" data-type="number" order="descending"/>
                    <xsl:sort select="empatados" data-type="number" order="descending"/>
                    <xsl:sort select="golesFavor - golesContra" data-type="number" order="descending"/>
                    <xsl:sort select="golesFavor" data-type="number" order="descending"/>
                    <tr>
                        <td><xsl:value-of select="position()"/></td>
                        <td class="equipoCell">
                            <img class="escudoMini" src="{escudo/@url}" alt="{nombre}"/>
                            <xsl:value-of select="nombre"/>
                        </td>
                        <td><xsl:value-of select="ganados + empatados + perdidos"/></td>
                        <td><xsl:value-of select="ganados"/></td>
                        <td><xsl:value-of select="empatados"/></td>
                        <td><xsl:value-of select="perdidos"/></td>
                        <td><xsl:value-of select="golesFavor"/></td>
                        <td><xsl:value-of select="golesContra"/></td>
                        <td>
                            <xsl:choose>
                                <xsl:when test="golesFavor - golesContra &gt; 0">+<xsl:value-of select="golesFavor - golesContra"/></xsl:when>
                                <xsl:otherwise><xsl:value-of select="golesFavor - golesContra"/></xsl:otherwise>
                            </xsl:choose>
                        </td>
                        <td><xsl:value-of select="(ganados * 3) + empatados"/></td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>
</xsl:stylesheet>