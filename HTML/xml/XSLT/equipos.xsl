<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- Parámetro para seleccionar la temporada -->
    <xsl:param name="temporadaId" select="''"/>
    
    <xsl:template match="/federacionBalonmano">
        <div class="gridEquipos">
            <xsl:for-each select="temporadas/temporada[@id=$temporadaId]/equipos/equipo">
                <xsl:sort select="(ganados * 3) + empatados" data-type="number" order="descending"/>
                <div class="fichaEquipo" data-equipo-id="{@id}" data-equipo-nombre="{nombre}">
                    <div class="fichaEscudo">
                        <xsl:choose>
                            <xsl:when test="escudo/@url != ''">
                                <img>
                                    <xsl:attribute name="src"><xsl:value-of select="escudo/@url"/></xsl:attribute>
                                    <xsl:attribute name="alt">Escudo de <xsl:value-of select="nombre"/></xsl:attribute>
                                    <xsl:attribute name="onerror">this.src='imagenes/escudo-default.png'</xsl:attribute>
                                </img>
                            </xsl:when>
                            <xsl:otherwise>
                                <img src="imagenes/escudo-default.png" alt="Sin escudo"/>
                            </xsl:otherwise>
                        </xsl:choose>
                    </div>
                    <div class="fichaEquipoInfo">
                        <h3 class="fichaEquipoNombre"><xsl:value-of select="nombre"/></h3>
                        
                        <div class="fichaEquipoStats">
                            <div class="statItem">
                                <span class="statLabel">🏆 Victorias</span>
                                <span class="statValor"><xsl:value-of select="ganados"/></span>
                            </div>
                            <div class="statItem">
                                <span class="statLabel">🤝 Empates</span>
                                <span class="statValor"><xsl:value-of select="empatados"/></span>
                            </div>
                            <div class="statItem">
                                <span class="statLabel">❌ Derrotas</span>
                                <span class="statValor"><xsl:value-of select="perdidos"/></span>
                            </div>
                            <div class="statItem">
                                <span class="statLabel">⚽ Partidos</span>
                                <span class="statValor"><xsl:value-of select="ganados + empatados + perdidos"/></span>
                            </div>
                        </div>
                        
                        <div class="fichaEquipoGoles">
                            <p>
                                <span class="fichaLabel">⚽ Goles a Favor:</span>
                                <span class="fichaValor golesFavor"><xsl:value-of select="golesFavor"/></span>
                            </p>
                            <p>
                                <span class="fichaLabel">🥅 Goles en Contra:</span>
                                <span class="fichaValor golesContra"><xsl:value-of select="golesContra"/></span>
                            </p>
                            <p>
                                <span class="fichaLabel">📊 Diferencia:</span>
                                <span class="fichaValor diferencia">
                                    <xsl:choose>
                                        <xsl:when test="golesFavor - golesContra &gt; 0">+<xsl:value-of select="golesFavor - golesContra"/></xsl:when>
                                        <xsl:otherwise><xsl:value-of select="golesFavor - golesContra"/></xsl:otherwise>
                                    </xsl:choose>
                                </span>
                            </p>
                        </div>
                        
                        <div class="fichaEquipoPuntos">
                            <span class="puntosLabel">PUNTOS</span>
                            <span class="puntosValor"><xsl:value-of select="(ganados * 3) + empatados"/></span>
                        </div>
                        
                        <p class="fichaEquipoJugadores">
                            <span class="fichaLabel">👥 Jugadores en plantilla:</span>
                            <span class="fichaValor"><xsl:value-of select="count(jugadores/jugador)"/></span>
                        </p>
                        
                        <button class="btnVerPlantilla" data-equipo="{nombre}">
                            👥 Ver Plantilla
                        </button>
                    </div>
                </div>
            </xsl:for-each>
        </div>
    </xsl:template>
</xsl:stylesheet>