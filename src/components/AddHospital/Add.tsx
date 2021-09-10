import {AuthComponent, AuthProps, AuthState} from "../../api/auth";
import React from "react";
import {Route} from "react-router";

import {AddHospital} from "./AddHospital";
import {AddHospitalPhoto} from "./AddHospitalPhoto";

/**
 *@extends AuthComponent
 */

export class Add extends AuthComponent<AuthProps, AuthState> {

/**
 * if the user is authenticated proceed to page 
 * else proceeds to login page
 * @returns { JSX.Element } Add Component
 */

    render() {
        if (this.state.auth) {
            return (
                <React.Fragment>
                    <Route path={"/addHospital/photo/:hspId"}>
                        <AddHospitalPhoto/>
                    </Route>
                    <Route exact={true} path={"/addHospital"}>
                        <AddHospital/>
                    </Route>
                </React.Fragment>
            )
        } else {
            this.performAuth()
            return <></>
        }
    }
}
