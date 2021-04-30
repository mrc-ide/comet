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

    companion object {
        val testResultsRequest =  mapOf(
            "region" to "TEST",
            "healthcare" to mapOf("generalBeds" to 314310, "criticalBeds" to 11350),
            "vaccination" to mapOf(
                    "efficacyInfection" to 0.9,
                    "efficacyDisease" to 0.96,
                    "maxDosesPerWeek" to null,
                    "strategy" to "HCW and Elderly",
                    "uptake" to 0.2,
                    "availability" to 0.9,
                    "durability" to 1095,
                    "riskProportion" to 0.1,
                    "future" to null
            ),
            "rt" to listOf(
                    mapOf("start" to "2021-04-30", "value" to 1.18),
                    mapOf("start" to "2021-10-31", "value" to 2.40)
            ),
            "simulation" to mapOf("forecastDays" to 10)
        )
    }

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

    @Test
    fun `can get results`() {
        val sut = FuelAPIClient(appProperties)
        val result = sut.results(testResultsRequest)
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "NimueRun")
    }
}
