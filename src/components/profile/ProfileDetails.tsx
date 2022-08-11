import { AuthComponent, AuthPropsLoc, AuthState, reactUrl } from "../../api/auth";
import { Container, Avatar, Modal, Slider, TextField } from "@mui/material";
import { withRouter } from "react-router";
import React from "react";
import { CSSTransition } from "react-transition-group";
import { Patient, PatientObject } from "../../api/model";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Editbutn from "../../images/editButton.svg";

import "./ProfileDetails.css";
import { withStyles } from "@mui/styles";
import Record from "../../images/reco.svg";
import offers from "../../images/offers.svg";
import reviewsvg from "../../images/friendshipaccnt.svg";
import Bloodgrp from "../../images/bloodgroup.svg";
import CovidPos from "../../images/corpos.svg";
import CovidNeg from "../../images/corneg.svg";
import Button from "@mui/material/Button";

import Maleicon from "../../images/male.svg";
import Femaleicon from "../../images/female.svg";
import TransGen from "../../images/TransGend.svg";
import PrefNSay from "../../images/genderless.svg";
import { BigBlueButton } from "../Utils";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";




const AirbnbSlider = withStyles({
    root: {
        color: "#0338B9 !important",
        height: 3,
        padding: "13px 0",
    },

    active: {},
    track: {
        height: 3,
    },
    rail: {
        color: "#d8d8d8 !important",
        opacity: 1,
        height: 3,
    },
})(Slider);


interface ProfileDetailsState extends AuthState {
    invite: string;
    show_share: boolean;
    tab: number;
    requests: PatientObject[];
    friend_request: PatientObject[];
    popUp: boolean;
}


export class ProfileDetailsLoc extends AuthComponent<AuthPropsLoc, ProfileDetailsState>
{
    constructor(props: AuthPropsLoc) 
    {
        super(props);
        this.state = {
            ...this.state,
            show_share: false,
            requests: [],
            friend_request: [],
            tab: 0
        };
    }

    hashChange = () => 
    {
        if (!this.props.location.hash.includes("share"))

            this.setState({ show_share: false });

        else

            this.setState({ show_share: true });


    };

    async componentDidMount() 
    {
        super.componentDidMount();
        const data = await Patient.filter({}, true);
        const data1 = await Patient.action_general("friends/", {}, true);
        this.setState({ requests: data.results, friend_request: data1.results });
    }



    getgender = (gender: string) => 
    {
        if (gender === "M")

            return (
                <img src={Maleicon} alt="" />
            );


        else if (gender === "F")

            return (
                <img src={Femaleicon} alt="" />
            );

        else if (gender === "NB")

            return (
                <img src={TransGen} alt="" />
            );

        else if (gender === "NP")

            return (
                <img src={PrefNSay} alt="" />
            );



    };

    handleInvite = async () => 
    {
        const shareData = {
            title: "NeedMedi",
            text: `${this.state.user?.first_name} ${this.state.user?.last_name ? this.state.user.last_name + " " : ""}has invited you to join Needmedi 

Free App to Search & Book Doctors

https://needmedi.com/invite?invite=${this.state.user?.tokens.private_token ?? ""}

Login with Gmail/Google or Facebook Account.

Or create a Login with any Email ID

Labs, Blood donors & more Online Medical Services... coming soon on Needmedi.com`,
        };

        try 
        {
            await navigator.share(shareData);
            toast.success("Invited Successfully", {
                position: "bottom-center"
            });
        }
        catch (error) 
        {
            toast.error((error as { details: string }).details, {
                position: "bottom-center"
            });
        }
    };

    actions = [{ icon: <AddIcon />, name: "Add Friend", task: () => this.setState({ popUp: true }) }, { icon: <PersonAddIcon />, name: "Invite Friend", task: () => this.handleInvite() }, { icon: <SearchIcon />, name: "Search Friend", task: () => this.props.history.push("/searchuser") }];

    getTab = () =>
        (this.state.tab === 0 ?
            <div className="">
                {/*<Container>*/}
                {/*    <Link to="/addRequest">*/}
                {/*        <BigBlueButton text="+ Add New Request"/>*/}
                {/*    </Link>*/}
                {/*</Container>*/}
                {/*<Container >*/}
                {/*    {this.state.requests ? (this.state.requests.map((obj, key) => (*/}
                {/*        <div key={key}>*/}

                {/*            <div className="mx-1">*/}
                {/*                <div className="maincard d-flex flex-row justify-content-between ">*/}

                {/*                    <div className=" lefttxt ">*/}
                {/*                        <h1 className="title m-0">{obj.Name}{this.getgender(obj.gender)}</h1>*/}
                {/*                        <div className="subtitle">*/}
                {/*                            <div>Symptoms:{obj.symptoms}</div>*/}
                {/*                            <div>Since:{obj.symdays}</div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                    <div className=" subtitle pr-4 pt-4 ">*/}
                {/*                        <div className="mt-1">{obj.blood} <img src={Bloodgrp} alt=""/></div>*/}
                {/*                        <div className="mt-1">Covid:{obj.covidresult ? (*/}
                {/*                            <img src={CovidPos} alt=""/>) : (*/}
                {/*                            <img src={CovidNeg} alt=""/>)}</div>*/}
                {/*                        <div className="mt-1">CT score:{obj.ctscore}</div>*/}
                {/*                        <Button sx={{*/}
                {/*                            borderRadius: "10px",*/}
                {/*                            marginBottom: "1rem",*/}
                {/*                            textTransform: "none",*/}
                {/*                            paddingX: "1.25rem",*/}
                {/*                            paddingY: ".25rem", marginTop: ".5rem"*/}
                {/*                        }} className="helpbutn"*/}
                {/*                        variant="contained">Edit</Button>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    ))) : null}*/}


                {/*</Container>*/}


            </div> :
            this.state.tab === 1 ?
                <div className="pb-2 friend-section">
                    <Container>
                        {/*<BigBlueButton*/}
                        {/*    onClick={() => this.state.tab === 1 ? this.handleInvite() : this.setState({popUp: true})}*/}
                        {/*    text={this.state.tab === 1 ? "Invite Friend" : "Add Friend"}/>*/}
                    </Container>

                    {this.state.user?.friends.map((friend, key) => (
                        <Container key={key}>
                            <div className="frndcard w-100 d-flex justify-content-between mb-2">
                                <Avatar src={friend.profile} variant="rounded" sx={{
                                    marginLeft: "6px",
                                    width: "47.96px",
                                    height: "50px",
                                    marginTop: "10px",
                                    marginBottom: "9px",
                                    borderRadius: "15px",
                                }}>{friend.name[0]}</Avatar>
                                <div style={{ textAlign: "left", marginLeft: "1rem" }}
                                    className="d-flex flex-grow-1 flex-column text-left align-self-center ">
                                    <div className="frndname">{friend.name}</div>
                                    <div className="frndemail">{friend.email}</div>
                                </div>

                                {/*{friend.invited && <div className="box bestseller"></div>} for including best volunteer*/}

                            </div>
                        </Container>))}
                </div> :
                <div>

                </div>
        );

    friendPopUp = () =>
        (
            <Modal
                open={this.state.popUp}
                onClose={() => this.setState({ popUp: false })}

            >
                <Box sx={{
                    position: "absolute" as const,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography variant="h6">
                        <b>Your ID :</b>&nbsp;{this.state.user?.tokens.private_token}&nbsp;
                        <Button
                            onClick={() => navigator.share({
                                title: "NeedMedi",
                                text: `${this.state.user?.username} sent you a friend request.`,
                                url: `${reactUrl}/addFriend/${this.state.user?.tokens.private_token}`
                            })}
                        >Share</Button>
                    </Typography>
                    <br />
                    <TextField
                        value={this.state.invite}
                        className="my-2" fullWidth variant="outlined"
                        label="Friend's Id"
                        InputLabelProps={{ shrink: true, }} size="small"
                        onChange={(event) =>
                            this.setState({ invite: event.target.value })}
                        InputProps={{
                            endAdornment:
                            <Button
                                onClick={() => this.setState({ invite: "" })}>
                                <CloseIcon />
                            </Button>
                        }}
                    />
                    <div className=" w-50 d-flex justify-content-between ">
                        <Button
                            variant="contained"
                            onClick={() => this.state.invite && this.props.history.push(`/addFriend/${this.state.invite}`)}>Add</Button>
                        <Button
                            variant="contained"
                            onClick={() => this.setState({ popUp: false })}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        );

    render() 
    {
        return (
            <div>
                <this.friendPopUp />
                <React.Fragment>
                    <div className="">
                        <Container className="w-100">
                            <div className="d-flex justify-content-between w-100 px-0  mt-4  ">

                                <ArrowBackIcon onClick={() => this.props.history.push("/")} />
                                <p className="Yourprof w-100 text-left align-self-center ">Your Profile</p>
                                <MoreVertIcon />

                            </div>
                            <div className="userbox d-flex flex-row align-content-around">
                                <Avatar src={this.state.user?.tokens?.profile || undefined} sx={{
                                    marginRight: "10px",
                                    width: "75px",
                                    height: "75px"
                                }}>{this.state.user?.username ? this.state.user.username[0] : "?"}</Avatar>
                                <div className="profile d-flex flex-grow-1 flex-column ">
                                    <p className="profname">{this.state.user?.first_name ? this.state.user.first_name + " " + this.state.user?.last_name : this.state.user?.username}</p>
                                    <p className="email">{this.state.user?.email}</p>
                                    <p className="invitecode">Invite code: {this.state.user?.tokens.private_token}</p>
                                </div>
                                <button onClick={() => 
                                {
                                    this.props.history.push("/profile/edit");
                                }}
                                className="editbutn" ><b><img src={Editbutn} alt="" /></b>
                                </button>
                            </div>
                            <div className="bg-grey px-4  mx-4 mb-4">
                                <div className="d-flex flex-row align-items-center">
                                    <div className="d-flex flex-column">
                                        <p className="point1">{this.state.user?.tokens?.points}</p>
                                        <p className="point2">Points</p>
                                    </div>
                                    <AirbnbSlider className="slider mx-2"
                                        size="small"
                                        defaultValue={this.state.user?.tokens?.points}
                                        aria-label="Small"
                                        valueLabelDisplay="auto"
                                        max={500}
                                        disabled
                                    />
                                    <div className="d-flex flex-column ">
                                        <p className="point3">500</p>
                                        <p className="point4">Points</p>
                                    </div>
                                </div>
                            </div>
                            <div className="container d-flex justify-content-between mb-4 p-0">

                                <button className={`card-about card-1 ${this.state.tab === 0 && "active"}`}
                                    onClick={() => this.setState({ tab: 0 })}>
                                    <img src={Record} alt={"doctor svg"} />
                                    <p className="m-0"><b>{this.state.requests?.length}</b><br />Medical Record</p>
                                </button>

                                <button className={`card-about card-1 ${this.state.tab === 1 && "active"}`}
                                    onClick={() => this.setState({ tab: 1 })}>
                                    <img src={reviewsvg} alt={"review svg"} />
                                    <p className="m-0"><b>{this.state.user?.friends?.length || 0}</b><br />Friends</p>
                                </button>

                                <button className={`card-about card-1 ${this.state.tab === 2 && "active"}`}
                                    onClick={() => this.setState({ tab: 2 })}>
                                    <img src={offers} alt={"layout svg"} />
                                    <p className="m-0"><b>{"0"}</b><br />Offers</p>
                                </button>


                            </div>
                        </Container>
                        {this.getTab()}

                        {this.state.tab === 1 && <SpeedDial
                            ariaLabel="SpeedDial basic example"
                            sx={{ position: "fixed", bottom: 100, right: 16 }}
                            icon={<SpeedDialIcon />}
                        >
                            {this.actions.map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    tooltipOpen
                                    onClick={action.task}
                                />
                            ))}
                        </SpeedDial>}

                    </div>

                    <CSSTransition classNames="filter-screen" in={this.state.show_share} timeout={300}
                        unmountOnExit>
                    </CSSTransition>
                </React.Fragment>
            </div>
        );

    }

}

export const ProfileDetails = withRouter(ProfileDetailsLoc);
