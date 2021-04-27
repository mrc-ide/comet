package org.imperial.mrc.comet.unit_tests.controllers

import org.assertj.core.api.Assertions.assertThat
import org.imperial.mrc.comet.AppMetadata
import org.imperial.mrc.comet.controllers.MetadataController
import org.imperial.mrc.comet.models.Response
import org.junit.jupiter.api.Test
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.slf4j.Logger

class MetadataControllerTests {

    @Test
    fun `gets Metadata`() {
        val mockResponse = Response("data", "success", listOf())
        val mockAppMetadata = mock<AppMetadata> {
            on { metadata } doReturn mockResponse
        }
        val mockLogger = mock<Logger>()

        val sut = MetadataController(mockAppMetadata, mockLogger)
        assertThat(sut.metadata()).isSameAs(mockResponse)

        verify(mockLogger).info("metadata")
    }
}
