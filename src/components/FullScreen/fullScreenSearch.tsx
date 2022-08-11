import {ResponsiveComponent, ResponsiveState} from "../ResponsiveComponent";
import {Container, Button, Chip, IconButton} from "@mui/material";
import {
    FullScreenLocationProps,
    LocationSearchBoxLoc,
    LocationSearchProps,
    LocationSearchState
} from "./FullScreenLocation";
import { TMarkerFilter, MarkerFilters, Marker } from "../../api/model";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import {getParam, setParam} from "../../api/QueryCreator";
import {withRouter} from "react-router";
import React from "react";
import "./fullScreenSearch.css";
import {toast} from "react-toastify";

import {withStyles} from "@mui/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import NorthWestIcon from "@mui/icons-material/NorthWest";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { PillSelect } from "../inputs/PillSelect";
interface LocationQuerySearchProps extends LocationSearchProps
{
    close: () => void,
    closeWindow?: () => void
}

type SuggestionSearch = {
    name: string;
    lat: number;
    lon: number;
    address: {
        country?: string;
        state?: string;
        city?: string;
        name: string
    }
}

interface LocationQuerySearchState extends LocationSearchState
{
    suggestionsSearch: SuggestionSearch[],
    selectedSearch: number,
    value: string,
    lat: string,
    lng: string,
    query: string,
    display: number | boolean,
    filters: TMarkerFilter,
    filter_active: boolean,
    location_active: boolean,

}

const StyledChip = withStyles({
    root: {},

    label: {
        padding: "0",
    },

})(Chip);

const departments = ["Cardiology", "Anaesthesiology", "Dermatology", "Endocrinology", "Gastroenterology", "Oncology",
    "Nephrology", "Neurology", "Paediatrics", "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Geriatrics", "Gynaecology", "Community Health", "ENT",
    "Dental", "Venerology", "Dietician", "Pathology", "General Physician", "Orthopaedics"];

export class LocationQuerySearchBoxLoc extends LocationSearchBoxLoc<LocationQuerySearchProps, LocationQuerySearchState>
{


    constructor(props: LocationQuerySearchProps)
    {
        super(props);
        this.state = {
            ...this.state,
            suggestionsSearch: [],
            selectedSearch: -1,
            query: getParam("query", "Search Hospital"),
            filters: {...MarkerFilters.getUnserialized()},
            filter_active: false,
            location_active: false,
        };

    }

    componentDidMount()
    {
    }

    componentDidUpdate()
    {
        console.log(this.state);
    }

    toggleDrawer = (newOpen: boolean) => () =>
    {
        console.log("adsasd");
        this.setState({filter_active: newOpen});
    };

    toggleLocation = (open: boolean) => () =>
    {
        this.setState({location_active: open});
    };


    setPersistence()
    {
        setParam("loc", this.state.value, "Select Location");
        setParam("query", this.state.query, "Search Hospital");
        setParam("lat", this.state.lat);
        setParam("lng", this.state.lng);
        MarkerFilters.setParams(this.state.filters);
        console.log(localStorage.getItem("lat"));
    }

    async queryData()
    {
        this.setPersistence();
        try 
        {
            const values = await Marker.filter({ search: this.state.query, limit: 5, ...MarkerFilters.getParams() });
            this.setState({ suggestionsSearch: values.results });
        }
        catch (e) 
        {
            toast.error("Internet Not Available", {
                position: "bottom-center",
            });
        }
    }

    async SuggestLocationsSearch(event: React.ChangeEvent<HTMLInputElement>)
    {
        this.setState({query: event.target.value}, async ()=>
        {
            this.queryData();
        });

    }

    handlePillSelect(type:keyof typeof this.state.filters, v: string)
    {
        const filter = this.state.filters[type]??[].slice();
        if(Array.isArray(filter))
        {
            const index = (filter as string[]).indexOf(v);
            
            if (index > -1)
                filter.splice(index, 1);
            else
                (filter as string[]).push(v);
        }
        this.setState({ filters:{...this.state.filters, [type]:filter} });            
    }

    handleEnterSearch()
    {
        const newSelected = this.state.suggestionsSearch[this.state.selectedSearch];
        const newValue = newSelected ? newSelected.name : this.state.query;
        this.setState({
            query: newValue,
            display: 0
        }, () =>
        {
            this.searchCallBack();
        });

    }


    handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) =>
    {

        const {selectedSearch, suggestionsSearch} = this.state;
        console.log(e.key);
        if (e.key === "ArrowUp" && suggestionsSearch.length > 0)
        {
            e.preventDefault();
            this.setState(prevState => ({
                selectedSearch: prevState.selectedSearch === -1 ? -1 : prevState.selectedSearch - 1
            }));
        }
        else if (e.key === "ArrowDown" && selectedSearch < suggestionsSearch.length - 1)
        {
            e.preventDefault();
            this.setState(prevState => ({
                selectedSearch: prevState.selectedSearch + 1
            }));
        }
        else if (e.key === "Enter")
        {
            e.preventDefault();
            this.handleEnterSearch();
        }
    };

    displaySuggestionsSearch(list: SuggestionSearch[])
    {
        return list.map((item: SuggestionSearch, i: number) =>
        {
            return (
                <Container
                    className={"w-100 d-flex py-3  select-locations " + ((i === this.state.selectedSearch) ? "active" : "")}
                    key={i}
                    onClick={() =>
                    {
                        const newValue = item.name;
                        this.setState({
                            query: newValue,
                            display: 0
                        }, () =>
                        {
                            this.searchCallBack();
                        });
                    }}>

                    {/*<LocalHospitalIcon sx={{width: "30px"}} className="input-marker mr-3"/>*/}
                    <div className="fill-rest">{item.name}
                    </div>
                    <NorthWestIcon/>
                </Container>
            );
        }
        );
    }


    render()
    {
        return (
            <div>
                <Container
                    className={"input-holder overflow-x-hidden mb-3 mx-2 "}>
                    <div className=" w-100 d-flex justify-content-between align-self-center">
                        <IconButton>
                            <ArrowBackIcon onClick={() => this.props.history.goBack()} />
                        </IconButton>

                        <input placeholder="Search Hospital" className="main-input w-75 mx-2 align-content-start pt-1"
                            value={this.state.query}
                            type="search"

                            onKeyDown={(event) =>
                            {
                                this.handleKeyDownSearch(event);
                            }}
                            onChange={(event) =>
                            {
                                this.SuggestLocationsSearch(event,).then();
                            }}
                            onFocusCapture={() =>
                            {
                                this.setState({display: 1});
                            }}
                        />
                        {this.state.query &&
                            <ArrowCircleRightIcon color={"primary"} sx={{width: 30}} className="align-self-center" onClick={() =>
                            {
                                this.searchCallBack();
                            }}/>
                        }

                    </div>

                    {/*{this.state.query &&*/}
                    {/*<CloseIcon sx={{width: 30}} className="input-marker mr-2" onClick={() =>*/}
                    {/*{*/}
                    {/*    this.setState({query: ""},*/}
                    {/*        () =>*/}
                    {/*        {*/}
                    {/*            this.setPersistence();*/}
                    {/*        });*/}
                    {/*}}/>}*/}
                </Container>
                <div className="d-flex align-items-center p-2 flex-column"
                    style={{boxShadow: "0px 6px 6.25px rgba(0, 0, 0, 0.25)"}}>
                    {/*<LocationOnIcon sx={{marginRight: "auto"}}*/}
                    {/*    onClick={() => (this.setState({location_active: !this.state.location_active})*/}
                    {/*    )}/>*/}
                    <div className="d-flex align-items-center w-100">
                        <Button sx={{textTransform: "none", marginRight: "auto"}} startIcon={<LocationOnIcon/>}
                            onClick={() => (this.setState({location_active: !this.state.location_active})
                            )}>
                            {this.state.value || "Select Location"}
                        </Button>
                        <Button sx={{textTransform: "none", marginLeft: "auto"}} endIcon={<KeyboardArrowDownIcon/>}
                            onClick={() => (this.setState({filter_active: !this.state.filter_active})
                            )}>
                            Search options
                        </Button>
                    </div>

                    <div className="bottombox w-100 py-1" style={{overflowX: "auto", whiteSpace: "nowrap"}}>
                        {
                            Object.entries(this.state.filters).flatMap(([k, v], i1) => 
                            {
                                return (v as string[]).map((vK, i2) =>
                                    (
                                        <StyledChip className="col-xs-4 mx-1" key={i1+i2} sx={{
                                            background: " #3E64FF", borderRadius: "5px", color: "white",
                                            fontSize: "8px", width: "76px", height: "21px"
                                        }} label={((MarkerFilters.choiceList as any)[k] as any)[vK as any]} />
                                    ));
                            })
                        }

                    </div>

                </div>

                <div>
                    {this.state.display === 1 ? this.displaySuggestionsSearch(this.state.suggestionsSearch) : ""}
                </div>

                <SwipeableDrawer anchor="bottom"
                    open={this.state.location_active}
                    onClose={this.toggleLocation(false)}
                    onOpen={this.toggleLocation(true)}
                    disableSwipeToOpen={false}
                    ModalProps={{
                        keepMounted: true,
                    }} className="fixed-bottom w-100 h-50 p-3" sx={{overflowY: "auto"}}>

                    <div className="filtertop d-flex w-100 justify-content-between p-2 align-self-center">
                        <h6 className="mb-0 d-flex align-items-center">Search By Location</h6>
                        <IconButton onClick={() =>
                        {
                            this.setState({location_active: !this.state.location_active}
                            );
                        }}>
                            <CloseIcon fontSize={"small"} sx={{color: "#0338B9"}}/>
                        </IconButton>
                    </div>
                    <div className="filterbottom d-flex flex-column pt-1">

                        <Container
                            className={"w-100 d-flex align-items-center input-holder " + ((2 === this.state.display) ? "active-blue" : "")}>
                            {/* <MarkerSvg className=" input-marker"/> */}

                            {this.state.value &&
                            <CloseOutlinedIcon fontSize={"small"} onClick={() =>
                            {
                                this.setState({value: ""},
                                    () =>
                                    {
                                        this.setPersistence();
                                    }
                                );
                            }}/>}

                            <input placeholder="Select Location"
                                className={"main-input"}
                                type="search"
                                ref={input => input && input.focus()}
                                value={this.state.value}
                                onKeyDown={(event) =>
                                {
                                    this.handleKeyDown(event);
                                }}
                                onFocusCapture={() =>
                                {
                                    this.setState({display: 2});
                                }}
                                onChange={(event) =>
                                {
                                    this.SuggestLocations(event).then();
                                }}/>

                            {this.state.value &&
                            <ArrowCircleRightIcon color={"primary"} sx={{width: 30}} className="align-self-center" onClick={() =>
                            {
                                this.handleEnter();
                            }}/>
                            }
                        </Container>
                        {(this.state.display === 2 || this.state.display === 0) &&
                        <Container className="w-100 d-flex align-items-center text-primary mt-2 py-3 select-locations pointers"
                            onClick={() =>
                            {
                                this.getLocation().then();
                            }}>
                            <MyLocationOutlinedIcon className="input-marker"/>
                            <div className="w-100 m-1"> Use Current Location</div>
                        </Container>}
                        {this.state.display === 2 ? this.displaySuggestions(this.state.suggestions) : ""}

                    </div>

                </SwipeableDrawer>

                <SwipeableDrawer anchor="bottom"
                    open={this.state.filter_active}
                    onClose={()=>this.toggleDrawer(false)}
                    onOpen={this.toggleDrawer(true)}
                    disableSwipeToOpen={false}
                    ModalProps={{
                        keepMounted: true,
                    }} className="fixed-bottom w-100 h-50 p-3" sx={{overflowY: "auto"}}>

                    <div className="filtertop w-100 d-flex justify-content-between pt-3 pb-2 px-3 align-self-center">
                        Select the tags you want to search
                        <IconButton  onClick={() =>
                        {
                            this.setState({filter_active: false});
                            this.queryData();
                        }}>
                            <CloseIcon sx={{color: "#0338B9"}}/>
                        </IconButton>
                    </div>
                    {Object.keys(this.state.filters)?.length? <Button sx={{width:"fit-content", marginLeft:"auto"}} className="bg-grey d-flex justify-content-end" endIcon={<ClearAllIcon sx={{color: "#0338B9"}}/>} onClick={() =>
                    {
                        MarkerFilters.reset();
                        this.setState({filters: {}});
                    }}>
                        clear
                    </Button>:<></>}
                    <div className="filterbottom d-flex flex-column">
                        <div className="filterhead text-center w-100 mb-4 mt-4 ">Types</div>
                        <div className="chips d-flex flex-wrap justify-content-between align-items-center">
                            
                            <PillSelect values={MarkerFilters.choiceList.category__in??{}} selected={this.state.filters.category__in??[]} onChange={(v) => this.handlePillSelect("category__in", v)} />

                        </div>
                        <div className="filterhead text-center w-100 mb-4 mt-2 ">Departments</div>
                        <div className="chips d-flex flex-wrap justify-content-between align-items-center">
                            
                            <PillSelect values={Object(departments)} selected={[]} onChange={(v) => ""} />

                        </div>
                        <div className="filterhead text-center w-100 mb-4 mt-2 ">Ownership</div>
                        <div className="chips d-flex flex-wrap justify-content-between align-items-center">
                            
                            <PillSelect values={MarkerFilters.choiceList.ownership__in??{}} selected={this.state.filters.ownership__in??[]} onChange={(v) => this.handlePillSelect("ownership__in", v)} />

                        </div>
                        <div className="filterhead text-center w-100 mb-4 mt-2 ">Medicine</div>
                        <div className="chips d-flex flex-wrap justify-content-around align-items-center">

                            <PillSelect values={MarkerFilters.choiceList.medicine__in??{}} selected={this.state.filters.medicine__in??[]} onChange={(v) => this.handlePillSelect("medicine__in", v)} />

                        </div>
                    </div>

                </SwipeableDrawer>

            </div>

        );

    }

}

export const LocationQuerySearchBox = withRouter(LocationQuerySearchBoxLoc);

export class FullScreenSearch extends
    ResponsiveComponent<FullScreenLocationProps, ResponsiveState>
{
    render()
    {
        return (<div className="fixed-top w-100 h-100 bg-white header">

            <Container  className="mt-3 p-0">
                <LocationQuerySearchBox close={() => null} closeWindow={this.props.close}   />
            </Container>
        </div>);
    }
}
