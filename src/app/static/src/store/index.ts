import { createStore } from "vuex";
import { actions } from "@/store/actions";
import { mutations } from "@/store/mutations";
import { RootState } from "@/store/state";

export default createStore<RootState>({
    state: {
        count: 0,
        apiInfo: null,
        metadata: null,
        results: null
    },
    mutations,
    actions,
    modules: {
    }
});
