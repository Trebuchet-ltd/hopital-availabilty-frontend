import React, { useState, useEffect, Key } from "react";
import Checkbox from "@mui/material/Checkbox";
import { pickTime } from "./SlotArrange";
import "./days.css";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { IconButton } from "@mui/material";


interface Day {
    onChange: (schedule: { start: string, end: string }[]) => void;
    day: number;
}

const schema = yup.object({
    schedule: yup.array().of(yup.object({
        start: yup.date().required(),
        end: yup.date().required()
    }).test(
        "start-end-check",
        "End cannot be less than start.",
        (value: { start: number; end: number; }, context: any) => !!value.start && !!value.end && value.start < value.end,
    )
    )
});

export const DAYS: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CheckDay = ({ onChange, day }: Day) => {
    const { control, register, getValues, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur"
    });
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "schedule", // unique name for your Field Array
    });
    const onSubmit = handleSubmit((v: any) => console.log(v), (e: any) => console.log(e));
    const [checked, setChecked] = useState<boolean>(false);
    const [isCheck, setIsCheck] = useState<boolean>(false);
    const msg: String = "Unavailable";

    const handleChecked = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if(event.target.checked)
        {
        setChecked(event.target.checked);
        setIsCheck(true);
        }
        else
        {
            setChecked(false);
            setIsCheck(false);
        }

    };

    console.log(getValues(), errors);


    //used for copy icon
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="box" key={day}>
            <div className="check_date">
                <div style={{display:'flex'}}>

                <Checkbox
                    checked={checked}
                    onChange={handleChecked}
                    inputProps={{ "aria-label": "controlled" }}

                />
                <h5 style={{ color: "black",marginTop:'10px' }}>{DAYS[day]}</h5>
                     
                </div>

              <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    style={{ position: 'relative', right: '15px', padding: '0px 0px' }}
                >
                    <ContentCopyIcon  style={{color:'black',marginRight:'5px'}}/>
                    </IconButton>
                <button onClick={() => append([{
                    start: new Date("2014-08-18T21:11:54"),
                    end: new Date("2014-08-18T21:11:54")
                }])
           
            }
                    disabled={!checked}
                    style={{ position: 'absolute', right: '5px' }}
                ><AddIcon/>
                </button>

                <Menu id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}>
                    {DAYS.map((value, index) => {
                        return (
                            <div key={index} >
                                <Checkbox style={{ display: 'inline' }}  />{value}
                            </div>
                        )
                    })}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <Button variant="contained" size="small">Copy</Button>
                    </div>
                </Menu>





            </div>
            {isCheck ?
            <div className="timeslots-wrapper date-pad">
               

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        {fields.map((f: { id: Key | null | undefined; }, i: string | number) => (
                            <div className="timeslot" key={f.id}>
                                <Controller
                                    {...register(`schedule.${i}.start`)}
                                    control={control}
                                    
                                    rules={{ required: true }}
                                    render={({ field }) => <TimePicker 
                                    
                                        renderInput={(params) => <TextField {...params}
                                            helperText={errors.schedule?.[i]?.message}
                                            label="Time"
                                            error={!!errors.schedule?.[i]} size="small" style={{marginRight:'20px'}} />}
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
                                    rules={{ required: true }}
                                    render={({ field }) => <TimePicker
                                        renderInput={(params) => <TextField {...params}
                                            helperText={errors.schedule?.[i]?.message}
                                            label="Time"
                                            error={!!errors.schedule?.[i]} size="small" style={{marginLeft:'10px'}}/>}
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
                                <button onClick={() => remove(i)}><DeleteOutlineIcon fontSize="medium"/></button>
                            </div>

                        ))}
                    </LocalizationProvider>
                   

                <button onClick={onSubmit}>Apply</button>

            </div>
             :
             <h5>{msg}</h5>}


        </div>
    );
};

export default CheckDay;
