package org.imperial.mrc.comet.controllers

import org.imperial.mrc.comet.clients.APIClient
import org.imperial.mrc.comet.models.Response
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestBody

@RestController
class DataController(
    private val logger: Logger = LoggerFactory.getLogger(DataController::class.java),
    private val apiClient: APIClient
) {
    @GetMapping("/countries")
    fun countries(): ResponseEntity<String> {
        logger.info("countries")
        return apiClient.countries()
    }

    @PostMapping("/results")
    fun results(@RequestBody request: String): ResponseEntity<String> {
        logger.info("results $request")
        return apiClient.results(request)
    }
}
