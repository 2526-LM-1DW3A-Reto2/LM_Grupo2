<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- Parámetro para seleccionar la temporada -->
    <xsl:param name="temporadaId" select="''"/>
    
    <!-- Variable para acceder a los equipos de la temporada -->
    <xsl:key name="equipoPorId" match="equipo" use="@id"/>
    
    <xsl:template match="/federacionBalonmano">
        <div class="calendarioContainer">
            <xsl:for-each select="temporadas/temporada[@id=$temporadaId]/jornadas/jornada">
                <div class="jornadaBloque" data-jornada="{@id}">
                    <h3 class="jornadaTitulo">
                        <span class="jornadaNumero">Jornada <xsl:value-of select="substring(@id, 2)"/></span>
                    </h3>
                    <div class="partidosGrid">
                        <xsl:for-each select="partidos/partido">
                            <xsl:variable name="localId" select="@local"/>
                            <xsl:variable name="visitanteId" select="@visitante"/>
                            <xsl:variable name="equipoLocal" select="ancestor::temporada/equipos/equipo[@id=$localId]"/>
                            <xsl:variable name="equipoVisitante" select="ancestor::temporada/equipos/equipo[@id=$visitanteId]"/>
                            
                            <div class="fichaPartido" data-local="{$equipoLocal/nombre}" data-visitante="{$equipoVisitante/nombre}" data-estado="{estado}">
                                <!-- Equipo Local -->
                                <div class="equipoPartido equipoLocal">
                                    <div class="escudoPartido">
                                        <xsl:choose>
                                            <xsl:when test="$equipoLocal/escudo/@url != ''">
                                                <img>
                                                    <xsl:attribute name="src"><xsl:value-of select="$equipoLocal/escudo/@url"/></xsl:attribute>
                                                    <xsl:attribute name="alt"><xsl:value-of select="$equipoLocal/nombre"/></xsl:attribute>
                                                    <xsl:attribute name="onerror">this.src='imagenes/escudo-default.png'</xsl:attribute>
                                                </img>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <img src="imagenes/escudo-default.png" alt="Sin escudo"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </div>
                                    <span class="nombreEquipoPartido"><xsl:value-of select="$equipoLocal/nombre"/></span>
                                    <span class="etiquetaLocal">LOCAL</span>
                                </div>
                                
                                <!-- Marcador Central -->
                                <div class="marcadorPartido">
                                    <xsl:choose>
                                        <xsl:when test="estado = 'Finalizado'">
                                            <div class="resultado">
                                                <span class="golesLocal">
                                                    <xsl:attribute name="class">
                                                        golesLocal
                                                        <xsl:if test="golesLocal > golesVisitante"> ganador</xsl:if>
                                                    </xsl:attribute>
                                                    <xsl:value-of select="golesLocal"/>
                                                </span>
                                                <span class="separadorGoles">-</span>
                                                <span class="golesVisitante">
                                                    <xsl:attribute name="class">
                                                        golesVisitante
                                                        <xsl:if test="golesVisitante > golesLocal"> ganador</xsl:if>
                                                    </xsl:attribute>
                                                    <xsl:value-of select="golesVisitante"/>
                                                </span>
                                            </div>
                                            <span class="estadoPartido finalizado">Finalizado</span>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <div class="resultado sinJugar">
                                                <span class="vsText">VS</span>
                                            </div>
                                            <span class="estadoPartido pendiente">Pendiente</span>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </div>
                                
                                <!-- Equipo Visitante -->
                                <div class="equipoPartido equipoVisitante">
                                    <div class="escudoPartido">
                                        <xsl:choose>
                                            <xsl:when test="$equipoVisitante/escudo/@url != ''">
                                                <img>
                                                    <xsl:attribute name="src"><xsl:value-of select="$equipoVisitante/escudo/@url"/></xsl:attribute>
                                                    <xsl:attribute name="alt"><xsl:value-of select="$equipoVisitante/nombre"/></xsl:attribute>
                                                    <xsl:attribute name="onerror">this.src='imagenes/escudo-default.png'</xsl:attribute>
                                                </img>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <img src="imagenes/escudo-default.png" alt="Sin escudo"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </div>
                                    <span class="nombreEquipoPartido"><xsl:value-of select="$equipoVisitante/nombre"/></span>
                                    <span class="etiquetaVisitante">VISITANTE</span>
                                </div>
                            </div>
                        </xsl:for-each>
                    </div>
                </div>
            </xsl:for-each>
        </div>
    </xsl:template>
</xsl:stylesheet>