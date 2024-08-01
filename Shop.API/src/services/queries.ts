export const getAllComments = "SELECT * FROM comments";
export const getCommentById = `SELECT * FROM comments WHERE comment_id = ?`;
export const postFiendComment = `SELECT * FROM comments c WHERE LOWER(c.email) = ? AND LOWER(c.name) = ? AND LOWER(c.body) = ? AND c.product_id = ?`;
export const postComment = `INSERT INTO comments (comment_id, email, name, body, product_id) VALUES (?,?,?,?,?)`;
export const delleteComment = `DELETE FROM comments WHERE comment_id = ?`;


export const postProduct = `INSERT INTO products (product_id, title, description, price) VALUES (?, ?, ?, ?)`;
export const delleteProduct = `DELETE FROM products WHERE product_id = ?`; 
export const delleteImages = `DELETE FROM images WHERE product_id = ? `;
export const delleteImage = `DELETE FROM images WHERE image_id IN ?`;
export const delleteComments = `DELETE FROM comments WHERE product_id = ?`;
export const postImages = `INSERT INTO images (image_id, url, product_id, main) VALUES (?, ?, ?, ?)`;
export const getCurrentCover = `SELECT * FROM images WHERE product_id = ? AND main = 1`;
export const getAvailabilityOfNewCover = `SELECT * FROM images WHERE image_id = ?`;


export const resetCurrentCover = `UPDATE images SET main = 0 WHERE product_id = ? AND main = 1`;
export const setNewCover = `UPDATE images SET main = 1 WHERE image_id = ? AND product_id = ?`;
export const setDataUpdate = `UPDATE products SET title = ?, description = ?, price = ? WHERE product_id = ?`;
export const getSimilarProducts = `SELECT * FROM similar_products WHERE product_id = ? OR similar_product_id = ?`;
export const postSimilarProducts = `INSERT INTO similar_products (product_id, similar_product_id) VALUES (?, ?)`;
export const delleteSimilarProducts = `DELETE FROM similar_products WHERE product_id = (?) AND similar_product_id = (?)`;
export const delleteAllSimilarProducts = `DELETE FROM similar_products WHERE product_id IN (?) OR similar_product_id IN (?)`;