<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <h2>Hola</h2>
        <xsl:apply-templates select="jornada/partido"/>
    </xsl:template>
    <xsl:template match="partido">
        <section>
            <figure>
                <img src="imagenes/imagenes_Logos/{logoLocal}" alt=""/>
            </figure>
            <figcaption></figcaption>
        </section>
    </xsl:template>
</xsl:stylesheet>