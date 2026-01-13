<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:param name="temporadaId"/>
    <xsl:template match="/">
        <table class="tableTemporada">
            <thead class="" >
                <tr>
                    <th>Equipo</th>
                    <th>Victorias</th>
                    <th>Empates</th>
                    <th>Derrotas</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>Dif</th>
                    <th>Puntos</th>
                </tr>
            </thead>
            <tbody>
                <xsl:apply-templates select="federacionBalonmano/temporadas/temporada[@id=$temporadaId]/equipos/equipo">
                    <xsl:sort select="(ganados * 3) + empatados" data-type="number" order="descending"/>
                    <xsl:sort select="ganados" data-type="number" order="descending"/>
                    <xsl:sort select="perdidos" data-type="number" order="ascending"/>
                    <xsl:sort select="empatados" data-type="number" order="descending"/>
                    <xsl:sort select="golesFavor - golesContra" data-type="number" order="descending"/>
                </xsl:apply-templates>
            </tbody>
        </table>
    </xsl:template>
    <xsl:template match="equipo">
        <tr>
            <td><xsl:value-of select="nombre"/></td>
            <td><xsl:value-of select="ganados"/></td>
            <td><xsl:value-of select="empatados"/></td>
            <td><xsl:value-of select="perdidos"/></td>
            <td><xsl:value-of select="golesFavor"/></td>
            <td><xsl:value-of select="golesContra"/></td>
            <td><xsl:value-of select="golesFavor - golesContra"/></td>
            <td style="font-weight: 700;"><xsl:value-of select="(ganados * 3) + empatados"/></td>
        </tr>
    </xsl:template>
</xsl:stylesheet>