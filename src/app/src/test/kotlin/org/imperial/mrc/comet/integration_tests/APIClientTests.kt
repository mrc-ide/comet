package org.imperial.mrc.comet.integration_tests

import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.imperial.mrc.comet.AppProperties
import org.junit.jupiter.api.Test
import org.imperial.mrc.comet.clients.FuelAPIClient
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class APIClientTests() {
    @Autowired
    lateinit var appProperties: AppProperties

    @Test
    fun `can get api info`() {
        val sut = FuelAPIClient(appProperties)
        val result = sut.info()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Root")
    }

    @Test
    fun `can get known failure`() {
        val sut = FuelAPIClient(appProperties)
        val result = sut.knownFailure()
        assertThat(result.statusCodeValue).isEqualTo(404)
        JSONValidator().validateError(result.body!!, "NOT_FOUND", "Resource not found")
    }
}
