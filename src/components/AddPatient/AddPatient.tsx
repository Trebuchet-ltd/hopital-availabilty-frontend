import { Patient, PatientObject} from "../../api/model";
import {AuthComponent, AuthState} from "../../api/auth";
import {RouteComponentProps, withRouter} from "react-router";
import {ResponsiveProps} from "../ResponsiveComponent";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Chip,  ListItem, TextField} from "@mui/material";
import './AddPatient.css'
import close from "../../images/close.svg";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from '@mui/material/Checkbox';
import lineicon from "../../images/LineCenter.svg"
import {toast} from "react-toastify";


interface AddPatientState extends AuthState {
    model: PatientObject;
    activeStep: number;
    skipped: number;
    avail_attender: boolean;
    avail_hospital: boolean;
    Name: string;
    age: number;
    gender: string;
    address: string;
    symptoms: string;
    covidresult: boolean;
    gender_name: string;
    symdays: string;
    spo2: number;
    bedtype_name: number;
    blood: string;
    ct: boolean;
    ctscore: string;
    oxy_bed: boolean;
    attendername: string;
    attenderphone: string;
    relation: string;
    hospitalpref: string;
    srfid: string;
    bunum: string;


}


export interface AuthPropsLoc extends RouteComponentProps<ResponsiveProps> {

}

export class AddPatient extends AuthComponent<AuthPropsLoc, AddPatientState> {

    constructor(props: AuthPropsLoc) {
        super(props);
        this.state = {
            ...this.state,
            activeStep: 0,
            avail_attender: false,
            avail_hospital: false,
            symptoms:'',


        }


    }


    styles = [{
        background: "linear-gradient(180deg, #0338B9 0%, #3E64FF 100%)",
        color: "white",
        margin: 0,
        fontSize: '12px',
        borderRadius: '10px'
    }, {background: "#F0F0F0", margin: 0, fontSize: '12px', borderRadius: '10px'}]
    tabs = ['Patient Info', 'Symptoms', 'Test Info', 'Attender', 'Hospital']
    steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];
    bloodgroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];


    form = () => {
        if (this.state.activeStep === 0) {
            return (

                <div className="m-4">
                    <p className="mainhead">Enter Patient information</p>

                    <TextField value={this.state.Name} className="mt-2" fullWidth variant="outlined" label="Patient Name *"
                               InputLabelProps={{shrink: true,}} size="small"
                               onChange={({target}) => this.setState({Name: target.value})}
                    />


                    <TextField value={this.state.age} className="mt-4" fullWidth variant="outlined" label="Age *"
                               InputLabelProps={{shrink: true,}} size="small"
                               onChange={({target}) => this.setState({age: Number(target.value)})}
                    />
                    <TextField value={this.state.gender} className="mt-4" fullWidth variant="outlined" select label="Gender *"
                               InputLabelProps={{shrink: true,}} size="small"

                               onChange={({target}) => this.setState({gender: target.value})}
                    >
                        <MenuItem value={"M"}>Male</MenuItem>
                        <MenuItem value={"F"}>Female</MenuItem>
                        <MenuItem value={"NB"}>Non Binary</MenuItem>
                        <MenuItem value={"NP"}>Prefer Not to Say</MenuItem>
                    </TextField>
                    <TextField value={this.state.address} className="mt-4" fullWidth variant="outlined" label="Address *"
                               InputLabelProps={{shrink: true,}} size="small"
                               onChange={({target}) => this.setState({address: target.value})}
                    />
                </div>
            )
        } else if (this.state.activeStep === 1) {
            return (
                <div className="m-4">

                    <p className="mainhead">Tell us about your Medical condition</p>

                    <TextField value={this.state.symptoms} className="mt-2" fullWidth variant="outlined"
                               label="Symptoms *"
                               InputLabelProps={{shrink: true,}} size="small"
                               onChange={({target}) => this.setState({symptoms: target.value})}
                    />
                    <TextField value={this.state.symdays} type="date" className="mt-4" fullWidth variant="outlined" label="Symptoms Start Date *"
                               InputLabelProps={{shrink: true,}} size="small"
                               onChange={({target}) => this.setState({symdays: target.value})}
                    />

                    <TextField value={this.state.spo2} className="mt-4" fullWidth variant="outlined" label="Blood oxygen level *"
                               InputLabelProps={{shrink: true,}} size="small"
                               onChange={({target}) => this.setState({spo2: Number(target.value)})}

                    />
                    <p className="helper">if available</p>
                    <TextField value={this.state.oxy_bed} className="mt-4 " fullWidth variant="outlined" select
                               label="Is the patient on oxygen support *"
                               InputLabelProps={{shrink: true,}} size="small"

                               onChange={({target}) => this.setState({oxy_bed: Boolean(target.value)})}
                    >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                    </TextField>
                    <TextField value={this.state.bedtype_name} className="mt-4" fullWidth variant="outlined" select label="Required bed type *"
                               InputLabelProps={{shrink: true,}} size="small"

                               onChange={({target}) => this.setState({bedtype_name: Number(target.value)})}
                    >
                        <MenuItem value={1}>Normal</MenuItem>
                        <MenuItem value={2}>Ventilator</MenuItem>
                        <MenuItem value={3}>ICU</MenuItem>
                    </TextField>

                </div>

            )
        } else if (this.state.activeStep === 2) {
            return (
                <div className="m-4">
                    <p className="mainhead">Please add tests information</p>

                    <TextField value={this.state.blood} className="mt-4" fullWidth variant="outlined" select label="Patient blood group *"
                               InputLabelProps={{shrink: true,}} size="small"

                               onChange={({target}) => this.setState({blood: target.value})}
                    >

                        {this.bloodgroups.map((value => (
                            <MenuItem value={value}>{value}</MenuItem>
                        )))

                        }
                    </TextField>
                    <TextField value={this.state.covidresult} className="mt-4" fullWidth variant="outlined" select label="Covid result *"
                               InputLabelProps={{shrink: true,}} size="small"

                               onChange={({target}) => this.setState({covidresult: Boolean(target.value)})}
                    >
                        <MenuItem value={1}>Possitive</MenuItem>
                        <MenuItem value={0}>Negative</MenuItem>
                    </TextField>
                    <TextField value={this.state.ct} className="mt-4" fullWidth variant="outlined" select label="Was a CT scan done ? *"
                               InputLabelProps={{shrink: true,}} size="small"

                               onChange={({target}) => this.setState({ct: Boolean(target.value)})}
                    >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                    </TextField>

                    <TextField value={this.state.ctscore} className="mt-4" fullWidth variant="outlined" label="If Yes, Please enter the CT score"
                               InputLabelProps={{shrink: true,}} size="small"
                               onChange={({target}) => this.setState({ctscore: target.value})}
                    />
                </div>

            )
        } else if (this.state.activeStep === 3) {
            return (<div className="m-4">
                    <div className=" d-flex justify-content-between align-items-centre">
                        <p className="mainhead">Is there an attender</p>
                        <Checkbox className="pb-3" checked={this.state.avail_attender} onClick={() => {
                            this.setState({avail_attender: !this.state.avail_attender})
                        }} size="small"/>
                    </div>
                    {this.state.avail_attender ? (
                        <div>
                            <TextField value={this.state.attendername} className="mt-4" fullWidth variant="outlined" label="Attender Name *"
                                       InputLabelProps={{shrink: true,}} size="small"

                                       onChange={({target}) => this.setState({attendername: target.value})}
                            />
                            <TextField value={this.state.attenderphone} className="mt-4" fullWidth variant="outlined" label="Attender Phone number"
                                       InputLabelProps={{shrink: true,}} size="small"

                                       onChange={({target}) => this.setState({attenderphone: target.value})}
                            />

                            <TextField value={this.state.relation} className="mt-4" fullWidth variant="outlined" label="Relation with the patient*"
                                       InputLabelProps={{shrink: true,}} size="small"
                                       onChange={({target}) => this.setState({relation: target.value})}
                            />
                        </div>) : null}

                </div>

            )

        } else if (this.state.activeStep === 4) {
            return (
                <div className="m-4">
                    <div className=" d-flex justify-content-between align-items-centre">
                        <p className="mainhead">Was the patient taken to a hospital?</p>
                        <Checkbox checked={this.state.avail_hospital} onClick={() => {
                            this.setState({avail_hospital: !this.state.avail_hospital})
                        }} size="small"/>
                    </div>
                    {this.state.avail_hospital ? (
                        <div>
                            <TextField value={this.state.hospitalpref} className="mt-4" fullWidth variant="outlined" label="Previous hospital name *"
                                       InputLabelProps={{shrink: true,}} size="small"

                                       onChange={({target}) => this.setState({hospitalpref: target.value})}
                            />

                            <TextField value={this.state.srfid} className="mt-4" fullWidth variant="outlined" label="SRF ID*"
                                       InputLabelProps={{shrink: true,}} size="small"

                                       onChange={({target}) => this.setState({srfid: target.value})}
                            />

                            <TextField value={this.state.bunum} className="mt-4" fullWidth variant="outlined" label="BU Number*"
                                       InputLabelProps={{shrink: true,}} size="small"
                                       onChange={({target}) => this.setState({bunum: target.value})}
                            />
                        </div>) : null}

                </div>

            )
        }


    }


    handleNext = () => {
        if (this.tabs.length - 1) {
            this.setState({
                activeStep: this.state.activeStep + 1
            })
        }

    }

    handleBack = () => {
        this.setState({
            activeStep: this.state.activeStep - 1
        })
    };

    savePatient = async () => {
        console.log(this.state)
        const toSend = this.state;

        toSend.user = null;


        if (this.state.Name && this.state.gender && this.state.symptoms)
            Patient.create({...toSend,})
                .then(() => {
                    this.props.history.push(`/`)
                    toast.success('Successfully added your details', {
                        position: 'bottom-center'
                    })
                }).catch((error) => {
                toast.error(error.details, {
                    position: 'bottom-center'
                })
            })
        else
            toast.error("please enter the required details", {
                position: 'bottom-center'
            })
    }


    render() {
        if (!this.state.auth) {
            this.performAuth()
            return (<></>)
        } else {
            console.log(this.state)
            return (
                <div className="d-flex flex-column justify-content-between">
                    <Box className='mb-auto px-2' sx={{width: '100%'}}>

                        <div className="head-sec d-flex justify-content-between p-3 shadow-none h-25">
                            <img src={close} onClick={() => this.props.history.goBack()} alt={"close"}/>
                            <p className="align-self-center m-0 p-0 justify-content-center"><b>Add Medical Details</b>
                            </p>
                            {this.state.activeStep === 4 ? (
                                <Button onClick={this.savePatient} className="sub"
                                        variant="contained">Submit</Button>) : (
                                <Button disabled sx={{borderRadius: '10px', background: '#F0F0F0'}}
                                        variant="contained">Submit</Button>)}

                        </div>

                        <ListItem className='wholetab'
                                  value={this.state.activeStep}
                        >

                            {
                                this.tabs.map((label, index) => (
                                    <div className="d-flex">{
                                        index !== 0 && index !== this.state.activeStep && index !== this.state.activeStep + 1 ?
                                            <img src={lineicon} alt=''/> : null
                                    }

                                        <Chip size='small' className='' label={label}
                                              sx={this.styles[this.state.activeStep === index ? 0 : 1]}/>
                                    </div>
                                ))
                            }

                        </ListItem>

                        {
                            this.form()
                        }


                        {this.state.activeStep === this.tabs.length ? null : (
                            <React.Fragment>

                                <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                                    <Button
                                        color="inherit"
                                        disabled={this.state.activeStep === 0}
                                        onClick={this.handleBack}
                                        sx={{
                                            borderRadius: '10px', background: '#F0F0F0',
                                            marginLeft: '1.25rem',
                                            textTransform: 'none',
                                        }}
                                    >
                                        Prev
                                    </Button>
                                    <Box sx={{flex: '1 1 auto'}}/>
                                    {this.state.activeStep !== this.tabs.length - 1 ? (<Button className="nxtbutton"
                                                                                               sx={{
                                                                                                   color: "white",
                                                                                                   marginRight: "1.25rem",
                                                                                                   textTransform: 'none'
                                                                                               }}
                                                                                               onClick={this.handleNext}>
                                        Next
                                    </Button>) : null

                                    }

                                </Box>

                            </React.Fragment>
                        )}


                    </Box>
                    <div className="text-center">
                        <p className="manmsg">All * are mandatory, we’ll help you connect with a Doctor soon</p>
                    </div>

                </div>


            )
        }
    }
}

export const Addpatient = withRouter(AddPatient)