package org.imperial.mrc.comet.unit_tests.controllers

import com.fasterxml.jackson.databind.node.ObjectNode
import org.assertj.core.api.Assertions.assertThat
import org.imperial.mrc.comet.controllers.DataController
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.slf4j.Logger
import java.io.File
import java.net.URL

class DataControllerTests {
    private val TMP_DIR = "tmp"

    @BeforeEach
    fun makeTmpDir() {
        File(TMP_DIR).mkdir()
    }

    @AfterEach
    fun cleanup() {
        File(TMP_DIR).deleteRecursively()
    }

    private fun createTestResource(fileName: String, contents: String): URL {
        val fullPath = "$TMP_DIR/fileName"

        val file = File(fullPath)
        file.createNewFile()
        file.writeText(contents)
        return file.toURI().toURL()
    }

    @Test
    fun `gets fixed results`() {
        val mockLogger = mock<Logger>()
        val mockClassLoader = mock<ClassLoader> {
            on { getResource("data.json") } doReturn createTestResource(
                    "data.json", """{"testContent": "testData"}"""
            )
        }

        val sut = DataController(mockLogger, mockClassLoader)
        val response = sut.results()

        assertThat(response.status).isEqualTo("success")
        assertThat(response.errors).isEmpty()
        val results = response.data as ObjectNode
        assertThat(results.toString()).isEqualTo("""{"testContent":"testData"}""")

        verify(mockLogger).info("results")
    }
}
