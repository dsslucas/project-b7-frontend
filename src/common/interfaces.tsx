export interface ResponseInterface {
    message: string;
    status: boolean;
    statusCode: number;    
    data: ResponseLoginInterface | ConfigInfoInterface | UserInterface[];
}

export interface ResponseLoginInterface {
    name: string;
    role: string;
    token: string;
    username: string;
}

export interface ConfigInfoInterface {
    id: number;
    name: string;
    active: boolean;
    type: string;
}

export interface UserInterface {
    id: number;
    name: string;
    username: string;
    roleCustom: string;
    email: string;
    registerDate: string;
    active: boolean;
}