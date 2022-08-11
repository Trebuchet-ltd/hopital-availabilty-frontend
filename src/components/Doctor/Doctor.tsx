import {Appointment, Doctor, DoctorObject, DoctorSchedule, DoctorScheduleObject, Patient, PatientObject} from "../../api/model";

import "./doctor.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import image from "../../images/doctorhead.jpg";
import icon from "./icons/icon@2x.svg";
import icon2 from "./icons/icon-2@2x.svg";
import icon3 from "./icons/icon-3@2x.svg";
import icon4 from "./icons/icon-4@2x.svg";
import icon5 from "./icons/icon-5@2x.svg";
import icon6 from "./icons/icon-6@2x.svg";
import icon7 from "./icons/icon-7@2x.svg";
import hospital from "../../images/hospital-icon.svg";

import {AuthComponent, AuthPropsLoc, AuthState} from "../../api/auth";

import {Container, MenuItem} from "@mui/material";
import Loader from "react-loader-spinner";
import {withRouter} from "react-router";
import React from "react";
import {BigBlueButton} from "../Utils";
import CustomDatePicker from "./CustomDatePicker";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {toast} from "react-toastify";
import TextField from "@mui/material/TextField";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { formatISO, isSameDay } from "date-fns";


interface DetailsState extends AuthState
{
    id: number,
    model: DoctorObject,
    schedule: DoctorScheduleObject[],
    ready: boolean,
    open_availability: HTMLElement | null,
    popovertext: string,
    show_review: boolean,
    booking: boolean;
    slot: number | null;
    appointment_date: null | Date;
    patient: number | null;
    helped: Array<PatientObject>;
    open: boolean;
    self_booked: boolean
}

interface StatsProps
{
    value: number | string,
    title: string,
    icon: string,
    class: string
}

interface CommunicationProps
{
    phone_number: number,
    title: string,
    icon: string,
    text: string,
    class: string
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

class DoctorStats extends React.Component<StatsProps, Record<string, unknown>>
{
    render()
    {
        return (
            <div className="overlap-group mx-2">
                <div className={`group ${this.props.class}`}>
                    <img
                        alt={this.props.title}
                        className="icon-3"
                        src={this.props.icon}
                    />
                </div>
                <div className="stats-value nunito-semi-bold-ebony-clay-17px">
                    {this.props.value}
                </div>
                <div className="patients nunito-bold-lynch-12px">
                    {this.props.title}
                </div>
            </div>
        );
    }
}

class Communication extends React.Component<CommunicationProps, Record<string, unknown>>
{
    render()
    {
        return (
            <a style={{textDecoration: "none"}} href={`tel:${this.props.phone_number}`}>
                <div className="message">
                    <div className={`overlap-group-1 ${this.props.class}`}>
                        <img alt={""}
                            className="icon"
                            src={this.props.icon}
                        />
                    </div>
                    <div className="flex-col">

                        <div className="messaging nunito-bold-ebony-clay-16px">{this.props.title}</div>
                        <p className="chat-me-up-share-ph nunito-bold-lynch-12px">{this.props.text}</p>
                    </div>

                </div>
            </a>
        );
    }
}

class DoctorLoc extends AuthComponent<AuthPropsLoc, DetailsState>
{


    constructor(props: AuthPropsLoc)
    {
        super(props);
        this.state = {
            ...this.state,
            id: 0,
            ready: false,
            open_availability: null,
            popovertext: "Percentage Probability of Availing the services",
            show_review: false,
            // booking: false,
            patient: -1,
            // slot: {date: ""},
            // open: false,
        };
    }

    async refreshData()
    {
        this.setState({ready: false});

        const docId = Number(this.props.match.params.docId);
        const doctor = await Doctor.get(docId) as DoctorObject;
        const {results} = await Patient.action_general("help", {}, true);

        this.setState({model: doctor, ready: true, id: docId, helped: results, patient: this.state.user?.id || -1});

    }

    async componentDidMount()
    {
        super.componentDidMount();
        await this.refreshData();
    }

    // handleClose = () =>
    // {
    //     this.setState({open: false, });
    //     const path = "/";
    //     this.props.history.push(path);
    // };

    // async handleBooking()
    // {
    //     try
    //     {
    //         const slot = this.state.slot;
    //
    //         if(!slot?.date || !slot?.start || !slot?.end)
    //             throw new Error("Please select a slot");
    //
    //         // await Appointment.create({
    //         //     doctor: this.state.model.id,
    //         //     date: slot.date,
    //         //     start: slot.start,
    //         //     end: slot.end,
    //         //     patient: this.state.patient
    //         // });
    //         this.setState({open: true, });
    //
    //         this.setState({booking: false});
    //
    //         toast.success("Booking Success", {
    //             position: "bottom-center"
    //         });
    //     }
    //     catch (error)
    //     {
    //         const errorObj = error as {details: string, message: string};
    //
    //         toast.error(errorObj.details || errorObj.message, {
    //             position: "bottom-center"
    //         });
    //     }
    // }

    // pad = (no: number | string) => no > 9 ? no : `0${no}`;
    // toDjangoDate = (date: Date) => `${date.getFullYear()}-${this.pad(date.getMonth()+1)}-${this.pad(date.getDate())}`;
    //
    // slots = [{ date: "Mar 13 2022", start: "09:30:00 GMT+0530", end: "10:30:00 GMT+0530" }, { date: "Mar 14 2022", start: "10:30:00 GMT+0530", end: "11:30:00 GMT+0530" }, { date: "Mar 15 2022", start: "08:30:00 GMT+0530", end: "11:40:00 GMT+0530" }];
    // ranges = [{start: "Mar 13 2022", end: "Mar 15 2022" }];

    render()
    {
        const model = this.state.model;
        // console.log(model);
        return (
            this.state.ready ? 
                <>
                    {/*{!this.state.booking ? <>*/}
                    <div className="overlap-group4">
                        <div className="d-flex justify-content-between w-100 px-3 align-items-centre">
                            <ArrowBackIcon className="left-align" onClick={() => this.props.history.goBack()}/>
                            <img alt={""}
                                className="icon-2 mx-3"
                                src={icon}
                            />

                        </div>

                        <img alt={""}
                            className="image"
                            src={model.image ? model.image : image}
                        />

                        <div className="text-1 nunito-semi-bold-ebony-clay-20px">
                            {model.name}
                        </div>
                        <div className="viralogist nunito-semi-bold-lynch-14px">
                            {model.specialization}
                        </div>
                        <div className="flex-row-1">
                            <DoctorStats value={model.patients >= 1000 ? "1000+" : model.patients} title={"Patients"}
                                icon={icon2} class={"blue"}/>
                            <DoctorStats value={model.experience} title={"Experience"} icon={icon3} class={"red"}/>
                            <DoctorStats value={model.rating} title={"Rating"} icon={icon4} class={"yellow"}/>
                        </div>
                    </div>
                    <div className={"about"}>
                        <div className="about-doctor nunito-semi-bold-ebony-clay-18px">
                            {model.about}
                        </div>
                        <p className="dr-bellamy-nicholas nunito-bold-lynch-14px">
                            {model.name}
                        </p>
                    </div>
                    <div className={"about "}>
                        <div className="about-doctor nunito-semi-bold-ebony-clay-18px">Working Time</div>
                        <div className="dr-bellamy-nicholas nunito-bold-lynch-14px">
                            {model.working_time.map(({working_time, hospital}, i) => (
                                <p key={i}>
                                    {DAYS[working_time.day as number]} -
                                    {working_time.starting_time} to {working_time.ending_time} at
                                    {hospital}
                                </p>
                            )
                            )}
                        </div>
                    </div>
                    <div className="communication">
                        <div className="communication-1 nunito-semi-bold-ebony-clay-18px">Communication</div>
                        <Communication
                            class={"blue"}
                            phone_number={model.phone_number}
                            icon={icon5}
                            title={"Messaging"}
                            text={"Chat with your doctor."}/>
                        <Communication
                            class={"red"}
                            phone_number={model.phone_number}
                            icon={icon6}
                            title={"Audio Call"}
                            text={"Call your doctor directly."}/>
                        <Communication
                            class={"green"}
                            phone_number={model.phone_number}
                            icon={icon7}
                            title={"Video Call"}
                            text={"See your doctor live."}/>
                    </div>
                    {/*</>*/}
                    {/*    :*/}
                    {/*    <>*/}
                    {/*        <div className="pb-0 overlap-group4">*/}
                    {/*            <div className="d-flex justify-content-between w-100 px-3 align-items-centre">*/}
                    {/*                <ArrowBackIcon className="left-align" onClick={() => this.props.history.goBack()}/>*/}
                    {/*                <img alt={""}*/}
                    {/*                    className="icon-2 mx-3"*/}
                    {/*                    src={icon}*/}
                    {/*                />*/}

                    {/*            </div>*/}

                    {/*            <img alt={""}*/}
                    {/*                className="image"*/}
                    {/*                src={model.image ? model.image : image}*/}
                    {/*            />*/}

                    {/*            <div className="nunito-semi-bold-ebony-clay-20px">*/}
                    {/*                {model.name}*/}
                    {/*            </div>*/}
                    {/*            <div className="w-100 text-center nunito-bold-lynch-14px">*/}
                    {/*                Specialization: {model.specialization}*/}
                    {/*            </div>*/}
                    {/*            <div className="d-flex w-100 text-center nunito-semi-bold-lynch-14px align-items-center justify-content-center">*/}
                    {/*                <img className="mx-1" style={{height: ".8rem"}} src={hospital} alt="hospital"/>*/}
                    {/*                hospital name goes here*/}
                    {/*            </div>*/}
                    {/*            /!*<div className="flex-row-1">*!/*/}
                    {/*            /!*    <DoctorStats value={model.patients >= 1000 ? "1000+" : model.patients} title={"Patients"}*!/*/}
                    {/*            /!*                 icon={icon2} class={"blue"}/>*!/*/}
                    {/*            /!*    <DoctorStats value={model.experience} title={"Experience"} icon={icon3} class={"red"}/>*!/*/}
                    {/*            /!*    <DoctorStats value={model.rating} title={"Rating"} icon={icon4} class={"yellow"}/>*!/*/}
                    {/*            /!*</div>*!/*/}
                    {/*        </div>*/}

                    {/*        <CustomDatePicker*/}
                    {/*            ranges={this.ranges && this.ranges.map(({start, end}) => ({start: new Date(start), end: new Date(end)}))}*/}
                    {/*            onChange={(date) => date && this.setState({slot: {date: this.toDjangoDate(date)}})}/>*/}
                    {/*        <Typography variant={"h6"}>Available Time</Typography>*/}
                    {/*        */}
                    {/*        /!*<CustomDatePicker*!/*/}
                    {/*        /!*    ranges={model.ranges && model.ranges.map(({start, end}) => ({start: new Date(start), end: new Date(end)}))}*!/*/}
                    {/*        /!*    onChange={(date) => date && this.setState({slot: {date: this.toDjangoDate(date)}})}/>*!/*/}
                    {/*        /!*<Typography variant={"h6"}>Available Time</Typography>*!/*/}
                    {/*        <Container>*/}

                    {/*            <div className="row d-flex justify-content-center">*/}
                    {/*                {this.slots && this.slots.map((slot, i) =>*/}
                    {/*                    <Chip  className="col-4 m-1" key={i}*/}
                    {/*                        label={`${slot.start.slice(0, 5)} - ${slot.end.slice(0, 5)}`}*/}
                    {/*                        variant="filled"*/}
                    {/*                        color={this.state.slot === slot ? "primary" : "default"}*/}
                    {/*                        onClick={() => this.setState({slot: slot})} />*/}
                    {/*                )}*/}
                    {/*            </div>*/}
                    {/*            */}
                    {/*            /!*<div className="row d-flex justify-content-center">*!/*/}
                    {/*            /!*    {model.slots && model.slots.filter(({date}) => this.state.slot.date === date).map((slot, i) =>*!/*/}
                    {/*            /!*        <Chip  className="col-4 m-1" key={i}*!/*/}
                    {/*            /!*            label={`${slot.start.slice(0, 5)} - ${slot.end.slice(0, 5)}`}*!/*/}
                    {/*            /!*            variant="filled"*!/*/}
                    {/*            /!*            color={this.state.slot === slot ? "primary" : "default"}*!/*/}
                    {/*            /!*            onClick={() => this.setState({slot: slot})} />*!/*/}
                    {/*            /!*    )}*!/*/}
                    {/*            /!*</div>*!/*/}
                    {/*            <TextField*/}
                    {/*                style={{marginTop: "1rem"}}*/}
                    {/*                id="outlined-select-currency"*/}
                    {/*                select*/}
                    {/*                label="Patient"*/}
                    {/*                value={this.state.patient}*/}
                    {/*                onChange={(e) => this.setState({patient: Number(e.target.value)})}*/}
                    {/*                fullWidth*/}
                    {/*            >*/}
                    {/*                <MenuItem value={this.state.user?.id}> Self </MenuItem>*/}
                    {/*                {this.state.helped.map(({uid, Name}, i) => (*/}
                    {/*                    <MenuItem key={i} value={uid}>*/}
                    {/*                        {Name}*/}
                    {/*                    </MenuItem>*/}
                    {/*                ))}*/}
                    {/*            </TextField>*/}
                    {/*        </Container>*/}
                    {/*    </>*/}
                    {/*}*/}
                    {/*<Container className="pb-5">*/}
                    {/*    <BigBlueButton text={!this.state.booking ? "Book Appointment" : "Confirm Booking"}*/}
                    {/*        onClick={() => !this.state.booking ? this.setState({booking: true}) : this.handleBooking()}/>*/}
                    {/*</Container>*/}

                    {/*<Dialog*/}
                    {/*    open={this.state.open}*/}
                    {/*    onClose={this.handleClose}*/}
                    {/*    aria-labelledby="alert-dialog-title"*/}
                    {/*    aria-describedby="alert-dialog-description"*/}
                    {/*>*/}
                    {/*    <DialogTitle id="alert-dialog-title">*/}
                    {/*        {"Booking Success"}*/}
                    {/*    </DialogTitle>*/}
                    {/*    <DialogContent>*/}
                    {/*        <DialogContentText id="alert-dialog-description">*/}
                    {/*            Successfully completed your slot booking. You have booked for 14/03/2022 9:30*/}
                    {/*        </DialogContentText>*/}
                    {/*    </DialogContent>*/}
                    {/*    <DialogActions>*/}
                    {/*        <Button onClick={this.handleClose}>*/}
                    {/*            See Bookings*/}
                    {/*        </Button>*/}
                    {/*        <Button onClick={this.handleClose}>*/}
                    {/*            Done*/}
                    {/*        </Button>*/}
                    {/*    </DialogActions>*/}
                    {/*</Dialog>*/}

                </>:
                <Container className="my-5 py-5 ">
                    <Loader type="Bars" color="#3a77ff" height={50} width={50}/>
                </Container>


        );
    }

}

class BookLoc extends AuthComponent<AuthPropsLoc, DetailsState>
{


    constructor(props: AuthPropsLoc)
    {
        super(props);
        this.state = {
            ...this.state,
            id: 0,
            ready: false,
            open_availability: null,
            popovertext: "Percentage Probability of Availing the services",
            show_review: false,
            // booking: false,
            patient: null,
            slot: null,
            appointment_date:null,
            open: false,
            self_booked: false,
        };
    }

    async refreshData()
    {
        this.setState({ready: false});

        const docId = Number(this.props.match.params.docId);
        const doctor = await Doctor.get(docId) as DoctorObject;
        const schedule = await (await DoctorSchedule.filter({doctor__exact:docId, date__gte:formatISO(new Date(), {representation:"date"})}, true)).results.map((obj:any)=>obj.data) as DoctorScheduleObject[];
        const {results} = await Patient.action_general("help", {}, true);
        const appointments = await (await Appointment.filter({day__doctor:this.props.match.params.docId}, true)).results;
        
        this.setState({model: doctor, ready: true, id: docId, helped: results, self_booked: !!appointments.length, schedule});

    }


    async componentDidMount()
    {
        super.componentDidMount();
        await this.refreshData();
    }

    handleClose = () =>
    {
        this.setState({open: false, });
        const path = "/";
        this.props.history.push(path);
    };

    async handleBooking()
    {
        try
        {
            const slot = this.state.slot;

            if(!slot)
                throw new Error("No slot");
            await Appointment.create({id:slot, patient: this.state.patient});
            this.setState({open: true, });

            this.setState({booking: false});

            toast.success("Booking Success", {
                position: "bottom-center"
            });
        }
        catch (error)
        {
            const errorObj = error as {details: string, message: string};

            toast.error(errorObj.details || errorObj.message, {
                position: "bottom-center"
            });
        }
    }

    pad = (no: number | string) => no > 9 ? no : `0${no}`;
    toDjangoDate = (date: Date) => `${date.getFullYear()}-${this.pad(date.getMonth()+1)}-${this.pad(date.getDate())}`;

    // slots = [{ date: "Mar 28 2022", start: "09:30:00 GMT+0530", end: "10:30:00 GMT+0530" }, { date: "Mar 29 2022", start: "10:30:00 GMT+0530", end: "11:30:00 GMT+0530" }, { date: "Mar 30 2022", start: "08:30:00 GMT+0530", end: "11:40:00 GMT+0530" }];
    // ranges = [{start: "Mar 28 2022", end: "Mar 30 2022" }];

    render()
    {
        const model = this.state.model;
        return (
            this.state.ready ?
                <>
                    {/*{!this.state.booking ? <>*/}
                    {/*    <div className="overlap-group4">*/}
                    {/*        <div className="d-flex justify-content-between w-100 px-3 align-items-centre">*/}
                    {/*            <ArrowBackIcon className="left-align" onClick={() => this.props.history.goBack()}/>*/}
                    {/*            <img alt={""}*/}
                    {/*                className="icon-2 mx-3"*/}
                    {/*                src={icon}*/}
                    {/*            />*/}

                    {/*        </div>*/}

                    {/*        <img alt={""}*/}
                    {/*            className="image"*/}
                    {/*            src={model.image ? model.image : image}*/}
                    {/*        />*/}

                    {/*        <div className="text-1 nunito-semi-bold-ebony-clay-20px">*/}
                    {/*            {model.name}*/}
                    {/*        </div>*/}
                    {/*        <div className="viralogist nunito-semi-bold-lynch-14px">*/}
                    {/*            {model.specialization}*/}
                    {/*        </div>*/}
                    {/*        <div className="flex-row-1">*/}
                    {/*            <DoctorStats value={model.patients >= 1000 ? "1000+" : model.patients} title={"Patients"}*/}
                    {/*                icon={icon2} class={"blue"}/>*/}
                    {/*            <DoctorStats value={model.experience} title={"Experience"} icon={icon3} class={"red"}/>*/}
                    {/*            <DoctorStats value={model.rating} title={"Rating"} icon={icon4} class={"yellow"}/>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className={"about"}>*/}
                    {/*        <div className="about-doctor nunito-semi-bold-ebony-clay-18px">*/}
                    {/*            {model.about}*/}
                    {/*        </div>*/}
                    {/*        <p className="dr-bellamy-nicholas nunito-bold-lynch-14px">*/}
                    {/*            {model.name}*/}
                    {/*        </p>*/}
                    {/*    </div>*/}
                    {/*    <div className={"about "}>*/}
                    {/*        <div className="about-doctor nunito-semi-bold-ebony-clay-18px">Working Time</div>*/}
                    {/*        <div className="dr-bellamy-nicholas nunito-bold-lynch-14px">*/}
                    {/*            {model.working_time.map(({working_time, hospital}, i) => (*/}
                    {/*                <p key={i}>*/}
                    {/*                    {DAYS[working_time.day as number]} -*/}
                    {/*                    {working_time.starting_time} to {working_time.ending_time} at*/}
                    {/*                    {hospital}*/}
                    {/*                </p>*/}
                    {/*            )*/}
                    {/*            )}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className="communication">*/}
                    {/*        <div className="communication-1 nunito-semi-bold-ebony-clay-18px">Communication</div>*/}
                    {/*        <Communication*/}
                    {/*            class={"blue"}*/}
                    {/*            phone_number={model.phone_number}*/}
                    {/*            icon={icon5}*/}
                    {/*            title={"Messaging"}*/}
                    {/*            text={"Chat with your doctor."}/>*/}
                    {/*        <Communication*/}
                    {/*            class={"red"}*/}
                    {/*            phone_number={model.phone_number}*/}
                    {/*            icon={icon6}*/}
                    {/*            title={"Audio Call"}*/}
                    {/*            text={"Call your doctor directly."}/>*/}
                    {/*        <Communication*/}
                    {/*            class={"green"}*/}
                    {/*            phone_number={model.phone_number}*/}
                    {/*            icon={icon7}*/}
                    {/*            title={"Video Call"}*/}
                    {/*            text={"See your doctor live."}/>*/}
                    {/*    </div>*/}
                    {/*</>*/}
                    {/*    :*/}
                    {/*    <>*/}
                    <div className="pb-0 overlap-group4">
                        <div className="d-flex justify-content-between w-100 px-3 align-items-centre">
                            <ArrowBackIcon className="left-align" onClick={() => this.props.history.goBack()}/>
                            <img alt={""}
                                className="icon-2 mx-3"
                                src={icon}
                            />

                        </div>

                        <img alt={""}
                            className="image"
                            src={model.image ? model.image : image}
                        />

                        <div className="nunito-semi-bold-ebony-clay-20px">
                            {model.name}
                        </div>
                        <div className="w-100 text-center nunito-bold-lynch-14px">
                                    Specialization: {model.specialization}
                        </div>
                        <div className="d-flex w-100 text-center nunito-semi-bold-lynch-14px align-items-center justify-content-center">
                            <img className="mx-1" style={{height: ".8rem"}} src={hospital} alt="hospital"/>
                                    hospital name goes here
                        </div>
                        {/*<div className="flex-row-1">*/}
                        {/*    <DoctorStats value={model.patients >= 1000 ? "1000+" : model.patients} title={"Patients"}*/}
                        {/*                 icon={icon2} class={"blue"}/>*/}
                        {/*    <DoctorStats value={model.experience} title={"Experience"} icon={icon3} class={"red"}/>*/}
                        {/*    <DoctorStats value={model.rating} title={"Rating"} icon={icon4} class={"yellow"}/>*/}
                        {/*</div>*/}
                    </div>

                    {/*<CustomDatePicker*/}
                    {/*    ranges={this.ranges && this.ranges.map(({start, end}) => ({start: new Date(start), end: new Date(end)}))}*/}
                    {/*    onChange={(date) => date && this.setState({slot: {date: this.toDjangoDate(date)}})}/>*/}
                    {/*<Typography variant={"h6"}>Available Time</Typography>*/}

                    <CustomDatePicker
                        days={this.state.schedule.map(schedule=>({day:new Date(schedule.date).setHours(0, 0, 0, 0), varient:Math.floor(schedule.stats.available*2/schedule.stats.total) as 0 | 1 | 2}))}
                        onChange={(date) => 
                        {
                            date && this.setState({appointment_date: date});this.setState({slot:null});
                        }}/>
                    <Typography variant={"h6"}>Available Time</Typography>
                    <Container>

                        <div className="row d-flex justify-content-center">
                            {this.state.appointment_date && this.state.schedule.find(sch => isSameDay(new Date(sch.date), this.state.appointment_date!))?.slots.map((slot, i) =>
                                <Chip  className="col-4 m-1" key={i}
                                    label={`${slot.start.slice(0, 5)} - ${slot.end.slice(0, 5)}`}
                                    variant="filled"
                                    disabled={slot.booked}
                                    color={this.state.slot === slot.id ? "primary" : "default"}
                                    onClick={() => this.setState({slot: slot.id})} />
                            )}
                        </div> 

                        <div className="row d-flex justify-content-center">
                            {/* {model.schedule && model.schedule.filter(({date}) => this.state.appointment_date === date)[0]?.slots.map((slot, i) =>
                                <Chip  className="col-4 m-1" key={i}
                                    label={`${slot.start.slice(0, 5)} - ${slot.end.slice(0, 5)}`}
                                    variant="filled"
                                    color={this.state.slot === slot ? "primary" : "default"}
                                    onClick={() => this.setState({slot: slot})} />
                            )} */}
                        </div>
                        <TextField
                            style={{marginTop: "1rem"}}
                            id="outlined-select-currency"
                            select
                            label="Patient"
                            value={this.state.patient}
                            onChange={(e) => this.setState({patient: Number(e.target.value)})}
                            fullWidth
                        >
                            <MenuItem disabled={this.state.self_booked} value={this.state.user?.id}> { `Self ${this.state.self_booked?"(Already booked)":""}` }</MenuItem>
                            {this.state.helped.map(({uid, Name}, i) => (
                                <MenuItem key={i} value={uid}>
                                    {Name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Container>
                    {/*    </>*/}
                    {/*}*/}
                    {/*<Container className="pb-5">*/}
                    {/*    <BigBlueButton text={!this.state.booking ? "Book Appointment" : "Confirm Booking"}*/}
                    {/*        onClick={() => !this.state.booking ? this.setState({booking: true}) : this.handleBooking()}/>*/}
                    {/*</Container>*/}

                    <Container className="pb-5">
                        <BigBlueButton disabled={!this.state.slot || !this.state.patient} text={"Confirm Booking"}
                            onClick={() => this.handleBooking()}/>
                    </Container>

                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Booking Success"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Successfully completed your slot booking.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            {/*<Button onClick={this.handleClose}>*/}
                            {/*    See Bookings*/}
                            {/*</Button>*/}
                            <Button onClick={this.handleClose}>
                                Done
                            </Button>
                        </DialogActions>
                    </Dialog>

                </>:
                <Container className="my-5 py-5 ">
                    <Loader type="Bars" color="#3a77ff" height={50} width={50}/>
                </Container>


        );
    }

}


export const DoctorComponent = withRouter(DoctorLoc);
export const BookingComponent = withRouter(BookLoc);
