export interface ResponseInterface {
    message: string;
    status: boolean;
    statusCode: number;    
    data: ResponseLoginInterface;
}

export interface ResponseLoginInterface {
    name: string;
    role: string;
    token: string;
    username: string;
}