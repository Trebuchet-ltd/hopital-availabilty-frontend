import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./details.css";

import {DoctorObject} from "../../api/model";
import doctor_fallback from "./icons/doctor-fallback.png";
import {Container} from "@mui/material";
import starsvg from "../../images/star.svg";

import search_icon from "./icons/search-icon.svg";
import {BigBlueButton} from "../Utils";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";


interface CardProps
{
    model: DoctorObject
}


export default class DoctorProfile extends React.Component<CardProps, { open: boolean }> 
{
    constructor(props: CardProps) 
    {
        super(props);
        this.setState({open: false});
    }

    render() 
    {
        return (
            <Link className="my-3 doctor-card" style={{textDecoration:"none"}} to={`/doctor/${this.props.model.id}`}>

                <div>
                    <div>
                        <div className="d-flex">
                            <img className="Doc-icon"
                                src={this.props.model.image || doctor_fallback}
                                alt={""}
                                width={"80px"}
                                height={"80px"}
                            />
                            <div style={{width: "-webkit-fill-available"}} className="d-flex justify-content-center flex-column align-items-start">
                                <div style={{fontSize: "18px"}} className="nunito-black-ebony-clay-16px text-start">
                                    {this.props.model.name}
                                </div>
                                <div className="nunito-black-lynch-12px text-start">
                                    {this.props.model.specialization || "General"}
                                </div>
                                <div className="bold">
                                    <img
                                        src={starsvg} alt={"star"}/> {this.props.model.rating || 0} ({(this.props.model.reviews || []).length} reviews)
                                </div>
                                <div className="bold" style={{marginLeft: "auto", marginRight: "1rem", marginTop: "20px"}}>
                                    <div>
                                        Available Slot
                                    </div>
                                    <div style={{color: "#3E64FF"}}>
                                        12 December 03pm
                                    </div>
                                    <p style={{color: "#A1A1A1", fontSize: "13px"}}>
                                        view more<ArrowDropDownIcon/>
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="d-flex justify-content-between">
                            <div className="d-flex mx-2 bold" style={{textDecoration:"none"}}>
                                Hospital Name<br/>
                                8 Years Experience
                            </div>

                            <Link className="d-flex align-items-center" style={{textDecoration:"none", marginRight: "2rem"}} to={`/doctor/${this.props.model.id}/book`}>
                                <Button sx={{width: "99px", background: " linear-gradient(180deg, #0338B9 0%, #3E64FF 100%);", borderRadius: "20px"}} variant="contained">Book</Button>
                            </Link>
                        </div>

                    </div>
                </div>
            </Link>
        );
    }
}


export class DoctorCards extends Component<{ models: DoctorObject[], hospital: number }, Record<string, unknown>>
{

    render() 
    {
        return (
            <div>{this.props.models.length ?
                <Link to="#searchDoctor" className="searchbar d-flex flex-row mb-3">
                    <img
                        alt="Search Icon"
                        className="col-2 pr-0"
                        src={search_icon}
                        width="22px"
                        height="22px"
                    />
                    <div className="search-for-doctors col-10 text-left pl-0">Search For Doctors</div>
                </Link>:null}
            <Container className="doc-container">

                <div className="doc-subc">

                    {this.props.models.map((model, i) => <DoctorProfile model={model} key={i}/>)}

                </div>
                <Link to={`/doctor/add/${this.props.hospital}`}>
                    <BigBlueButton text="Add Doctor"/>
                </Link>
            </Container>
            </div>
        );
    }
}

