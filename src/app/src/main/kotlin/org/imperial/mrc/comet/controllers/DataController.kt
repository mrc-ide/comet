package org.imperial.mrc.comet.controllers

import org.imperial.mrc.comet.clients.APIClient
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestBody

@RestController
class DataController(
    private val logger: Logger = LoggerFactory.getLogger(DataController::class.java),
    private val apiClient: APIClient
) {
    @PostMapping("/results")
    fun results(@RequestBody request: Any): ResponseEntity<String> {
        logger.info("results")
        return apiClient.results(request)
    }
}
