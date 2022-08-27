import React, {useState, useEffect} from "react";
import Checkbox from "@mui/material/Checkbox";
import {pickTime} from "./SlotArrange";
import "./days.css";
import {useFieldArray, useForm, Controller} from "react-hook-form";
import TextField from "@mui/material/TextField";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

interface Day
{
    onChange: (schedule: { start: string, end: string }[]) => void;
    day: number;
}

const schema = yup.object({
    schedule: yup.array().of(yup.object({
        start: yup.date().required(),
        end: yup.date().required().min(yup.ref("start"))
    }))
});

export const DAYS: string[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const CheckDay = ({onChange, day}: Day) =>
{
    const {control, register, getValues, handleSubmit} = useForm({resolver: yupResolver(schema), mode: "onBlur"});
    const {fields, append, prepend, remove, swap, move, insert} = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "schedule", // unique name for your Field Array
    });
    const onSubmit = handleSubmit((v) => console.log(v), (e) => console.log(e));
    const [checked, setChecked] = useState<boolean>(false);

    const handleChecked = (event: React.ChangeEvent<HTMLInputElement>): void =>
    {
        setChecked(event.target.checked);
    };

    console.log(getValues());


    return (
        <div className="box" key={day}>
            <div className="check_date">
                <Checkbox
                    checked={checked}
                    onChange={handleChecked}
                    inputProps={{"aria-label": "controlled"}}
                />
                <h5 style={{color: "black"}}>{DAYS[day]}</h5>
                <button onClick={() => append([{
                    start: new Date("2014-08-18T21:11:54"),
                    end: new Date("2014-08-18T21:11:54")
                }])}
                        disabled={!checked}
                >add
                </button>
            </div>
            <div className="timeslots-wrapper date-pad">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {fields.map((f, i) => (
                        <div className="timeslot" key={f.id}>
                            <Controller
                                {...register(`schedule.${i}.start`)}
                                control={control}
                                rules={{required: true}}
                                render={({field}) => <TimePicker
                                    renderInput={(params) => <TextField {...params} />}
                                    {...field}
                                    // shouldDisableTime={(timeValue, clockType) =>
                                    // {
                                    //     if (clockType === "hours" && timeValue % 2)
                                    //     {
                                    //         return true;
                                    //     }
                                    //
                                    //     return false;
                                    // }}
                                />

                                }
                            />
                            <Controller
                                {...register(`schedule.${i}.end`)}
                                control={control}
                                rules={{required: true}}
                                render={({field}) => <TimePicker
                                    renderInput={(params) => <TextField {...params} />}
                                    {...field}
                                    // shouldDisableTime={(timeValue, clockType) =>
                                    // {
                                    //     if (clockType === "hours" && timeValue % 2)
                                    //     {
                                    //         return true;
                                    //     }
                                    //
                                    //     return false;
                                    // }}
                                />

                                }
                            />
                            <button onClick={() => remove(i)}>-</button>
                        </div>

                    ))}
                </LocalizationProvider>
            </div>


        </div>
    );
};

export default CheckDay;
