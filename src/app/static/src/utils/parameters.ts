import {RootState} from "@/store/state";
import {
  DynamicControl,
  DynamicControlGroup,
  DynamicControlSection, DynamicFormMeta
} from "@reside-ic/vue-dynamic-form";

export const updateParameterInGroup = (state: RootState, parameterGroup: string,
                                         parameterName: string, parameterValue: string | number) => {
    //Because parameter values are kept separately from the metadata for dynamic form used
    //to update those values, we need to update them both
    // @ts-ignore
    state.paramValues![parameterGroup]![parameterName] = parameterValue;

    const group = state.metadata!.parameterGroups.find(group => group.id == parameterGroup);
    const groupControls = (group!.config as DynamicFormMeta).controlSections.map((section: DynamicControlSection) => section.controlGroups.map((controlGroup: DynamicControlGroup) => controlGroup.controls)).flat().flat();
    const control = groupControls.find((control: DynamicControl) => control.name == parameterName)!;
    control.value = parameterValue;
    console.log("Update parameter group to:" + JSON.stringify(group))
};
