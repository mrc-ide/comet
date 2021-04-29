package org.imperial.mrc.comet.clients

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.kittinunf.fuel.core.Response
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.httpPost
import org.imperial.mrc.comet.AppProperties
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component

interface APIClient {
    fun info(): ResponseEntity<String>
    fun results(params: Map<String, Any?>): ResponseEntity<String>
    fun knownFailure(): ResponseEntity<String>
}

@Component
class FuelAPIClient(private val appProperties: AppProperties) : APIClient {
    override fun info(): ResponseEntity<String> {
        return "${appProperties.apiUrl}/"
                .httpGet()
                .response()
                .second
                .toResponseEntity()
    }

    override fun results(params: Map<String, Any?>): ResponseEntity<String> {
        val json = ObjectMapper().writeValueAsString(params)
        return "${appProperties.apiUrl}/nimue/run"
                .httpPost()
                .jsonBody(json)
                .response()
                .second
                .toResponseEntity()
    }

    override fun knownFailure(): ResponseEntity<String> {
        return "${appProperties.apiUrl}/nonexistent"
                .httpGet()
                .response()
                .second
                .toResponseEntity()
    }
}

fun Response.toResponseEntity(): ResponseEntity<String> {
    val httpStatus = httpStatusFromCode(this.statusCode)

    val body = this.body().asString("application/json")

    return ResponseEntity.status(httpStatus)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
}

fun httpStatusFromCode(code: Int): HttpStatus {
    val status = HttpStatus.resolve(code) ?: return HttpStatus.INTERNAL_SERVER_ERROR
    return if (status <= HttpStatus.NOT_FOUND) {
        status
    } else {
        HttpStatus.INTERNAL_SERVER_ERROR
    }
}
