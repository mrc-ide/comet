import { Schema } from "ajv";
import { DynamicFormMeta } from "@reside-ic/vue-dynamic-form";

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

export interface Rt {
    start: string,
    value: string
}

export interface ParameterGroupJsonataMetadata {
    id: string,
    type: "dynamicForm" | "rt",
    config: string
}

export interface ParameterGroupMetadata {
    id: string,
    label: string,
    type: "dynamicForm" | "rt",
    config: DynamicFormMeta | Rt[]
}

export interface Metadata {
    charts: ChartMetadata[],
    parameterGroups: ParameterGroupMetadata[]
}

export interface Data {
  [k: string]: unknown;
}
