<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- Parámetro para seleccionar la temporada -->
    <xsl:param name="temporadaId" select="''"/>
    
    <xsl:template match="/federacionBalonmano">
        <div class="gridJugadores">
            <xsl:for-each select="temporadas/temporada[@id=$temporadaId]/equipos/equipo/jugadores/jugador">
                <xsl:sort select="nombre" order="ascending"/>
                <div class="fichaJugador" 
                     data-nombre="{translate(nombre, 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ', 'abcdefghijklmnopqrstuvwxyzáéíóúñ')}" 
                     data-equipo="{ancestor::equipo/nombre}" 
                     data-posicion="{posicion}"
                     data-edad="{edad}"
                     data-nacionalidad="{translate(nacionalidad, 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ', 'abcdefghijklmnopqrstuvwxyzáéíóúñ')}">
                    <div class="fichaFoto">
                        <xsl:choose>
                            <xsl:when test="foto/@url != ''">
                                <img>
                                    <xsl:attribute name="src"><xsl:value-of select="foto/@url"/></xsl:attribute>
                                    <xsl:attribute name="alt"><xsl:value-of select="nombre"/></xsl:attribute>
                                    <xsl:attribute name="onerror">this.src='imagenes/jugador-default.png'</xsl:attribute>
                                </img>
                            </xsl:when>
                            <xsl:otherwise>
                                <img src="imagenes/jugador-default.png" alt="Sin foto"/>
                            </xsl:otherwise>
                        </xsl:choose>
                    </div>
                    <div class="fichaInfo">
                        <h3 class="fichaNombre"><xsl:value-of select="nombre"/></h3>
                        <p class="fichaEquipo">
                            <span class="fichaLabel">🏆 Equipo:</span>
                            <span class="fichaValor"><xsl:value-of select="ancestor::equipo/nombre"/></span>
                        </p>
                        <p class="fichaPosicion">
                            <span class="fichaLabel">⚽ Posición:</span>
                            <span class="fichaValor"><xsl:value-of select="posicion"/></span>
                        </p>
                        <p class="fichaEdad">
                            <span class="fichaLabel">📅 Edad:</span>
                            <span class="fichaValor"><xsl:value-of select="edad"/> años</span>
                        </p>
                        <p class="fichaAltura">
                            <span class="fichaLabel">📏 Altura:</span>
                            <span class="fichaValor"><xsl:value-of select="altura"/></span>
                        </p>
                        <p class="fichaPeso">
                            <span class="fichaLabel">⚖️ Peso:</span>
                            <span class="fichaValor"><xsl:value-of select="peso"/></span>
                        </p>
                        <p class="fichaNacionalidad">
                            <span class="fichaLabel">🌍 Nacionalidad:</span>
                            <span class="fichaValor"><xsl:value-of select="nacionalidad"/></span>
                        </p>
                        <p class="fichaDorsal">
                            <span class="fichaLabel">🔢 Dorsal:</span>
                            <span class="fichaValor">#<xsl:value-of select="dorsal"/></span>
                        </p>
                    </div>
                </div>
            </xsl:for-each>
        </div>
    </xsl:template>
</xsl:stylesheet>