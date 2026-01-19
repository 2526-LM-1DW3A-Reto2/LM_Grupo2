<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <!-- Parámetro para seleccionar la temporada -->
    <xsl:param name="temporadaId" select="''"/>
    
    <xsl:template match="/federacionBalonmano">
        <xsl:variable name="temporada" select="temporadas/temporada[@id=$temporadaId]"/>
        <xsl:variable name="equipos" select="$temporada/equipos/equipo"/>
        <xsl:variable name="jornadas" select="$temporada/jornadas/jornada"/>
        <xsl:variable name="ultimaJornada" select="$jornadas[last()]"/>
        
        <!-- Sección Hero con estadísticas dinámicas -->
        <section class="hero" id="inicio">
            <div class="heroContenido">
                <h2>La Casa del Balonmano Español</h2>
                <p>Promoviendo la excelencia deportiva con innovación, sostenibilidad y pasión por el balonmano desde 1942</p>
                
                <!-- Estadísticas dinámicas -->
                <div class="heroEstadisticas">
                    <div class="estadistica">
                        <span class="estadisticaNumero"><xsl:value-of select="count($equipos)"/></span>
                        <span class="estadisticaLabel">Equipos</span>
                    </div>
                    <div class="estadistica">
                        <span class="estadisticaNumero"><xsl:value-of select="count($jornadas)"/></span>
                        <span class="estadisticaLabel">Jornadas</span>
                    </div>
                    <div class="estadistica">
                        <span class="estadisticaNumero"><xsl:value-of select="count($equipos/jugadores/jugador)"/></span>
                        <span class="estadisticaLabel">Jugadores</span>
                    </div>
                    <div class="estadistica">
                        <span class="estadisticaNumero"><xsl:value-of select="count(temporadas/temporada)"/></span>
                        <span class="estadisticaLabel">Temporadas</span>
                    </div>
                </div>
                
                <p class="btnInternoConMargen">
                    <a href="#clasificacion-inicio" class="btnInterno" title="Ver clasificación">Ver Clasificación ⬇</a>
                </p>
            </div>
        </section>
        
        <!-- Clasificación -->
        <section class="seccion seccionInicio" id="clasificacion-inicio">
            <div class="seccionHeaderInicio">
                <h2>🏆 Clasificación Actual</h2>
                <span class="temporadaLabel">Temporada <xsl:value-of select="translate($temporadaId, '_', '/')"/></span>
            </div>
            <section class="contenedorTablaInicio">
                <table class="tablaClasificacionInicio">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Equipo</th>
                            <th>PJ</th>
                            <th>G</th>
                            <th>E</th>
                            <th>P</th>
                            <th>GF</th>
                            <th>GC</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="$equipos">
                            <xsl:sort select="(ganados * 2) + empatados" data-type="number" order="descending"/>
                            <xsl:sort select="golesFavor - golesContra" data-type="number" order="descending"/>
                            <tr>
                                <xsl:if test="position() = 1">
                                    <xsl:attribute name="class">lider</xsl:attribute>
                                </xsl:if>
                                <td><xsl:value-of select="position()"/></td>
                                <td class="equipoCell">
                                    <img src="{escudo/@url}" alt="{nombre}" class="escudoMini"/>
                                    <xsl:value-of select="nombre"/>
                                </td>
                                <td><xsl:value-of select="ganados + empatados + perdidos"/></td>
                                <td><xsl:value-of select="ganados"/></td>
                                <td><xsl:value-of select="empatados"/></td>
                                <td><xsl:value-of select="perdidos"/></td>
                                <td><xsl:value-of select="golesFavor"/></td>
                                <td><xsl:value-of select="golesContra"/></td>
                                <td class="puntos"><xsl:value-of select="(ganados * 3) + empatados"/></td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
            </section>
            <div class="verMasContainer">
                <button class="btnVerMas" data-archivo="pages/clasificacion.html">Ver clasificación completa →</button>
            </div>
        </section>
        
        <!-- Últimos Partidos -->
        <section class="seccion seccionInicio" id="partidos-inicio">
            <div class="seccionHeaderInicio">
                <h2>⚽ Últimos Partidos</h2>
                <span class="temporadaLabel">Partidos Finalizados</span>
            </div>
            
            <div class="contenedorPartidosInicio">
                <!-- Obtener todos los partidos finalizados de todas las jornadas -->
                <xsl:for-each select="$jornadas/partidos/partido[estado='Finalizado']">
                    <!-- Ordenar por jornada descendente (últimas primero) -->
                    <xsl:sort select="count(ancestor::jornada/preceding-sibling::jornada)" data-type="number" order="descending"/>
                    <!-- Limitar a los últimos 3 partidos -->
                    <xsl:if test="position() &lt;= 3">
                        <xsl:variable name="localId" select="@local"/>
                        <xsl:variable name="visitanteId" select="@visitante"/>
                        <xsl:variable name="equipoLocal" select="$equipos[@id=$localId]"/>
                        <xsl:variable name="equipoVisitante" select="$equipos[@id=$visitanteId]"/>
                        <xsl:variable name="jornadaActual" select="ancestor::jornada"/>
                        
                        <div class="cardPartidoInicio">
                            <div class="partidoJornada">Jornada <xsl:value-of select="substring-after($jornadaActual/@id, 'J')"/></div>
                            <div class="partidoEquipos">
                                <div class="equipoPartido">
                                    <img src="{$equipoLocal/escudo/@url}" alt="{$equipoLocal/nombre}" class="escudoPartido"/>
                                    <span class="nombreEquipoPartido"><xsl:value-of select="$equipoLocal/nombre"/></span>
                                </div>
                                <div class="marcador">
                                    <span class="golesLocal"><xsl:value-of select="golesLocal"/></span>
                                    <span class="separador">-</span>
                                    <span class="golesVisitante"><xsl:value-of select="golesVisitante"/></span>
                                </div>
                                <div class="equipoPartido">
                                    <img src="{$equipoVisitante/escudo/@url}" alt="{$equipoVisitante/nombre}" class="escudoPartido"/>
                                    <span class="nombreEquipoPartido"><xsl:value-of select="$equipoVisitante/nombre"/></span>
                                </div>
                            </div>
                            <div class="partidoEstado"><xsl:value-of select="estado"/></div>
                        </div>
                    </xsl:if>
                </xsl:for-each>
            </div>
            
            <div class="verMasContainer">
                <button class="btnVerMas" data-archivo="pages/calendario.html">Ver todos los partidos →</button>
            </div>
        </section>
        
        <!-- Equipos -->
        <section class="seccion seccionInicio" id="equipos-inicio">
            <div class="seccionHeaderInicio">
                <h2>🏅 Equipos de la Liga</h2>
                <span class="temporadaLabel">Temporada <xsl:value-of select="translate($temporadaId, '_', '/')"/></span>
            </div>
            
            <div class="gridEquiposInicio">
                <xsl:for-each select="$equipos">
                    <div class="cardEquipoInicio">
                        <img src="{escudo/@url}" alt="{nombre}" class="escudoEquipoInicio"/>
                        <h3><xsl:value-of select="nombre"/></h3>
                        <div class="infoEquipoInicio">
                            <span>👥 <xsl:value-of select="count(jugadores/jugador)"/> jugadores</span>
                            <span>🏆 <xsl:value-of select="(ganados * 3) + empatados"/> puntos</span>
                        </div>
                    </div>
                </xsl:for-each>
            </div>
            
            <div class="verMasContainer">
                <button class="btnVerMas" data-archivo="pages/equipos.html">Ver todos los equipos →</button>
            </div>
        </section>
        
        <!-- Jugadores Destacados -->
        <section class="seccion seccionInicio" id="jugadores-inicio">
            <div class="seccionHeaderInicio">
                <h2>⭐ Mejores Valorados</h2>
                <span class="temporadaLabel">MVP de la Jornada</span>
            </div>
            
            <div class="mvpContainer">
                <!-- Simulación de los 3 jugadores mejor valorados -->
                <xsl:for-each select="$equipos[position() &lt;= 3]/jugadores/jugador[1]">
                    <xsl:variable name="equipoId" select="@equipo"/>
                    <xsl:variable name="equipoJugador" select="$equipos[@id=$equipoId]"/>
                    <xsl:variable name="valoracion">
                        <xsl:choose>
                            <xsl:when test="position() = 1">9.2</xsl:when>
                            <xsl:when test="position() = 2">8.8</xsl:when>
                            <xsl:otherwise>8.5</xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>
                    <xsl:variable name="medalla">
                        <xsl:choose>
                            <xsl:when test="position() = 1">🥇</xsl:when>
                            <xsl:when test="position() = 2">🥈</xsl:when>
                            <xsl:otherwise>🥉</xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>
                    
                    <div class="cardMvp">
                        <div class="mvpFotoContainer">
                            <xsl:choose>
                                <xsl:when test="foto/@url != ''">
                                    <img class="mvpFoto">
                                        <xsl:attribute name="src"><xsl:value-of select="foto/@url"/></xsl:attribute>
                                        <xsl:attribute name="alt"><xsl:value-of select="nombre"/></xsl:attribute>
                                        <xsl:attribute name="onerror">this.src='imagenes/jugador-default.png'</xsl:attribute>
                                    </img>
                                </xsl:when>
                                <xsl:otherwise>
                                    <img src="imagenes/jugador-default.png" alt="Sin foto" class="mvpFoto"/>
                                </xsl:otherwise>
                            </xsl:choose>
                            <span class="mvpMedalla"><xsl:value-of select="$medalla"/></span>
                            <span class="mvpValoracion"><xsl:value-of select="$valoracion"/></span>
                        </div>
                        <div class="mvpInfo">
                            <span class="mvpDorsal">#<xsl:value-of select="dorsal"/></span>
                            <h3 class="mvpNombre"><xsl:value-of select="nombre"/></h3>
                            <span class="mvpEquipo"><xsl:value-of select="$equipoJugador/nombre"/></span>
                            <span class="mvpPosicion"><xsl:value-of select="posicion"/></span>
                        </div>
                    </div>
                </xsl:for-each>
            </div>
            
            <div class="verMasContainer">
                <button class="btnVerMas" data-archivo="pages/jugadores.html">Ver todos los jugadores →</button>
            </div>
        </section>
        
        <!-- Estadísticas de la Liga -->
        <section class="seccion seccionInicio" id="estadisticas-inicio">
            <div class="seccionHeaderInicio">
                <h2>📊 Estadísticas de la Liga</h2>
            </div>
            
            <div class="statsGridInicio">
                <div class="statCardInicio">
                    <span class="statNumeroInicio"><xsl:value-of select="sum($equipos/golesFavor)"/></span>
                    <span class="statLabelInicio">Goles Totales</span>
                </div>
                <div class="statCardInicio">
                    <span class="statNumeroInicio">
                        <xsl:value-of select="format-number(sum($equipos/golesFavor) div (sum($equipos/ganados) + sum($equipos/empatados) + sum($equipos/perdidos)) * 2, '0.0')"/>
                    </span>
                    <span class="statLabelInicio">Promedio Goles/Partido</span>
                </div>
                <div class="statCardInicio">
                    <span class="statNumeroInicio">
                        <xsl:value-of select="(sum($equipos/ganados) + sum($equipos/empatados) + sum($equipos/perdidos)) div 2"/>
                    </span>
                    <span class="statLabelInicio">Partidos Jugados</span>
                </div>
                <div class="statCardInicio">
                    <xsl:for-each select="$equipos">
                        <xsl:sort select="golesFavor" data-type="number" order="descending"/>
                        <xsl:if test="position() = 1">
                            <span class="statNumeroInicio equipoGoleador"><xsl:value-of select="nombre"/></span>
                        </xsl:if>
                    </xsl:for-each>
                    <span class="statLabelInicio">Equipo Más Goleador</span>
                </div>
            </div>
        </section>
        
        <!-- Enlaces externos -->
        <section class="seccion seccionInicio" id="enlaces-inicio">
            <h2>🔗 Enlaces de Interés</h2>
            <ul class="linksExternos">
                <li>
                    <a href="https://www.ihf.info/" target="_blank" rel="noopener noreferrer" title="Federación Internacional de Balonmano">
                        🌐 Federación Internacional de Balonmano (IHF)
                    </a>
                </li>
                <li>
                    <a href="https://www.eurohandball.com/" target="_blank" rel="noopener noreferrer" title="Federación Europea de Balonmano">
                        🇪🇺 Federación Europea de Balonmano (EHF)
                    </a>
                </li>
                <li>
                    <a href="https://www.coe.es/" target="_blank" rel="noopener noreferrer" title="Comité Olímpico Español">
                        🏅 Comité Olímpico Español (COE)
                    </a>
                </li>
            </ul>
        </section>
        
        <!-- Botón volver arriba -->
        <div class="volverArribaContainerTop">
            <a href="#inicio" class="btnInterno" title="Volver al inicio de la página">⬆ Volver arriba</a>
        </div>
    </xsl:template>
</xsl:stylesheet>