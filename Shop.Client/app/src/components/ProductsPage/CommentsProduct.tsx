import React, { FC } from "react";
import { IProduct } from "../../../../../Shared/types";

export const CommentsProducts: FC<{ data: IProduct | undefined }> = ({
  data,
}) => {
  return (
    <div className="product__containerComments">
      {!data?.comments ? (
        <></>
      ) : (
        <>
          {data.comments.map((item, index) => {
            return (
              <div className="product__containerComments--comment" key={index}>
                <h3 className="product__containerComments--comment--title">
                  {item.name}
                </h3>
                <p className="product__containerComments--comment--email">
                  {item.email}
                </p>
                <p className="product__containerComments--comment--body">
                  {item.body}
                </p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
