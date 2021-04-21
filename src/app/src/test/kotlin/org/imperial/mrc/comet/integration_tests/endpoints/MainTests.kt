package org.imperial.mrc.comet.integration_tests.endpoints

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity

class MainTests: EndpointTests() {
    @Test
    fun `can get api info`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/api-info")
        assertSuccess(responseEntity, "Root")
        val responseJson = ObjectMapper().readValue<JsonNode>(responseEntity.body.toString())
        assertThat(responseJson["data"]["name"].asText()).isEqualTo("cometr")
    }

    @Test
    fun `can get known failure`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/failure")
        assertFailure(responseEntity, 404)
    }
}
