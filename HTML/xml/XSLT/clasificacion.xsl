<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/ligaBalonmano">
        <table>
            <thead>
                <tr>
                    <th>Posicion</th>
                    <th>Equipo</th>
                    <th>Partidos Jugados</th>
                    <th>Victorias</th>
                    <th>Empates</th>
                    <th>Derrotas</th>
                    <th>Goles a Favor</th>
                    <th>Goles en Contra</th>
                    <th>Puntos</th>
                </tr>
            </thead>
            <tbody>
                <xsl:for-each select="equipos/equipo">
                    <xsl:variable name="idEquipo" select="idEquipo"/>
                    <xsl:variable name="partidos" select="/ligaBalonmano/partidos/partido[(idEquipoLocal=$idEquipo or idEquipoVisitante=$idEquipo)]"/>
                    <xsl:variable name="PJ" select="count($partidos)"/>
                    <xsl:variable name="PG" select="count($partidos[(idEquipoLocal=$idEquipo and golesLocal &gt; golesVisitante) or (idEquipoVisitante=$idEquipo and golesVisitante &gt; golesLocal)])"/>
                    <xsl:variable name="PE" select="count($partidos[golesLocal = golesVisitante])"/>
                    <xsl:variable name="PP" select="$PJ - $PG - $PE"/>
                    <xsl:variable name="GF">
                        <xsl:call-template name="calcularGolesFavor">
                            <xsl:with-param name="idEquipo" select="$idEquipo"/>
                            <xsl:with-param name="partidos" select="$partidos"/>
                        </xsl:call-template>
                    </xsl:variable>
                    <xsl:variable name="GC">
                        <xsl:call-template name="calcularGolesContra">
                            <xsl:with-param name="idEquipo" select="$idEquipo"/>
                            <xsl:with-param name="partidos" select="$partidos"/>
                        </xsl:call-template>
                    </xsl:variable>
                    <xsl:variable name="DIF" select="$GF - $GC"/>
                    <xsl:variable name="PTS" select="($PG * 3) + $PE"/>

                    <tr>
                        <td><xsl:value-of select="position()"/></td>
                        <td><xsl:value-of select="nombreEquipo"/></td>
                        <td><xsl:value-of select="$PJ"/></td>
                        <td><xsl:value-of select="$PG"/></td>
                        <td><xsl:value-of select="$PE"/></td>
                        <td><xsl:value-of select="$PP"/></td>
                        <td><xsl:value-of select="$GF"/></td>
                        <td><xsl:value-of aselect="$GC"/></td>
                        <td>
                            <xsl:choose>
                                <xsl:when test="$DIF %gt; 0">+<xsl:value-of select="$DIF"/></xsl:when>
                                <xsl:otherwise/><xsl:value-of select="$DIF"/><xsl:otherwise />
                            </xsl:choose>
                        </td>
                        <td><xsl:value-of select="$PTS"/></td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>

    <!-- Template para calcular goles a favor -->
     <xsl:template name="calcularGolesFavor">
        <xsl:param name="idEquipo"/>
        <xsl:param name="partidos"/>
        
        <xsl:variable name="golesLocal" select="sum($partidos[idEquipoLocal=$idEquipo]/golesLocal)"/>
        <xsl:variable name="golesVisitante" select="sum($partidos[idEquipoVisitante=$idEquipo]/golesVisitante)"/>

        <xsl:value-of select="$golesLocal + $golesVisitante"/>
     </xsl:template>

    <!-- Template para calcular goles a favor -->
     <xsl:template name="calcularGolesContra">
        <xsl:param name="idEquipo"/>
        <xsl:param name="partidos"/>

        <xsl:variable name="golesContraLocal" select="sum($partidos[idEquipoLocal=$idEquipo]/golesVisitante)"/>
        <xsl:variable name="golesContraVisitante" select="sum($partidos[idEquipoVisitante=$idEquipo]/golesLocal)"/>

        <xsl:value-of select="$golesContraLocal + $golesContraVisitante"/>
     </xsl:template>
</xsl:stylesheet>