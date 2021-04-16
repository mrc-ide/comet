package org.imperial.mrc.comet.controllers

import net.logstash.logback.argument.StructuredArguments.kv
import org.imperial.mrc.comet.clients.APIClient
import org.imperial.mrc.comet.models.Response
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import kotlin.random.Random

@RestController
class MainController(val apiClient: APIClient) {

    val logger: Logger = LoggerFactory.getLogger(javaClass)

    @GetMapping("/random")
    fun random(@RequestParam min: Int, @RequestParam max: Int): Response {
        logger.info("random {} {}", kv("min", min), kv("max", max))
        return Response(Random.nextInt(min, max))
    }

    @GetMapping("/api-info")
    fun apiInfo() = apiClient.info()

    @GetMapping("/failure")
    fun failure() = apiClient.knownFailure()
}
