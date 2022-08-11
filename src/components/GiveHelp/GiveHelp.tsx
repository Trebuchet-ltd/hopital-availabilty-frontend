import {Patient, PatientObject} from "../../api/model";
import {AuthComponent, AuthState} from "../../api/auth";
import {RouteComponentProps, withRouter} from "react-router";
import * as React from "react";
import "./GiveHelp.css";
import Maleicon from "../../images/male.svg";
import Femaleicon from "../../images/female.svg";
import CovidPos from "../../images/corpos.svg";
import CovidNeg from "../../images/corneg.svg";
import Bloodgrp from "../../images/bloodgroup.svg";
import TransGen from "../../images/TransGend.svg";
import PrefNSay from "../../images/genderless.svg";
import {toast} from "react-toastify";
import {Button, Chip, Container, ListItem} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface PatientState extends AuthState {
    models: PatientObject[];
    helped_models: PatientObject[];
    currenttab: number;
    isLoading: boolean;
}

const getType = (type: string) => {
    if (type === "M")
        return "Medical";
    else if (type === "FI")
        return "Financial";
    else if (type === "B")
        return "Blood";
    else if (type === "O")
        return "Other";

};
export type AuthPropsLoc = RouteComponentProps<Record<string, string | undefined>>;

export class GiveHelp extends AuthComponent<AuthPropsLoc, PatientState> {
    constructor(props: AuthPropsLoc) {
        super(props);
        this.state = {
            ...this.state,
            currenttab: 0,
            isLoading: true,
        };
    }

    styles = [
        {
            background: "linear-gradient(180deg, #0338B9 0%, #3E64FF 100%)",
            color: "white",
            margin: 0,
            fontSize: "16px",
            borderRadius: "10px",
        },
        {
            background: "#F0F0F0",
            margin: 0,
            fontSize: "16px",
            borderRadius: "10px",
        },
    ];
    tab_name = ["Requests", "Helped by you"];

    componentDidMount() {
        Patient.action_general("all", {}, true).then((patients) => {
            const results = patients.results;
            this.setState({models: results});
        });
        Patient.action_general("help", {}, true).then((patients) => {
            const results = patients.results;
            this.setState({helped_models: results});
        });
        this.setState({isLoading: false});
    }

    getgender = (gender: string) => {
        if (gender === "M")

            return <img src={Maleicon} alt=""/>;

        else if (gender === "F")

            return <img src={Femaleicon} alt=""/>;

        else if (gender === "NB")

            return <img src={TransGen} alt=""/>;

        else if (gender === "NP") return <img src={PrefNSay} alt=""/>;
    };

    givehelp = async (obj: PatientObject) => {
        try {
            await obj.modify("help/");
            toast.success("Thank you for helping out", {
                position: "bottom-center",
            });
        } catch (error) {
            console.error(error);
            toast.error((error as { details: string }).details, {
                position: "bottom-center",
            });
        }
    };

    fields = () => {
        let model;
        if (this.state.currenttab === 0)

            model = this.state.models;

        else if (this.state.currenttab === 1)

            model = this.state.helped_models;
        console.log(model);

        if (model)

            return (
                <Container className="maincont">
                    {
                        model.map((obj, key) => (
                            <div key={key}>
                                <div className="mx-1">
                                    <div className="maincard ">
                                        <div className="card-heading">{getType(obj.request_type!) + " request"}</div>
                                        <div className="d-flex flex-row justify-content-between ">
                                            <div className="lefttxt">
                                                <h1 className="title m-0">
                                                    {obj.Name}
                                                    {this.getgender(obj.gender)}
                                                </h1>

                                                <div className="subtitle">
                                                    <div>Language:{this.state.user?.tokens.language?.map(l => l.name).join(", ")}</div>
                                                </div>
                                                <div className="subtitle">
                                                    <div>Description :{obj.reason}</div>
                                                </div>
                                            </div>
                                            <div className="lefttxt ">
                                                {
                                                    obj.request_type === "M" && <div className="subtitle">
                                                        <div>Symptoms:{obj.symptoms}</div>
                                                        <div>Since:{obj.symdays}</div>

                                                    </div>
                                                }
                                            </div>
                                            <div className=" subtitle  pt-4 ">
                                                {

                                                    obj.request_type === "B" && <div className="mt-1">
                                                        <div>Blood group:{obj.blood}</div>
                                                    </div>
                                                }
                                                <Button
                                                    //   onClick={() => this.givehelp(obj)}
                                                    onClick={() =>
                                                        this.props.history.push(`/help/${this.state.currenttab === 1 ? "me/" : ""}${obj.id}`)
                                                    }
                                                    sx={{
                                                        borderRadius: "10px",
                                                        marginBottom: "1rem",
                                                        textTransform: "none",
                                                        paddingX: "1.25rem",
                                                        paddingY: ".25rem",
                                                        marginTop: ".5rem",
                                                    }}
                                                    className="helpbutn"
                                                    variant="contained"
                                                >
                                                    View
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </Container>
            );

    };

    // savePatient = async () => {
    //     console.log(this.state)
    //     const toSend = this.state;
    //
    //     toSend.user = null;
    //
    //
    //     if (this.state.Name && this.state.gender && this.state.symptoms)
    //         Patient.create({...toSend,})
    //             .then(() => {
    //                 this.props.history.push(`/`)
    //                 toast.success('Successfully added your details', {
    //                     position: 'bottom-center'
    //                 })
    //             }).catch((error) => {
    //             toast.error(error.details, {
    //                 position: 'bottom-center'
    //             })
    //         })
    //     else
    //         toast.error("please enter the required details", {
    //             position: 'bottom-center'
    //         })
    // }
    handleChange = () => {
        this.setState({
            currenttab: this.state.currenttab + 1,
        });
    };

    render() {
        if (!this.state.auth) {
            this.performAuth();
            return <></>;
        } else {
            console.log(this.state);
            return (
                <div className="mb-3 ">
                    <Container className=" tophead fixed-top d-flex justify-content-between p-3 ">
                        <CloseIcon
                            className="d-flex align-self-center"
                            onClick={() => this.props.history.goBack()}
                        />
                        <p className="align-self-center m-0 p-0 text-left flex-grow-1 pl-4">
                            <b>Give Help</b>
                        </p>
                    </Container>22.5
                    <div className=" mb-4 mt-4 pt-4 pb-2"></div>
                    <ListItem
                        className="d-flex justify-content-around"
                        value={this.state.currenttab}
                    >
                        {this.tab_name.map((label, index) => (
                            <div key={index} className="d-flex">
                                <Chip
                                    className=""
                                    label={label}
                                    onClick={() =>
                                        this.setState({
                                            currenttab: index,
                                        })
                                    }
                                    sx={this.styles[this.state.currenttab === index ? 0 : 1]}
                                />
                            </div>
                        ))}
                    </ListItem>
                    {this.fields()}
                </div>
            );
        }
    }
}

const Givehelp = withRouter(GiveHelp);
export default Givehelp;
