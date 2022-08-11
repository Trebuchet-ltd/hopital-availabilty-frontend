import "./bootstrap.min.css";
import {Index} from "./components/Index";
import React from "react";
import {Route, RouteComponentProps, Switch, withRouter} from "react-router";
import {Search} from "./pages/search";
import {getParam} from "./api/QueryCreator";
import {Details} from "./components/Details/Details";
import {HandleInvite, HandleToken, refresh_user} from "./api/auth";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {Profile} from "./components/profile/Profile";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./App.css";
import {BottomNav} from "./components/NavBar/BottomNav";

import {ThemeProvider} from "@mui/styles";
import {green, pink} from "@mui/material/colors";
import {Privacy} from "./components/Privacy/Privacy";
import {Add} from "./components/AddHospital/Add";
import {DoctorComponent, BookingComponent} from "./components/Doctor/Doctor";
import {AddDoctorComponent} from "./components/AddDoctor/AddDoctor";
//import { AddDepartmentComponent } from "./components/AddDepartment/AddDepartment";
//import { Addpatient } from "./components/AddPatient/AddPatient";

const AddDepartmentComponent = React.lazy(() => import("./components/AddDepartment/AddDepartment"));
const Addpatient = React.lazy(() => import("./components/AddPatient/AddPatient"));
const Chat = React.lazy(() => import("./components/Chat"));
const Swiper = React.lazy(() => import("./components/Chat/Swiper"));
const VideoCall = React.lazy(() => import("./components/VideoCall"));
const Notification = React.lazy(() => import("./components/Notification/Notification"));
const ViewHelp = React.lazy(() => import("./components/GiveHelp/help/View"));
const Givehelp = React.lazy(() => import("./components/GiveHelp/GiveHelp"));
const SearchNurse = React.lazy(() => import("./components/Nurses/SearchNurse"));
const SearchAmbulance = React.lazy(() => import("./components/Ambulance/SearchAmbulance"));
const Searchdoctor = React.lazy(() => import("./components/Doctor/Searchdoctor"));

//import { Givehelp } from "./components/GiveHelp/GiveHelp";
import {AddHospitalReview} from "./components/AddReview/AddHospitalReview";
import {createTheme} from "@mui/material/styles";
//import Searchdoctor from "./components/Doctor/Searchdoctor";
import {NavBar} from "./components/NavBar/navBar";
//import SearchNurse from "./components/Nurses/SearchNurse";
import {AddNurseComponent} from "./components/Nurses/AddNurse";
import {NurseComponent} from "./components/Nurses/Nurse";
import {UserPage} from "./components/User/Login";
import {EditPage} from "./components/profile/edit";
//import SearchAmbulance from "./components/Ambulance/SearchAmbulance";
import {AddFriendComponent} from "./components/AddFriend/AddFriend";
import {AddAmbulanceComponent} from "./components/Ambulance/AddAmbulance";

//import Chat from "./components/Chat";
//import Swiper from "./components/Chat/Swiper";
//import VideoCall from "./components/VideoCall";
//import Notification from "./components/Notification/Notification";
import {SearchUser} from "./components/Search/SearchUser";
import {Quickrequest} from "./components/AddPatient/QuickRequest";
//import ViewHelp from "./components/GiveHelp/help/View";
//SREEHARI TRIES
import SlotArrange from "./components/DoctorDashBoard/SlotArrange";

const theme = createTheme({
    palette: {
        primary: {
            main: "#0091ea",
        },
        secondary: pink,
        success: green,
    },
});

function Suspense({children}: { children: React.ReactNode }) {
    return <React.Suspense fallback={<>LOADING...</>}>
        {children}
    </React.Suspense>;
}

interface AppRouterProps {
    title: string; // This one is coming from the router
}

type AppProps = RouteComponentProps<AppRouterProps>;

class AppLoc extends React.Component<AppProps> {
    /**
     * Initialize props
     * Set the location into history stack
     */

    constructor(props: AppProps) {
        super(props);
        const location = this.props.location.pathname + this.props.location.search;
        this.props.history.replace(location);
        refresh_user();
    }

    /**
     * componentDidMount() method allows us to execute the React code even after component is rendered
     */
    componentDidMount() {
        getParam("lat", "", true);
        getParam("lng", "", true);
        getParam("loc", "Search Location", true);
        getParam("query", "Search Hospital", true);
    }

    /**
     * componentDidUpdate() method use to execute the code when the state of component changes
     */
    componentDidUpdate() {
        getParam("lat", "", true);
        getParam("lng", "", true);
        getParam("loc", "Search Location", true);
        getParam("query", "Search Hospital", true);
    }

    render() {
        return (
            <div className="App">
                {/*
         * Initialize the theme
         */}
                <ThemeProvider theme={theme}>
                    <ToastContainer
                        position="bottom-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />

                    <Switch>
                        <Route path="/chat/:chatId">
                            <Suspense>
                                <Chat/>
                            </Suspense>

                        </Route>
                        <Route path="/video_call/:chatId">
                            <Suspense>
                                <VideoCall/>
                            </Suspense>

                        </Route>
                        <Route path="/chat" exact>
                            <Suspense>
                                <Swiper/>
                            </Suspense>
                            <BottomNav/>
                        </Route>
                        <Route path="/doctor/add/:hospital">
                            <AddDoctorComponent/>
                            <BottomNav/>
                        </Route>
                        <Route path="/department/add/:hospital">
                            <AddDepartmentComponent/>
                            <BottomNav/>
                        </Route>
                        <Route path="/doctor/:docId" exact>
                            <DoctorComponent/>
                            <BottomNav/>
                        </Route>{" "}
                        {/* Show details about a doctor */}
                        <Route path="/doctor/:docId/book">
                            <BookingComponent/>
                        </Route>{" "}
                        {/* Show booing doctor */}
                        <Route path="/doctor/add/:hospital">
                            <AddDoctorComponent/>
                            <BottomNav/>
                        </Route>
                        <Route path="/addFriend/:token">
                            <AddFriendComponent/>
                            <BottomNav/>
                        </Route>
                        <Route path="/notification">
                            <Suspense>
                                <Notification/>
                            </Suspense>
                        </Route>
                        <Route path="/details/reviews/:hspId">
                            <AddHospitalReview/>
                            <BottomNav/>
                        </Route>
                        <Route path="/details/:hspId">
                            {" "}
                            <Details/>
                        </Route>
                        {/* Show details about a hospital */}
                        <Route path="/search" exact>
                            <NavBar/>
                            <Search/>
                            <BottomNav/>
                        </Route>
                        <Route path="/searchuser">
                            <SearchUser/>
                        </Route>
                        <Route path="/ambulance">
                            <Suspense>
                                <SearchAmbulance/>
                            </Suspense>
                            <BottomNav/>
                        </Route>
                        <Route path={"/profile/edit"}>
                            <EditPage/>
                            <BottomNav/>
                        </Route>
                        {/* If the current URL is /profile, this route is rendered
            while the rest are ignored */}
                        <Route path="/profile/">
                            <Profile/>
                            <BottomNav/>
                            {/* If the current URL is /set_token, this route is rendered
            while the rest are ignored */}
                        </Route>
                        <Route path="/set_token/">
                            <HandleToken/>
                            <BottomNav/>
                        </Route>
                        {/* If the current URL is /invite, this route is rendered
            while the rest are ignored */}
                        <Route path="/invite/">
                            <HandleInvite/>
                            <BottomNav/>
                        </Route>
                        {/* If the current URL is /AddHospital, this route is rendered
            while the rest are ignored */}
                        <Route path="/AddHospital/">
                            <Add/>
                            <BottomNav/>
                        </Route>
                        {/* If the current URL is /privacypolicy, this route is rendered
            while the rest are ignored */}
                        <Route path="/privacypolicy/">
                            <Privacy/>
                            <BottomNav/>
                        </Route>
                        <Route path={"/addRequest"}>
                            <Suspense>
                                <Addpatient/>
                            </Suspense>
                            <BottomNav/>
                        </Route>
                        <Route path={"/quickRequest"} exact>
                            <Quickrequest/>
                            <BottomNav/>
                        </Route>
                        <Route path={"/help"} exact>
                            <Suspense>
                                <Givehelp/>
                            </Suspense>
                            <BottomNav/>
                        </Route>
                        <Route path={"/help/me/:id"}>

                            <BottomNav/>
                            <Suspense>
                                <ViewHelp me={true} />
                            </Suspense>
                        </Route>
                        <Route path={"/help/:id"}>
                            {/* <Givehelp/> */}
                            <BottomNav/>
                            <Suspense>
                                <ViewHelp/>
                            </Suspense>
                        </Route>
                       
                        <Route path={"/searchdoctor"}>
                            <Suspense>
                                <Searchdoctor/>
                            </Suspense>
                            <BottomNav/>
                        </Route>
                        <Route path={"/searchnurse"}>
                            <Suspense>
                                <SearchNurse/>
                            </Suspense>
                            <BottomNav/>
                        </Route>
                        <Route path={"/addnurse/"}>
                            <AddNurseComponent/>
                            <BottomNav/>
                        </Route>
                        <Route path="/searchambulance">
                            <SearchAmbulance/>
                            <BottomNav/>
                        </Route>
                        <Route path="/addambulance">
                            <AddAmbulanceComponent/>
                            <BottomNav/>
                        </Route>
                        <Route path={"/adddoctor"}>
                            <AddDoctorComponent withoutHospital={true}/>
                            <BottomNav/>
                        </Route>
                        <Route path="/nurse/:nurseId">
                            <NurseComponent/>
                            <BottomNav/>
                        </Route>
                        <Route path={"/user"}>
                            <UserPage/>
                            <BottomNav/>
                        </Route>
                        <Route path={"/doctor"}>
                            <SlotArrange/>
                            <BottomNav/>
                        </Route>
                        {/* If the current URL is /, this route is rendered
            while the rest are ignored */}
                        <Route path="/">
                            <NavBar/>
                            <Index/>
                            <BottomNav/>
                        </Route>
                    </Switch>
                </ThemeProvider>
            </div>
        );
    }
}

const App = withRouter(AppLoc);
export default App;
