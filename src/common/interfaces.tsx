export interface ResponseInterface {
    message: string;
    status: boolean;
    statusCode: number;    
    data: ResponseLoginInterface | ConfigInfoInterface;
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