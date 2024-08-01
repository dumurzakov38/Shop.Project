import axios from "axios";
import { IProduct, IProductFilterPayload, SimilarProduct } from "../../Shared/types";
import { IProductEditData, IProductCreate } from "../types";
import { API_HOST as host} from "./const";

export async function getProducts(): Promise<IProduct[]> {
    const { data } = await axios.get < IProduct[] > (`${host}/products`);
    return data || [];
};

export async function getProduct(id: string): Promise<IProduct | null> {
    try {
        const { data } = await axios.get < IProduct > (
            `${host}/products/${id}`
        );

        return data;
    } catch (e) {
        return null;
    }
};

export async function getSimilarProducts(id: string): Promise<SimilarProduct[] | null> {
    try {
        const { data } = await axios.get < SimilarProduct[] > (
            `${host}/products/similar_products/${id}`
        );

        return data;
    } catch (e) {
        return null;
    }
};

export async function searchProducts(filter: IProductFilterPayload): Promise<IProduct[]> {
    const { data } = await axios.get < IProduct[] > (
        `${host}/products/search`,
        { params: filter }
    );
    return data || [];
}; 

export async function removeProduct(id: string): Promise<void> {
    await axios.delete(`${host}/products/${id}`);
};

function compileIdsToRemove(data: string | string[]): string[] {
    if (typeof data === "string") return [data];
    return data;
};

async function compileImagesToAdd(data: string, currentProduct) {
    const stringFormatting = data.split(/,|\n/);
    const validPaths = stringFormatting.map(part => part.trim());

    const images = new Map();
    if (!currentProduct?.thumbnail) {
        validPaths.forEach((image, index) => {
            if (!images.has(currentProduct.id)) {
                images.set(currentProduct.id, [{ main: true, url: image }]);
            } else {
                const list = images.get(currentProduct.id);
                list.push({ main: false, url: image });
                images.set(currentProduct.id, list);
            }
        });
    } else {
        validPaths.forEach((image) => {
            if (!images.has(currentProduct.id)) {
                images.set(currentProduct.id, [{ main: false, url: image }]);
            } else {
                const list = images.get(currentProduct.id);
                list.push({ main: false, url: image });
                images.set(currentProduct.id, list);
            }
        });
    }

    const resultImages = images.get(currentProduct.id);

    return(resultImages);
};

export async function updateProduct(productId: string, formData: IProductEditData): Promise<IProduct | null> {
    try {
        const {data: currentProduct} = await axios.get < IProduct > (`${host}/products/${productId}`);

        if (formData.commentsToRemove) {
            try {
                const commentsIdsToRemove = compileIdsToRemove(formData.commentsToRemove);

                await Promise.all(commentsIdsToRemove.map(async (id) => {
                    await axios.delete(`${host}/comments/${id}`);
                }));

            } catch (e) {
                console.log(e);
            }
        }

        if (formData.imagesToRemove) {
            try {
                const imagesIdsToRemove = compileIdsToRemove(formData.imagesToRemove);

                await Promise.all(imagesIdsToRemove.map(async (id) => {
                    await axios.post(`${host}/products/delete_images`, [ id ]);
                }));

            } catch (e) {
                console.log(e);
            }
        }

        if (formData.newImages) {
            try {
                const imagesToAdd = await compileImagesToAdd(formData.newImages, currentProduct);

                const data = {
                    product_id: currentProduct.id,
                    images: imagesToAdd
                };

                await axios.post(`${host}/products/set_images`, data);
            } catch (e) {
                console.log(e);
            }
        }

        if (formData.mainImage && formData.mainImage !== currentProduct?.thumbnail?.id) {
            try {;
                const data = {
                    idChange: formData.mainImage
                };

                await axios.post(`${host}/products/update_thumbnail/${currentProduct.id}`, data);
            } catch (e) {
                console.log(e);
            }
            return;
        }

        if (formData.similarProductToRemove) {
            const ids = compileIdsToRemove(formData.similarProductToRemove);

            const removingLinks = new Map();

            for (let products of ids) {

                if (!removingLinks.has(currentProduct.id)) {
                    removingLinks.set(currentProduct.id, { product_id: currentProduct.id, similar_product_id: products });
                };

                const list = removingLinks.get(currentProduct.id);
                removingLinks.set(currentProduct.id, [...list, { product_id: currentProduct.id, similar_product_id: products }]);
            }

            await axios.post(`${host}/products/del_similar_products`, removingLinks.get(currentProduct.id));
        }

        if (formData.add_similar_product) {
            const ids = compileIdsToRemove(formData.add_similar_product);
            const pairs = ids.map(id => [id]);

            const addLinks = new Map();

            for (let products of pairs) {

                if (!addLinks.has(currentProduct.id)) {
                    addLinks.set(currentProduct.id, { product_id: currentProduct.id, similar_product_id: products });
                };

                const list = addLinks.get(currentProduct.id);
                addLinks.set(currentProduct.id, [...list, { product_id: currentProduct.id, similar_product_id: products }]);
            }

            await axios.post(`${host}/products/add_similar_products`, addLinks.get(currentProduct.id));
        }

        const data = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            price: Number((formData.price).replace(/[\s\t]+/g, ''))
        };

        try {
            await axios.patch(`${host}/products/${currentProduct.id}`, data);
        } catch (e) {
            console.log(e);
        }
        
        return currentProduct;
    } catch (e) {
        console.log(e);
    }
};

export async function create_product(formData: IProductCreate) {
    try {
        const data = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            price: Number((formData.price).replace(/[\s\t]+/g, ''))
        };

        const idNewProduct = await axios.post(`${host}/products/`, data);

        return idNewProduct;
    } catch (e) {
        console.log(e);
    }
};