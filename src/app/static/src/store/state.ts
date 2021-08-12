import {
  ApiInfo,
  Country,
  Data,
  ErrorInfo,
  Metadata, ParameterValues
} from "@/types";

export interface RootState {
  apiInfo: ApiInfo | null
  metadata: Metadata | null
  countries: Country[] | null
  results: Data | null
  paramValues: ParameterValues | null
  fetchingResults: boolean
  errors: ErrorInfo[]
}
