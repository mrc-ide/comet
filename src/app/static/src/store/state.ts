import { ApiInfo, Metadata } from "@/types";

export interface RootState {
  count: number
  apiInfo: ApiInfo | null
  metadata: Metadata | null
  results: unknown | null
}
