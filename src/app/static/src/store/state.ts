import { ApiInfo, Data, Metadata } from "@/types";

export interface RootState {
  apiInfo: ApiInfo | null
  metadata: Metadata | null
  results: Data | null
  paramValues: Data | null
  fetchingResults: boolean
}
