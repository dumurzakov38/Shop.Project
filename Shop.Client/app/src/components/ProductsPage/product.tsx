import { Loader } from "../other/Loader";
import React, { FC, useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { IProduct } from "../../../../../Shared/types";
import product_placeholder from "../../img/product_placeholder.png";
import { ProductAddComment } from "./components/ProductAddCommentFunction";
import { SimilarProduct } from "./SimilarProduct";
import { CommentsProducts } from "./CommentsProduct";
import { AddCommentsProduct } from "./AddCommentsProduct";

export const Product: FC = () => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<IProduct>();
  const [similarProducts, setSimilarProducts] = useState<IProduct[]>();
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [isBtnSubmitDisabeld, setIsBtnSubmitDisabeld] = useState<Boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<IProduct>(
          `http://localhost:3000/api/products/${id}`
        );
        setData(response.data);
      } catch (e) {
        console.log(e);
        setData(undefined);
      } finally {
        setIsLoading(false);
      }

      try {
        const response = await axios.get<IProduct[]>(
          `http://localhost:3000/api/products/similar_products/${id}`
        );
        setSimilarProducts(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    ProductAddComment(setIsBtnSubmitDisabeld, id, setData, setIsLoading);
  }, [isLoading === false]);

  return (
    <section className="main content">
      <div className="content__container">
        {!isLoading ? (
          <div className="product">
            <div className="product__container">
              <div>
                <div className="product__containerTitle">
                  <h3>{data?.title}</h3>
                </div>
                <div className="product__containerImages">
                  {!data?.images ? (
                    <div className="product__containerImages__mainImage">
                      <img src={product_placeholder} alt="" />
                    </div>
                  ) : (
                    <>
                      <div className="product__containerImages__mainImage">
                        <img src={data?.thumbnail?.url} alt="" />
                      </div>
                      <div className="product__containerImages__images">
                        {data?.images.map((item, index) => {
                          return (
                            <div
                              className="product__containerImages__image"
                              key={index}
                            >
                              <img src={item.url} alt="" />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div>
                <div className="product__containerDescription">
                  <p>{data?.description}</p>
                </div>
                <div className="product__containerPrice">
                  <p className="product__containerPrice--name">Стоимость:</p>
                  <p className="product__containerPrice--value">
                    {data?.price}
                  </p>
                </div>
              </div>
            </div>
            <SimilarProduct similarProducts={similarProducts} />
            <CommentsProducts data={data} />
            <AddCommentsProduct isBtnSubmitDisabeld={isBtnSubmitDisabeld} />
          </div>
        ) : (
          <Loader loading={isLoading} />
        )}
      </div>
    </section>
  );
};
