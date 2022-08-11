// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from "react";
import "./slotarrange.css";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import { StickyHead } from "../Utils";
import { withRouter, RouteComponentProps } from "react-router";
import CheckDay from "./CheckDay";
import CustomDatePicker from "../Doctor/CustomDatePicker";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TimePicker from "./TimePicker";
import Modal from "./Modal";
import { format } from "date-fns"; 
import Loader from "react-loader-spinner";
import DeleteIcon from "@mui/icons-material/Delete";

export const DAYS: string[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
export const pickTime: string[] = ["9.00", "10.00", "11.00", "12.00", "1.00", "2.00", "3.00", "4.00"];

interface State {
  show: boolean;
  clickIndex: number;
  checked: boolean;
  openCalender: boolean;
  btnVal: string;
  slote: boolean;
  openModal:boolean;
  date:Date;
  loading:boolean;
}

type AppProps = RouteComponentProps;
class SlotArrange extends Component<AppProps, State>
{

    state: State = {
        show: false,
        clickIndex: 0,
        checked: false,
        openCalender: false,
        btnVal:"Open",
        slote:false,
        openModal:true,
        date:new Date(),
        loading:false,
    };

    setClickIndex(el: number)
    {
        this.setState({ clickIndex: el });
    }

    handleCalenderChange = (val:any):void =>
    {
        this.setState({date:val});
        this.handleModal();
    };

    handleChecked = (event: React.ChangeEvent<HTMLInputElement>): void =>
    {
        this.setState({ checked: event.target.checked });
    };

    handleBtnState = ():void =>
    {
        this.setState({ openCalender: !this.state.openCalender });
        if(this.state.openCalender)
            this.setState({btnVal:"View"});
        else
            this.setState({btnVal:"Hide"});
    };

    handleModal = ():void=>
    {
        this.setState({openModal: !this.state.openModal}); 
    };

    // modal opening unwanted on first render this is the fix
    componentDidMount()
    {
        this.setState({openModal: false});
    }

    dummeyTime = ["9.00-10.00", "11.00-12.00"];


    render() 
    { 
        return (
        // 90% code in this are Conditionally renderd
            <>
                {/* Info about calender is passed to this modal */}
                <Modal open={this.state.openModal} handleClose={this.handleModal} >
                    <div className="md-box">
                        <div className="md-main">
                            <div>
                                <h4>{ this.state.date.getDate()},  {format(this.state.date, "MMMM")}</h4>
                                <h5>{DAYS[this.state.date.getDay()]}</h5>
                            </div>
                            <div className="symbol center" onClick={this.handleModal} >
                                <CloseIcon className="sym"/>
                            </div>        
                        </div>
                        {this.state.loading &&
         <>
             {/* preloader only works when fetching data */}
             <Container className='mt-5 pt-5 text-center'>
                 <Loader type="Bars" color="#3a77ff" height={50} width={50}/>
             </Container>
         </>
                        }
                        {!this.state.loading && 
          <>
              <Container className='mt-5 pt-5 text-center'>
                  {
                      this.dummeyTime.map((el, index)=>
                          <div className="bx" key={index}>
                              <h6>{el}</h6>
                              <DeleteIcon className="clo"/>
                          </div>
                      )
                  } 
                  <div className="btnS">
                      <Button className="sub" variant="contained">Submit</Button>   
                      <Button className="sub" variant="contained">clear all <DeleteIcon/></Button>   
                  </div>

              </Container>
          </>
                        }
                    </div>
                </Modal>

                <StickyHead title="set Weekly Schedule" onClick={() => console.log("submit")} goBack={() => this.props.history.goBack()} />
                <Container className="slot_body">
                    {/* <Modal onClose={() =>console.log("close")}> */}
                    {DAYS.map((el, index) =>
                    {
                        return (
                            <CheckDay key={index} index={index} el={el} setClickIndex={() => this.setClickIndex(index)} clickIndex={this.state.clickIndex} />
                        );
                    })}
                    <div className="btn-add">
                        <Button variant="outlined" size="small" onClick={()=> this.setState({slote:!this.state.slote})} >
                            <div className="btn-cont">
                                <span className="btn-span">
                                    <AddIcon/>
                                </span>
                Add/Remove Slots
                            </div>
                        </Button>
                    </div>
 
                    {this.state.slote && 
         <>
             <div className="center">
                 <TimePicker lab="Day" data={DAYS}/>
                 {/* these to should accpet a array of time in string as the data prop */}
                 <TimePicker lab="From"  data={DAYS}/>
                 <TimePicker lab="To"  data={DAYS}/>
             </div>
         </>
          
                    }

                    {
                        this.state.openCalender &&
             <>
                 <div className="cal">
                     <CustomDatePicker ranges={[{start: new Date(), end: new Date()}]} onChange={this.handleCalenderChange}/>
                 </div>
             </>
                    }
           
                    <div className="btn-add">
                        <Button variant={!this.state.openCalender?"contained":"outlined"} onClick={this.handleBtnState} size="small">
                            <div className="btn-cont">
                                <span className="btn-span">
                                    {this.state.openCalender && <VisibilityOffIcon/>}
                                    {!this.state.openCalender &&  <EventIcon/>}
                                </span>
                                {this.state.btnVal} Schedule
                            </div>
                        </Button>
                    </div>
                </Container>
            </>

        );

    }
}

export default withRouter(SlotArrange);


