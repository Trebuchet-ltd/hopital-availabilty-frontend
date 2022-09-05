import { AuthComponent, AuthState, refresh_user } from "../../api/auth";
import React from "react";
import { Route } from "react-router";
import { ProfileDetails } from "./ProfileDetails";
import "./profile.css";
import { RequestDetails } from "./RequestDisplay";
import { DoctorComponent } from "../Doctor/Doctor";



export class Profile extends AuthComponent<Record<string, string | undefined>, AuthState>
{
    render() {
        refresh_user();

        if (this.state.auth)

            return (
                <React.Fragment>
                    <Route path={"/profile/edit"}>
                        <div>whit</div>
                    </Route>

                    <Route path="/profile/request/:requestId">
                        <RequestDetails />
                    </Route>

                    <Route exact={true} path={"/profile"}>
                            <ProfileDetails />
                    </Route>
                </React.Fragment>
            );

        else {
            this.performAuth();
            return <></>;
        }
    }
}
