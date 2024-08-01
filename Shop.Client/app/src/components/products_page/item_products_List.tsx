import React, { FC } from "react";
import { Link } from "react-router-dom";
import { IProduct } from "../../../../../Shared/types";

import product_placeholder from "../../img/product_placeholder.png";

export const ItemProductsList: FC<{ index: number, product: IProduct }> = ({ index, product }) => {
    return (
        <div key={index} className="products__list__containerProducts__product">
            <Link to={`/${product.id}`}>
                <div className="products__list__containerProducts__product__containerTitle">
                {!product.title ? (
                    <h1>Заголовок отсутствует</h1>
                ):(
                    <h1>{product?.title}</h1>
                )}
                </div>
            </Link>
            <Link to={`/${product.id}`}>
                {!product.images ? (
                    <div className="products__list__containerProducts__product__containerImg">
                        <img src={product_placeholder} alt=""/>
                    </div>
                ):(
                    <div className="products__list__containerProducts__product__containerImg">
                        <img src={product.thumbnail?.url} alt=""/>
                    </div>
                )}
            </Link>
            <div className="products__list__containerProducts__product__containerPrice">
                <p>Стоимость: </p>
                {!product.price ? (
                    <p>0</p>
                ):(
                    <p>{product?.price}</p>
                )}
            </div>
            <div className="products__list__containerProducts__product__containerComments">
                <p>Коментариев: </p>
                {!product.comments ? (
                    <p>0</p>
                ):(
                    <p>{product.comments?.length}</p>
                )}
            </div>
        </div>
    )
};