export interface IComment {
    id: string;
    name: string;
    email: string;
    body: string;
    productId: string;
};  

export interface IProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail?: IImagesEntity;
    comments?: IComment[];
    images?: IImagesEntity[];
};

export interface IImagesEntity {
    id: string;
    productId: string;
    main: boolean;
    url: string;
};

export interface IProductFilterPayload {
    title?: string;
    description?: string;
    priceFrom?: string;
    priceTo?: string;
};

export interface IidPosted {
    product_id: string;
};

export interface IAuthRequisites {
    username: string;
    password: string;
};

export interface SimilarProduct {
    id: string,
    title: string,
    description: string,
    price: number
};

export interface IPossibleSimilarProducts {
    title: string;
    id: string;
};