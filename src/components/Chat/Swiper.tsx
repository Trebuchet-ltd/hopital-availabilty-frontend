import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import "./Swiper.css";
import Fab from "@mui/material/Fab";
import Plus from "../../images/chat_plus.svg";
import SearchIcon from "@mui/icons-material/Search";
import chat from "../../images/chat_bw.svg";
import recent from "../../images/recent_bw.svg";
import call from "../../images/call_bw.svg";
import contact from "../../images/contact_bw.svg";
import {Link} from "react-router-dom";
import {Avatar, Tab} from "@mui/material";
import {AuthComponent, AuthPropsLoc, AuthState, refresh_user} from "../../api/auth";
import {withRouter} from "react-router";
import SignalConnection from "./lib";
import ReplyIcon from "@mui/icons-material/Reply";
import Account from "../../images/doctorhead.jpg";

interface TabPanelProps
{
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps)
{
    const {children, value, index, ...other} = props;

    return (
        <div
            style={{height: "87vh"}}
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}

        >
            {value === index && (
                <Box sx={{py: 3, height: "100%"}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

interface SwiperState extends AuthState
{
    value: number,
    connection: SignalConnection
}

class SwiperLoc extends AuthComponent<AuthPropsLoc, SwiperState>
{
    constructor(props: AuthPropsLoc)
    {
        super(props);

        this.state = {...this.state, value: 0};
    }

    componentDidMount()
    {
        super.componentDidMount();

        refresh_user();

        if (!this.state.auth)
            this.performAuth();

        if (this.state.user?.tokens?.private_token)
            this.setState({
                connection: new SignalConnection(this.state.user.tokens.private_token, "", () => null)
            });
        
    }

    componentWillUnmount()
    {
        super.componentWillUnmount();
        if (this.state.connection)
            this.state.connection.tareDown();
    }

    getTime = (date: Date) => date.toLocaleTimeString("en-US", {hour: "numeric", minute: "numeric", hour12: true});


    render()
    {
        return (
            <>
                <Tabs
                    value={this.state.value}
                    selectionFollowsFocus
                    onChange={(e, value) => this.setState({value})}
                    indicatorColor="primary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab icon={<img src={chat} alt=""/>}/>
                    <Tab icon={<img src={recent} alt=""/>}/>
                    <Tab icon={<img src={call} alt=""/>}/>
                    <Tab icon={<img src={contact} alt=""/>}/>
                </Tabs>

                <SwipeableViews
                    axis={"x"}

                    index={this.state.value}
                    onChangeIndex={(value) => this.setState({value})}
                >
                    <TabPanel value={this.state.value} index={0}>
                        <div>
                            <div style={{maxHeight: "45vh"}}>
                                <div style={{
                                    textAlign: "left",
                                    fontSize: "20px",
                                    lineHeight: "20px",
                                    margin: "1rem",
                                    paddingLeft: ".5rem"
                                }}>
                                    Chats
                                </div>
                                <div style={{marginBottom: "2rem"}}> {/*TODO: Implement*/}
                                    <div className="d-flex justify-content-between">
                                        <div style={{
                                            textAlign: "left",
                                            fontSize: "18px",
                                            lineHeight: "24.55px",
                                            margin: "1rem"
                                        }}>
                                            Pinned Chats
                                        </div>

                                        {/*<img style={{*/}
                                        {/*    height: "3rem",*/}
                                        {/*    borderRadius: "100%",*/}
                                        {/*    marginRight: "1rem",*/}
                                        {/*    alignItems: "center"*/}
                                        {/*}} src={Account} alt={"profile"}/>*/}
                                        <Avatar src={this.state.user?.tokens?.profile || undefined} variant="rounded"
                                            sx={{
                                                height: "2.5rem",
                                                borderRadius: "50%",
                                                marginRight: "1rem",
                                                alignItems: "center"
                                            }}>{this.state.user?.username ? this.state.user.username[0] : "?"}</Avatar>
                                    </div>

                                    <div className="chat-main d-flex flex-wrap justify-content-around m-2 pb-2"
                                        style={{maxHeight: "30vh", overflow: "auto"}}>

                                        {/*<div className="p-1" style={{*/}
                                        {/*    width: "40%",*/}
                                        {/*    height: "50%",*/}
                                        {/*    background: "#F7F7F7",*/}
                                        {/*    marginTop: "1rem",*/}
                                        {/*    borderRadius: "8px"*/}
                                        {/*}}>*/}
                                        {/*    <div className="d-flex p-2">*/}
                                        {/*        <div style={{marginRight: "1rem", height: "2.5rem"}} className="d-flex">*/}
                                        {/*            <img style={{borderRadius: "100%", alignItems: "center"}}*/}
                                        {/*                src={Account} alt={"profile"}/>*/}
                                        {/*            <div style={{*/}
                                        {/*                width: "10px",*/}
                                        {/*                height: "10px",*/}
                                        {/*                borderRadius: "50%",*/}
                                        {/*                background: "#4CE417",*/}
                                        {/*                alignSelf: "end",*/}
                                        {/*                marginBottom: "1px",*/}
                                        {/*                marginLeft: "-13px"*/}
                                        {/*            }}/>*/}
                                        {/*        </div>*/}
                                        {/*        <p style={{fontSize: ".8rem", textAlign: "left", color: "#1B1A57"}}>Name*/}
                                        {/*            of a person</p>*/}
                                        {/*    </div>*/}

                                        {/*    <div className="d-flex justify-content-center align-items-center px-2 mb-2">*/}
                                        {/*        <ReplyIcon sx={{height: "1rem"}} color="action"/>*/}
                                        {/*        <p className="d-flex justify-content-center align-items-center mb-0"*/}
                                        {/*            style={{fontSize: ".7rem", textAlign: "left", color: "#4F5E7B"}}>Some*/}
                                        {/*            chat here...</p>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                                                                


                                    </div>

                                </div>

                            </div>


                            <div className="m-2" style={{
                                boxShadow: "rgb(70 96 135 / 10%) -4px -18px 32px",
                                borderRadius: "16px 16px 0 0",
                                bottom: "0",
                                minHeight: "33vh", // TODO: This was 37 vh
                                height: "100%"
                            }}>
                                <div className="d-flex align-items-center justify-content-center">
                                    <div style={{
                                        width: "30px",
                                        height: "4px",
                                        background: "#4F5E7B",
                                        marginTop: "1rem",
                                        opacity: "0.2",
                                        borderRadius: "100px"
                                    }}>
                                    </div>
                                </div>
                                <div style={{marginBottom: "1rem"}} className="d-flex justify-content-between p-2">
                                    Recent Chats
                                    <SearchIcon sx={{color: "#4F5E7B"}}/>
                                </div>

                                <div className="chat-main" style={{height: "35vh", overflow: "auto"}}>
                                    {this.state.user?.chat_friends?.map((friend, i) =>
                                        (<Link to={`/chat/${friend.token}`} key={i}>
                                            <div className="d-flex mb-2">
                                                <div className="ms-2 me-1 d-flex">
                                                    {/*<img className="align-items-center"*/}
                                                    {/*    style={{borderRadius: "100%", height: "3rem"}} src={Account}*/}
                                                    {/*    alt={"profile"}/>*/}
                                                    <Avatar src={friend.name || undefined} variant="rounded" sx={{
                                                        height: "2.5rem",
                                                        borderRadius: "50%",
                                                        marginRight: "1rem",
                                                        alignItems: "center"
                                                    }}>{friend.name ? friend.name[0] : "?"}</Avatar>
                                                    <div style={{
                                                        width: "10px",
                                                        height: "10px",
                                                        borderRadius: "50%",
                                                        background: "#4CE417",
                                                        alignSelf: "end",
                                                        marginBottom: "5px",
                                                        marginLeft: "-24px",
                                                        zIndex: 1000,
                                                    }}/>
                                                </div>
                                                <div style={{color: "#1B1A57"}} className="text-start">
                                                    {friend.name}
                                                    {/*<p style={{color: "#4F5E7B"}}>recent message</p>*/}
                                                </div>
                                                <div style={{marginLeft: "auto", marginRight: ".5rem"}}
                                                    className="d-flex flex-column align-items-center">
                                                    <p style={{color: "#4F5E7B"}}
                                                        className="m-0">{friend.last_seen && this.getTime(new Date(friend.last_seen))}</p>
                                                    {/*<div style={{*/}
                                                    {/*    width: "24px",*/}
                                                    {/*    height: "24px",*/}
                                                    {/*    borderRadius: "50%",*/}
                                                    {/*    background: "blue",*/}
                                                    {/*    color: "#FFFFFF"*/}
                                                    {/*}}>3*/}
                                                    {/*</div>*/}
                                                </div>
                                            </div>
                                        </Link>)
                                    )}
                                </div>

                                <Fab style={{position: "fixed", bottom: 30, right: 20, background: "#385FF6"}}
                                    color="primary" aria-label="add">
                                    <img src={Plus} alt={"plus"}/>
                                </Fab>

                            </div>

                        </div>
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1}>
                        Recent calls
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2}>
                        Call
                    </TabPanel>
                    <TabPanel value={this.state.value} index={3}>
                        Contacts
                    </TabPanel>
                </SwipeableViews>
            </>
        );
    }
}


const Swiper = withRouter(SwiperLoc);

export default Swiper;
