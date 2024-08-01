export interface IProductEditData {
  title: string;
  description: string;
  price: string;
  mainImage: string;
  newImages?: string;
  commentsToRemove: string | string[];
  imagesToRemove: string | string[];
  similarProductToRemove: string | string[];
  add_similar_product: string | string[]
};

declare module 'express-session' {
  export interface SessionData {
    username?: string
  }
};

export interface IProductCreate { 
  title: string;
  description: string;
  price: string;
};