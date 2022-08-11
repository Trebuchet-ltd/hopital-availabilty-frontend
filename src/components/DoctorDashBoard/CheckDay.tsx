import React, {  useState, useEffect} from "react";
import Checkbox from "@mui/material/Checkbox";
import TimePicker from "./TimePicker";
import {  pickTime } from "./SlotArrange";
import "./days.css";

interface Day{
    el:string;
    index:number;
    setClickIndex:(el:number) =>void;
    clickIndex:number;
  }
  
  
const CheckDay = ({el, index, setClickIndex, clickIndex}:Day)=>
{
    const [checked, setChecked] = useState<boolean>(false);
    
    const handleChecked = (event: React.ChangeEvent<HTMLInputElement>):void=>
    {
        setChecked(event.target.checked);
        setClickIndex(index);
    };  
    useEffect(()=>
    {
        if(index !== clickIndex)
            setChecked(false);     
    }, [index, clickIndex]);
     
    return (
        <div className="box" key={index}>
            <div className="check_date" >
                <h5 style={{color:"black"}}>{el}</h5>
                <Checkbox
                    checked={checked}
                    onChange={handleChecked}
                    inputProps={{ "aria-label": "controlled" }}
                />
            </div> 
            {index === clickIndex && checked && 
              <div className="check_date date-pad">
                  {/* these to should accpet a array of time in string as the data prop need to change later*/}
                  <TimePicker lab="From"  data={pickTime}/>
                  <TimePicker lab="To"  data={pickTime}/>
              </div>
            }
        </div>
    );
};
  
export default CheckDay;
