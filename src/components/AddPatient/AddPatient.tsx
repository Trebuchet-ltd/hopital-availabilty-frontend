import { Patient, PatientObject } from "../../api/model";
import { AuthComponent, AuthState } from "../../api/auth";
import { RouteComponentProps, withRouter } from "react-router";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
    Chip,
    ListItem,
    TextField,
    Container,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl
} from "@mui/material";
import "./AddPatient.css";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import lineicon from "../../images/LineCenter.svg";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";


interface AddPatientState extends AuthState {
    model: PatientObject;
    activeStep: number;
    avail_attender: boolean;
    avail_hospital: boolean; 
    otherLabel: string;
    requirementCheck: boolean;
    gender_name: string;
    skipped: number;

    public: boolean;
    Name: string;
    age: number;
    gender: string;
    requirement: string;
    otherRequirement: string;
    address: string;
    symptoms: string;
    covidresult?: number;
    symdays: string;
    spo2?: number;
    bedtype: number;
    blood: string;
    ct?: number;
    ctscore: string;
    oxy_bed?: number;
    attendername: string;
    attenderphone: string;
    relation: string;
    hospitalpref: string;
    srfid: string;
    bunum: string;
    request_type: string;
    mobile_number: string;
}


export type AuthPropsLoc = RouteComponentProps<Record<string, string | undefined>>

const Symptoms = ["Fever", "Cough", "Running nose", "Headache", "Nausea / Vomiting",
    "Diarrhea / Stomach upset", "Constipation", "Urine color", "Joint pain", "Body pain",
    "Fatigue / Weakness", "Inflammation / swelling", "Rashes / Itching", "Sleeplessness",
    "No appetite", "Sweating", "Chills / shivering", "Anaemia", "Irregular Periods",
    "Bleeding", "Asthma", "Breathing Difficulty" ];

export class AddPatient extends AuthComponent<AuthPropsLoc, AddPatientState>
{

    constructor(props: AuthPropsLoc) 
    {
        super(props);
        this.state = {
            ...this.state,
            activeStep: 0,
            avail_attender: false,
            avail_hospital: false,
            Name: "",
            public: false,
            gender: "",
            address: "",
            requirement: "",
            requirementCheck: false,
            otherRequirement: "",
            otherLabel: "",

            symptoms: "",
            symdays: new Date().toISOString().substring(0, 10),
            spo2: undefined,
            oxy_bed: undefined,
            bedtype: 1,


            blood: "",
            ct: undefined,
            covidresult: undefined,
            ctscore: "",



            attendername: "",
            attenderphone: "",
            relation: "",


            hospitalpref: "",
            srfid: "",
            bunum: "",

            mobile_number: "",
            request_type:"M"
        };


    }


    styles = [{
        background: "linear-gradient(180deg, #0338B9 0%, #3E64FF 100%)",
        color: "white",
        margin: 0,
        fontSize: "12px",
        borderRadius: "10px"
    }, { background: "#F0F0F0", margin: 0, fontSize: "12px", borderRadius: "10px" }];
    tabs = ["Patient Info", "Symptoms", "Test Info", "Attender", "Hospital"];
    steps = ["Select campaign settings", "Create an ad group", "Create an ad"];
    bloodgroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    requirements = ["ICU", "Oxygen", "Medicine", "Scan", "General Ward", "Medical Test", "Other"];


    form = () => 
    {
        const handleRequirement = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => 
        {

            this.setValue("requirement", event);
            if (event.target.value === "Other") 
            {
                this.setState({ otherLabel: "Enter Your Requirement" });
                this.setState({ requirementCheck: true });
            }
            else if (event.target.value === "Medicine") 
            {
                this.setState({ otherLabel: "Enter Medicine Name/Type" });
                this.setState({ requirementCheck: true });
            }
            else if (event.target.value === "Scan") 
            {
                this.setState({ otherLabel: "Enter Type Of Scan" });
                this.setState({ requirementCheck: true });
            }
            else if (event.target.value === "Medical Test") 
            {
                this.setState({ otherLabel: "Enter Type Of Test" });
                this.setState({ requirementCheck: true });
            }
            else

                this.setState({ requirementCheck: false });

        };
        if (this.state.activeStep === 0)

            return (

                <div className="m-4">
                    <p className="mainhead">Enter Patient information</p>

                    <TextField value={this.state.Name} className="mt-2" fullWidth variant="outlined" label="Patient Name *"
                        InputLabelProps={{ shrink: true, }} size="small"
                        onChange={(event) =>
                            this.setValue("Name", event)}
                    />


                    <TextField type="number" value={this.state.age} className="mt-4" fullWidth variant="outlined" label="Age *"
                        InputLabelProps={{ shrink: true, }} size="small"
                        onChange={(event) =>
                            this.setValue("age", event)}
                    />
                    <TextField value={this.state.mobile_number} className="mt-2" fullWidth variant="outlined" label="Mobile no. *"
                        InputLabelProps={{ shrink: true, }} size="small"
                        onChange={(event) =>
                            this.setValue("mobile_number", event)}
                    />
                    <TextField value={this.state.gender} className="mt-4" fullWidth variant="outlined" select label="Gender *"
                        InputLabelProps={{ shrink: true, }} size="small"
                        onChange={(event) =>
                            this.setValue("gender", event)}
                    >
                        <MenuItem value={"M"}>Male</MenuItem>
                        <MenuItem value={"F"}>Female</MenuItem>
                        <MenuItem value={"NB"}>Non Binary</MenuItem>
                        <MenuItem value={"NP"}>Prefer Not to Say</MenuItem>
                    </TextField>
                    <TextField value={this.state.address} className="mt-4" fullWidth variant="outlined" label="Address *"
                        InputLabelProps={{ shrink: true, }} size="small"
                        onChange={({ target }) => this.setState({ address: target.value })}
                    />
                    <TextField value={this.state.requirement} className="mt-4" fullWidth variant="outlined" select label="Requirement *"
                        InputLabelProps={{ shrink: true, }} size="small"

                        onChange={handleRequirement}
                    >
                        {this.requirements.map((value, key) => (
                            <MenuItem key={key} value={value}>{value}</MenuItem>
                        ))}
                    </TextField>

                    {this.state.requirementCheck &&
                        <TextField value={this.state.otherRequirement} className="mt-4" fullWidth variant="outlined" label={this.state.otherLabel}
                            InputLabelProps={{ shrink: true, }} size="small"
                            onChange={(event) =>
                                this.setState({ otherRequirement: event.target.value })} />}
                    <FormControl sx={{ textAlign: "left", width: "100%" }} className="mt-4">
                        <FormLabel id="demo-controlled-radio-buttons-group">Do you wish to make your request public?</FormLabel>
                        <RadioGroup
                            value={this.state.public}
                            onChange={(event) =>
                                event.target.value === "true" ? this.setState({ public: true }) : this.setState({ public: false })}>

                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>

                </div>
            );

        else if (this.state.activeStep === 1)

            return (
                <div className="m-4">

                    <p className="mainhead">Tell us about your Medical condition</p>
                    <Autocomplete style={{width: "100%"}}
                        fullWidth={true}
                        disablePortal
                        autoComplete
                        freeSolo
                        limitTags={2}
                        size="small"
                        multiple={true}
                        id="combo-box-demo"
                        options={Symptoms}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField fullWidth={true} {...params} value={this.state.symptoms}
                            label="Symptoms *"
                            InputLabelProps={{ shrink: true, }}
                            onChange={(event) =>
                                this.setValue("symptoms", event)}
                        />}
                    />
                    <TextField value={this.state.symdays} type="date" className="mt-4" fullWidth variant="outlined" label="Symptoms Start Date *"
                        InputLabelProps={{ shrink: true, }} size="small"
                        onChange={(event) =>
                            this.setValue("symdays", event)}
                    />

                    <TextField type="number" value={this.state.spo2} className="mt-4" fullWidth variant="outlined" label="Blood oxygen level *"
                        InputLabelProps={{ shrink: true, }} size="small"
                        onChange={(event) =>
                            this.setValue("spo2", event)}

                    />
                    <p className="helper">if available</p>
                    <TextField value={this.state.oxy_bed} className="mt-4 " fullWidth variant="outlined" select
                        label="Is the patient on oxygen support *"
                        InputLabelProps={{ shrink: true, }} size="small"

                        onChange={(event) =>
                            this.setValue("oxy_bed", event)}>

                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                    </TextField>
                    <TextField value={this.state.bedtype} className="mt-4" fullWidth variant="outlined" select label="Required bed type *"
                        InputLabelProps={{ shrink: true, }} size="small"

                        onChange={({ target }) => this.setState({ bedtype: Number(target.value) })}
                    >
                        <MenuItem value={1}>Normal</MenuItem>
                        <MenuItem value={2}>Ventilator</MenuItem>
                        <MenuItem value={3}>ICU</MenuItem>
                    </TextField>

                </div>

            );

        else if (this.state.activeStep === 2)

            return (
                <div className="m-4">
                    <p className="mainhead">Please add tests information</p>

                    <TextField value={this.state.blood} className="mt-4" fullWidth variant="outlined" select label="Patient blood group *"
                        InputLabelProps={{ shrink: true, }} size="small"

                        onChange={(event) =>
                            this.setValue("blood", event)}
                    >

                        {this.bloodgroups.map((value, key) => (
                            <MenuItem key={key} value={value}>{value}</MenuItem>
                        ))

                        }
                    </TextField>
                    <TextField value={this.state.covidresult} className="mt-4" fullWidth variant="outlined" select label="Covid result *"
                        InputLabelProps={{ shrink: true, }} size="small"

                        onChange={(event) =>
                            this.setValue("covidresult", event)}
                    >
                        <MenuItem value={1}>Possitive</MenuItem>
                        <MenuItem value={0}>Negative</MenuItem>
                    </TextField>
                    <TextField value={this.state.ct} className="mt-4" fullWidth variant="outlined" select label="Was a CT scan done ? *"
                        InputLabelProps={{ shrink: true, }} size="small"

                        onChange={(event) =>
                            this.setValue("ct", event)}>

                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                    </TextField>

                    <TextField value={this.state.ctscore} className="mt-4" fullWidth variant="outlined" label="If Yes, Please enter the CT score"
                        InputLabelProps={{ shrink: true, }} size="small"
                        onChange={(event) =>
                            this.setValue("ctscore", event)}
                    />
                </div>

            );

        else if (this.state.activeStep === 3)

            return (<div className="m-4">
                <div className=" d-flex justify-content-between align-items-centre">
                    <p className="mainhead">Is there an attender</p>
                    <Checkbox className="pb-3" checked={this.state.avail_attender} onClick={() => 
                    {
                        this.setState({ avail_attender: !this.state.avail_attender });      //TODO checkbox alignment
                    }} size="small" />
                </div>
                {this.state.avail_attender ? (
                    <div>
                        <TextField value={this.state.attendername} className="mt-4" fullWidth variant="outlined" label="Attender Name *"
                            InputLabelProps={{ shrink: true, }} size="small"

                            onChange={(event) =>
                                this.setValue("attendername", event)}
                        />
                        <TextField value={this.state.attenderphone} className="mt-4" fullWidth variant="outlined" label="Attender Phone number"
                            InputLabelProps={{ shrink: true, }} size="small"

                            onChange={(event) =>
                                this.setValue("attenderphone", event)}
                        />

                        <TextField value={this.state.relation} className="mt-4" fullWidth variant="outlined" label="Relation with the patient*"
                            InputLabelProps={{ shrink: true, }} size="small"
                            onChange={(event) =>
                                this.setValue("relation", event)}
                        />
                    </div>) : null}

            </div>

            );


        else if (this.state.activeStep === 4)

            return (
                <div className="m-4">
                    <div className=" d-flex justify-content-between align-items-centre">
                        <p className="mainhead">Was the patient taken to a hospital?</p>
                        <Checkbox checked={this.state.avail_hospital} onClick={() => 
                        {
                            this.setState({ avail_hospital: !this.state.avail_hospital });  //TODO checkbox alignment
                        }} size="small" />
                    </div>
                    {this.state.avail_hospital ? (
                        <div>
                            <TextField value={this.state.hospitalpref} className="mt-4" fullWidth variant="outlined" label="Previous hospital name *"
                                InputLabelProps={{ shrink: true, }} size="small"

                                onChange={({ target }) => this.setState({ hospitalpref: target.value })}
                            />

                            <TextField value={this.state.srfid} className="mt-4" fullWidth variant="outlined" label="SRF ID*"
                                InputLabelProps={{ shrink: true, }} size="small"

                                onChange={({ target }) => this.setState({ srfid: target.value })}
                            />

                            <TextField value={this.state.bunum} className="mt-4" fullWidth variant="outlined" label="BU Number*"
                                InputLabelProps={{ shrink: true, }} size="small"
                                onChange={({ target }) => this.setState({ bunum: target.value })}
                            />
                        </div>) : null}

                </div>

            );



    };
    setValue = (name: string, event: string | boolean | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => 
    {
        let value;
        if (typeof event !== "boolean" && typeof event !== "string")

            value = event.target.value;

        else

            value = event;

        //TODO: fix ts ignore
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.setState({ [name]: value });

    };


    handleNext = () => 
    {
        if (this.tabs.length - 1)

            this.setState({
                activeStep: this.state.activeStep + 1
            });


    };

    handleBack = () => 
    {
        this.setState({
            activeStep: this.state.activeStep - 1
        });
    };

    savePatient = async () => 
    {
        if (this.state.requirement === "Other" || "Medicine" || "Scan" || "Medical Test")

            await this.setState({
                requirement: this.state.requirement + ":" + this.state.otherRequirement
            });

        console.log(this.state);
        const toSend = this.state;

        toSend.user = undefined;


        if (this.state.Name && this.state.gender && this.state.symptoms)
            Patient.create({ ...toSend, })
                .then(() => 
                {
                    this.props.history.push("/");
                    toast.success("Successfully added your details", {
                        position: "bottom-center"
                    });
                }).catch((error) => 
                {
                    toast.error(error.details, {
                        position: "bottom-center"
                    });
                });
        else
            toast.error("please enter the required details", {
                position: "bottom-center"
            });
    };


    render() 
    {
        if (!this.state.auth) 
        {
            this.performAuth();
            return (<></>);
        }
        else 
        {
            console.log(this.state);
            return (
                <div className="d-flex flex-column vh-100">
                    <Box className='px-2' sx={{ width: "100%" }}>

                        <Container className="head-sec d-flex  justify-content-between p-3 shadow-none ">
                            <CloseIcon className="d-flex align-self-center" onClick={() => this.props.history.goBack()} />
                            <p className="align-self-center m-0 p-0 justify-content-center"><b>Add Medical Details</b>
                            </p>
                            {this.state.activeStep === 4 ? (
                                <Button onClick={this.savePatient} className="sub"
                                    variant="contained">Submit</Button>) : (
                                <Button disabled sx={{ borderRadius: "10px", background: "#F0F0F0" }}
                                    variant="contained">Submit</Button>)}
                        </Container>

                        <ListItem className='wholetab'
                            value={this.state.activeStep}
                        >

                            {
                                this.tabs.map((label, index) => (
                                    <div key={index} className="d-flex">{
                                        index !== 0 && index !== this.state.activeStep && index !== this.state.activeStep + 1 ?
                                            <img src={lineicon} alt='' /> : null
                                    }

                                    <Chip size='small' className='' label={label} onClick={() => this.setState({
                                        activeStep: index
                                    })}
                                    sx={this.styles[this.state.activeStep === index ? 0 : 1]} />
                                    </div>
                                ))
                            }

                        </ListItem>

                        {
                            this.form()
                        }


                        {this.state.activeStep === this.tabs.length ? null : (
                            <React.Fragment>

                                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                    <Button
                                        color="inherit"
                                        disabled={this.state.activeStep === 0}
                                        onClick={this.handleBack}
                                        sx={{
                                            borderRadius: "10px", background: "#F0F0F0",
                                            marginLeft: "1.25rem",
                                            textTransform: "none",
                                        }}
                                    >
                                        Prev
                                    </Button>
                                    <Box sx={{ flex: "1 1 auto" }} />
                                    {this.state.activeStep !== this.tabs.length - 1 ? (<Button className="nxtbutton"
                                        sx={{
                                            color: "white",
                                            marginRight: "1.25rem",
                                            textTransform: "none"
                                        }}
                                        onClick={this.handleNext}>
                                        Next
                                    </Button>) : null

                                    }

                                </Box>

                            </React.Fragment>
                        )}


                    </Box>

                    <Container sx={{ marginBottom: "4rem" }} className="mt-auto text-center  ">
                        <p className="manmsg">All * are mandatory, we’ll help you connect with a Doctor soon</p>
                    </Container>

                </div>


            );
        }
    }
}

const Addpatient = withRouter(AddPatient!);

export default Addpatient;
