<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/ligaBalonmano">
        <table>
            <thead>
                <tr style="background-color: black;">
                    <th>Posicion</th>
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
                <xsl:for-each select="equipos/equipo">
                    <xsl:sort select="(count(/ligaBalonmano/partidos/partido[(idEquipoLocal=current()/ID or idEquipoVisitante=current()/ID)][(idEquipoLocal=current()/ID and golesLocal > golesVisitante) or (idEquipoVisitante=current()/ID and golesVisitante > golesLocal)]) * 3) + count(/ligaBalonmano/partidos/partido[(idEquipoLocal=current()/ID or idEquipoVisitante=current()/ID) and golesLocal = golesVisitante])" data-type="number" order="descending"/>
                    <xsl:variable name="idEquipo" select="idEquipo"/>
                    <xsl:variable name="partidos" select="/ligaBalonmano/partidos/partido[($idEquipo = idEquipoLocal or $idEquipo = idEquipoVisitante)]"/>
                    <xsl:variable name="PG" select="count($partidos[($idEquipo = idEquipoLocal and golesLocal > golesVisitante) or ($idEquipo = idEquipoVisitante and golesVisitante > golesLocal)])"/>
                    <xsl:variable name="PE" select="count($partidos[golesLocal = golesVisitante])"/>
                    <xsl:variable name="PJ" select="count($partidos)"/>
                    <xsl:variable name="GF" select="sum($partidos[($idEquipo = idEquipoLocal)]/golesLocal) + sum($partidos[($idEquipo = idEquipoVisitante)]/golesVisitante)"/>
                    <xsl:variable name="GC" select="sum($partidos[($idEquipo = idEquipoLocal)]/golesVisitante) + sum($partidos[($idEquipo = idEquipoVisitante)]/golesLocal)"/>
                    <xsl:variable name="PTS" select="($PG * 3) + $PE"/>
                    
                    <tr>
                        <td><xsl:value-of select="position()"/></td>
                        <td><xsl:value-of select="nombreEquipo"/></td>
                        <td><xsl:value-of select="$PJ"/></td>
                        <td><xsl:value-of select="$PG"/></td>
                        <td><xsl:value-of select="$PE"/></td>
                        <td><xsl:value-of select="$PJ - $PG - $PE"/></td>
                        <td><xsl:value-of select="$GF"/></td>
                        <td><xsl:value-of select="$GC"/></td>
                        <td>
                            <xsl:choose>
                                <xsl:when test="$GF - $GC &gt; 0">+<xsl:value-of select="$GF - $GC"/></xsl:when>
                                <xsl:otherwise><xsl:value-of select="$GF - $GC"/></xsl:otherwise>
                            </xsl:choose>
                        </td>
                        <td><xsl:value-of select="$PTS"/></td>
                    </tr>
                </xsl:for-each>
            </tbody> 
        </table>
    </xsl:template>
</xsl:stylesheet>