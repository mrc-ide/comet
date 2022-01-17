import { DynamicFormMeta } from "@reside-ic/vue-dynamic-form";
import { mutations } from "@/store/mutations";
import { mockRootState } from "../../mocks";

describe("mutations", () => {
    it("sets metadata", () => {
        const state = mockRootState();
        const mockMetadata = { charts: [], parameterGroups: [] };
        mutations.setMetadata(state, mockMetadata);
        expect(state.metadata).toBe(mockMetadata);
    });

    it("sets countries", () => {
        const state = mockRootState();
        const mockCountries = [{ code: "NARN", name: "Narnia", public: true } as any];
        mutations.setCountries(state, mockCountries);
        expect(state.countries).toBe(mockCountries);
    });

    it("sets results", () => {
        const state = mockRootState();
        const mockResults = { time_series: [] };
        mutations.setResults(state, mockResults);
        expect(state.results).toBe(mockResults);
    });

    it("sets parameter metadata", () => {
        const state = mockRootState({ metadata: { charts: [], parameterGroups: [] } as any });
        const newParamMetadata = [
            { id: "group1" },
            { id: "group2" }
        ];
        mutations.setParameterMetadata(state, newParamMetadata as any);
        expect(state.metadata).toStrictEqual({
            charts: [],
            parameterGroups: newParamMetadata
        });
    });

    it("sets country", () => {
        const countries = [
            { code: "GBR", capacityGeneral: 1000, capacityICU: 10 },
            { code: "FRA", capacityGeneral: 2000, capacityICU: 20 }
        ] as any;
        const paramValues = {
            region: "GBR",
            healthcare: {
                generalBeds: 1000,
                criticalBeds: 10
            }
        };
        const metadata = {
            parameterGroups: [
                {
                    id: "anotherGroup"
                },
                {
                    id: "healthcare",
                    config: {
                        controlSections: [
                            {
                                controlGroups: [
                                    {
                                        controls: [
                                            { name: "generalBeds", value: 1000 },
                                            { name: "criticalBeds", value: 10 }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        } as any;
        const state = mockRootState({ countries, paramValues, metadata });
        mutations.setCountry(state, "FRA");
        expect(state.paramValues!.region).toBe("FRA");
        const healthcare = state.paramValues!.healthcare as Record<string, any>;
        expect(healthcare.generalBeds).toBe(2000);
        expect(healthcare.criticalBeds).toBe(20);
        const formMeta = state.metadata!.parameterGroups[1].config as DynamicFormMeta;
        const controlGroup = formMeta.controlSections[0].controlGroups[0];
        expect(controlGroup.controls[0].value).toBe(2000);
        expect(controlGroup.controls[1].value).toBe(20);
    });

    it("sets parameter values", () => {
        const state = mockRootState();
        const mockParamValues = { grp1: { param1: "value1" } };
        mutations.setParameterValues(state, mockParamValues);
        expect(state.paramValues).toBe(mockParamValues);
    });

    it("sets fetchingResults", () => {
        const state = mockRootState();
        mutations.setFetchingResults(state, true);
        expect(state.fetchingResults).toBe(true);
    });

    it("sets errors", () => {
        const state = mockRootState();
        const errors = [{ error: "an error" }];
        mutations.setErrors(state, errors);
        expect(state.errors).toBe(errors);
    });
});
