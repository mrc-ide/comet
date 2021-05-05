package org.imperial.mrc.comet.controllers

import org.imperial.mrc.comet.clients.APIClient
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class MainController(
    val apiClient: APIClient,
    private val logger: Logger = LoggerFactory.getLogger(MainController::class.java)
) {

    @GetMapping("/api-info")
    fun apiInfo(): ResponseEntity<String> {
        logger.info("api-info")
        return apiClient.info()
    }

}
