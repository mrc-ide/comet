import {RootState} from "@/store/index";
import {ApiInfo, Metadata} from "@/types";

export const mutations = {
  increment(state: RootState, amount: number) {
    state.count += amount;
  },
  setApiInfo(state: RootState, apiInfo: ApiInfo) {
    state.apiInfo = apiInfo;
  },
  setMetadata(state: RootState, metadata: Metadata) {
    state.metadata = metadata;
  }
};
