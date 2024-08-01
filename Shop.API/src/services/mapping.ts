import { ICommentEntity, IProductEntity, IProductImageEntity, IImagesProcessing, IidPosted } from "../types";
import { IComment, IProduct, IImagesEntity, IPossibleSimilarProducts } from "../../../Shared/types";
import { v4 as uuidv4 } from "uuid";

export const mapCommentEntity = ({comment_id, product_id, ...rest}: ICommentEntity): IComment => {
    return {
        id: comment_id,
        productId: product_id,
        ...rest
    }
};

export const mapCommentsEntity = (data: ICommentEntity[]): IComment[] => {
    return data.map(mapCommentEntity);
};

export const mapProductsEntity = (data: IProductEntity[]): IProduct[] => {
    return data.map(({ product_id, title, description, price }) => ({
        id: product_id,
        title: title || "",
        description: description || "",
        price: Number(price) || 0
    }))
};

export const mapImageEntity = ({image_id, product_id, url, main}: IProductImageEntity): IImagesEntity => {
    return {
        id: image_id,
        productId: product_id,
        main: Boolean(main),
        url
    }
};

export const mapImagesEntity = (data: IProductImageEntity[]): IImagesEntity[] => {
    return data.map(mapImageEntity);
};

export const mapImageProcessing = ({ main, url }: IImagesProcessing, id: IidPosted) => {
    const id_image = uuidv4();

    return {
        image_id: id_image,
        url,
        product_id: id,
        main: Number(main)
    }
};

export const mapConvertingProduct = (product) => {
    const products = new Map();

    for (let prod of product) {
        if(!products.has("product")) {
            products.set("product", { title: prod.title, id: prod.id })
        }

        const list = products.get("product");
        products.set("product", [...list, { title: prod.title, id: prod.id }]);
    }

    return products.get("product");
};

export const mapConvertingSimilarProduct  = (product): IPossibleSimilarProducts[] => {
    const products = new Map();

    for (let prod of product) {
        if(!products.has("product")) {
            products.set("product", { title: prod.title, id: prod.id })
        }

        const list = products.get("product");
        products.set("product", [...list, { title: prod.title, id: prod.id }]);
    }

    return products.get("product");
};