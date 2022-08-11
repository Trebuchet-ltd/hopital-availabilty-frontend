import React from "react";
import { FieldValues, useForm, UseFormProps, UseFormReturn } from "react-hook-form";

export default function HookFormWrapper<FieldType extends FieldValues>(
    { children, ...useformProps }: UseFormProps<FieldType> & { children: (a: UseFormReturn<FieldType>) => JSX.Element }
) 
{
    const ret = useForm<FieldType>(useformProps);
    return children(ret);
}
