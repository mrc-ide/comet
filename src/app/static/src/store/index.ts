import { createStore } from "vuex";
import { actions } from "@/store/actions";
import { mutations } from "@/store/mutations";
import { RootState } from "@/store/state";

export default createStore<RootState>({
    state: {
        apiInfo: null,
        metadata: null,
        results: null,
        // This auxiliary data required by charts will eventually come out of dynamic parameters
        chartLayoutData: {
            params: {
                phases: [
                    {
                        start: "2020-01-01T00:00:00.000Z",
                        rt: 1.35
                    },
                    {
                        start: "2021-03-25T00:00:00.000Z",
                        rt: 2.45
                    }
                ],
                general_beds: 314310,
                critical_beds: 11350,
                population: 67890000
            }
        }
    },
    mutations,
    actions,
    modules: {
    }
});
