import { RowDataPacket } from "mysql2/index";
import { IComment, IProduct, IImagesEntity, IProductFilterPayload } from "../../Shared/types";
import { IAuthRequisites } from "../../Shared/types";

export interface ICommentEntity extends RowDataPacket {
    comment_id: string;
    name: string;
    email: string;
    body: string;
    product_id: string;
};

export interface IProductSearchFilter extends IProductFilterPayload {};

export type IdeleteImages = string[];

export interface IImagesProcessing {
    main: boolean;
    url: string;
};

export interface IidPosted {
    product_id: string;
};
 
export type CommentCreatePayload = Omit<IComment, "id">;

export interface IProductEntity extends IProduct, RowDataPacket {
    product_id: string;
};

export type ProductCreatePayload = Omit<IProduct, "id" | "comments">;

export interface IProductImageEntity extends RowDataPacket{
    image_id: string;
    url: string;
    product_id: string;
    main: number;
};

export interface IsetImages {
    product_id: IidPosted;
    images: IImagesEntity[];
};

export interface IUserRequisitesEntity extends IAuthRequisites, RowDataPacket {
    id: number;
};