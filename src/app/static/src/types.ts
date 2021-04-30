import { Schema } from "ajv";

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

export interface ChartMetadata {
    id: string,
    config: string,
    data: string,
    layout: string,
    inputSchema: Schema
}

export interface Metadata {
    charts: ChartMetadata[]
}

export interface Data {
  [k: string]: unknown;
}
