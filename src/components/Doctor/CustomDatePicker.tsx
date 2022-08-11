import * as React from "react";
import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import PickersDay, {PickersDayProps} from "@mui/lab/PickersDay";
import isSameDay from "date-fns/isSameDay";
import isWithinInterval from "date-fns/isWithinInterval";

type CustomPickerDayProps = PickersDayProps<Date> & {
    varient:0 | 1 | 2 | null
};

interface CustomDatePickerProps{
    days: {day:Date | number, varient: 0 | 1 | 2}[]
    onChange: (date:Date|null) => unknown
}

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
        prop !== "varient" 
})<CustomPickerDayProps>(({theme, varient}) => ({
    ...(varient !== null && {
        border:"1px solid #00000000",
        backgroundColor: "#D8E3FF00",
        color: "#000000",
        fontWeight:"bold",
        "&:hover, &:focus": {
            backgroundColor: theme.palette.primary.dark,
            color:"white"
        }

    }), ...(varient === 2 && {
        borderColor: "#26ed30 !important",
        "&:hover, &:focus": {
            backgroundColor: "#26ed30",
            color:"white"
        }
    }),
    ...(varient === 1 && {
        borderColor: "#ed9b31 !important",
        "&:hover, &:focus": {
            backgroundColor: "#ed9b31",
            color:"white"
        }
    }),
    ...(varient === 0 && {
        backgroundColor: "#e93a3a",
        color:"white !important"

    }),

})) as React.ComponentType<CustomPickerDayProps>;

export default function CustomDatePicker({days, onChange}: CustomDatePickerProps)
{
    const [value, setValue] = React.useState<Date | null>(new Date());

    const renderWeekPickerDay = (
        date: Date,
        selectedDates: Array<Date | null>,
        pickersDayProps: PickersDayProps<Date>,
    ) =>
    {
        if (!value)
            return <PickersDay {...pickersDayProps} />;

        let isInSchedule = false; let varient = null;

        for (const {day, varient:v} of days)
        {
            isInSchedule = isSameDay(date, day);
            
            if(isInSchedule)
            {
                varient = v;
                break;
            }
        }
        return (
            <CustomPickersDay
                sx={{width: "100%", borderRadius:"6px"}}
                {...pickersDayProps}
                varient={varient}
                disabled={!isInSchedule || varient === 0}
            />
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
                className="w-100"
                displayStaticWrapperAs="desktop"
                label="Week picker"
                value={value}
                onChange={(date) =>
                {
                    setValue(date);
                    onChange(date);
                }}
                renderDay={renderWeekPickerDay}
                renderInput={(params) => <TextField {...params} />}
                inputFormat="'Week of' MMM d"
            />
        </LocalizationProvider>
    );
}
