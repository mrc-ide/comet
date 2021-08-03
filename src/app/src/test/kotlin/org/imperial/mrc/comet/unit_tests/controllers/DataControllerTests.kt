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
    private val mockResponseEntity = mock<ResponseEntity<String>>()

    @Test
    fun `gets results`() {
        val mockLogger = mock<Logger>()
        val mockAPIClient = mock<APIClient> {
            on { results("request") } doReturn mockResponseEntity
        }

        val sut = DataController(mockLogger, mockAPIClient)
        val response = sut.results("request")

        assertThat(response).isSameAs(mockResponseEntity)
        verify(mockLogger).info("results request")
    }

    @Test
    fun `gets countries`() {
        val mockLogger = mock<Logger>()
        val mockAPIClient = mock<APIClient> {
            on { countries() } doReturn mockResponseEntity
        }

        val sut = DataController(mockLogger, mockAPIClient)
        val response = sut.countries()

        assertThat(response).isSameAs(mockResponseEntity)
        verify(mockLogger).info("countries")
    }
}
