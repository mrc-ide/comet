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
        val testResultsRequest = """
            {
                "region": "TEST",
                "healthcare": {
                    "generalBeds": 314310,
                    "criticalBeds": 11350
                },
                "vaccination": {
                    "efficacyInfection": 0.9,
                    "efficacyDisease": 0.96,
                    "maxDosesPerWeek": null,
                    "strategy": "HCW and Elderly",
                    "uptake": 0.2,
                    "availability": 0.9,
                    "durability": 1095,
                    "riskProportion": 0.1,
                    "future": null
                },
                "rt": [
                    {
                        "start": "2021-04-30",
                        "value": 1.18
                    },
                    {
                        "start": "2021-10-31",
                        "value": 2.40
                    }
                ],
                "simulation": {
                    "forecastDays": 10
                }
            }
        """.trimIndent()
    }

    @Test
    fun `can get api info`() {
        val sut = FuelAPIClient(appProperties)
        val result = sut.info()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Root")
    }

    @Test
    fun `can get results`() {
        val sut = FuelAPIClient(appProperties)
        val result = sut.results(testResultsRequest)
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "NimueRun")
    }
}
