import Model, {baseUrl, filePost, ModelData, ModelObject, get} from "./api";
import {getAuth} from "./auth";

interface ImageObject {
    hospital: number
    image: string
    review: number | null
    useinmarker: boolean
}

export class MarkerObject extends ModelObject {
    lng: any;
    comment: object[] | any
    oxygen_availability: number = 0;
    covid_rating: number = 0;
    financial_rating: number = 0;
    oxygen_rating: number = 0;
    address: any;
    name: string | undefined;
    care_rating: number = 0;
    Phone: string | undefined;
    avg_cost: number = 0
    icu_availability: number = 0;
    model: any;
    images?: ImageObject[]
    ventilator_availability: number = 0;
    lat: any;


    constructor(data: ModelData, baseUrl: string) {

        super(data, baseUrl);
        this.fields = ["id", "Phone", "size", "financial_rating", "avg_cost", "covid_rating", "beds_available", "care_rating",
            "oxygen_rating", "ventilator_availability", "oxygen_availability", "icu_availability", "lat", "lng", "images",
            "display_address", "name", "datef", 'address', 'comment']
        this.getData()

    }

    async addPhoto(file: File) {
        const formData = new FormData();


        formData.append(
            "image",
            file,
            file.name
        );
        formData.append(
            'hospital',
            this.id.toString()
        )
        let headers = {'Authorization': `Bearer ${getAuth()}`}

        return await filePost(baseUrl + '/api/image/', formData, headers)
    }


}

export class DoctorObject extends ModelObject {
    id: number = -1;
    name: string | undefined;
    phone_number: number = -1;
    hospital: Array<number> = [];
    departments: Array<number> = [];
    user: number = -1;
    working_time: string | undefined;
    rating: number = -1;
    reviews: [] = [];
    patients: number = -1;
    experience: number = -1;
    specialization: string | undefined;
    about: string | undefined;
    image: { uri: string | undefined } = { uri: undefined };

    constructor(data: ModelData, baseUrl: string) {
        super(data, baseUrl);
        this.fields = ['id', 'name', 'phone_number', 'hospital', 'department', 'user', 'working_time',
            'rating', 'reviews', 'patients', 'experience', 'specialization', 'about', 'image'];
        this.getData();
    }

    // async addPhoto(file: File) {
    //     const formData = new FormData();
    //
    //
    //     formData.append(
    //         "image",
    //         file,
    //         file.name
    //     );
    //     formData.append(
    //         'hospital',
    //         this.id.toString()
    //     )
    //     let headers = {'Authorization': `Bearer ${getAuth()}`}
    //
    //     return await filePost(baseUrl + '/api/image/', formData, headers)
    // }


}

export class ReviewObject extends ModelObject {


    constructor(data: ModelData, baseUrl: string) {
        super(data, baseUrl);
        this.fields = ["id", "marker", "financial_rating", "avg_cost", "covid_rating", "beds_available", "care_rating",
            "oxygen_rating", "ventilator_availability", "oxygen_availability", "icu_availability", "comment", "datef",
            "images", "day",]
        this.getData()
    }
}

export class PatientObject extends ModelObject {
    Name: string = '';
    age: number = 0;
    gender: string = 'M';
    address: string = '';
    symptoms: string = '';
    covidresult: boolean = false;
    gender_name: string = '';
    symdays: string = '';
    spo2: number = 0;
    bedtype_name: string = '';
    blood: string = '';
    ct: boolean = false;
    ctscore: string = '';

    constructor(data: ModelData, baseUrl: string) {
        super(data, baseUrl);
        this.fields = ['id', 'Name', 'age', 'gender', 'address', 'symptoms', 'symdays', 'spo2', 'hospitalday', 'oxy_bed', 'covidresult',
            'hospitalpref', 'attendername', 'attenderphone', 'relation', 'srfid', 'bunum', 'blood', 'bedtype', 'ct',
            'ctscore', 'gender_name', 'bedtype_name']
        this.getData()
    }
}

export class susObject extends ModelObject {

    constructor(data: ModelData, baseUrl: string) {
        super(data, baseUrl);
        this.fields = ["id", "marker", "comment", "created_by", "datef"]
        this.getData()
    }
}

export const Review = new Model(baseUrl + '/api/review/', ReviewObject)
export const Sus = new Model(baseUrl + '/api/suspicious/', susObject)
export const Marker = new Model(baseUrl + '/api/marker/', MarkerObject)
export const Doctor = new Model(baseUrl + '/internals/doctors/', DoctorObject)
export const Patient = new Model(baseUrl + '/api/patient/', PatientObject)

export type ModelRegistry =
    typeof MarkerObject
    | typeof ReviewObject
    | typeof susObject
    | typeof PatientObject
    | typeof ModelObject

