import {ApiInfo, Data, Metadata} from "@/types";

export interface RootState {
  count: number
  apiInfo: ApiInfo | null
  metadata: Metadata | null
  results: Data | null
  chartLayoutData: Data | null
}
