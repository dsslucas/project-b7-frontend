export interface ResponseInterface {
    message: string;
    status: boolean;
    statusCode: number;    
    data: ResponseLoginInterface | ConfigInfoInterface | UserInterface[] | UserInterface;
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
    password?: string;
    roleCustom: string;
    email: string;
    registerDate: string;
    active: boolean;
}

export interface ProductResponse {
    headers: string[];
    data: ProductInterface[];
    isAdmin: boolean;
    isStockWorker: boolean;
}

export interface ProductInterface {
    id: number;
    name: string; // send for payload
    nameProduct: string;
    nameUser: string;
    active: boolean;
    sku: number;
    icms: number;
    registerDate: string;
    amount: number;
    unitValue: number;
    totalValue: number;
    category: ProductCategoryInterface;
}

export interface ProductCategoryInterface {
    id: number;
    name: string;
    active: boolean;
    type: ProductCategoryTypeInterface;
}

export interface ProductCategoryTypeInterface {
    id: number;
    name: string;
}