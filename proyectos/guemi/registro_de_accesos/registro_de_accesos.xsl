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
                        <th>evento</th>
                        <th>fecha_hora</th>
                        <th>matricula</th>
                        <th>plaza_ref</th>
                    </tr>
                    <xsl:for-each select="/accesos/registro">
                        <tr>
                            <td>
                                <xsl:value-of select="@id" />
                            </td>
                            <td>
                                <xsl:value-of select="@evento" />
                            </td>
                            <td>
                                <xsl:value-of select="fecha_hora" />
                            </td>
                            <td>
                                <xsl:value-of select="matricula" />
                            </td>
                            <td>
                                <xsl:value-of select="plaza_ref" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>