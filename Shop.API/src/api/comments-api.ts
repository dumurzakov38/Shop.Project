import { Request, Response, Router } from "express";
import { CommentCreatePayload, ICommentEntity } from "../types";
import { IComment } from "../../../Shared/types";
import { validateComment } from "../helpers";
import { v4 as uuidv4 } from "uuid";
import { connection } from "../../index";
import { mapCommentsEntity } from "../services/mapping";
import { ResultSetHeader  } from "mysql2";
import { getAllComments, getCommentById, postFiendComment, postComment, delleteComment } from "../services/queries";
import { throwServerError } from "../../../Shop.Admin/controllers/helper";
import { param, validationResult } from "express-validator";

export const commentsRouter = Router();

commentsRouter.get("/", async (req: Request, res: Response) => {
    try {
        const [comments] = await connection.query<ICommentEntity[]>(getAllComments);
        
        res.setHeader("Content-Type", "application/json");
        res.send(mapCommentsEntity(comments));
    } catch (e) {
        console.debug(e.message);
        res.status(500);
        res.send("Something went wrong");
    }
});

commentsRouter.get('/:id',
    [
        param('id').isUUID().withMessage('Comment id is not UUID')
    ],
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400);
                res.json({ errors: errors.array() });
                return;
            }
            const id = req.params.id;

            const [comments] = await connection.query<ICommentEntity[]>(getCommentById, [id]);

            if (comments.length === 0) {
                res.status(404);
                res.send(`Comment with id ${id} is not found`);
                return;
            }
    
            res.setHeader('Content-Type', 'application/json');
            res.send(mapCommentsEntity(comments));
        } catch (e) {
            throwServerError(res, e);
        }
});

commentsRouter.post('/', async (req: Request<{}, {}, CommentCreatePayload>, res: Response) => {
    try {
        const validationResult = validateComment(req.body);
        const { name, email, body, productId } = req.body;

        if (validationResult) {
            res.status(400);
            res.send(validationResult);
            return;
        }

        const [sameResult] = await connection.query<ICommentEntity[]>(postFiendComment,[email.toLowerCase(), name.toLowerCase(), body.toLowerCase(), productId]);

        if (sameResult.length) {
            res.status(422);
            res.send("Comment with the same fields already exists");
            return;
        }

        const id = uuidv4();

        const [info] = await connection.query<ResultSetHeader>(postComment, [id, email, name, body, productId]);

        res.status(201);
        res.send(`Comment id:${id} has been added!`);
    } catch (e) {
        throwServerError(res, e);
    }
});

commentsRouter.patch('/', async (req: Request<{}, {}, Partial<IComment>>, res: Response) => {
    try {
        let updateQuery = "UPDATE comments SET ";

        const valuesToUpdate = [];
        ["name", "body", "email"].forEach(fieldName => {
            if (req.body.hasOwnProperty(fieldName)) {
                if (valuesToUpdate.length) {
                    updateQuery += ", ";
                }

                updateQuery += `${fieldName} = ?`;
                valuesToUpdate.push(req.body[fieldName]);
            }
        });

        updateQuery += " WHERE comment_id = ?";
        valuesToUpdate.push(req.body.id);

        const [info] = await connection.query < ResultSetHeader > (updateQuery, valuesToUpdate);

        if (info.affectedRows === 1) {
            res.status(200);
            res.end();
            return;
        }

        const newComment = req.body as CommentCreatePayload;
        const validationResult = validateComment(newComment);

        if (validationResult) {
            res.status(400);
            res.send(validationResult);
            return;
        }

        const id = uuidv4();
        await connection.query < ResultSetHeader > (postComment, [id, newComment.email, newComment.name, newComment.body, newComment.productId]);
            
        res.status(201);
        res.send({ ...newComment, id });
    } catch (e) {
        console.log(e.message);
        res.status(500);
        res.send("Server error");
    }
});

commentsRouter.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const [info] = await connection.query<ResultSetHeader >(delleteComment, [req.params.id]);

        if (info.affectedRows === 0) {
            res.status(404);
            res.send(`Comment with id ${req.params.id} is not found`);
            return;
        }

        res.status(200);
        res.send();
    } catch (e) {
        throwServerError(res, e);
    }
});