import {
  CommentCreatePayload,
  ICommentEntity,
  IProductSearchFilter,
  IProductImageEntity,
  IidPosted,
  IImagesProcessing,
} from "./types";
import {
  IComment,
  IProduct,
  IImagesEntity,
  SimilarProduct,
} from "../../Shared/types";
import {
  mapCommentEntity,
  mapImageEntity,
  mapImageProcessing,
  mapConvertingProduct,
} from "./services/mapping";

type CommentValidator = (comment: CommentCreatePayload) => string | null;

export const validateComment: CommentValidator = (comment) => {
  if (!comment || !Object.keys(comment).length) {
    return "Comment is absent or empty";
  }

  const requiredFields = new Set<keyof CommentCreatePayload>([
    "name",
    "email",
    "body",
    "productId",
  ]);

  let wrongFieldName;

  requiredFields.forEach((fieldName) => {
    if (!comment[fieldName]) {
      wrongFieldName = fieldName;
      return;
    }
  });

  if (wrongFieldName) {
    return `Field '${wrongFieldName}' is absent`;
  }

  return null;
};

const compareValues = (target: string, compare: string): boolean => {
  return target.toLowerCase() === compare.toLowerCase();
};

export const checkCommentUniq = (
  payload: CommentCreatePayload,
  comments: IComment[]
): boolean => {
  const byEmail = comments.find(({ email }) =>
    compareValues(payload.email, email)
  );

  if (!byEmail) {
    return true;
  }

  const { body, name, productId } = byEmail;
  return !(
    compareValues(payload.body, body) &&
    compareValues(payload.name, name) &&
    compareValues(payload.productId.toString(), productId.toString())
  );
};

export const enhanceProductsComments = (
  products: IProduct[],
  commentRows: ICommentEntity[]
): IProduct[] => {
  const commentsByProductId = new Map<string, IComment[]>();

  for (let commentEntity of commentRows) {
    const comment = mapCommentEntity(commentEntity);
    if (!commentsByProductId.has(comment.productId)) {
      commentsByProductId.set(comment.productId, []);
    }

    const list = commentsByProductId.get(comment.productId);
    commentsByProductId.set(comment.productId, [...list, comment]);
  }

  for (let product of products) {
    if (commentsByProductId.has(product.id)) {
      product.comments = commentsByProductId.get(product.id);
    }
  }

  return products;
};

export const getProductsFilterQuery = (
  filter: IProductSearchFilter
): [string, string[]] => {
  const { title, description, priceFrom, priceTo } = filter;

  let query = "SELECT * FROM products WHERE ";
  const values = [];

  if (title) {
    query += "title LIKE ? ";
    values.push(`%${title}%`);
  }

  if (description) {
    if (values.length) {
      query += " OR ";
    }

    query += "description LIKE ? ";
    values.push(`%${description}%`);
  }

  if (priceFrom || priceTo) {
    if (values.length) {
      query += " OR ";
    }

    query += `(price > ? AND price < ?)`;
    values.push(priceFrom || 0);
    values.push(priceTo || 999999);
  }

  return [query, values];
};

export const enhanceProductsImages = (
  interimResult: IProduct[],
  imagesRows: IProductImageEntity[]
): IProduct[] => {
  const imagesByProductId = new Map<string, IImagesEntity[]>();
  const thumbnailsByProductId = new Map<string, IImagesEntity>();

  for (let imageEntity of imagesRows) {
    const image = mapImageEntity(imageEntity);
    if (!imagesByProductId.has(image.productId)) {
      imagesByProductId.set(image.productId, []);
    }

    const list = imagesByProductId.get(image.productId);
    imagesByProductId.set(image.productId, [...list, image]);

    if (image.main) {
      thumbnailsByProductId.set(image.productId, image);
    }
  }

  for (let product of interimResult) {
    product.thumbnail = thumbnailsByProductId.get(product.id);

    if (imagesByProductId.has(product.id)) {
      product.images = imagesByProductId.get(product.id);

      if (!product.thumbnail) {
        product.thumbnail = product.images[0];
      }
    }
  }

  return interimResult;
};

export const postProcessingImages = (
  images: IImagesProcessing[],
  product_id: IidPosted
) => {
  const imagesResult = new Map();

  for (let image of images) {
    const img = mapImageProcessing(image, product_id);

    if (!imagesResult.has(img.product_id)) {
      imagesResult.set(img.product_id, img);
    }

    const list = imagesResult.get(img.product_id);
    imagesResult.set(img.product_id, [...list, img]);
  }

  const result = imagesResult.get(product_id);
  return result;
};

export const possibleSimilarProducts = (
  product: IProduct,
  similar_products: SimilarProduct[],
  products: IProduct[]
) => {
  if (similar_products?.length) {
    const currentProductConverting = {
      title: product.title,
      id: product.id,
    };
    const similarProductsConverting = mapConvertingProduct(similar_products);
    const allProductsConverting = mapConvertingProduct(products);

    const allExceptCurrent = allProductsConverting.filter(
      (item) => item.id !== currentProductConverting.id
    );
    const allExceptSimilar = allExceptCurrent.filter(
      (item) =>
        !similarProductsConverting.some(
          (similarProduct) => similarProduct.id === item.id
        )
    );

    return allExceptSimilar;
  } else {
    const currentProductConverting = {
      title: product.title,
      id: product.id,
    };
    const allProductsConverting = mapConvertingProduct(products);

    const allExceptCurrent = allProductsConverting.filter(
      (item) => item.id !== currentProductConverting.id
    );

    return allExceptCurrent;
  }
};
