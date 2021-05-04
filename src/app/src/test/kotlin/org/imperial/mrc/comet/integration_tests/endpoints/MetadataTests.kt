package org.imperial.mrc.comet.integration_tests.endpoints

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.readValue
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity

class MetadataTests: EndpointTests() {
    @Test
    fun `can get metadata`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/metadata")
        assertSuccess(responseEntity, null)
        val responseJson = ObjectMapper().readValue<JsonNode>(responseEntity.body.toString())

        val chartsJson = responseJson["data"]["charts"]
        assertThat(chartsJson.count()).isGreaterThan(0)
        val firstChart = chartsJson[0]
        assertThat(firstChart["id"].asText()).isNotBlank()
        assertThat(firstChart["collapsed"].asBoolean()).isNotNull()
        assertThat(firstChart["config"].asText()).isNotBlank()
        assertThat(firstChart["data"].asText()).isNotBlank()
        assertThat(firstChart["layout"].asText()).isNotBlank()
        assertThat(firstChart["inputSchema"]).isInstanceOf(ObjectNode::class.java)

        val parametersJson = responseJson["data"]["parameterGroups"]
        assertThat(parametersJson.count()).isGreaterThan(0)
        val firstParamGroup = parametersJson[0]
        assertThat(firstParamGroup["id"].asText()).isNotBlank()
        assertThat(firstParamGroup["label"].asText()).isNotBlank()
        assertThat(firstParamGroup["type"].asText()).isNotBlank()
        assertThat(firstParamGroup["config"].asText()).isNotBlank()
    }
}
