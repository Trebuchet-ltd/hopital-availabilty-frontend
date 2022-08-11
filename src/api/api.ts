import {getAuth} from "./auth";
import {ModelRegistry} from "./model";
import { getParam, setParam } from "./QueryCreator";
import { filterTypes, TFilterChoiceList } from "./types";

export const baseUrl = process.env.BASE_URL;


export async function get(url: string, kwargs = {}, headers = {})
{
    const response = await fetch(url + "?" + new URLSearchParams(kwargs),
        {
            headers: {
                ...headers
            }
        }
    );
    if (response.status > 300)
    
        throw (response);
    
    else
    {

        console.log(response);
        return response.json();
    }
}

export async function post(url: RequestInfo, kwargs:FormData | Record<string, unknown> = {}, headers = {})
{
    const isFormdata = kwargs instanceof FormData;
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            ...isFormdata?{}:{"Content-Type": "application/json"},
            ...headers
        },
        body: isFormdata?kwargs : JSON.stringify(kwargs)
    }
    );
    if (response.status > 300)
    
        throw (response);
    
    else
    {

        console.log(response);
        return response.json();
    }
}

export async function filePost(url: RequestInfo, formData: FormData, headers = {})
{
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            ...headers
        },
        body: formData
    }
    );
    if (response.status > 300)
    
        throw (response);
    
    else
    {
        console.log(response);
        return response.json();
    }
}


export async function filePatch(url: RequestInfo, formData: FormData, headers = {})
{
    const response = await fetch(url, {
        method: "PATCH", // *GET, POST, PUT, DELETE, etc.
        headers: {
            ...headers
        },
        body: formData
    });

    if (response.status > 300)
        throw (response);
    else
        return response.json();
}


export async function patch(url: RequestInfo, kwargs = {}, headers = {})
{
    const response = await fetch(url, {
        method: "PATCH", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        body: JSON.stringify(kwargs)
    }
    );
    if (response.status > 300)
    
        throw (response);
    
    else
    {

        console.log(response);
        return response.json();
    }
}

export interface ModelData
{
    [key: string]: number | string,
}


export class ModelObject
{
    data;
    baseUrl;
    id: number;
    fields: string[] = ["id"];
    filters:readonly string[] = [];

    constructor(data: ModelData, baseUrl: string)
    {
        this.data = data;
        this.id = data.id as number;
        this.baseUrl = baseUrl;

    }

    getData()
    {
        for (const item of this.fields)
            (this as Record<string, unknown>)[item] = this.data[item];
    }

    setData()
    {
        for (const item of this.fields)
            this.data[item] = (this as unknown as Record<string, string | number>)[item];
    }

    save = async () =>
    {
        this.setData();
        const headers = {"Authorization": `Bearer ${getAuth()}`};
        return patch(`${this.baseUrl}${this.id}/`, this.data, headers);
    };

    modify = async (path: string, data = this.data) =>
    {
        try
        {
            this.setData();
            const headers = {"Authorization": `Bearer ${getAuth()}`};
            return await post(`${this.baseUrl}${this.id}/${path}`, data, headers);
        }
        catch (e)
        {
            throw await (e as { json: () => Promise<unknown> }).json();
        }

    };

}

export class ModelFilterSet<T extends Record<string, any>>
{

    params: readonly (keyof T)[] = [];
    choiceList: TFilterChoiceList<T>;

    constructor(params: (keyof T)[]=[], c:TFilterChoiceList<T>= {} as TFilterChoiceList<T>) 
    {
        this.params = params;
        this.choiceList = c;
    }

    static metaToParams(meta: Record<string, readonly filterTypes[]>)
    {
        return Object.keys(meta).reduce((params, key)=>([...params, ...meta[key].map(fil=>key+`${fil==="exact"?"":"__"+fil}`)]), [] as any);
    } 

    shouldUpdate(oldParams:Partial<T>)
    {
        const curParams:any = this.getUnserialized();
        for(const k in curParams)
            if(Array.isArray(oldParams[k]))
            {
                if(oldParams[k]!.length !== curParams[k].length || !oldParams[k]!.every((v:string)=>curParams[k].includes(v)))
                    return true;
            }
            else if(oldParams[k] !== curParams[k])
                return true;
        if(!Object.keys(oldParams).every(v=>Object.keys(curParams).includes(v)))
            return true;
        return false;
    }

    getUnserialized()
    {
        return this.params.reduce((acc, cur) => 
        {
            const param = getParam(cur as string, "", false);
            return param === ""?acc: { ...acc, [cur]: (cur as string).includes("__in")?param.split(","):param  };
        }, {});
    }

    getParams(from_quey=false) 
    {
        return this.params.reduce((acc, cur) => 
        {
            const param = getParam(cur as string, "", from_quey);
            return param === ""?acc: { ...acc, [cur]: param  };
        }, {} as Record<keyof T, string>);
    }

    setParams(params: Partial<T>) 
    {
        Object.entries(params).forEach(([k, v]) => this.setParam(k, v));
    }

    setParam<K extends keyof T>(k: K, v: T[K]) 
    {
        setParam(k as string, Array.isArray(v) ? v.join(",") : v);
        return this;
    }

    reset()
    {
        this.params.forEach(p=>localStorage.removeItem(p as string));
    }
}

export default class Model
{
    baseurl: string;
    modelClass: ModelRegistry;

    constructor(baseUrl: string, modelClass: ModelRegistry)
    {
        this.baseurl = baseUrl;
        this.modelClass = modelClass;
    }


    get = async (id: number | string, kwargs: Record<string, unknown> = {}, auth = false) =>
    {
        let headers = {};

        if (auth)
        
            headers = {"Authorization": `Bearer ${getAuth()}`};
        


        const data = await get(`${this.baseurl}${id}/`, kwargs, headers);
        return new this.modelClass(data, this.baseurl);

    };

    filter = async (kwargs= {}, auth = false) =>
    {
        try
        {
            let headers = {};

            if (auth)
            
                headers = {"Authorization": `Bearer ${getAuth()}`};
            


            const data = await get(`${this.baseurl}`, kwargs, headers);
            const lst = data.results.map((item: ModelData) => new this.modelClass(item, this.baseurl));
            return {results: lst, next: data.next};
        }
        catch (e)
        {
            throw e;
        }
    };
    /*path doesn't need /
    * */
    action_general = async (path: string, kwargs = {}, auth = false) =>
    {
        try
        {
            let headers = {};
            if (auth)
                headers = {"Authorization": `Bearer ${getAuth()}`};

            const data = await get(`${this.baseurl}${path}`, kwargs, headers);
            const lst = data.results.map((item: ModelData) => new this.modelClass(item, this.baseurl));

            return {results: lst, next: data.next};
        }
        catch (e)
        {
            throw e;
        }
    };


    /**
     * @param {{}} kwargs
     */
    async create(kwargs: FormData | Record<string, unknown>)
    {
        console.log(kwargs);
        try
        {
            const headers = {"Authorization": `Bearer ${getAuth()}`};
            const data = await post(`${this.baseurl}`, kwargs, headers);
            return new this.modelClass(data, this.baseurl);
        }
        catch (e)
        {
            throw await (e as { json: () => Promise<unknown> }).json();
        }
    }

    async action_post(path: string, kwargs = {})
    {
        try
        {
            const headers = {"Authorization": `Bearer ${getAuth()}`};
            const data = await post(`${this.baseurl}${path}`, kwargs, headers);
            return new this.modelClass(data, this.baseurl);
        }
        catch (e)
        {
            throw await (e as { json: () => Promise<unknown> }).json();
        }
    }

}

