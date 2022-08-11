import {AuthComponent, AuthPropsLoc, AuthState} from "../../api/auth";
import {StickyHead} from "../Utils";
import {Button, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {Link} from "react-router-dom";
import * as React from "react";
import {Patient, PatientObject} from "../../api/model";
import {withRouter} from "react-router";
import IconButton from "@mui/material/IconButton";
import {toast} from "react-toastify";
import { Control, Controller, SubmitHandler, useForm, UseFormHandleSubmit } from "react-hook-form";
import HookFormWrapper from "../Form/HookFormWrapper";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MUIController from "../Form/MUIControl";



const financialReq = yup.string().when("request_type", (type, schema)=>type==="FI"?schema.required():schema);
const schema = yup.object({
    request_type: yup.string().required().label("Request type"),
    age: yup.number().typeError("Must be number").required().max(110, "Enter a valid age"),
    gender: yup.string().required(),
    address: yup.string().required("Location is required"),
    mobile_number: yup.string().matches(/^\+?\d{10,14}$/, {message:"Enter a valid mobile number."}).required().label("Mobile number"),
    reason: yup.string(),
    account_holder: financialReq.label("Account holder name"),
    account_no: financialReq.label("Account number"),
    ifsc: financialReq,
    bank_name: financialReq.label("Bank name"),
    Name: yup.string().required().matches(/^[A-Z ]+$/i, {message:"Enter a valid name"}),
}).required();
interface QuickRequestState extends AuthState {
    model: PatientObject;
    attachment_name: string;
    attachment: File
}




class QuickRequest extends AuthComponent<AuthPropsLoc, QuickRequestState>
{

    constructor(props: AuthPropsLoc)
    {
        super(props);
        this.state = {
            ...this.state,
        };
    }


    saveRequest  = async (data:any)=>
    {
        const toSend = {...data, attachment:this.state.attachment};
        console.log(toSend);
        //toSend.user = undefined;

        const formData = new FormData();
        for (const key in toSend) 
        {
            const d = toSend[key as keyof typeof toSend];
            if (d !== undefined) 
            {
                console.log(d);
                formData.append(key, typeof d === "number" ? d.toString() : d);
            }
        }

        Patient.create(formData)
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
    };

    render()
    {
        if(!this.state.auth)
        {
            this.performAuth();
            return <></>;
        }
        return (
            <>

                <HookFormWrapper<yup.InferType<typeof schema>>
                    defaultValues={{
                        request_type: "", 
                        Name: this.state.user?.first_name + " " + this.state.user?.last_name,
                        mobile_number: this.state.user?.tokens.phone_number, 
                        address: this.state.user?.tokens.address,
                        age: this.state.user?.tokens.age, 
                        gender: this.state.user?.tokens.gender
                    }}
                    resolver={yupResolver(schema)}>
                    {
                        ({ control, handleSubmit, getValues }) => 
                        {
                            const submit = handleSubmit((d) => this.saveRequest.bind(this)(d), (err)=>console.log(err));
                            return <>
                                <StickyHead title="Quick Request"
                                    onClick={submit}
                                    //onClick={() => this.saveRequest()} 

                                    goBack={this.props.history.goBack} />

                                <div className="m-4">
                                    <MUIController name='request_type' control={control as any}>
                                        {
                                            (props) => <TextField className="mt-4" fullWidth variant="outlined" select
                                                label="Request type *"
                                                InputLabelProps={{ shrink: true, }}
                                                {...props}
                                                onChange={(e)=>
                                                {
                                                    props.onChange(e.target.value);
                                                    this.forceUpdate();
                                                }}
                                            >
                                                <MenuItem value={"M"}>Medical Request</MenuItem>
                                                <MenuItem value={"FI"}>Financial Request</MenuItem>
                                                <MenuItem value={"B"}>Blood Request</MenuItem>
                                                <MenuItem value={"F"}>Food Request</MenuItem>
                                                <MenuItem value={"O"}>other</MenuItem>
                                            </TextField>
                                        }
                                    </MUIController>
                                    <MUIController name='Name' control={control as any}>
                                        {
                                            (props) => <TextField className="mt-4" fullWidth variant="outlined"
                                                label="Name *" InputLabelProps={{ shrink: true, }}
                                                {...props} />
                                        }
                                    </MUIController>
                                    <div className="d-flex justify-content-between">
                                        <MUIController name='age' control={control as any}>
                                            {
                                                (props) => <TextField sx={{ width: 90 }} className="mt-4" variant="outlined"
                                                    label="Age *"
                                                    InputLabelProps={{ shrink: true, }}
                                                    {...props}
                                                />
                                            }
                                        </MUIController>
                                        <MUIController name='gender' control={control as any}>
                                            {
                                                (props) => <TextField sx={{ width: 212 }} className="mt-4" select
                                                    variant="outlined" label="Gender *"
                                                    InputLabelProps={{ shrink: true, }}
                                                    {...props}
                                                >
                                                    <MenuItem value={"M"}>Male</MenuItem>
                                                    <MenuItem value={"F"}>Female</MenuItem>
                                                    <MenuItem value={"NB"}>Non Binary</MenuItem>
                                                    <MenuItem value={"NP"}>Prefer Not to Say</MenuItem>
                                                </TextField>
                                            }
                                        </MUIController>

                                    </div>


                                    <MUIController name='address' control={control as any}>
                                        {
                                            (props) => <TextField className="mt-4" fullWidth variant="outlined"
                                                label="Location *" InputLabelProps={{ shrink: true, }}
                                                {...props}
                                            />
                                        }
                                    </MUIController>

                                    <MUIController name='mobile_number' control={control as any}>
                                        {
                                            (props) => <TextField className="mt-4" fullWidth variant="outlined"
                                                label="Mobile Number *" InputLabelProps={{ shrink: true, }}
                                                {...props}
                                            />
                                        }
                                    </MUIController>

                                    <MUIController name='reason' control={control as any}>
                                        {
                                            (props) => <TextField rows={4} multiline className="mt-4" fullWidth
                                                variant="outlined" label="Reason " InputLabelProps={{ shrink: true, }}
                                                {...props}
                                            />
                                        }
                                    </MUIController>


                                    <label className="d-flex mt-4 align-items-center" htmlFor="icon-button-file">
                                        <IconButton component="span" style={{ color: "#222B45", fontSize: "15px", padding: "0" }}>
                                            <AttachFileIcon sx={{ transform: "rotate(40deg)" }} />
                                            Upload Attachment
                                        </IconButton>
                                    </label>
                                    {this.state.attachment_name}
                                    <input id="icon-button-file" type="file" name="file"
                                        style={{ visibility: "hidden" }} onChange={({ target }) => 
                                        {
                                            const files = target.files;
                                            if (files) 
                                            {
                                                console.log(files);
                                                this.setState({ attachment: files[0] });
                                                
                                                this.setState({ attachment_name: files[0].name });
                                                // reader.readAsDataURL(files[0]);
                                                // reader.onload=(e)=>
                                                // {
                                                //     if(e.target)

                                                //         this.updatePatientData({attachment: e.target.result});

                                                // };
                                            }
                                        }} />
                                    {getValues("request_type") === "FI" ?
                                        <>
                                            <div className="d-flex">
                                                <b>Please enter Account details</b>
                                            </div>
                                            <MUIController name='account_holder' control={control as any}>
                                                {
                                                    (props) => <TextField className="mt-4" fullWidth variant="outlined"
                                                        label="Name *" InputLabelProps={{ shrink: true, }}
                                                        {...props} />
                                                }
                                            </MUIController>
                                            <MUIController name='account_no' control={control as any}>
                                                {
                                                    (props) => <TextField className="mt-4" fullWidth variant="outlined"
                                                        label="Account Number *" InputLabelProps={{ shrink: true, }}
                                                        {...props} />
                                                }
                                            </MUIController>

                                            <MUIController name='ifsc' control={control as any}>
                                                {
                                                    (props) => <TextField className="mt-4" fullWidth variant="outlined"
                                                        label="IFSC Code *" InputLabelProps={{ shrink: true, }}
                                                        {...props} />
                                                }
                                            </MUIController>
                                            <MUIController name='bank_name' control={control as any}>
                                                {
                                                    (props) => <TextField className="mt-4" fullWidth variant="outlined"
                                                        label="Bank Name *" InputLabelProps={{ shrink: true, }}
                                                        {...props} />
                                                }
                                            </MUIController>

                                        </> : <></>}
                                    <div className="d-flex mt-4">
                                        <b>For detailed Medical Request</b>
                                    </div>
                                    <Link className="d-flex mb-3" to={"/addRequest"}>Click Here</Link>
                                </div>
                            </>;
                        }
                    }
                </HookFormWrapper>

                    
                    
            </>
        );
    }
}

export const Quickrequest = withRouter(QuickRequest);
