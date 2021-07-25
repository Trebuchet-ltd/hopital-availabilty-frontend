import React from "react";
import {Col, Container} from "react-bootstrap";
import {AuthComponent, AuthPropsLoc, AuthState} from "../../api/auth";
import DotsMobileStepper from "./Banners";
import {withRouter} from "react-router";

import './index.css'
import SwipeableTextMobileStepper from "./Banners";
import {getParam} from "../../api/QueryCreator";
import {Marker} from "../../api/model";
import {ModelObject} from "../../api/api";
import {SearchResults} from "../cards/SearchResultCard";


interface IndexState extends AuthState {
    display: boolean
    lat?: string,
    lng?: string,
}

class IndexLoc extends AuthComponent<AuthPropsLoc, IndexState> {

    constructor(props: AuthPropsLoc) {
        super(props);
        let lat = getParam('lat',)
        let lng = getParam('lng',)
        this.state = {
            ...this.state,
            display: true,
            lat, lng
        }
    }


    render() {

        return (
            <React.Fragment>
                <Container fluid={true} className=" mt-5 p-5 bg-grey">

                </Container>
                <Container className="bg-grey">
                    <SwipeableTextMobileStepper/>
                </Container>
                <Container className="pt-3 text-left">
                    <h6>Hospitals Near You</h6>
                    <Col xs={12} id="searchresults">
                        <SearchResults updateParent={() => {
                        }}/>
                    </Col>
                </Container>

            </React.Fragment>)
    }

}

export const Index = withRouter(IndexLoc);