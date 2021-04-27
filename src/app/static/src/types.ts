export interface ApiError {
    error: string
    detail: string | null
}

export interface ApiResponse {
    status: string,
    data: unknown,
    errors: ApiError[] | null
}

export interface ApiInfo {
    name: string,
    version: Record<string, string>
}

export interface Metadata {
    charts: unknown[]
}
