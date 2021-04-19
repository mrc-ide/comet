package org.imperial.mrc.comet

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.databind.node.TextNode
import com.fasterxml.jackson.module.kotlin.readValue
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.io.FileNotFoundException
import java.net.URL
import javax.annotation.PostConstruct

@Component
class AppMetadata(private val logger: Logger = LoggerFactory.getLogger(AppMetadata::class.java)) {

    companion object {
        private const val METADATA_ROOT = "metadata"
        private const val CHARTS_ROOT = "$METADATA_ROOT/charts"
        private val objectMapper = ObjectMapper()
    }

    @PostConstruct
    fun init() {
        val charts = buildChartsMetadata()
        logger.info("APP METADATA CONSTRUCTED!!!!!")
    }

    private fun buildChartsMetadata(): ArrayNode {
        val chartsText = readFromResource("$CHARTS_ROOT/charts.json")
        val charts = objectMapper.readValue<ArrayNode>(chartsText)
        for (node in charts) {
            val chartNode = node as ObjectNode
            val chartId = node["id"].asText()
            val chartRoot = "$CHARTS_ROOT/$chartId"

            setResourceContentsAsObjectNode(chartNode, "config", "$chartRoot/config.json")

            setResourceContentsAsTextNode(chartNode, "data", "$chartRoot/data.jsonata")
            setResourceContentsAsTextNode(chartNode, "layout", "$chartRoot/layout.jsonata")

            setResourceContentsAsObjectNode(chartNode, "inputSchema", "$chartRoot/input.schema.json")
        }

        return charts
    }

    private fun setResourceContentsAsTextNode(parentNode: ObjectNode, name: String,  resourcePath: String) {
        val text = readFromResource(resourcePath)
        parentNode.set<TextNode>(name, TextNode(text))
    }

    private fun setResourceContentsAsObjectNode(parentNode: ObjectNode, name: String, resourcePath: String) {
        val text = readFromResource(resourcePath)
        val node = objectMapper.readValue<JsonNode>(text)
        parentNode.set<ObjectNode>(name, node)
    }

    private fun readFromResource(path: String): String {
        val url: URL? = AppMetadata::class.java.classLoader.getResource(path)
        return url?.readText() ?: throw FileNotFoundException("Resource file '$path' not found")
    }
}
