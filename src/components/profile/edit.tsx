import {AuthComponent, AuthState, getAuth, setObj} from "../../api/auth";
import {Language, LanguageObject} from "../../api/model";
import {AuthPropsLoc} from "../GiveHelp/GiveHelp";
import {withRouter} from "react-router";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import {Avatar, Container, TextField, Autocomplete, MenuItem} from "@mui/material";

import * as React from "react";
import "./edit.css";

import cam from "../../images/cam-pic.jpg";
import {StickyHead} from "../Utils";
import {toast} from "react-toastify";
import {baseUrl, filePatch, patch} from "../../api/api";
import {ChangeEvent} from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MUIController from "../Form/MUIControl";
import HookFormWrapper from "../Form/HookFormWrapper";
import { DeepPartial } from "../../types/utils";



const schema = yup.object({

    age: yup.number().typeError("Must be number").max(110, "Enter a valid age"),
    gender: yup.string(),
    address: yup.string(),
    phone_number: yup.string().matches(/^\+?\d{10,14}$/, {message:"Enter a valid mobile number."}).label("Mobile number"),
    first_name: yup.string().required().matches(/^[A-Z ]+$/i, {message:"Enter a valid name"}),
    last_name: yup.string().required().matches(/^[A-Z ]+$/i, {message:"Enter a valid name"}),
    language: yup.mixed()
}).required();

interface EditState extends AuthState
{
    active: boolean,
    languages: Array<LanguageObject>,
    searchTerm: string,

}


class Edit extends AuthComponent<AuthPropsLoc, EditState>
{
    fileInput: React.RefObject<HTMLInputElement>;

    constructor(props: AuthPropsLoc)
    {
        super(props);
        if (this.state.user)
            this.state = {
                ...this.state,
                languages: [],
                searchTerm: "",
                user: {
                    ...this.state.user,
                    tokens: { ...this.state.user?.tokens, language: this.state.user?.tokens.language ?? [] }
                }


            };
        
        this.getLanguages().then(undefined);
        this.fileInput = React.createRef();
    }

    componentWillMount()
    {
        if(!this.state.user)
            this.props.history.push("/");
    }
    save = (d: yup.InferType<typeof schema>) =>
    {
        if (!this.state.user)
            return;
        const {first_name, last_name, ...tokens} = d;
        const user: DeepPartial<typeof this.state.user> = {...this.state.user, first_name, last_name, tokens:{...this.state.user.tokens, ...tokens}};
        const access_token = getAuth();

        return patch(`${baseUrl}/auth/users/me/`, user, {"Authorization": `Bearer ${access_token}`}).then(({results}) =>
        {
            setObj("user", results[0]);
            this.props.history.push("/profile");
            toast.success("Successfully edited your details", {
                position: "bottom-center"
            });
        }).catch((error) =>
        {
            toast.error(error.details, {
                position: "bottom-center"
            });
        });
    };

    uploadImage = (event: ChangeEvent<HTMLInputElement>) =>
    {
        event.preventDefault();

        const reader = new FileReader();
        const file = event.target.files?.[0];
        if (file)
        {

            reader.onloadend = () =>
            {
                const formData = new FormData();

                formData.append(
                    "image",
                    file,
                    file.name
                );

                const headers = {"Authorization": `Bearer ${getAuth()}`};

                filePatch(baseUrl + "/auth/users/me/", formData, headers).then(() =>
                {
                    toast.success("Successfully updated photo", {
                        position: "bottom-center"
                    });
                }).catch((error) =>
                {
                    toast.error(error.details, {
                        position: "bottom-center"
                    });
                });
            };
            reader.readAsDataURL(file);
        }
    };

    async getLanguages ()
    {
        Language.filter({search: this.state.searchTerm}).then((languages) => 
        {
            const results = languages.results;
            this.setState({languages: results});
        });

    } 

    editSearchTerm = (e: string) => this.setState({searchTerm: e}, this.getLanguages);

    render()
    {
        console.log(this.state.user?.tokens);
        const user = this.state.user!;
        return (
            <HookFormWrapper<yup.InferType<typeof schema>>
                defaultValues={{
                    first_name: this.state.user?.first_name,
                    last_name: this.state.user?.last_name,
                    phone_number: this.state.user?.tokens.phone_number??"",
                    address: this.state.user?.tokens.address,
                    age: this.state.user?.tokens.age,
                    gender: this.state.user?.tokens.gender
                }}
                resolver={yupResolver(schema)}>
                {
                    ({ control, handleSubmit, getValues, register }) => 
                    {
                        const submit = handleSubmit((d) => this.save(d), (err)=>console.log(err));

                        return (
                            <div>
                                <StickyHead title="Edit Your Profile" action={"Save"} onClick={submit}
                                    goBack={this.props.history.goBack} />
                                <Container className="d-flex justify-content-center my-3">
                                    <input type="file" hidden onChange={this.uploadImage} accept="image/*" ref={this.fileInput} />
                                    <Avatar sx={{ width: "107px", height: "107px" }}
                                        onClick={() => this.fileInput.current?.click()}
                                        src={this.state.user?.tokens.profile || cam}
                                    />
                                </Container>
                                {this.state.user &&
                                    <Container className="px-5 ">
                                        <p className="txthead mt-3 ">FIRST NAME</p>
                                        <div className="d-flex justify-content-between flex-row align-items-center">
                                            <MUIController name='first_name' control={control as any}>
                                                {
                                                    (props) => <TextField
                                                        {...props}
                                                        fullWidth
                                                        variant="standard"
                                                        InputProps={{
                                                            endAdornment: (
                                                                <button onClick={() => 
                                                                {
                                                                    this.setState({
                                                                        ...this.state,
                                                                        user: { ...user, first_name: "" }
                                                                    });
                                                                }}>
                                                                    <HighlightOffIcon />
                                                                </button>
                                                            ),
                                                        }}
                                                    />
                                                }
                                            </MUIController>
                                        </div>
                                        <p className="txthead mt-3">LAST NAME</p>
                                        <div className="d-flex justify-content-between flex-row align-items-center">                                  <div className="d-flex justify-content-between flex-row align-items-center">
                                            <MUIController name='last_name' control={control as any}>
                                                {
                                                    (props) => <TextField
                                                        {...props}
                                                        fullWidth
                                                        variant="standard"
                                                        InputProps={{
                                                            endAdornment: (
                                                                <button onClick={() => 
                                                                {
                                                                    this.setState({
                                                                        ...this.state,
                                                                        user: { ...user, last_name: "" }
                                                                    });
                                                                }}>
                                                                    <HighlightOffIcon />
                                                                </button>
                                                            ),
                                                        }}
                                                    />
                                                }
                                            </MUIController>
                                        </div>
                                        {/*<p className="txthead mt-3">EMAIL</p>*/}
                                        {/*<div className="d-flex justify-content-between flex-row align-items-center">*/}
                                        {/*    <TextField*/}
                                        {/*        value={this.state.user?.email}*/}
                                        {/*        fullWidth*/}
                                        {/*        onChange={({target}) => this.setState({*/}
                                        {/*            ...this.state,*/}
                                        {/*            user: {...this.state.user, email: target.value} as User*/}
                                        {/*        })}*/}
                                        {/*        variant="standard"*/}
                                        {/*        InputProps={{*/}
                                        {/*            endAdornment: (*/}
                                        {/*                <button onClick={() =>*/}
                                        {/*                {*/}
                                        {/*                    this.setState({*/}
                                        {/*                        ...this.state,*/}
                                        {/*                        user: {...this.state.user, email: ""} as User*/}
                                        {/*                    });*/}
                                        {/*                }}>*/}
                                        {/*                    <HighlightOffIcon/>*/}
                                        {/*                </button>*/}
                                        {/*            ),*/}
                                        {/*        }}*/}
                                        {/*    />*/}
                                        {/*</div>*/}
                                        <p className="txthead mt-3">PHONE</p>
                                        <div className="d-flex justify-content-between flex-row align-items-center">
                                            <MUIController name='phone_number' control={control as any}>
                                                {
                                                    (props) => <TextField
                                                        fullWidth
                                                        {...props}
                                                        variant="standard"
                                                        InputProps={{
                                                            endAdornment: (
                                                                <button onClick={() => 
                                                                {
                                                                    this.setState({
                                                                        ...this.state,
                                                                        user: {
                                                                            ...user,
                                                                            tokens: { ...user.tokens, phone_number: "" }
                                                                        }
                                                                    });
                                                                }}>
                                                                    <HighlightOffIcon />
                                                                </button>
                                                            ),
                                                        }}
                                                    />
                                                }
                                            </MUIController>
                                        </div>
                                        <div className="d-flex justify-content-between flex-row align-items-center"></div>
                                        <MUIController name='gender' control={control as any}>
                                            {
                                                (props) => <TextField sx={{ width: 212 }}
                                                    className="mt-4"
                                                    select
                                                    variant="outlined"
                                                    label="Gender *"
                                                    InputLabelProps={{ shrink: true, }}
                                                    {...props}
                                                >
                                                    <MenuItem value={"M"}>Male</MenuItem>
                                                    <MenuItem value={"F"}>Female</MenuItem>
                                                    <MenuItem value={"NB"}>Non Binary</MenuItem>
                                                    <MenuItem value={"NP"}>Prefer Not to Say</MenuItem>
                                                </TextField>
                                            }
                                        </MUIController>
                                        </div>
                                        <MUIController name='age' control={control as any}>
                                            {
                                                (props) => <TextField sx={{ width: 90 }} className="mt-4" variant="outlined"
                                                    label="Age *"
                                                    InputLabelProps={{ shrink: true, }}
                                                    {...props}
                                                />
                                            }
                                        </MUIController>
                                        <MUIController name='address' control={control as any}>
                                            {
                                                (props) => <TextField className="mt-4" fullWidth variant="outlined"
                                                    label="Location *" InputLabelProps={{ shrink: true, }}
                                                    {...props}
                                                />
                                            }
                                        </MUIController>
                                        <div className="d-flex justify-content-between flex-row align-items-center">
                                            <p className="txthead mt-3">LANGUAGES</p>
                                            <div className="d-flex justify-content-between flex-row align-items-center">
                                                <Autocomplete
                                                    multiple
                                                    fullWidth
                                                    autoSelect
                                                    defaultValue={user.tokens.language as any}
                                                    options={this.state.languages}
                                                    getOptionLabel={(language) => language.name}
                                                    onChange={(_, language) => this.setState({
                                                        ...this.state,
                                                        user: {
                                                            ...user,
                                                            tokens: { ...user.tokens, language: language }
                                                        }
                                                    })}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            fullWidth
                                                            onChange={(event) => this.editSearchTerm(event.target.value)}
                                                        />)}
                                                />
                                            </div>
                                        </div>
                                        <div className="bottom-sec">
                                            <hr className="linestyle" />
                                            <div className="endtxt pb-4">We appreciate your kindness</div>
                                        </div>
                                    </Container>
                                }
                            </div>
                        );
                    }
                }
            </HookFormWrapper>

        );
    }
}

export const EditPage = withRouter(Edit);
