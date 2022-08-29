import { Button, Container} from "@mui/material";
import React from "react";

import "./index.css";

import star from "../../images/star.svg";
import fadestar from "../../images/fadestar.svg";
import CloseIcon from "@mui/icons-material/Close";
import {Link} from "react-router-dom";
import Addhosp from "../../images/addhospcard.svg";
import Givehelp from "../../images/givehelpcard.svg";
import Nurse from "../../images/nurse 1.png";
// import SearchUser from "../../images/Male-user-search-icon.png";
import Ambulanceimg from "../../images/ambulance 1.png";
import Medicine from "../../images/Medicine.svg";
import Doc from "../../images/Doc.svg";
import Laboratory from "../../images/laboratory 1.png";
import BloodBank from "../../images/blood-bank 1.png";
import request from "../../images/helphand.svg";


const BigBlueButtonStyle = {
    letterSpacing: "0.49px",
    borderRadius: "20px",
    background: "linear-gradient(180deg, #0338B9 0%, #3E64FF 100%)",
};

interface StickyHeadProps
{
    title: string,
    onClick: () => undefined | Promise<void> | void,
    goBack: () => void,
    action?: string,
}

export const BigBlueButton = ({...props}) =>
{
    const {text} = props;
    return (<Button
        {...props}
        className="nunito-bold-white-16px p-3 my-3 "
        fullWidth
        variant="contained"
        sx={{...BigBlueButtonStyle, textTransform: "none", fontWeight: "700px"}}
    >
        {text as string}
    </Button>
    );
};

export const StarRating = ({rating}: { rating: number }) => (
    <Container>
        {[...Array(Math.round(5 - rating))].map((e, i) => (
            <img
                key={i}
                className="rtg align-self-start mt-4 ml-1"
                src={fadestar}
                alt="rating"
            />
        ))}

        {[...Array(Math.round(rating))].map((e, i) => (
            <img
                key={i}
                className="rtg align-self-start mt-4 ml-1"
                src={star}
                alt="rating"
            />
        ))}
    </Container>
);



export const StickyHead = ({title, action, onClick, goBack}: StickyHeadProps) => (
    <>
        <Container className=" tophead fixed-top d-flex justify-content-between p-3" style={{backgroundColor:'#e6e6e6'}}>
            <CloseIcon className="d-flex align-self-center" onClick={() => goBack()} style={{cursor:"pointer"}}/>
            <p className="align-self-center m-0 p-0 text-left flex-grow-1 pl-4"><b>{title}</b>
            </p>
            <Button className="sub" onClick={onClick}
                variant="contained">{action || "Submit"}</Button>

        </Container>
        <div className=" mb-4 mt-4 pt-4 pb-2">

        </div>
    </>
);

export const NineCards =()=>(
    <>
        <div>
            <div className="container d-flex justify-content-between  p-0 align-self-center px-2">
                <Link style={{textDecoration:"none"}} className="homecard" to="/search">
                    <div>
                        <img src={Addhosp} alt=""/>
                        <div className="cardtxt ">Hospital</div>
                    </div>
                </Link>
                {/*<Link style={{textDecoration:"none"}} className="homecard" to="/searchuser">*/}
                {/*    <img style={{width: "3.5rem"}} src={SearchUser} alt=""/>*/}
                {/*    <div style={{marginTop: "0"}} className="cardtxt ">Search User</div>*/}
                {/*</Link>*/}
                <Link style={{textDecoration:"none"}} className="homecard" to="/searchdoctor">
                    <div >
                        <img src={Doc} alt=""/>
                        <div className="cardtxt m-0">Doctor</div>
                    </div>
                </Link>

                <div className="homecard">
                    <img src={Laboratory} alt=""/>
                    <div className="cardtxt ">Laboratory</div>
                </div>
            </div>

        </div>
        <div>

            <div className="container d-flex justify-content-between my-2 p-0 align-self-center px-2">

                <Link style={{textDecoration:"none"}} className="homecard" to="/quickRequest">
                    <div >
                        <img src={request} alt=""/>
                        <div className="cardtxt m-0">Request</div>
                    </div>
                </Link>

                <Link style={{textDecoration:"none"}} className="homecard" to="/help">
                    <div>
                        <img src={Givehelp} alt=""/>
                        <div className="cardtxt ">Give help</div>
                    </div>
                </Link>

                <Link style={{textDecoration:"none"}} className="homecard" to="/searchnurse">
                    <div >
                        <img src={Nurse} alt=""/>
                        <div className="cardtxt m-0">Nurse</div>
                    </div>
                </Link>

            </div>

        </div>
        <div>

            <div className="container d-flex justify-content-between  p-0 align-self-center px-2">

                <div className="homecard">
                    <img src={Medicine} alt=""/>
                    <div className="cardtxt ">Medicine</div>
                </div>

                <div className="homecard">
                    <img src={BloodBank} alt=""/>
                    <div className="cardtxt ">Blood Bank</div>
                </div>

                <Link style={{textDecoration:"none"}} className="homecard" to="/searchambulance">
                    <img src={Ambulanceimg} alt=""/>
                    <div className="cardtxt ">Ambulance</div>
                </Link>

            </div>

        </div>
    </>
);
