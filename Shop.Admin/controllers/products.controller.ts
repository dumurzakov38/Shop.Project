import { Router, Request, Response } from "express";
import { getProducts, getSimilarProducts, searchProducts, getProduct, removeProduct, updateProduct, create_product } from "../models/products.model";
import { IProductFilterPayload } from "../../Shared/types";
import { IProductEditData } from "../types";
import { throwServerError } from "./helper";
import { possibleSimilarProducts } from "../../Shop.API/src/helpers";

export const productsRouter = Router();

productsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const products = await getProducts();
        res.render("products", {
            items: products,
            queryParams: {}
        });
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/search', async (req: Request<{}, {}, {}, IProductFilterPayload>, res: Response) => {
    try {
        const products = await searchProducts(req.query);
        res.render("products", {
            items: products,
            queryParams: req.query
        });
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/new_product', async (req: Request, res: Response) => {
    try {
        res.render("new-product", {req: req});
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const product = await getProduct(req.params.id);
        const similar_products = await getSimilarProducts(req.params.id);
        const products = await getProducts();

        const otherSimilarProducts = possibleSimilarProducts(product, similar_products, products);

        if (product) {
            res.render("product/product", {
                item: product,
                similar_products: similar_products? similar_products : null,
                possibleSimilarProducts: otherSimilarProducts? otherSimilarProducts : null
            });
        } else {
            res.render("product/empty-product", {
                id: req.params.id
            });
        }
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/remove-product/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        if (req.session.username !== "admin") {
            res.status(403);
            res.send("Forbidden");
            return;
        }

        await removeProduct(req.params.id);
        res.redirect(`/${process.env.ADMIN_PATH}`);
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.post('/save/:id', async (req: Request<{ id: string }, {}, IProductEditData>, res: Response) => {
    try {
        await updateProduct(req.params.id, req.body);
        res.redirect(`/${process.env.ADMIN_PATH}/${req.params.id}`);
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.post('/add_product', async (req: Request<{}>, res: Response) => {
    try {
        const id = await create_product(req.body);

        res.redirect(`/${process.env.ADMIN_PATH}/${id.data.id}`);
    } catch (e) {
        throwServerError(res, e);
    }
});