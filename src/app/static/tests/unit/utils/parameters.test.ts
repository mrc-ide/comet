import { updateParameterInGroup } from "@/utils/parameters";
import { mockRootState } from "../../mocks";

describe("parameters utils", () => {
    it("updates parameter in group", () => {
        const paramValues = {
            pGroup: {
                pName: "oldValue",
                otherName: "someValue"
            },
            otherGroup: {}
        };
        const metadata = {
            parameterGroups: [
                {
                    id: "pGroup",
                    config: {
                        controlSections: [
                            {
                                controlGroups: [
                                    {
                                        controls: [
                                            { name: "anotherParamGroup", value: "anotherValue" }
                                        ]
                                    }
                                ]
                            },
                            {
                                controlGroups: [
                                    {
                                        controls: [
                                            { name: "otherName", value: "otherOldValue" },
                                            { name: "pName", value: "oldValue" }
                                        ]
                                    },
                                    {
                                        controls: [
                                            { name: "anotherControlGroup", value: 5 }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    id: "otherGroup"
                }
            ]
        } as any;
        const state = mockRootState({
            paramValues,
            metadata
        });
        updateParameterInGroup(state, "pGroup", "pName", "newValue");
        expect(state.paramValues).toStrictEqual({
            pGroup: {
                pName: "newValue",
                otherName: "someValue"
            },
            otherGroup: {}
        });
        expect(state.metadata).toStrictEqual({
            parameterGroups: [
                {
                    id: "pGroup",
                    config: {
                        controlSections: [
                            {
                                controlGroups: [
                                    {
                                        controls: [
                                            { name: "anotherParamGroup", value: "anotherValue" }
                                        ]
                                    }
                                ]
                            },
                            {
                                controlGroups: [
                                    {
                                        controls: [
                                            { name: "otherName", value: "otherOldValue" },
                                            { name: "pName", value: "newValue" }
                                        ]
                                    },
                                    {
                                        controls: [
                                            { name: "anotherControlGroup", value: 5 }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    id: "otherGroup"
                }
            ]
        });
    });
});
