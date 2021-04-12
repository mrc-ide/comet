package org.imperial.mrc.comet.clients

import com.github.kittinunf.fuel.core.FuelError
import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.result.Result
import org.imperial.mrc.comet.AppProperties
import org.imperial.mrc.comet.models.ErrorDetail
import org.imperial.mrc.comet.models.Response
import org.springframework.stereotype.Component

interface APIClient {
    fun ip(): Response
}

@Component
class FuelAPIClient(private val appProperties: AppProperties) : APIClient {
    override fun ip(): Response {
        return "${appProperties.apiUrl}/ip"
                .httpGet()
                .responseString()
                .third
                .toResponse()
    }
}

fun <V> Result<V, FuelError>.toResponse() = when (this) {
    is Result.Failure ->
    {
        val ex = this.getException()
        Response(null, "failure", listOf(ErrorDetail(ex.javaClass.simpleName, ex.message)))
    }
    is Result.Success ->
    {
        val data = this.get()
        Response(data)
    }
}
