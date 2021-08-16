import { RootState } from "@/store/state";
import {
    DynamicControl,
    DynamicControlGroup,
    DynamicControlSection,
    DynamicFormMeta
} from "@reside-ic/vue-dynamic-form";

export const updateParameterInGroup = (
    state: RootState,
    parameterGroup: string,
    parameterName: string,
    parameterValue: string | number
): void => {
    // Because parameter values are kept separately from the metadata for dynamic form used
    // to update those values, we need to update them both
    const paramValueGroup = (state.paramValues![parameterGroup] as Record<string, unknown>)!;
    paramValueGroup[parameterName] = parameterValue;

    const paramGroup = state.metadata!.parameterGroups.find((group) => group.id === parameterGroup);
    const groupControls = (paramGroup!.config as DynamicFormMeta).controlSections
        .flatMap((section: DynamicControlSection) => section.controlGroups
            .flatMap((controlGroup: DynamicControlGroup) => controlGroup.controls));
    const paramControl = groupControls.find(
        (control: DynamicControl) => control.name === parameterName
    )!;
    paramControl.value = parameterValue;
};
