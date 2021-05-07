package org.imperial.mrc.comet.unit_tests

import org.assertj.core.api.Assertions.assertThat
import org.imperial.mrc.comet.clients.httpStatusFromCode
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

class APIClientTests {
    @Test
    fun `httpStatusFromCode resolves code for success`() {
        val result = httpStatusFromCode(200)
        assertThat(result).isEqualTo(HttpStatus.OK)
    }

    @Test
    fun `httpStatusFromCode resolves code for not found`() {
        val result = httpStatusFromCode(404)
        assertThat(result).isEqualTo(HttpStatus.NOT_FOUND)
    }

    @Test
    fun `httpStatusFromCode resolves code for internal server error`() {
        val result = httpStatusFromCode(500)
        assertThat(result).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
    }

    @Test
    fun `httpStatusFromCode resolves code for unknown code`() {
        val result = httpStatusFromCode(-1)
        assertThat(result).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
