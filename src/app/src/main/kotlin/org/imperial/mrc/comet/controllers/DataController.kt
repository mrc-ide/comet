package org.imperial.mrc.comet.controllers

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.readValue
import org.imperial.mrc.comet.models.Response
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.io.FileNotFoundException
import java.net.URL

@RestController
class DataController(
    private val logger: Logger = LoggerFactory.getLogger(DataController::class.java),
    private val classLoader: ClassLoader = DataController::class.java.classLoader
) {
    @GetMapping("/results")
    fun results(): Response {
        logger.info("results")

        // NB this implementation to return fixed test data will be replaced with getting real results from cometr
        val fileName = "data.json"
        val url: URL? = classLoader.getResource(fileName)
        val resultsText = url?.readText() ?: throw FileNotFoundException("Resource file '$fileName' not found")
        val results = ObjectMapper().readValue<ObjectNode>(resultsText)
        return Response(results)
    }
}
