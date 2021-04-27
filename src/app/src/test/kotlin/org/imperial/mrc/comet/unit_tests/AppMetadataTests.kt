package org.imperial.mrc.comet.unit_tests

import com.fasterxml.jackson.databind.node.ObjectNode
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.imperial.mrc.comet.AppMetadata
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.slf4j.Logger
import java.io.File
import java.io.FileNotFoundException
import java.net.URL

class AppMetadataTests {
    private val TMP_DIR = "tmp"

    @BeforeEach
    fun makeTmpDir() {
        File(TMP_DIR).mkdir()
    }

    @AfterEach
    fun cleanup() {
        File(TMP_DIR).deleteRecursively()
    }

    private fun createTestResource(path: String, contents: String): URL {
        val fullPath = "$TMP_DIR/$path"

        val dir = File(fullPath.replaceAfterLast("/", ""))
        dir.mkdirs()

        val file = File(fullPath)
        file.createNewFile()
        file.writeText(contents)
        return file.toURI().toURL()
    }

    @Test
    fun `builds chart metadata`() {
        val mockLogger = mock<Logger>()

        val mockClassLoader = mock<ClassLoader>() {
            on { getResource("metadata/charts/charts.json") } doReturn createTestResource(
                    "metadata/charts/charts.json",
                    """[
                            {"id": "chart1", "collapsed": true},
                            {"id": "chart2", "collapsed": false}
                        ]"""
            )

            on { getResource("metadata/charts/chart1/config.jsonata") } doReturn createTestResource(
                    "metadata/charts/chart1/config.jsonata", """{"testContent": "chart1_config"}"""
            )
            on { getResource("metadata/charts/chart2/config.jsonata") } doReturn createTestResource(
                    "metadata/charts/chart2/config.jsonata", """{"testContent": "chart2_config"}"""
            )

            on { getResource("metadata/charts/chart1/data.jsonata") } doReturn createTestResource(
                    "metadata/charts/chart1/data.jsonata", "chart1_data"
            )
            on { getResource("metadata/charts/chart2/data.jsonata") } doReturn createTestResource(
                    "metadata/charts/chart2/data.jsonata", "chart2_data"
            )

            on { getResource("metadata/charts/chart1/layout.jsonata") } doReturn createTestResource(
                    "metadata/charts/chart1/layout.jsonata", "chart1_layout"
            )
            on { getResource("metadata/charts/chart2/layout.jsonata") } doReturn createTestResource(
                    "metadata/charts/chart2/layout.jsonata", "chart2_layout"
            )

            on { getResource("metadata/charts/chart1/input.schema.json") } doReturn createTestResource(
                    "metadata/charts/chart1/input.schema.json", """{"testContent": "chart1_schema"}"""
            )
            on { getResource("metadata/charts/chart2/input.schema.json") } doReturn createTestResource(
                    "metadata/charts/chart2/input.schema.json", """{"testContent": "chart2_schema"}"""
            )
        }

        val sut = AppMetadata(mockLogger, mockClassLoader)
        val metadataResponse = sut.metadata

        assertThat(metadataResponse.errors.isEmpty())
        assertThat(metadataResponse.status).isEqualTo("success")

        val metadata = metadataResponse.data as ObjectNode
        val charts = metadata["charts"]
        assertThat(charts.count()).isEqualTo(2)

        val chart1 = charts[0]
        assertThat(chart1["id"].asText()).isEqualTo("chart1")
        assertThat(chart1["collapsed"].asBoolean()).isEqualTo(true)
        assertThat(chart1["config"].asText()).isEqualTo("""{"testContent": "chart1_config"}""")
        assertThat(chart1["data"].asText()).isEqualTo("chart1_data")
        assertThat(chart1["layout"].asText()).isEqualTo("chart1_layout")
        assertThat(chart1["inputSchema"].toString()).isEqualTo("""{"testContent":"chart1_schema"}""")

        val chart2 = charts[1]
        assertThat(chart2["id"].asText()).isEqualTo("chart2")
        assertThat(chart2["collapsed"].asBoolean()).isEqualTo(false)
        assertThat(chart2["config"].asText()).isEqualTo("""{"testContent": "chart2_config"}""")
        assertThat(chart2["data"].asText()).isEqualTo("chart2_data")
        assertThat(chart2["layout"].asText()).isEqualTo("chart2_layout")
        assertThat(chart2["inputSchema"].toString()).isEqualTo("""{"testContent":"chart2_schema"}""")

        verify(mockLogger).info("AppMetadata constructed")
    }

    @Test
    fun `throws FileNotFoundException when expected resource file is missing`() {
        val mockClassLoader = mock<ClassLoader>() {
            on { getResource("metadata/charts/charts.json") } doReturn createTestResource(
                    "metadata/charts/charts.json",
                    """[
                            {"id": "chart1", "collapsed": true}
                        ]"""
            )
        }

        assertThatThrownBy{ AppMetadata(mock(), mockClassLoader) }
                .isInstanceOf(FileNotFoundException::class.java)
                .hasMessage("Resource file 'metadata/charts/chart1/config.json' not found")
    }
}
