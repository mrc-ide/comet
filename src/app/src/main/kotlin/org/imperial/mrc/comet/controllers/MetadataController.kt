package org.imperial.mrc.comet.controllers

import org.imperial.mrc.comet.AppMetadata
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.imperial.mrc.comet.models.Response

@RestController
class MetadataController(
    private val appMetadata: AppMetadata,
    private val logger: Logger = LoggerFactory.getLogger(MetadataController::class.java))
{
    @GetMapping("/metadata")
    fun apiInfo(): Response {
        logger.info("metadata")
        return appMetadata.metadata
    }
}
