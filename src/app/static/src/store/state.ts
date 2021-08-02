import {
  ApiInfo, Countries,
  Data,
  ErrorInfo,
  Metadata
} from "@/types";

export interface RootState {
  apiInfo: ApiInfo | null
  metadata: Metadata | null
  countries: Countries | null
  results: Data | null
  paramValues: Data | null
  fetchingResults: boolean
  errors: ErrorInfo[]
}
