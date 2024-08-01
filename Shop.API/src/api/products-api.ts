import { Request, Response, Router } from "express";
import { connection } from "../..";
import { ICommentEntity, IProductEntity, IProductSearchFilter, ProductCreatePayload, IProductImageEntity, IdeleteImages, IsetImages } from "../types";
import { mapProductsEntity, mapCommentsEntity, mapImagesEntity } from "../services/mapping";
import { enhanceProductsComments, getProductsFilterQuery, enhanceProductsImages, postProcessingImages } from "../helpers";
import { v4 as uuidv4 } from "uuid";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { postProduct, delleteProduct, delleteComments, delleteImages, delleteImage, postImages, getCurrentCover, getAvailabilityOfNewCover, resetCurrentCover, setNewCover, setDataUpdate, getSimilarProducts, postSimilarProducts, delleteSimilarProducts, delleteAllSimilarProducts } from "../services/queries";
import { throwServerError } from "../../../Shop.Admin/controllers/helper"
import { param, body, validationResult } from "express-validator";
import { IProduct } from "../../../Shared/types";

export const productsRouter = Router();

productsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const [productRows] = await connection.query < IProductEntity[] > (
            "SELECT * FROM products"
        );

        const [commentRows] = await connection.query < ICommentEntity[] > (
            "SELECT * FROM comments"
        ); 

        const [imagesRows] = await connection.query < IProductImageEntity[] > (
            "SELECT * FROM images"
        );

        const products = mapProductsEntity(productRows);
        const interimResult = enhanceProductsComments(products, commentRows);
        const result = enhanceProductsImages(interimResult, imagesRows);

        res.send(result);
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.get('/search', async (req: Request<{}, {}, {}, IProductSearchFilter>, res: Response) => {
    try {
        const [query, values] = getProductsFilterQuery(req.query);
        const [rows] = await connection.query <IProductEntity[] > (query, values);

        if (!rows?.length) {
            res.status(404);
            res.send(`Products are not found`);
            return;
        }

        const [commentRows] = await connection.query <ICommentEntity[] > (
            "SELECT * FROM comments"
        );

        const [imagesRows] = await connection.query < IProductImageEntity[] > (
            "SELECT * FROM images"
        );

        const products = mapProductsEntity(rows);
        const interimResult = enhanceProductsComments(products, commentRows);
        const result = enhanceProductsImages(interimResult, imagesRows);

        res.send(result);
    } catch (e) {
        throwServerError(res, e)
    }
});

productsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const [rows] = await connection.query < IProductEntity[] > (
            "SELECT * FROM products WHERE product_id = ?", 
            [req.params.id]
        );

        if (!rows?.[0]) {
            res.status(400);
            res.send(`Product with id ${req.params.id} is not found`);
            return;
        }

        const [comments] = await connection.query < ICommentEntity[] > (
            "SELECT * FROM comments WHERE product_id = ?", 
            [req.params.id]
        );

        const [images] = await connection.query < IProductImageEntity[] > (
            "SELECT * FROM images WHERE product_id = ?",
            [req.params.id]
        );

        const product = mapProductsEntity(rows)[0];

        if (comments.length) {
            product.comments = mapCommentsEntity(comments);
        }

        if (images.length) {
            product.images = mapImagesEntity(images);
            product.thumbnail = product.images.find(image => image.main) || product.images[0];
        }
        res.send(product);
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.post('/', async (req: Request<{}, {}, ProductCreatePayload>, res: Response): Promise<IProduct[]> => {
    try {
        const { title, description, price, images } = req.body;
        const id = uuidv4();
        
        if (images?.length) {
            const resultImages = await postProcessingImages(images, id);

            for (let i = 0; i < resultImages.length; i++) {
                try {
                    const [postImageResult] = await connection.query<ResultSetHeader>(
                        postImages, [resultImages[i].image_id, resultImages[i].url, resultImages[i].product_id, resultImages[i].main]
                    );
            
                    if (postImageResult.affectedRows === 0) {
                        res.status(400).send("Error when adding images");
                        return;
                    }
                } catch (error) {
                    res.status(400).send("Error when adding images");
                    return;
                }
            }
        }

        await connection.query<ResultSetHeader>(
            postProduct, [id, title || null, description || null, price || null]
        );
        
        try {
            const [rows] = await connection.query < IProductEntity[] > (
                "SELECT * FROM products WHERE product_id = ?", 
                [id]
            );
    
            if (!rows?.[0]) {
                res.status(400);
                res.send(`Product with id ${id} is not found`);
                return;
            }
    
            const [comments] = await connection.query < ICommentEntity[] > (
                "SELECT * FROM comments WHERE product_id = ?", 
                [id]
            );
    
            const [images] = await connection.query < IProductImageEntity[] > (
                "SELECT * FROM images WHERE product_id = ?",
                [id]
            );
    
            const product = mapProductsEntity(rows)[0];
    
            if (comments.length) {
                product.comments = mapCommentsEntity(comments);
            }
    
            if (images.length) {
                product.images = mapImagesEntity(images);
                product.thumbnail = product.images.find(image => image.main) || product.images[0];
            }
            res.send(product);
        } catch (e) {
            throwServerError(res, e);
        }
        
        res.send()
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const [infoImages] = await connection.query < ResultSetHeader > (
            delleteImages, [req.params.id]
        );

        const [infoComments] = await connection.query < ResultSetHeader > (
            delleteComments, [req.params.id]
        );

        const [resultsDelleteSilimar] = await connection.query< ResultSetHeader >(
            delleteAllSimilarProducts, [req.params.id, req.params.id]
        );

        const [infoProduct] = await connection.query < ResultSetHeader > (
            delleteProduct, [req.params.id]
        );

        if (infoImages.affectedRows === 0 && infoComments.affectedRows === 0 && resultsDelleteSilimar.affectedRows === 0 && infoProduct.affectedRows === 0) {
            res.status(404);
            res.send(`Product with id ${req.params.id} is not found`);
            return;
        }

        res.status(200);
        res.end();
    } catch (e) {
        throwServerError(res, e);
    }
});



productsRouter.post('/delete_images', async (req: Request<{}, {}, IdeleteImages>, res: Response) => {
    try {
        const imagesToRemove = req.body;

        if(!imagesToRemove?.length) {
            res.status(400);
            res.send("Images array is empty");
            return;
        }
        
        const [deleteImg] = await connection.query< ResultSetHeader > (delleteImage, [[imagesToRemove]]);

        if(deleteImg.affectedRows === 0) {
            res.status(404);
            res.send("No one image has been removed");
            return;
        }

        res.status(200);
        res.send("Images have been removed!");
    } catch (e) {
        throwServerError(res, e);
    }
});

productsRouter.post('/set_images', async (req: Request<{}, {}, IsetImages>, res: Response) => {
    try {
        const { product_id, images } = req.body;
        const resultImages = await postProcessingImages(images, product_id);

        const [rows] = await connection.query < IProductEntity[] > (
            "SELECT * FROM products WHERE product_id = ?", 
            [product_id]
        );

        if (!rows?.[0]) {
            res.status(400);
            res.send(`Product with id ${product_id} is not found`);
            return;
        }

        for (let i = 0; i < resultImages.length; i++) {
            try {
                const [postImageResult] = await connection.query<ResultSetHeader>(
                    postImages, [resultImages[i].image_id, resultImages[i].url, resultImages[i].product_id, resultImages[i].main]
                );
        
                if (postImageResult.affectedRows === 0) {
                    res.status(400).send("Error when adding images");
                    return;
                }
            } catch (error) {
                res.status(400).send("Error when adding images");
                return;
            }
        }

        res.status(201).send(`images to the product ${product_id} have been successfully added`);
    } catch (error) {
        throwServerError(res, error);
    }
});

productsRouter.post('/update_thumbnail/:id', 
    [
        param('id').isUUID().withMessage('Product id is not UUID'),
        body('idChange').isUUID().withMessage('New thumbnail id is empty or not UUID')
    ],
    async (req: Request<{ id: string, idChange: string }>, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400);
                res.json({ errors: errors.array() });
                return;
            }
            const idChangeProduct = req.params.id;
            const { idChange } = req.body;

            const [currentCover] = await connection.query<RowDataPacket[]>(
                getCurrentCover, [idChangeProduct]
            );

            if(!currentCover || currentCover.length === 0) {
                res.status(400);
                res.end();
                return;
            } 
            
            const [availabilityOfNewCover] = await connection.query<RowDataPacket[]>(
                getAvailabilityOfNewCover, [idChange] 
            );

            if(!availabilityOfNewCover || availabilityOfNewCover.length === 0) {
                res.status(400);
                res.end();
                return;
            } 

            try {
                await connection.query<ResultSetHeader>(resetCurrentCover, [idChangeProduct]);

                await connection.query<ResultSetHeader>(setNewCover, [idChange, idChangeProduct]);

                res.status(200);
            } catch (error) {
                throwServerError(res, error);
            }
            
        res.status(200);
        res.end(); 
    } catch (e) {
        throwServerError(res, e);
    }     
});

productsRouter.patch('/:id', async (req: Request<{ id: string, title: string, description: string, price: number }>, res: Response) => {
    try {
        const id = req.params.id;
        const { title, description, price } = req.body;

        const [rows] = await connection.query < IProductEntity[] > (
            "SELECT * FROM products WHERE product_id = ?", 
            [id]
        );

        if (!rows?.[0]) {
            res.status(404);
            return;
        }

        try {
            await connection.query<ResultSetHeader>(setDataUpdate, [title, description, price, id]);
            res.status(200);
            res.end();  
        } catch (error) {
            throwServerError(res, error);
        }
    } catch (error) {
        throwServerError(res, error);
    }
});



productsRouter.get('/similar_products/:id',
    [
        param('id').isUUID().withMessage('Product id is not UUID')
    ],
    async (req: Request<{ id: string }, {}, {}>, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400);
                res.json({ errors: errors.array() });
                return;
            }
            try {
                const origin_product = req.params.id;
                const [rows] = await connection.query < RowDataPacket[] > (
                    getSimilarProducts, [origin_product, origin_product]
                );

                if(rows.length === 0) {
                    res.status(404).send("No similar products found");
                    return;
                }

                const list_id = rows.map(({ product_id, similar_product_id }) => {
                    return origin_product === product_id ? similar_product_id : product_id;
                });

                const [products] = await connection.query<RowDataPacket[]>(
                    "SELECT * FROM products WHERE product_id IN (?)", 
                    [list_id]
                );
                
                const result = products.map(({product_id, ...rest}) => {
                    return {
                        id: product_id,
                        ...rest
                    };
                });

                res.send(result);
            } catch (error) {
                throwServerError(res, error);
            }
        } catch (error) {
            throwServerError(res, error);
        }
});

productsRouter.post('/add_similar_products',
    [
        body().isArray().withMessage('Body should be an array'),
        body('*.product_id').isUUID().withMessage('Product id is not UUID'),
        body('*.similar_product_id').isUUID().withMessage('Similar products id is not UUID'),
    ],
    async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400);
                res.json({ errors: errors.array() });
                return;
            }

            try {
                const [uniquenessСheck] = await connection.query <ResultSetHeader> (
                    `SELECT * FROM similar_products WHERE product_id IN (?)`, [req.body.product_id]
                );

                if(uniquenessСheck.affectedRows === 0) {
                    res.status(500).end();
                    return;
                }

                const [rows] = await Promise.all(req.body.map(async (product) => {
                    const [info] = await connection.query<ResultSetHeader>(
                        postSimilarProducts, [product.product_id, product.similar_product_id]
                    );
                return info;
                }));

                if(rows.affectedRows === 0) {
                    res.status(500).end();
                    return;
                } else {
                    res.status(200).end();
                    return;
                }
            } catch (error) {
                throwServerError(res, error);
            }
        
    } catch (error) {
        throwServerError(res, error);
    }
});

productsRouter.post('/del_similar_products',
    [
        body().isArray().withMessage('Body should be an array'),
        body('*.product_id').isUUID().withMessage('Each product_id should be a valid UUID'),
        body('*.similar_product_id').isUUID().withMessage('Each similar_product_id should be a valid UUID')
    ],
    async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400);
                res.json({ errors: errors.array() });
                return;
            }

            try {
                const [resultsQuerys] = await Promise.all(req.body.map(async (product) => {
                    const [info] = await connection.query<ResultSetHeader>(
                        delleteSimilarProducts, [product.product_id, product.similar_product_id]
                    );

                    return info;
                }));
                
                // Здравствуйте, не совсем понял ТЗ. В начале говориться что нужно удалять все записи
                // о связи с другими товарами из таблицы а в конце о том что нужно удалять только 
                // отмеченные для удаления связи, поэтому реализовал две логики в одном эндпойнте. 
                // Ниже логика удаления всех связей по id, метод принимает массив 
                // строк с id через запятую.
                // [
                //     "id_product_1","id_product_2","id_product_3"...
                // ]
                // ... body().isArray().withMessage('Body should be an array'),
                // ... body().isUUID().withMessage('Each product_id should be a valid UUID')
                // ... req: Request<{ req: string[] }>, res: Response
                // ... const [resultsQuerys] = await connection.query<ResultSetHeader>(
                // ...     delleteAllSimilarProducts, [req.body, req.body]
                // ... );

                if(resultsQuerys?.affectedRows === 0) {
                    res.status(404).send("No similar products found");
                } else {
                    res.status(200).send("Product removed from similar ones");
                }
            
            } catch (error) {
                throwServerError(res, error);
            }
    } catch (error) {
        throwServerError(res, error);
    }
});