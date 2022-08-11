import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import IconButton from "@mui/material/IconButton";
import CallEndIcon from "@mui/icons-material/CallEnd";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HttpsIcon from "@mui/icons-material/Https";
import {AuthComponent, AuthPropsLoc, AuthState, Friend} from "../../api/auth";
import {withRouter} from "react-router";
import Avatar from "@mui/material/Avatar";
import {Link} from "react-router-dom";
import WebRTC, { MediaTypes } from "./WebRTC";
import React from "react";
import {Button as MuiButton} from "@mui/material";
import { withStyles } from "@mui/styles";
import { DEFAULT_CONSTRAINTS } from "./constants";

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "light" ? "#083CBE" : grey[800],
}));

interface VideoCallState extends AuthState {
    acceptCall: (value: (PromiseLike<boolean> | boolean)) => void;
    openStatus: boolean;
    chatUser: Friend;
    rtc: WebRTC;
    video:{enabled:boolean, denied:boolean};
    audio:{enabled:boolean, denied:boolean};
}
const Button = withStyles(theme =>({
    root: {
        color:"white"
    },
}))(MuiButton);
class VideoCallLoc extends AuthComponent<AuthPropsLoc, VideoCallState>
{
    private readonly localVideo = React.createRef<HTMLVideoElement>();
    private readonly remoteVideo = React.createRef<HTMLVideoElement>();
    private readonly remoteAudio = React.createRef<HTMLAudioElement>();

    constructor(props: AuthPropsLoc)
    {
        super(props);
        console.log(this.props.match.params);
        const chatUser = this.state.user?.friends?.find((friend) => friend.token === this.props.match.params.chatId);

        if (!chatUser || !this.state.user?.tokens.private_token)
            this.props.history.replace("/chat");
        else
            this.state = {
                ...this.state,
                openStatus: false,
                chatUser,
                video:{enabled:false, denied:false},
                audio:{enabled:false, denied:false},
            };
    }

    async componentDidMount()
    {
        super.componentDidMount();

        if (!this.state.auth || !this.state.user?.tokens?.private_token)
            return this.performAuth();

        if(this.localVideo.current && this.remoteVideo.current && this.remoteAudio.current)
        {
            const rtc = new WebRTC(
                this.state.user?.tokens?.private_token,
                this.state?.chatUser.token,
                this.localVideo.current,
                this.remoteVideo.current,
                this.remoteAudio.current,
                this.notifyUser
            );
            this.setState({rtc});
            rtc.media.on("audioToggle", (state:boolean)=>
            {
                console.log("video", state);this.setState({audio:{enabled:state, denied:false}});
            });
            rtc.media.on("videoToggle", (state:boolean)=>
            {
                console.log("audio", state);this.setState({video:{enabled:state, denied:false}});
            });
            rtc.media.on("permissionDenied", (type)=>
            {
                console.log(type+ " denied");
                if (type === "video")
                    this.setState({ video: {  enabled: false, denied: true, } });
                else if (type === "audio")
                    this.setState({ video: {  enabled: false, denied: true} });
            });
        }
    }

    componentWillUnmount()
    {
        super.componentWillUnmount();
        this.state.rtc.tearDown();
    }

    notifyUser = async (msg?: string) =>
    {
        window.alert(msg);
        const setState = this.setState.bind(this);
        return new Promise<boolean>((acceptCall) => setState({acceptCall}));
    };

    render()
    {
        console.log(this.state.video, this.state.audio);
        return (
            <>
                <div style={{zIndex: 50, height: "100%", color: "#8DB5B4", backgroundColor: "#3E64FF"}}>
                    <div style={{padding: "1rem"}} className="d-flex justify-content-center align-items-center">
                        <Link style={{textDecoration: "none"}} to={`/chat/${this.state.chatUser.token}`}>
                            <KeyboardArrowDownIcon color={"error"} />
                        </Link>
                        <HttpsIcon style={{height: "1rem"}}/>
                        <p className="m-0" >End-to-end encrypted</p>
                    </div>
                    {0 ?
                        <div style={{color: "#F0F0F0"}}>
                            <Avatar src={this.state.chatUser.profile} alt={this.state.chatUser.name}/>
                            <h3 className="mt-3">{this.state.chatUser.name}</h3>
                            <p>Calling</p>
                        </div> :
                        <>
                            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                            <video ref={this.localVideo} muted={true} autoPlay={true}/>
                            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                            <video ref={this.remoteVideo} autoPlay={true} playsInline/>
                            <audio ref={this.remoteAudio} autoPlay/>
                            <div style={{marginBottom:"40px"}}>
                                <Button onClick={() => this.state.rtc.makeCall()}>Call</Button>
                                <Button onClick={() => this.state.rtc.media.toggleCamera(!this.state.video.enabled)}>{"Video " + (this.state.video.enabled ? "On" : "Off")}</Button>
                                <Button onClick={() => this.state.rtc.media.toggleMic(!this.state.audio.enabled)}>{"Audio " + (this.state.audio.enabled ? "On" : "Off")}</Button>
                                <Button onClick={() => this.state.acceptCall(true)}>Accept</Button>
                                <Button onClick={() => this.state.acceptCall(false)}>Reject</Button>
                                <Button onClick={() => this.state.rtc.tearDown()}>Stop</Button>
                            </div>
                            <Global
                                styles={{
                                    ".MuiDrawer-root > .MuiPaper-root": {
                                        height: "10%",
                                        overflow: "visible",
                                    },
                                }}
                            />
                            {/* <SwipeableDrawer
                                style={{zIndex: 100}}
                                anchor="bottom"
                                open={this.state.openStatus}
                                disableSwipeToOpen={false}
                                onClose={() => this.setState({openStatus: false})}
                                onOpen={() => this.setState({openStatus: true})}
                                ModalProps={{
                                    keepMounted: true,
                                }}
                            >
                                <StyledBox
                                    sx={{
                                        position: "absolute",
                                        top: "-5rem",
                                        borderTopLeftRadius: 10,
                                        borderTopRightRadius: 10,
                                        visibility: "visible",
                                        right: 0,
                                        left: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                    }}
                                >
                                    <IconButton onClick={()=>this.setState({openStatus: false})}>
                                        <KeyboardArrowDownIcon />
                                    </IconButton>
                                    <div style={{paddingBottom: "2rem"}} className="d-flex justify-content-around w-100">
                                        <IconButton>
                                            <FlipCameraIosIcon style={{color: "#fff"}}/>
                                        </IconButton>

                                        <IconButton style={{color: "#fff"}}>
                                            <VolumeUpIcon/>
                                        </IconButton>

                                        <IconButton style={{color: "#fff"}}>
                                            <VideocamOffIcon/>
                                        </IconButton>

                                        <IconButton style={{color: "#fff"}}>
                                            <MicOffIcon/>
                                        </IconButton>

                                        <IconButton style={{color: "#fff", background: "#E91C43"}}>
                                            <CallEndIcon/>
                                        </IconButton>

                                    </div>
                                </StyledBox>
                                <StyledBox
                                    sx={{
                                        px: 2,
                                        pb: 2,
                                        height: "100%",
                                        overflow: "auto",
                                    }}
                                >
                                </StyledBox>
                            </SwipeableDrawer> */}

                        </>
                    }


                </div>



            </>
        );
    }
}

export default withRouter(VideoCallLoc);
