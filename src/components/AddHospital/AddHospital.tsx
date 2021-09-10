import React, {useEffect, useState} from "react";
import {AuthComponent, AuthPropsLoc, AuthState} from "../../api/auth";
import {Container} from "react-bootstrap";
import {toast} from "react-toastify";
import {MapContainer, Marker as MarkerTag, TileLayer, useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import './AddHospital.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from "leaflet";
import {BiCurrentLocation, GrLocation} from "react-icons/all";
import {get} from "../../api/api";
import {Suggestion} from "../FullScreen/FullScreenLocation";
import {TextField} from "@material-ui/core";
import {Marker} from "../../api/model";
import {withRouter} from "react-router";

/**
 * Describes the marker icon in map 
 */

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

// Describes on the position of marker and set lat and lng value

interface LocationMarkerProps {
    updateCenter?: (lat: number, lng: number) => void
    setCenter?: (lat: number, lng: number) => void
    center: {
        lat: number,
        lng: number
    }
}

// Based on the searchvalue it returns the location suggestions

function LocationMarker(props: LocationMarkerProps) {
    const {updateCenter} = props
    const {center} = props
    const [position, setPosition] = useState(center)
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [selected, setSelected] = useState(-1)
    const [display, setDisplay] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const SuggestLocations = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
        setDisplay(1)
        let url;
        try {
            url = 'https://api.locationiq.com/v1/autocomplete.php';
            const values = await get(url, {
                key: 'pk.760f1338e289bacc788f9e0ae4a4951e',
                q: event.target.value,
                limit: 5,
                countrycodes: 'in'
            })
            console.log(values)
            let {error} = values
            if (!error) {
                setSuggestions(values)
            }
        } catch (e) {

        }
    }

   // Take on the value at current location of marker when enter key is pressed

    const handleEnter = () => {
        let item = suggestions[selected]
        if (item) {
            let newValue = item.address.name
            setSearchValue(newValue)
            let itemCent = {lat: item.lat, lng: item.lon}
            console.log(itemCent)
            map.flyTo(itemCent, map.getZoom())
            if (updateCenter) {
                updateCenter(item.lat, item.lon)
            }
            setPosition(itemCent)
            setDisplay(0)
        }
    }

    // handle the keys up down and enter through location suggestions

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log(e.key)
        if (e.key === 'ArrowUp' && suggestions.length > 0) {
            e.preventDefault()
            setSelected(selected === -1 ? -1 : selected - 1)
        } else if (e.key === "ArrowDown" && selected < suggestions.length - 1) {
            e.preventDefault()
            setSelected(selected + 1)
        } else if (e.key === "Enter") {
            e.preventDefault()
            handleEnter()
        }
    }
    const map = useMapEvents({

            click(e) {
                console.log(e)

                const {target} = e.originalEvent;
                if (target) {
                    // @ts-ignore
                    const className = target.getAttribute('class')
                    console.log(className)
                    if (className) {
                        if (!className.includes('ignore-close')) {
                            setDisplay(0)
                        }
                    } else {
                        setDisplay(0)
                    }
                }

            },

            // Enables to drag the location marker throughout the map

            drag(e) {
                let latlng = map.getCenter()
                setPosition(latlng)
                if (updateCenter) {
                    updateCenter(latlng.lat, latlng.lng)
                }
                setDisplay(0)


            },
            
            // Enables to zoom out and zoom in within the map

            zoomlevelschange(e) {
                let latlng = map.getCenter()
                setPosition(latlng)
                if (updateCenter) {
                    updateCenter(latlng.lat, latlng.lng)
                }
                setDisplay(0)

            },

            // fetch the position of founded location

            locationfound(e) {
                setPosition(e.latlng)
                map.setView(e.latlng, e.accuracy)

                if (updateCenter) {
                    updateCenter(e.latlng.lat, e.latlng.lng)
                }
            },

            // Displays an error message asking the user to enable location services

            locationerror(e) {
                toast.error("Location is Disabled, Please enable location from the settings Menu", {
                    position: 'bottom-center'
                })
            }
        }
    )

    useEffect(() => {
        if(navigator.geolocation){
             navigator.geolocation.getCurrentPosition(()=>map.locate)
        }
    }, []);
    useEffect(() => {

    }, [suggestions])
    return position === null ? null : (
        <>
            <div className={'overlay w-100'}>
                <div className=" d-flex w-100 row-reverse justify-content-end flex-row px-3 pt-3">


                    <input className={"bg-grey w-75 px-3 px-3 py-2 ignore-close font-weight-regular search-map"}
                           onChange={SuggestLocations}
                           value={searchValue}
                           onKeyDown={handleKeyDown}
                           onFocus={() => setDisplay(1)}
                           type={'search'}
                           placeholder={"Search Hospital Location"}
                           autoComplete={'off'}
                    >
                    </input>
                    <button
                        className={"bg-grey d-flex align-items-center px-2  justify-content-center text-primary mx-1 search-map"}
                        onClick={() => {
                            console.log(map.getCenter())
                            map.locate()
                            setDisplay(0)

                        }}

                    >
                        <BiCurrentLocation size={25}/>
                    </button>

                </div>
                <div className=' d-flex w-100 row-reverse justify-content-end flex-row px-3 py-3'>
                    {display && suggestions.length !== 0 ?
                        <div className={"bg-white w-75 px-3 px-3 py-2 ignore-close font-weight-regular search-map"}>
                            {suggestions.map((item, i) =>
                                <button key={i} onClick={() => {
                                    let itemCent = {lat: item.lat, lng: item.lon}
                                    console.log(itemCent)
                                    map.flyTo(itemCent, map.getZoom())
                                    if (updateCenter) {
                                        updateCenter(item.lat, item.lon)
                                    }
                                    setSearchValue(item.address.name)
                                    setPosition(itemCent)
                                    setDisplay(0)
                                }}
                                        className={'d-flex w-100  flex-row align-items-center ignore-close py-2 border-bottom ' + ((i === selected) ? "active" : '')}>
                                    <GrLocation scale={4} size={25}
                                                className="ignore-close input-marker text-primary mr-3"/>
                                    <div className="ignore-close fill-rest"><b
                                        className={"ignore-close"}>{item.address.name}</b>
                                        <div className={"ignore-close"}>
                                            {[item.address.city, item.address.state, item.address.country].filter(Boolean).join(', ')}</div>
                                    </div>
                                </button>
                            )}
                        </div> : ''}
                    <div
                        className={"px-3  mx-2 "}
                    >
                    </div>

                </div>
            </div>
            <MarkerTag position={position}>
            </MarkerTag>
        </>
    )
}

interface AddHospitalState extends AuthState {
    position: number
    center: {
        lat: number,
        lng: number
    }
    name: string,
    Phone: string,
    ownership: string,
    type: string,
    category: string

}

export class AddHospitalLoc extends AuthComponent<AuthPropsLoc, AddHospitalState> {

    constructor(props: AuthPropsLoc) {
        super(props);

        this.state = {
            ...this.state,
            position: 0,
            center: {
                lat: 9.9313695,
                lng: 76.2673759,
            },
            name: '',
            Phone: '',
            ownership: 'U',
            type: 'U',
            category: 'U'
        }
    }

    setValue = (name: string, event: string | boolean | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let value
        if (typeof event !== "boolean" && typeof event !== 'string') {
            value = event.target.value
        } else {
            value = event
        }

        // @ts-ignore
        this.setState({[name]: value})

    }

    setCenter = (lat: number, lng: number) => {
        this.setState({
            center: {lat, lng}
        })
    }

    setPosition = (position: number) => {
        let filled = true
        console.log(filled)
        if (filled)
            this.setState({position})
        else {
            toast.error('Please fill all the required details before proceeding', {
                position: "bottom-center",
            });
        }
    }
    eventHandlers = (event: any) => {
        console.log(event)
    }

    postData = () => {
        if (this.state.name && this.state.Phone) {
            Marker.create({
                ...this.state,
                ...this.state.center
            }).then((marker) => {
                this.props.history.push(`/addHospital/addRequest/${marker.id}`)
                toast.success('thank you for the contribution', {
                    position: 'bottom-center'
                })
            }).catch((error) => {
                toast.error(error.details, {
                    position: 'bottom-center'
                })
            })
        } else {
            toast.error("please enter the required details", {
                position: 'bottom-center'
            })
        }
    }

    render() {
        if (!this.state.auth) {
            this.performAuth()
            return (<></>)
        } else {
            console.log(this.state.center)
            return (
                <div className="bg-grey d-flex flex-column  justify-content-between min-vh-100">

                    <Container className="mt-5 pt-4 ">
                        <h4><b>Add Hospital</b></h4>
                    </Container>
                    <Container className=" px-0 pb-3 pt-0 bg-white neumorphic-input">

                        {this.state.position === 0 &&
                        <div>
                            <MapContainer center={this.state.center} scrollWheelZoom={true} touchZoom={true}
                                          doubleClickZoom={true}
                                          zoom={15}
                            >

                                <TileLayer
                                    attribution='Map data &copy;  <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
                                    url="https://api.mapbox.com/styles/v1/sahilathrij/ckr296izue2ls18pdnk1z2dd6/tiles/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FoaWxhdGhyaWoiLCJhIjoiY2tyMjdtMzhmMjY4djJ1cWhpNms5azc1dCJ9.qfosI4PHQv8XO8bHqd-IQg"
                                    tileSize={512} zoomOffset= {-1}
                                />
                                <LocationMarker updateCenter={this.setCenter} center={this.state.center}/>

                            </MapContainer>

                        </div>

                        }
                        {this.state.position === 1 &&
                        <div className="d-flex flex-column px-3">
                            <h6 className="text-left"><b>Hospital Information</b></h6>
                            <TextField label="Hospital Name" required={true} variant="outlined"
                                       autoFocus
                                       className="my-1" type="text"
                                       value={this.state.name}
                                       onChange={(event) =>
                                           this.setValue("name", event)}
                                       helperText="Please enter Hospital Name"
                            />
                            <TextField label="Phone Number" required={true} variant="outlined"
                                       className="my-1" type="text"
                                       value={this.state.Phone}
                                       onChange={(event) =>
                                           this.setValue("Phone", event)}
                                       helperText="Please enter Hospital Phone"
                            />

                            <TextField label="Type of Center" required={true} variant="outlined"
                                       select
                                       className="my-1" type="select"
                                       helperText="Please enter Type of Wellness Center"
                                       SelectProps={{
                                           native: true,
                                       }}
                                       value={this.state.type}
                                       onChange={(event) =>
                                           this.setValue("type", event)}
                            >
                                <option value='U'>Uncategorized</option>
                                <option value='P'>Pharmacy</option>
                                <option value="C">Clinic</option>
                                <option value="W">Wellness Center</option>
                                <option value="H">Hospital</option>
                            </TextField>
                            <TextField label="Hospital Type" required={true} variant="outlined"
                                       select
                                       className="my-1" type="select"
                                       helperText="Please enter category of hospital"
                                       SelectProps={{
                                           native: true,
                                       }}
                                       value={this.state.category}
                                       onChange={(event) =>
                                           this.setValue("category", event)}
                            >
                                <option value='U'>Uncategorized</option>
                                <option value='E'>Economy</option>
                                <option value="N">Normal</option>
                                <option value="S">Specialty</option>
                                <option value="SS">Super Specialty</option>
                            </TextField>


                            <TextField label="Type of Ownership" required={true} variant="outlined"
                                       select
                                       className="my-1" type="select"
                                       helperText="Please enter type of Ownership"
                                       SelectProps={{
                                           native: true,
                                       }}
                                       value={this.state.ownership}
                                       onChange={(event) =>
                                           this.setValue("ownership", event)}
                            >
                                <option value='U'>Uncategorized</option>
                                <option value='Pu'>Public</option>
                                <option value="Pr">Private</option>
                                <option value="Co">Co-operative</option>
                            </TextField>

                        </div>
                        }


                        <div className="d-flex flex-row px-3 pt-2 w-100 justify-content-center">
                            {this.state.position !== 0 &&
                            <button className="btn w-50 btn-light" onClick={() => {
                                this.setPosition(this.state.position - 1)
                            }}>Previous</button>
                            }
                            {this.state.position !== 1 ?
                                <button className="btn w-50 btn-primary blue-gradient"
                                        onClick={() => {
                                            this.setPosition(this.state.position + 1)
                                        }}> Next</button> :
                                <button className="btn w-50 btn-success"
                                        onClick={() => this.postData()}> Submit</button>}
                        </div>
                    </Container>

                    <Container className=" py-2 bg-white neumorphic-input p-0 ">


                        <div className="space-50"/>
                    </Container>
                </div>

            )
        }
    }
}

export const AddHospital = withRouter(AddHospitalLoc)