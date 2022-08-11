import {Container} from "@mui/system";
import React from "react";
import Loader from "react-loader-spinner";
import {withRouter} from "react-router";
import {toast} from "react-toastify";
import {AuthComponent, AuthState} from "../../../api/auth";
import {Patient, PatientObject} from "../../../api/model";
import {StickyHead} from "../../Utils";
import Medical from "../cards/Medical";
import {AuthPropsLoc} from "../GiveHelp";
import CloseIcon from "@mui/icons-material/Close";

interface NewState extends AuthState {
    model: PatientObject;
    isLoading: boolean;
}

interface NewProps extends AuthPropsLoc {

    me?: boolean;
}

class ViewHelp extends AuthComponent<NewProps, NewState> {
    constructor(props: AuthPropsLoc) {
        super(props);
        this.state = {
            ...this.state,
            isLoading: true,
        };
    }

    givehelp = async (obj: PatientObject) => {
        try {
            await obj.modify("help/");
            toast.success("Thank you for helping out", {
                position: "bottom-center",
            });
        } catch (error) {
            console.error(error);
            toast.error((error as { details: string }).details, {
                position: "bottom-center",
            });
        }
    };

    componentDidMount() {
        console.log(this, this.props.me);
        Patient.action_general(this.props.me ? "help" : "all", {}, true).then((patients) => {
            const id: string = this.props.match.params.id as string;
            if (!id) this.props.history.push("/help");
            const results = patients.results;
            this.setState({model: results});
            const user = results.find((el: PatientObject) => el.id === parseInt(id));
            console.log(results);
            // if (!user) this.props.history.push("/help");
            this.setState({model: user});
            this.setState({isLoading: false});
            console.log(this.state.model);
        });
    }

    render() {
        if (this.state.isLoading)
            return (
                <>
                    <Container className="mt-5 pt-5 text-center">
                        <Container className=" tophead fixed-top d-flex justify-content-between p-3 ">
                            <CloseIcon
                                className="d-flex align-self-center"
                                onClick={() => this.props.history.goBack()}
                            />
                            <p className="align-self-center m-0 p-0 text-left flex-grow-1 pl-4">
                                <b>Give Help</b>
                            </p>
                        </Container>
                        <Loader type="Bars" color="#3a77ff" height={50} width={50}/>
                    </Container>
                </>
            );
        return (
            <>
                <Medical user={this.state.model} view={this.props.me}/>
                <Container className=" tophead fixed-top d-flex justify-content-between p-3 ">
                    <CloseIcon
                        className="d-flex align-self-center"
                        onClick={() => this.props.history.goBack()}
                    />
                    <p className="align-self-center m-0 p-0 text-left flex-grow-1 pl-4">
                        <b>Give Help</b>
                    </p>
                </Container>
            </>
        );
    }
}

export default withRouter(ViewHelp);
