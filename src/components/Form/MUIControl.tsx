import { Controller, UseControllerProps, Control, ControllerRenderProps } from "react-hook-form";

export default function MUIController(
    { children, control, name }: UseControllerProps & { children: (p:{ error?: any, helperText?: any, } & ControllerRenderProps<any, string>)=>JSX.Element, control: Control, name:string }
) 
{
    return <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => children({ error: fieldState.error !== undefined, helperText: fieldState.error?.message, ...field })??<></>}
    ></Controller>;
}
