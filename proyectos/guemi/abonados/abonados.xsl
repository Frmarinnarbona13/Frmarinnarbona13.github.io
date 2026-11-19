<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>Plazas</title>
            </head>
            <body>
                <h2>Plazas disponibles</h2>
                <table border="1">
                    <tr>
                        <th>id</th>
                        <th>tipo</th>
                        <th>nombre</th>
                        <th>matricula</th>
                        <th>vigencia_desde</th>
                        <th>vigencia_hasta</th>
                        <th>tarifa_ref</th>
                    </tr>
                    <xsl:for-each select="/abonados/abonado">
                        <tr>
                            <td>
                                <xsl:value-of select="@id" />
                            </td>
                            <td>
                                <xsl:value-of select="@tipo" />
                            </td>
                            <td>
                                <xsl:value-of select="nombre" />
                            </td>
                            <td>
                                <xsl:value-of select="matricula" />
                            </td>
                            <td>
                                <xsl:value-of select="vigencia_desde" />
                            </td>
                            <td>
                                <xsl:value-of select="vigencia_hasta" />
                            </td>
                            <td>
                                <xsl:value-of select="tarifa_ref" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
                <div>
                    <h2>Camaras</h2>
                    <table border="1">
                        <tr>
                            <th>nombre</th>
                            <th>horas_grabación</th>
                        </tr>
                        <xsl:for-each select="abonados/camaras/camara">
                            <tr>
                                <td>
                                    <xsl:value-of select="nombre" />
                                </td>
                                <td>
                                    <xsl:value-of select="horas_grabacion" />
                                </td>
                            </tr>
                        </xsl:for-each>
                    </table>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>