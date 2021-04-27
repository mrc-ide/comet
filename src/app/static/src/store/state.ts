import {ApiInfo, Results, Metadata} from "@/types";

export interface RootState {
  count: number
  apiInfo: ApiInfo | null
  metadata: Metadata | null
  results: Results | null
  chartLayoutData: unknown
}
