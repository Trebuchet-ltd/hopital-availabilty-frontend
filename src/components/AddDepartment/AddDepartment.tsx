import {AuthComponent, AuthPropsLoc, AuthState} from "../../api/auth";
import {withRouter} from "react-router";
import {MenuItem, TextField, Button} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./AddDepartment.css";
import {Department, DepartmentName, DepartmentNameObject} from "../../api/model";
import {toast} from "react-toastify";
import Skeleton from "@mui/material/Skeleton";

interface AddDepartmentState extends AuthState {
    departments: Array<DepartmentNameObject>,
    id: number,
    hospital: number,
    ready?: boolean
}


class AddDepartmentLoc extends AuthComponent<AuthPropsLoc, AddDepartmentState> 
{

    async componentDidMount() 
    {
        super.componentDidMount();
        
        const {hospital} = this.props.match.params as unknown as { hospital: number };
        const departments = await DepartmentName.filter();

        this.setState({
            departments: departments.results as Array<DepartmentNameObject>,
            hospital,
            ready: true,
        });
    }

    saveDepartment = () => 
    {
        Department.create({name_id: this.state.id, hospital: this.state.hospital})
            .then(() => 
            {
                this.props.history.push(`/details/${this.state.hospital}`);
                toast.success("thank you for the contribution", {
                    position: "bottom-center"
                });
            }).catch((error) => 
            {
                toast.error(error.details, {
                    position: "bottom-center"
                });
            });
    };

    render(): JSX.Element 
    {


        return (
            this.state.ready ?
                <div className="main h-100">
                    <div className="head-sec d-flex justify-content-between p-3 shadow-none h-25">
                        <CloseIcon onClick={() => this.props.history.goBack()} />
                        <p className="align-self-center m-0 p-0 justify-content-center"><b>Add Department details</b>
                        </p>
                        <Button className="sub" variant="contained" onClick={this.saveDepartment}>Submit</Button>
                    </div>

                    <div className="m-4">

                        <TextField className="mt-4" fullWidth variant="outlined" select label="Name"
                            InputLabelProps={{shrink: true, }} size="small"
                            onChange={({target}) => this.setState({id: Number(target.value)})}>
                            {this.state.departments.map(({name, id}, i) =>
                                <MenuItem value={id} key={i}>{name}</MenuItem>
                            )}
                        </TextField>

                    </div>

                </div> :
                <div className="main h-100">
                    <div className="head-sec d-flex justify-content-between p-3 shadow-none h-25">
                        <CloseIcon onClick={() => this.props.history.goBack()}/>
                        <p className="align-self-center m-0 p-0 justify-content-center"><b>Add Department details</b>
                        </p>
                        <Button className="sub" variant="contained" onClick={this.saveDepartment}>Submit</Button>
                    </div>

                    <div className="m-4">
                        <Skeleton variant="rectangular" className="mt-2 w-100"  height={118} />
                    </div>
                </div>

        );
    }
}

const AddDepartmentComponent = withRouter(AddDepartmentLoc);
export default AddDepartmentComponent;
