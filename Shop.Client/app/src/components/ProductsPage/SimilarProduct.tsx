import React, { FC } from "react";
import { Link } from "react-router-dom";
import { IProduct } from "../../../../../Shared/types";

export const SimilarProduct: FC<{
  similarProducts: IProduct[] | undefined;
}> = ({ similarProducts }) => {
  return (
    <div className="product__containerSimilarProducts">
      {!similarProducts ? (
        <></>
      ) : (
        <>
          {similarProducts.map((item) => {
            return (
              <div
                className="product__containerSimilarProducts--product"
                key={item.id}
              >
                <Link
                  to={`/${item.id}`}
                  className="product__containerSimilarProducts--product--a"
                >
                  <h3>{item.title}</h3>
                </Link>
                <p className="product__containerSimilarProducts--product--value">
                  {item.price}
                </p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
