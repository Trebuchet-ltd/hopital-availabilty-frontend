import {Marker, MarkerObject} from "../../api/model";
import {AuthComponent, AuthPropsLoc, AuthState} from "../../api/auth";
import React from "react";

import './details.css'
import {Container} from "react-bootstrap";
import Loader from "react-loader-spinner";
import {withRouter} from "react-router";

import doctorsvg from '../../images/doctor.svg';
import layoutsvg from '../../images/layout.svg';
import reviewsvg from '../../images/review.svg';
import starsvg from '../../images/star.svg';

import image from "./icons/image@2x.png"
import icon from "./icons/icon-1@2x.png"
import icon2 from "./icons/icon@2x.png"
import share_icon from "./icons/shareicon.svg"
import phone_icon from "./icons/vector-26@2x.png"
import map_pin from "./icons/map-pin.svg"
import direction_icon from "./icons/primary@2x.png"

// import {DepartmentCards} from "./DepatrmentCards"
import {DoctorCards} from "./DoctorCards";


interface DetailsState extends AuthState {
    id: number,
    model: MarkerObject,
    ready: boolean,
    open_availability: HTMLElement | null,
    popovertext: string,
    show_review: boolean,
}


class DetailsLoc extends AuthComponent<AuthPropsLoc, DetailsState> {


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


    hashChange = () => {
        if (!this.props.location.hash.includes('review')) {
            this.setState({show_review: false})
        } else {
            this.setState({show_review: true})
        }
    }

    async refreshReviews() {
        this.setState({ready: false})
        //TODO: fix later
        // @ts-ignore
        let {hspId} = this.props.match.params
        let marker = await Marker.get(hspId) as MarkerObject

        this.setState({model: marker, ready: true, id: hspId})

    }

    async componentDidMount() {
        super.componentDidMount()
        await this.refreshReviews()
    }

    handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        this.setState({open_availability: event.currentTarget});
    };
    handleClose = () => {
        this.setState({open_availability: null});
    };

    handlePhotoUpload = () => {
        this.props.history.push(`/addHospital/photo/${this.state.id}`)

    }

    render() {
        let {model} = this.state

        return (
            this.state.ready ?
                <>
                    <div className="d-flex flex-column w-100 container">
                        <div className="w-100 flex-row container pt-5">
                            <div className="w-100 d-flex flex-row justify-content-between">
                                <img alt={""} width={"15px"} height={"15px"} src={icon2}
                                     onClick={() => this.props.history.goBack()}/>
                                <img alt={""} width={"5px"} height={"15px"} src={icon}/>
                            </div>

                            <img alt={""} className="m-0" height={"178px"} width={"178px"} src={image}/>
                        </div>
                        <div className="font-weight-bold h4">
                            {model.name}
                        </div>
                        <div className="w-100 justify-content-center d-flex flex-column">
                            <div className="w-100 d-flex flex-row justify-content-center">
                                <img alt={""} src={map_pin} width={"12px"} height={"12px"}/>
                                <div className="details-place">
                                    {[model.address.village, model.address.suburb, model.address.county, model.address.state].filter(Boolean).join(', ')}
                                </div>
                            </div>
                            <div className="w-100 d-flex justify-content-around">
                                <ActionButton src={direction_icon} caption={"Route"}
                                              action={`https://www.google.com/maps/search/${model.name}/@${model.lat},${model.lng},19.88z`}/>
                                <ActionButton src={phone_icon} caption={"Phone"} action={`tel:${model.Phone}`}/>
                                <ActionButton src={share_icon} caption={"Share"}
                                              share={{title: model.name, url: this.props.location.pathname}}/>
                            </div>

                        </div>
                        <div className="hosp-about">
                            <div
                                className="container d-flex flex-row justify-content-between nunito-semi-bold-ebony-clay-18px">
                                <div className="font-weight-bold">
                                    About
                                </div>
                                <div className="d-flex flex-row">
                                    {model.care_rating}
                                    <img alt={""} className="staricon" src={starsvg}/>
                                </div>

                            </div>
                            <p className="container text-justify nunito-bold-lynch-14px">
                                {model.about || "No details available ):"}
                            </p>
                        </div>
                        <div className="container d-flex justify-content-between">

                            <div className="card-about card-1">
                                <img src={doctorsvg} alt={"doctor svg"}/>
                                <p className="m-0"><b>{model.doctors.length}</b><br/>Doctors</p>
                            </div>

                            <div className="card-about card-1">
                                <img src={layoutsvg} alt={"layout svg"}/>
                                <p className="m-0"><b>good</b><br/>Layout</p>
                            </div>

                            <div className="card-about card-1">
                                <img src={reviewsvg} alt={"review svg"}/>
                                <p className="m-0"><b>{model.comment.length}<br/></b>Ratings<br/>&amp; Reviews</p>
                            </div>

                        </div>
                    </div>
                    <DoctorCards models={model.doctors}/>
                </> :
                <Container fluid={true} className="my-5 py-5 ">
                    <Loader type="Bars" color="#3a77ff" height={50} width={50}/>
                </Container>


        );
    }

}

class ActionButton extends React.Component<{ src: string, caption: string, action?: string, share?: ShareData }, {}> {
    render() {
        return (
            <div className="d-flex flex-column align-items-center">
                <a
                    href={this.props.action || "#"}
                    onClick={() => this.props.share && navigator.share(this.props.share)} // TODO use proper share
                    target={this.props.action ? "_blank" : "_self"}
                >
                    <div className="group-6839">
                        <div className="overlap-group-7">
                            <img alt={"Action Icons"}
                                 height={"30px"}
                                 width={"30px"}
                                 src={this.props.src}
                            />
                        </div>
                    </div>
                    <div className="nunito-semi-bold-ebony-clay-17px">
                        {this.props.caption}
                    </div>
                </a>
            </div>
        );
    }
}

export const Details = withRouter(DetailsLoc);