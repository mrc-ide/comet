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
import org.imperial.mrc.comet.models.Response

@Component
class AppMetadata(
    private val logger: Logger = LoggerFactory.getLogger(AppMetadata::class.java),
    private val classLoader: ClassLoader = AppMetadata::class.java.classLoader
) {

    companion object {
        private const val METADATA_ROOT = "metadata"
        private const val CHARTS_ROOT = "$METADATA_ROOT/charts"
        private const val PARAMS_ROOT = "$METADATA_ROOT/parameterGroups"
        private val objectMapper = ObjectMapper()
    }

    val metadata: Response

    init {
        val fullMetadata = ObjectNode(objectMapper.nodeFactory)

        val charts = buildChartsMetadata()
        fullMetadata.set<ArrayNode>("charts", charts)

        val params = buildParametersMetadata()
        fullMetadata.set<ArrayNode>("parameterGroups", params)

        metadata = Response(fullMetadata)

        logger.info("AppMetadata constructed")
    }

    private fun buildChartsMetadata(): ArrayNode {
        val chartsText = readFromResource("$CHARTS_ROOT/charts.json")
        val charts = objectMapper.readValue<ArrayNode>(chartsText)
        for (node in charts) {
            val chartNode = node as ObjectNode
            val chartId = node["id"].asText()
            val chartRoot = "$CHARTS_ROOT/$chartId"

            setResourceContentsAsTextNode(chartNode, "config", "$chartRoot/config.jsonata")

            setResourceContentsAsTextNode(chartNode, "data", "$chartRoot/data.jsonata")
            setResourceContentsAsTextNode(chartNode, "layout", "$chartRoot/layout.jsonata")

            setResourceContentsAsObjectNode(chartNode, "inputSchema", "$chartRoot/input.schema.json")
        }

        return charts
    }

    private fun buildParametersMetadata(): ArrayNode {
        val paramGroupsText = readFromResource("$PARAMS_ROOT/parameterGroups.json")
        val paramGroups = objectMapper.readValue<ArrayNode>(paramGroupsText)
        for (node in paramGroups) {
            val paramGroupNode = node as ObjectNode
            val paramGroupId = node["id"].asText()
            val paramGroupFileName = "$PARAMS_ROOT/$paramGroupId.jsonata"

            setResourceContentsAsTextNode(paramGroupNode,"config", paramGroupFileName)
        }

        return paramGroups
    }

    private fun setResourceContentsAsTextNode(parentNode: ObjectNode, name: String, resourcePath: String) {
        val text = readFromResource(resourcePath)
        parentNode.set<TextNode>(name, TextNode(text))
    }

    private fun setResourceContentsAsObjectNode(parentNode: ObjectNode, name: String, resourcePath: String) {
        val text = readFromResource(resourcePath)
        val node = objectMapper.readValue<JsonNode>(text)
        parentNode.set<ObjectNode>(name, node)
    }

    private fun readFromResource(path: String): String {
        val url: URL? = classLoader.getResource(path)
        return url?.readText() ?: throw FileNotFoundException("Resource file '$path' not found")
    }
}
