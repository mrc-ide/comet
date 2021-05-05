package org.imperial.mrc.comet.integration_tests.endpoints

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.readValue
import org.assertj.core.api.Assertions.assertThat
import org.imperial.mrc.comet.integration_tests.APIClientTests.Companion.testResultsRequest
import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.postForEntity

class DataTests: EndpointTests() {
    @Test
    fun `can get results`() {
        val responseEntity = testRestTemplate.postForEntity<String>("/results", testResultsRequest)
        assertSuccess(responseEntity, "NimueRun")
        val responseJson = ObjectMapper().readValue<JsonNode>(responseEntity.body.toString())
        val resultsJson = responseJson["data"]
        assertThat(resultsJson).isInstanceOf(ObjectNode::class.java)
    }
}
