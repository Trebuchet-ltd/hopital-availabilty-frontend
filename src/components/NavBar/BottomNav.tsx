import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import React from "react";
import {AuthComponent, AuthPropsLoc, AuthState} from "../../api/auth";
import {withRouter} from "react-router";
import Addhosp from "../../images/addhosp_bw.svg";
// import Explore from "../../images/explore_bw.svg";
import Help from "../../images/help_bw.svg";
import Chat from "../../images/chat_home.svg";
import home from "../../images/home_bw.svg";
import homeaf from "../../images/home_af.svg";
import Account from "../../images/accn_bw.svg";
import Addhospaf from "../../images/addhosp_af.svg";
// import Exploreaf from "../../images/explore_af.svg";
import Helpaf from "../../images/help_af.svg";
import Chataf from "../../images/chat_af.svg";
import Accountaf from "../../images/accnt_af.svg";


/**
 * AuthState called into BottomNavState and assigned value to string type
 */
interface BottomNavState extends AuthState {
    value: string
    active: number
}

class BottomNavLoc extends AuthComponent<AuthPropsLoc, BottomNavState> 
{
    constructor(props: AuthPropsLoc) 
    {
        super(props);
        const tempvalue: number = this.getActive();
        const value: string = this.icons[tempvalue].path;
        this.state = {...this.state, value, active: tempvalue};
    }

    /**
     * returns string corresponding to path
     * @returns string
     */
    getActive() 
    {
        return this.props.location.pathname.includes("/addHospital") ? 1 :
            this.props.location.pathname.includes("/help") ? 2 :
                this.props.location.pathname.includes("/chat") ? 3 :
                    this.props.location.pathname.includes("/profile/") ? 4 : 0; 
    }

    hashChange = () => 
    {
        console.log(this.getActive());
        const tempvalue: number = this.getActive();
        const value: string = this.icons[tempvalue].path;

        this.setState({value: value, active: tempvalue}); //passing string corresponding to path to value
    };

    /**
     * set the value to state and redirect to value
     * @param _
     * @param value
     * @param active
     */
    handleChange = (_: unknown, value: string, active: number) =>
    {
        this.setState({value, active});
        this.props.history.push(value);
        this.props.history.push(value);
        this.props.history.goBack();
    };
    icons = [
        {path: "/", iconbf: home, iconaf: homeaf},
        {path: "/addHospital", iconbf: Addhosp, iconaf: Addhospaf},
        {path: "/help", iconbf: Help, iconaf: Helpaf},
        {path: "/chat", iconbf: Chat, iconaf: Chataf},
        {path: "/profile/", iconbf: Account, iconaf: Accountaf}
    ];

    render(): JSX.Element 
    {
        return <React.Fragment>
            <div className="py-4 w-100"></div>
            <BottomNavigation value={this.state.value} className='fixed-bottom'
            >
                {this.icons.map((icon, key) => (
                    <BottomNavigationAction sx={{minWidth: "auto", padding: "0", maxWidth: "auto", width: "auto"}}
                        onClick={(event) =>
                            (this.handleChange(event, icon.path, key))} key={key}
                        value={icon.path}     //TODO Onclick correction
                        icon={<img alt=""
                            src={this.state.active === key ? icon.iconaf : icon.iconbf}/>}/>))}
            </BottomNavigation>
        </React.Fragment>;

    }
}

export const BottomNav = withRouter(BottomNavLoc);
