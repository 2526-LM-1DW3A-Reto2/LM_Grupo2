<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <xsl:apply-templates select="jornada/partido"/>
    </xsl:template>
    <xsl:template>
        <article>
            <section>
                <figure>
                    <img src="../../imagenes/imagenes_Logos/{.}" alt=""/>
                </figure>
                <figcaption></figcaption>
            </section>
        </article>
    </xsl:template>
</xsl:stylesheet>