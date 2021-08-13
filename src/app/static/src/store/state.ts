import {
  ApiInfo,
  Country,
  Data,
  ErrorInfo,
  Metadata
} from "@/types";

export interface RootState {
  apiInfo: ApiInfo | null
  metadata: Metadata | null
  countries: Country[] | null
  results: Data | null
  paramValues: Data | null
  fetchingResults: boolean
  errors: ErrorInfo[]
}
