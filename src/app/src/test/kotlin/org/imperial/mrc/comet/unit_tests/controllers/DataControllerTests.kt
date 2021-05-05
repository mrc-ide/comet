package org.imperial.mrc.comet.unit_tests.controllers

import org.assertj.core.api.Assertions.assertThat
import org.imperial.mrc.comet.clients.APIClient
import org.imperial.mrc.comet.controllers.DataController
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.slf4j.Logger
import org.springframework.http.ResponseEntity
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
        val fullPath = "$TMP_DIR/$fileName"

        val file = File(fullPath)
        file.createNewFile()
        file.writeText(contents)
        return file.toURI().toURL()
    }

    @Test
    fun `gets results`() {
        val mockLogger = mock<Logger>()
        val mockResponseEntity = mock<ResponseEntity<String>>()
        val mockAPIClient = mock<APIClient> {
            on { results("request") } doReturn mockResponseEntity
        }

        val sut = DataController(mockLogger, mockAPIClient)
        val response = sut.results("request")

        assertThat(response).isSameAs(mockResponseEntity)
        verify(mockLogger).info("results request")
    }
}
