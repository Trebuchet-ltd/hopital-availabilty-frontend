import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface prop {
  lab: string;
  data: string[];
}

export default function TimePicker({ lab, data }: prop) 
{
    const [age, setAge] = React.useState("");

    const handleChange = (event: SelectChangeEvent) => 
    {
        console.log(event);
        setAge(event.target.value as string);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 60 }} size="small">
            <InputLabel id="demo-simple-select-label">{lab}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label={lab}
                onChange={handleChange}
            >
                {data.map((item, i) => (
                    <MenuItem key={i} value={item}>{item}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
