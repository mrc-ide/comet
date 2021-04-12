package org.imperial.mrc.comet.models

data class Response(val data: Any?, val status: String = "success", val errors: List<ErrorDetail> = emptyList())
