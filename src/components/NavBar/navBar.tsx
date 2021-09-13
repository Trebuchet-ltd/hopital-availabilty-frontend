import React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {FullScreenSearch} from "../FullScreen/fullScreenSearch";
import {Link} from "react-router-dom";
import {FullScreenUser} from "../FullScreen/FullSreenUser";
import {getParam} from "../../api/QueryCreator";
import {FullScreenFilter} from "../FullScreen/FullScreenFilter";
import {FullScreenLocation} from "../FullScreen/FullScreenLocation";
import {BiSearch, BiSlider} from "react-icons/all";
import {CSSTransition} from "react-transition-group";
import {Container, Navbar} from "react-bootstrap";
import {ResponsiveComponent, ResponsiveProps, ResponsiveState} from "../ResponsiveComponent";
import {ReactComponent as Burger} from "../../images/burger.svg";
import {ReactComponent as Brand} from '../../images/brand.svg';
import {ReactComponent as MarkerSvg} from '../../images/markersvg.svg';

import './nabar.css'

interface NavBarProp extends RouteComponentProps<ResponsiveProps> {

}
/** 
 * properties of ResponsiveState is called in to NavBarState
 * Assigning type of variables
 */
interface NavBarState extends ResponsiveState {

    loc: string,
    show_location: boolean,
    query: string,
    show_search: boolean,
    show_filter: boolean,
    show_user: boolean,
}

export class NavBarLoc extends ResponsiveComponent<NavBarProp, NavBarState> {
/**
 * Constructor description.
 * initialize loc, query
 * @returns { JSX.Element } navBar Component
 */
    constructor(props: NavBarProp) {
        super(props);
        this.state = {
            ...this.state,
            loc: getParam('loc', 'Select Location', true),       //get parameter or set it as default value 
            query: getParam('query', 'Search Hospital', true),  //get parameter or set it as default value 
            show_user: window.location.href.includes('#user'),         //set as true if is url contain #user
            show_filter: window.location.href.includes('#filter'),    //set as true if is url contain #filter
            show_location: window.location.href.includes('#location'),   //set as true if is url contain #location
            show_search: window.location.href.includes('#search')       //set as true if is url contain #search
        }
    }

    /**
     * The function runs on hash change and sets the states appropriately.
     */
    hashChange = () => {

        this.setState({
            show_user: window.location.href.includes('#user'),
            show_filter: window.location.href.includes('#filter'),
            show_location: window.location.href.includes('#location'),
            show_search: window.location.href.includes('#search')
        })
    }

    render() {
        let currentLocation = this.props.location.search + this.props.location.hash 
        let showSearchBar = !this.props.location.pathname.includes('/details') &&       //to hide search bar in details, profiles, addhospital
            !this.props.location.pathname.includes('/profile') &&
            !this.props.location.pathname.includes('/addHospital')
        return (
            <Navbar collapseOnSelect expand="xl" variant="dark"
                    className={"navbar  fixed-top " + (showSearchBar ? 'bg-white' : 'bg-grey')}
                    id="navbar">

                <Container fluid={true}>
                    <div className="justify-content-start">
                        <Navbar.Toggle aria-controls="navbarSupportedContent" className="BlueBackground p-2"
                                       onClick={() => {

                                           this.props.history.push(currentLocation + '#user')
                                           this.setState({show_user: !this.state.show_user})
                                       }}>
                            <Burger/>
                        </Navbar.Toggle>

                        <CSSTransition classNames="user-screen" in={this.state.show_user} timeout={300}
                                       unmountOnExit>
                            <FullScreenUser close={() => {
                                this.props.history.goBack()
                                this.setState({show_user: false})
                            }}/>
                        </CSSTransition>
                        <Navbar.Brand className="navbar-brand px-3">
                            <Link to={'/'}>
                                <Brand width={30} height={30}/>
                            </Link>
                        </Navbar.Brand>
                    </div>
                    {this.props.location.pathname === '/search' &&
                    <>
                        <button className="pointers" onClick={() => {
                            this.props.history.push(currentLocation + '#filter')
                            this.setState({show_filter: !this.state.show_filter})
                        }}><BiSlider scale={4} size={30}/>
                        </button>
                        <CSSTransition classNames="filter-screen" in={this.state.show_filter} timeout={300}
                                       unmountOnExit>
                            <FullScreenFilter close={() => {
                                this.props.history.goBack()
                                this.setState({show_filter: false})
                            }}/>
                        </CSSTransition>
                    </>
                    }
                    {(this.props.location.pathname !== '/search' && showSearchBar) &&
                    <>
                        <button className="pointers" onClick={() => {
                            this.props.history.push(currentLocation + '#location')
                            this.setState({show_location: !this.state.show_location})
                        }}>{this.state.loc}
                            <MarkerSvg/>
                        </button>
                        <CSSTransition classNames="location-screen" in={this.state.show_location} timeout={300}
                                       unmountOnExit>
                            <FullScreenLocation close={() => {

                                let loc = getParam('loc', 'Search Location')
                                this.props.history.goBack()
                                this.setState({show_location: false, loc: loc})
                            }}/>
                        </CSSTransition>
                    </>
                    }


                </Container>

                {showSearchBar &&
                <>
                    <button className="w-100 container input-holder pointers m-2" onClick={() => {
                        this.props.history.push(currentLocation + '#search')

                        this.setState({show_search: !this.state.show_search})
                    }}>
                        <BiSearch scale={4} size={30} className=" input-marker ml-3 mr-2"/>
                        <div
                            className="main-input searchbox fill-rest overflow-hidden"> {
                            this.props.location.pathname === '/search' ?
                                <><b>{this.state.query}</b> near <b>{this.state.loc}</b></> :
                                <b>{this.state.query || 'Search Hospital'}</b>

                        }</div>
                    </button>
                    <CSSTransition classNames="location-screen" in={this.state.show_search} timeout={300}
                                   unmountOnExit
                    >
                        <FullScreenSearch close={() => {

                            let loc = getParam('loc', 'Select Location')
                            let query = getParam('query', 'Search Hospital')
                            this.props.history.goBack()
                            this.setState({loc: loc, query: query})
                            this.setState({show_search: false})
                        }}/>
                    </CSSTransition>
                </>
                }

            </Navbar>

        )
    }

}


export const NavBar = withRouter(NavBarLoc);