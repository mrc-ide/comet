package org.imperial.mrc.comet.integration_tests.endpoints

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.fail
import org.imperial.mrc.comet.integration_tests.JSONValidator
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
abstract class EndpointTests {
    @Autowired
    lateinit var testRestTemplate: TestRestTemplate

    protected fun assertSuccess(responseEntity: ResponseEntity<String>,
                                schemaName: String?) {

        assertThat(responseEntity.headers.contentType!!.toString())
                .isEqualTo("application/json")

        if (responseEntity.statusCode != HttpStatus.OK) {
            fail<String>("Expected OK response but got error: ${responseEntity.body}")
        }
        if (schemaName != null) {
            JSONValidator().validateSuccess(responseEntity.body!!, schemaName)
        }

        val responseJson = ObjectMapper().readValue<JsonNode>(responseEntity.body.toString())
        assertThat(responseJson["status"].asText()).isEqualTo("success")
    }

    protected fun assertFailure(responseEntity: ResponseEntity<String>,
                                statusCode: Int) {
        assertThat(responseEntity.headers.contentType!!.toString())
                .isEqualTo("application/json")

        assertThat(responseEntity.statusCodeValue).isEqualTo(statusCode)

        val responseJson = ObjectMapper().readValue<JsonNode>(responseEntity.body.toString())
        assertThat(responseJson["status"].asText()).isEqualTo("failure")
        assertThat(responseJson["data"].isNull).isTrue()
        assertThat(responseJson["errors"].count()).isGreaterThan(0)
    }
}
