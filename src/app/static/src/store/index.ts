import { createStore } from "vuex";
import {ApiInfo, Metadata} from "@/types";
import {actions} from "@/store/actions";
import {mutations} from "@/store/mutations";

export interface RootState {
  count: number
  apiInfo: ApiInfo | null
  metadata: Metadata | null
}

export default createStore<RootState>({
    state: {
        count: 0,
        apiInfo: null,
        metadata: null
    },
    mutations,
    actions,
    modules: {
    }
});
