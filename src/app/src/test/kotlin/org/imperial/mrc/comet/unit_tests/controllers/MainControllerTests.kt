package org.imperial.mrc.comet.unit_tests.controllers

import org.assertj.core.api.Assertions.assertThat
import org.imperial.mrc.comet.clients.APIClient
import org.imperial.mrc.comet.controllers.MainController
import org.junit.jupiter.api.Test
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.slf4j.Logger
import org.springframework.http.ResponseEntity

class MainControllerTests {

    private val mockResponseEntity = mock<ResponseEntity<String>>()

    /*@Test
    fun `gets api info`() {
        val mockClient = mock<APIClient> {
            on { info() } doReturn mockResponseEntity
        }
        val mockLogger = mock<Logger>()

        val sut = MainController(mockClient, mockLogger)
        val result = sut.apiInfo()

        assertThat(result).isSameAs(mockResponseEntity)
        verify(mockLogger).info("api-info")
    }*/
}
