<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>Tarifas</title>
            </head>
            <body>
                <h1>Tarifas</h1>
                <table border="1">
                    <tr>
                        <th>id</th>
                        <th>tipo</th>
                        <th>descripcion</th>
                        <th>precio_hora</th>
                        <th>max_diario</th>
                        <th>precio_mensual</th>
                        <th>acceso_24h</th>
                    </tr>
                    <xsl:for-each select="/tarifas/tarifa">
                        <tr>
                            <td>
                                <xsl:value-of select="@id" />
                            </td>
                            <td>
                                <xsl:value-of select="@tipo" />
                            </td>
                            <td>
                                <xsl:value-of select="descripcion" />
                            </td>
                            <td>
                                <xsl:value-of select="precio_hora" />
                            </td>
                            <td>
                                <xsl:value-of select="max_diario" />
                            </td>
                            <td>
                                <xsl:value-of select="precio_mensual" />
                            </td>
                            <td>
                                <xsl:value-of select="acceso_24h" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>