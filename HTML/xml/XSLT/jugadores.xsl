<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:key name="nombre" match="jugador" use="nombre" />
    <xsl:template match="/">
        <xsl:apply-templates select="federacionBalonmano/temporadas/temporada/equipos/equipo/jugadores/jugador[generate-id() = generate-id(key('nombre', nombre)[1])]" />
    </xsl:template>
    
    <xsl:template match="jugador">
        <div class="cardJugador">
            <h3><xsl:value-of select="nombre"/></h3>
            <img src="" alt=""/>
            <p><strong>Equipo: </strong> <xsl:value-of select="ancestor::equipo/nombre"/></p>
            <p><strong>Nacionalidad: </strong> <xsl:value-of select="nacionalidad"/></p>
            <p><strong>Edad: </strong> <xsl:value-of select="edad"/> años</p>
            <p><strong>Altura: </strong> <xsl:value-of select="altura"/></p>
            <p><strong>Peso: </strong> <xsl:value-of select="peso"/></p>
            <p><strong>Dorsal: </strong> <xsl:value-of select="dorsal"/></p>
            <p><strong>Posición: </strong> <xsl:value-of select="posicion"/></p>
            <div class="fotoJugador">
                <xsl:if test="foto/@url != ''">
                    <img>
                        <xsl:attribute name="src">
                            <xsl:value-of select="foto/@url"/>
                        </xsl:attribute>
                        <xsl:attribute name="alt">
                            <xsl:value-of select="nombre"/>
                        </xsl:attribute>
                    </img>
                </xsl:if>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>