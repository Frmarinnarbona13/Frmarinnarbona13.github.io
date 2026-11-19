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
                        <th>planta</th>
                        <th>tipo</th>
                        <th>estado</th>
                        <th>observación</th>
                        <th>carga kw</th>
                    </tr>
                    <xsl:for-each select="/plazas/plaza">
                        <tr>
                            <td>
                                <xsl:value-of select="@id" />
                            </td>
                            <td>
                                <xsl:value-of select="@planta" />
                            </td>
                            <td>
                                <xsl:value-of select="@tipo" />
                            </td>
                            <td>
                                <xsl:value-of select="@estado" />
                            </td>
                            <td>
                                <xsl:value-of select="observacion" />
                            </td>
                            <td>
                                <xsl:value-of select="carga_kw" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>