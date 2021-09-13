import {Doctor, DoctorObject} from "../../api/model";

import "./doctor.css";

import icon1 from "./icons/icon-1@2x.svg";
import image from "./icons/image@2x.svg";
import icon from "./icons/icon@2x.svg";
import icon2 from "./icons/icon-2@2x.svg";
import icon3 from "./icons/icon-3@2x.svg";
import icon4 from "./icons/icon-4@2x.svg";
import icon5 from "./icons/icon-5@2x.svg";
import icon6 from "./icons/icon-6@2x.svg";
import icon7 from "./icons/icon-7@2x.svg";

import {AuthComponent, AuthPropsLoc, AuthState} from "../../api/auth";

import {Container} from "react-bootstrap";
import Loader from "react-loader-spinner";
import {withRouter} from "react-router";
import React from "react";

interface DetailsState extends AuthState {
    id: number,
    model: DoctorObject,
    ready: boolean,
    open_availability: HTMLElement | null,
    popovertext: string,
    show_review: boolean,


}

interface StatsProps {
    value: number, 
    title: string, 
    icon: string, 
    class: string
};

interface CommunicationProps {
    phone_number: number, 
    title: string, 
    icon: string, 
    text: string
};

class DoctorStats extends React.Component<StatsProps,{}> {
    render(){
        return (
            <div className="overlap-group">
                <div className={`group ${this.props.class}`} >
                    <img 
                        alt={this.props.title}
                        className="icon-3"
                        src={this.props.icon}
                    />
                </div>
                <div className="text-2 nunito-semi-bold-ebony-clay-17px">
                    {this.props.value}
                </div>
                <div className="patients nunito-bold-lynch-12px">
                    {this.props.title}
                </div>
            </div>
        );
    }
};

class Communication extends React.Component<CommunicationProps,{}>{
    render(){
        return (
            <a href={`tel:${this.props.phone_number}`}>
                <div className="message">
                    <div className="overlap-group-1">
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
};

class DoctorLoc extends AuthComponent<AuthPropsLoc, DetailsState> {


    constructor(props: AuthPropsLoc) {
        super(props);
        this.state = {
            ...this.state,
            id: 0,
            ready: false,
            open_availability: null,
            popovertext: 'Percentage Probability of Availing the services',
            show_review: false
        }
    }

    async refreshData() {
        this.setState({ready: false})
        //TODO: fix later
        // @ts-ignore
        let {docId} = this.props.match.params
        let doctor = await Doctor.get(docId) as DoctorObject

        this.setState({model: doctor, ready: true, id: docId})

    }

    async componentDidMount() {
        super.componentDidMount()
        await this.refreshData()
    }

    showDoctor({model, history}: { model: DoctorObject, history: {goBack: Function} }) {
        return (
            <>
                <div className="overlap-group4">
                    <div className="flex-row">
                        <div className="left-align">
                            <img alt={""}
                                 onClick={() => history.goBack()}
                                 className="icon-1"
                                 src={icon1}/>
                        </div>
                        <img alt={""}
                             className="image"
                             src={model.image?.uri ? model.image.uri : image}
                        />
                        <img alt={""}
                             className="icon-2"
                             src={icon}
                        />
                    </div>
                    <div className="text-1 nunito-semi-bold-ebony-clay-20px">
                        {model.name}
                    </div>
                    <div className="viralogist nunito-semi-bold-lynch-14px">
                        {model.specialization}
                    </div>
                    <div className="flex-row-1">
                        <DoctorStats value={model.patients} title={"Patients"} icon={icon2} class={"blue"}/>
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
                    <p className="dr-bellamy-nicholas nunito-bold-lynch-14px">
                        {model.working_time}
                    </p>
                </div>
                <div className="communication">
                    <div className="communication-1 nunito-semi-bold-ebony-clay-18px">Communication</div>
                    <Communication 
                        phone_number={model.phone_number} 
                        icon={icon5} 
                        title={"Messaging"} 
                        text={"Chat with your doctor."} />
                    <Communication 
                        phone_number={model.phone_number} 
                        icon={icon6} 
                        title={"Audio Call"} 
                        text={"Call your doctor directly."} />
                    <Communication 
                        phone_number={model.phone_number} 
                        icon={icon7} 
                        title={"Video Call"} 
                        text={"See your doctor live."} />
                </div>
                <div className="button">
                    <div className="overlap-group3">
                        <div
                            className="book-appointment nunito-bold-white-16px"
                            onClick={() => alert("Will be available in the next release.")}
                        >Book Appointment</div>
                    </div>
                </div>
            </>
        )
    }

    render() {
        return (
            this.state.ready ?
                <this.showDoctor model={this.state.model} history={this.props.history}/> :
                <Container fluid={true} className="my-5 py-5 ">
                    <Loader type="Bars" color="#3a77ff" height={50} width={50}/>
                </Container>


        );
    }

}


export const DoctorComponent = withRouter(DoctorLoc)