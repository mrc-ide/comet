package org.imperial.mrc.comet.clients

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
    fun countries(): ResponseEntity<String>
    fun results(request: String): ResponseEntity<String>
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

    override fun countries(): ResponseEntity<String> {
        return "${appProperties.apiUrl}/countries"
                .httpGet()
                .response()
                .second
                .toResponseEntity()
    }

    override fun results(request: String): ResponseEntity<String> {
        return "${appProperties.apiUrl}/nimue/run"
                .httpPost()
                .jsonBody(request)
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
