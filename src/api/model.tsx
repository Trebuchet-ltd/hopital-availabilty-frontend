import { number, string } from "prop-types";
import Model, {baseUrl, filePost, ModelData, ModelObject, ModelFilterSet} from "./api";
import {getAuth} from "./auth";
import { TFilterChoiceList, TFilterParams } from "./types";

export interface Slots {
        id: number,
        start: string,
        end: string,
        booked: boolean,
}

interface ImageObject
{
    hospital: number;
    image: string;
    review: number | null;
    useinmarker: boolean;
}

export interface WorkingTime
{
    working_time: {
        day: number | null,
        starting_time: string | null,
        ending_time: string | null
    },
    hospital: number
}

export const markerCategories = {
    'E': 'Economy',
    'N': 'Normal',
    'S': 'Speacialty',
    'SS': 'Super Specialty',
    'U': 'Uncategorized'
} as const;

export const markerTypes = {
    'H': 'Hospital',
    'P': 'Pharmacy',
    'C': 'Clinic',
    'W': 'Wellness Center',
    'U': 'Uncategorized'
} as const;

export const markerOwnership = {
    'Pu': 'Public',
    'Pr': 'Private',
    'Co': 'Co-operative',
    'U': 'Uncategorized'
} as const; 

export const markerMedicine = {
    'Ay': 'Ayurveda', 'Al': 'Allopathy',
    'Ho': 'Homeopathy'
} as const;

 const markerfilters = {'financial_rating': ['gte', 'lte', 'exact'],
                        'oxygen_rating': ['gte', 'lte', 'exact'], 'ventilator_availability': ['gte', 'lte', 'exact'],
                        'oxygen_availability': ['gte', 'lte', 'exact'], 'icu_availability': ['gte', 'lte', 'exact'],
                        'avg_cost': ['gte', 'lte', 'exact'],
                        'care_rating': ['gte', 'lte', 'exact'], 'covid_rating': ['gte', 'lte', 'exact'],
                        'beds_available': ['gte', 'lte', 'exact'], 'category': ['in'], 'type': ['in'],
                        'ownership': ['in'], 'medicine': ['in']} as const;
                    

export type TMarkerFilter = TFilterParams<typeof markerfilters,MarkerObject>

const markerFilterChoices: TFilterChoiceList<TMarkerFilter>= {'category__in':markerCategories,'medicine__in':markerMedicine,'type__in':markerTypes,'ownership__in':markerOwnership}

export class MarkerObject extends ModelObject {
    lng = "0";
    comment: ReviewObject[] = [];
    oxygen_availability = 0;
    covid_rating = 0;
    financial_rating = 0;
    oxygen_rating = 0;
    address: Record<string, unknown> = {};
    name: string | undefined;
    care_rating = 0;
    Phone: string | undefined;
    avg_cost = 0;
    icu_availability = 0;
    model: Record<string, unknown> = {};
    images: ImageObject[] = [];
    ventilator_availability = 0;
    lat = "0";
    doctors: DoctorObject[] = [];
    about: string | undefined;
    departments: Array<DepartmentObject> = [];
    type: keyof typeof markerTypes = 'U';
    category: keyof typeof markerCategories = 'U';
    ownership: keyof typeof markerOwnership = 'U';
    medicine: keyof typeof markerMedicine = 'Al';

    constructor(data: ModelData, baseUrl: string) {

        super(data, baseUrl);
        this.fields = ["id", "Phone", "size", "financial_rating", "avg_cost", "covid_rating", "beds_available", "care_rating",
            "oxygen_rating", "ventilator_availability", "oxygen_availability", "icu_availability", "lat", "lng", "images",
            "display_address", "name", "datef", "address", "comment", "departments", "doctors", "ownership", "type", "medicine",
            "category"];
        this.getData();

    }

    async addPhoto(file: File)
    {
        const formData = new FormData();

        formData.append(
            "image",
            file,
            file.name
        );
        formData.append(
            "hospital",
            this.id.toString()
        );
        const headers = {"Authorization": `Bearer ${getAuth()}`};

        return await filePost(baseUrl + "/api/image/", formData, headers);
    }
}

export class Comment extends ModelObject
{
    id = -1;
    marker = -1;
    financial_rating = -1;
    avg_cost = -1;
    covid_rating = -1;
    care_rating = -1;
    oxygen_rating = -1;
    beds_available = -1;
    size = -1;
    oxygen_availability = 0;
    ventilator_availability = -1;
    icu_availability = 0;
    comment = "";
    written_by = -1;
    written_by_name = "";
    images?: ImageObject[];
    datef = "";

    constructor(data: ModelData, baseUrl: string)
    {

        super(data, baseUrl);
        this.fields = ["id", "marker", "financial_rating", "avg_cost", "covid_rating", "care_rating", "oxygen_rating",
            "beds_available", "size", "ventilator_availability", "oxygen_availability",
            "icu_availability", "comment", "written_by", "images", "written_by_name", "datef"];
        this.getData();

    }


}

export class DepartmentNameObject extends ModelObject
{
    icon?: string;
    name?: string;

    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["name", "icon", "id"];
        this.getData();
    }
}

export class DepartmentObject extends ModelObject
{
    name: { id: number, icon?: string, name?: string } = {id: -1};
    x = -1;
    y = -1;
    hospital = -1;
    doctors: Array<DoctorObject> = [];
    name_id = -1;
    rating = -1;

    constructor(data: ModelData, baseUrl: string)
    {

        super(data, baseUrl);
        this.fields = ["name", "x", "y", "hospital", "doctors", "name_id", "rating", "id"];
        this.getData();

    }

    async addPhoto(file: File)
    {
        const formData = new FormData();


        formData.append(
            "image",
            file,
            file.name
        );
        formData.append(
            "hospital",
            this.id.toString()
        );
        const headers = {"Authorization": `Bearer ${getAuth()}`};

        return await filePost(baseUrl + "/api/image/", formData, headers);
    }


}

// export class UserSearchObject extends ModelObject
// {
//     id: -1;
//     first_name: string;
//     last_name: string;
//     private_token: string;
//
//     constructor(data: ModelData, baseUrl: string)
//     {
//         super(data, baseUrl);
//         this.fields = ["id", "first_name", "last_name", "private_token"];
//         this.getData();
//     }
//
// }
export class UserSearchObject extends ModelObject
{
    id = -1;
    first_name= "";
    last_name="";
    private_token ="";
    image ="";


    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["id", "first_name", "last_name", "private_token", "image"];
        this.getData();
    }

}


export class DoctorObject extends ModelObject
{
    id = -1;
    name: string | undefined;
    phone_number = -1;
    hospital: Array<number> = [];
    departments: Array<number> = [];
    user = -1;
    working_time: Array<WorkingTime> = [];
    rating = -1;
    reviews: [] = [];
    patients = -1;
    experience = -1;
    specialization: string | undefined;
    about: string | undefined;
    image: string | undefined;
    whatsapp_number = "";
    email = "";
    address = "";
    ima_number = "";
    ranges: Array<{ start: string, end: string }> = [];


    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["id", "name", "phone_number", "hospital", "department", "user", "working_time",
            "rating", "reviews", "patients", "experience", "specialization", "about", "image", "whatsapp_number",
            "email", "address", "ima_num", "ranges","schedule"];
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
    //         "hospital",
    //         this.id.toString()
    //     )
    //     let headers = {"Authorization": `Bearer ${getAuth()}`}
    //
    //     return await filePost(baseUrl + "/api/image/", formData, headers)
    // }


}

export class NurseObject extends ModelObject
{
    id = -1;
    name: string | undefined;
    gender: string | undefined;
    phone_number = -1;
    hospital: Array<number> = [];
    user = -1;
    rating = -1;
    reviews: [] = [];
    patients = -1;
    experience = -1;
    specialization: string | undefined;
    about: string | undefined;
    image: string | undefined;
    home_care = false;
    availability = false;
    services = 0;
    whatsapp_number = "";
    email = "";
    address = "";

    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["id", "name", "gender", "hospital", "experience", "patients", "image", "user",
            "rating", "home_care", "about", "phone_number", "review", "availability", "services", "whatsapp_number", "email", "address"];
        this.getData();
    }
}

export class ReviewObject extends ModelObject
{
    id = 0;
    marker = 0;
    total_rating = 0;
    financial_rating = 0;
    avg_cost = 0;
    covid_rating = 0;
    beds_available = 0;
    care_rating = 0;
    oxygen_rating = 0;
    ventilator_availability = 0;
    oxygen_availability = 0;
    icu_availability = 0;
    comment = "";
    datef = "";
    images: Record<string, unknown>[] = [];
    day = 0;
    written_by_name = "";
    written_by = "";
    written_by_image = "";
    size = 0;

    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["id", "marker", "total_rating", "financial_rating", "avg_cost", "covid_rating", "beds_available", "care_rating",
            "oxygen_rating", "ventilator_availability", "oxygen_availability", "icu_availability", "comment", "datef",
            "images", "day", "written_by_name", "written_by", "size"];
        this.getData();
    }
}

export class PatientObject extends ModelObject
{
    Name = "";
    age = 0;
    gender = "M";
    address = "";
    requirement = "";
    symptoms = "";
    covidresult = false;
    gender_name = "";
    symdays = "";
    spo2 = 0;
    bedtype_name = 0;
    blood = "";
    ct = false;
    ctscore = "";
    oxy_bed = false;
    attendername = "";
    attenderphone = "";
    relation = "";
    hospitalpref = "";
    srfid = "";
    bunum = "";
    uid = -1;
    request_type: "" | undefined;
    location: "" | undefined;
    reason: "" | undefined;
    attachment: "" | undefined;
    account_holder: "" | undefined;
    ifsc: "" | undefined;
    bank_name: "" | undefined;
    mobile_number: 0 | undefined;

    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["id", "Name", "age", "gender", "address", "requirement", "symptoms", "symdays", "spo2", "hospitalday", "oxy_bed", "covidresult",
            "hospitalpref", "attendername", "attenderphone", "relation", "srfid", "bunum", "blood", "bedtype", "ct",
            "ctscore", "gender_name", "bedtype_name", "request_type", "gender", "location", "reason", "attachment", "account_holder", "bank_name", "mobile_number" ];
        this.getData();
    }
}

export class susObject extends ModelObject
{

    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["id", "marker", "comment", "created_by", "datef"];
        this.getData();
    }
}

export class LanguageObject extends ModelObject
{
    name = "";

    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["id", "name"];
        this.getData();
    }
}

export class AmbulanceObject extends ModelObject
{
    id = -1;
    name = "";
    driver_name = "";
    hospital = "";
    phone_number = "";
    image = "";
    rating = 0;

    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["id", "name", "driver_name", "hospital", "phone_number", "image", "rating"];
        this.getData();
    }
}

class AppointmentObject extends ModelObject
{
    doctor = "";
    date = -1;
    start?: string;
    end?: string;

    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["id", "doctor", "date", "start", "end"];
        this.getData();
    }
}

export class BloodBankObject extends ModelObject
{
    name = "";
    phone_no = "";
    image = "";
    blood_avail_Bpos = "";
    blood_avail_Apos = "";
    blood_avail_ABpos = "";
    blood_avail_Opos = "";
    blood_avail_Bneg = "";
    blood_avail_Aneg = "";
    blood_avail_Oneg = "";
    blood_avail_ABneg = "";

    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["name", "image", "phone_no", "blood_avail_Bpos", "blood_avail_Apos", "blood_avail_ABpos", "blood_avail_Opos", "blood_avail_Bneg", "blood_avail_Aneg", "blood_avail_Oneg", "blood_avail_ABneg"];
        this.getData();
    }

}

export class DoctorScheduleObject extends MarkerObject{
    date =  "";
    doctor = "";
    id =  -1;
    slots:Slots[] = [];
    stats = {available:-1, total: -1};
    constructor(data: ModelData, baseUrl: string)
    {
        super(data, baseUrl);
        this.fields = ["id", "date", "slots", "stats","doctor"];
        this.getData();
    }
}

export const MarkerFilters = new ModelFilterSet<TMarkerFilter>(ModelFilterSet.metaToParams(markerfilters), markerFilterChoices);


export const Review = new Model(baseUrl + "/api/review/", ReviewObject);
export const Sus = new Model(baseUrl + "/api/suspicious/", susObject);
export const Department = new Model(baseUrl + "/internals/departments/", DepartmentObject);
export const Marker = new Model(baseUrl + "/api/marker/", MarkerObject);
export const Doctor = new Model(baseUrl + "/internals/doctors/", DoctorObject);
export const Patient = new Model(baseUrl + "/api/patient/", PatientObject);
export const DepartmentName = new Model(baseUrl + "/internals/department_names/", DepartmentNameObject);
export const Nurse = new Model(baseUrl + "/internals/nurses/", NurseObject);
export const Language = new Model(baseUrl + "/api/language/", LanguageObject);
export const Ambulance = new Model(baseUrl + "/internals/ambulance/", AmbulanceObject);
export const Appointment = new Model(baseUrl + "/internals/appointment/", AppointmentObject);
export const BloodBank = new Model(baseUrl + "/internals/blood_bank/", AppointmentObject);
export const UserSearch = new Model(baseUrl + "/auth/search_users", UserSearchObject);
export const DoctorSchedule = new Model(baseUrl + "/internals/doctor_schedule/", AppointmentObject);

export type ModelRegistry =
    typeof MarkerObject
    | typeof ReviewObject
    | typeof susObject
    | typeof PatientObject
    | typeof ModelObject
    | typeof NurseObject
    | typeof DoctorObject
    | typeof AppointmentObject
    | typeof AmbulanceObject
    | typeof BloodBankObject
    | typeof UserSearchObject

