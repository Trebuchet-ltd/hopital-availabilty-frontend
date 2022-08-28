import React, {  useState, useEffect} from "react";
import Checkbox from "@mui/material/Checkbox";
import TimePicker from "./TimePicker";
import {  pickTime } from "./SlotArrange";
import "./days.css";
//new changes
import {DeleteOutline} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface Day{
    el:string;
    index:number;
    setClickIndex:(el:number) =>void;
    clickIndex:number;


  }
  
  
const CheckDay = ({el, index, setClickIndex, clickIndex}:Day,)=>
{
    const [checked, setChecked] = useState<boolean>(false);
    //new changes
    const [isAvailable,setIsAvailable]=useState<boolean>(true);
    const msg:String="Unavailable";
    const[counter,setCounter]=useState<number>(1);
    const [newSlot,setNewSlot]=useState<number[]>([0]);
    
    
    const handleChecked = (event: React.ChangeEvent<HTMLInputElement>):void=>
    {
        setChecked(event.target.checked);
        setChecked(true);
        setClickIndex(index);
        
        
    };  

    //used for adding new slot 
   const addNewSlot=(e:any)=>{
    e.preventDefault();
    setChecked(true);
    setClickIndex(index);
    setCounter(prevState=>prevState+1);
    setNewSlot([...newSlot,counter]);
    console.log(newSlot);
   }

   //used for deleting a existing slot
   const deleteSlot=(value:number)=>{
    
  setNewSlot(newSlot.filter(val=>val!==value))
    
   }

    useEffect(()=>
    {
        if(index !== clickIndex)
            setChecked(false);     
    }, [index, clickIndex]);
     
    return (
        <div className="box" key={index}>
            <div className="check_date" >
                <div style={{display:'inline',position:'absolute',left:'5%'}}>
            <Checkbox
                    checked={checked}
                    onChange={handleChecked}
                    inputProps={{ "aria-label": "controlled" }}
                />
               
                <h5 style={{color:"black",display:'inline'}}>{el}</h5>
                </div>
              <div style={{ width: '100%'}} key={index}>
                <button style={{float: 'right'}}  onClick={()=>console.log('copy slot time')
                }><ContentCopyIcon/></button>
                <button style={{float: 'right',marginRight:'10px'}} onClick={addNewSlot}><AddIcon/></button>
                </div>
          
                
            </div> 
            {index === clickIndex && checked && isAvailable?

           
            

        
              <div className="check_date date-pad" >
                  {/* these to should accpet a array of time in string as the data prop need to change later*/}
                  {/* add new slot */}
                 {newSlot.map((value:number)=>{

                return(
                    <div key={value} style={{display:'flex',alignItems:'left'}} >
                        <div style={{display:'flex'}}>
                  <TimePicker  lab="From"  data={pickTime}/>
                  <TimePicker  lab="To"  data={pickTime}/>
                  <button style={{float: 'right'}} onClick={()=>deleteSlot(value)} ><DeleteOutline fontSize="large"/></button>
                  
                  </div>
                  <br />
                 

                 {/*new changes add deleteicon*/}
                
                 
                 </div>
                 
                )
                  })}

              </div>
         
              :
              <h5 style={{textAlign:'center',marginTop: '20px'}}>{msg}</h5>
            }
        </div>
    );
};
  
export default CheckDay;
