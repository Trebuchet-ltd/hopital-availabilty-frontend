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
import React from "react";

import {Container} from "react-bootstrap";
import Loader from "react-loader-spinner";
import {withRouter} from "react-router";

interface DetailsState extends AuthState {
    id: number,
    model: DoctorObject,
    ready: boolean,
    open_availability: HTMLElement | null,
    popovertext: string,
    show_review: boolean,


}

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
                    <div className="text-1nunito-semi-bold-ebony-clay-20px">
                        {model.name}
                    </div>
                    <div className="viralogistnunito-semi-bold-lynch-14px">
                        {model.specialization}
                    </div>
                    <div className="flex-row-1">
                        <div className="overlap-group">
                            <div className="group">
                                <img alt={""}
                                     className="icon-3"
                                     src={icon2}
                                />
                            </div>
                            <div className="text-2nunito-semi-bold-ebony-clay-17px">
                                {model.patients}
                            </div>
                            <div className="patientsnunito-bold-lynch-12px"> Patients</div>
                        </div>
                        <div className="overlap-group1">
                            <div className="group-1">
                                <img alt={""}
                                     className="icon-4"
                                     src={icon3}
                                />
                            </div>
                            <div className="addressnunito-semi-bold-ebony-clay-16px">
                                {model.experience}
                            </div>
                            <div className="experiencenunito-bold-lynch-12px">Experience</div>
                        </div>
                        <div className="overlap-group2">
                            <div className="group-2">
                                <img alt={""}
                                     className="icon-5"
                                     src={icon4}
                                />
                            </div>
                            <div className="text-3nunito-semi-bold-ebony-clay-17px">
                                {model.rating}
                            </div>
                            <div className="ratingsnunito-bold-lynch-12px">Rating</div>
                        </div>
                    </div>
                </div>
                <div className={"about"}>
                    <div className="about-doctornunito-semi-bold-ebony-clay-18px">
                        {model.about}
                    </div>
                    <p className="dr-bellamy-nicholasnunito-bold-lynch-14px">
                        {model.name}
                    </p>
                </div>
                <div className={"about "}>
                    <div className="about-doctornunito-semi-bold-ebony-clay-18px">Working Time</div>
                    <p className="dr-bellamy-nicholasnunito-bold-lynch-14px">
                        {model.working_time}
                    </p>
                </div>
                <div className="communication">
                    <div className="communication-1nunito-semi-bold-ebony-clay-18px">Communication</div>
                    <a href={`tel:${model.phone_number}`}>
                        <div className="message">
                            <div className="overlap-group-1">
                                <img alt={""}
                                     className="icon"
                                     src={icon5}
                                />
                            </div>
                            <div className="flex-col">

                                <div className="messagingnunito-bold-ebony-clay-16px">Messaging</div>
                                <p className="chat-me-up-share-phnunito-bold-lynch-12px">Chat with me</p>
                            </div>

                        </div>
                    </a>
                    <a href={`tel:${model.phone_number}`}>
                        <div className="audio">
                            <div className="overlap-group-2">
                                <img alt={""}
                                     className="icon"
                                     src={icon6}
                                />
                            </div>
                            <div className="flex-col-1">
                                <div className="audio-callnunito-bold-ebony-clay-16px">Audio Call</div>
                                <div className="call-your-doctor-dirnunito-bold-lynch-12px">Call your doctor directly.
                                </div>
                            </div>
                        </div>
                    </a>
                    <a href={`tel:${model.phone_number}`}>
                        <div className="video-call">
                            <div className="overlap-group-3">
                                <img alt={""}
                                     className="icon-6"
                                     src={icon7}
                                />
                            </div>
                            <div className="flex-col-2">
                                <div className="video-call-1nunito-bold-ebony-clay-16px">Video Call</div>
                                <div className="text-4nunito-bold-lynch-12px">See your doctor live.</div>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="button">
                    <div className="overlap-group3">
                        <div
                            className="book-appointmentnunito-bold-white-16px"
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