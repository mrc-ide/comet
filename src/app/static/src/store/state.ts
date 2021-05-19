import {
    ApiInfo,
    Data,
    ErrorInfo,
    Metadata
} from "@/types";

export interface RootState {
  apiInfo: ApiInfo | null
  metadata: Metadata | null
  results: Data | null
  paramValues: Data | null
  fetchingResults: boolean
  errors: Array<ErrorInfo>
}
