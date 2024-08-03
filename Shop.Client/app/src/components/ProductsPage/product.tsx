import { Loader } from "../other/Loader";
import React, { FC, useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { IProduct } from "../../../../../Shared/types";
import product_placeholder from "../../img/product_placeholder.png";
import { Link } from "react-router-dom";
import { ProductAddComment } from "./components/ProductAddCommentFunction";

export const Product: FC<{}> = () => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<IProduct>();
  const [similarProducts, setSimilarProducts] = useState<IProduct[]>();
  const [loading, setLoading] = useState<Boolean>(true);
  const [btnSubmitDisabeld, setBtnSubmitDisabeld] = useState<Boolean>(true);

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
        setLoading(false);
      }

      try {
        const response = await axios.get<IProduct[]>(
          `http://localhost:3000/api/products/similar_products/${id}`
        );
        setSimilarProducts(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    ProductAddComment(setBtnSubmitDisabeld, id, setData, setLoading);
  }, [loading === false]);

  return (
    <section className="main content">
      <div className="content__container">
        {!loading ? (
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
            <div className="product__containerSimilarProducts">
              {!similarProducts ? (
                <></>
              ) : (
                <>
                  {similarProducts.map((item, index) => {
                    return (
                      <div
                        className="product__containerSimilarProducts--product"
                        key={index}
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
            <div className="product__containerComments">
              {!data?.comments ? (
                <></>
              ) : (
                <>
                  {data.comments.map((item, index) => {
                    return (
                      <div
                        className="product__containerComments--comment"
                        key={index}
                      >
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
            <div className="product__containerAddComments">
              <form className="product__containerAddComments__containerForm">
                <div className="product__containerAddComments__containerForm--title">
                  <label className="product__containerAddComments__containerForm--title--label">
                    Заголовок
                  </label>
                  <input
                    className="product__containerAddComments__containerForm--title--input"
                    placeholder="Введите заголовок"
                    type="text"
                  />
                </div>
                <div className="product__containerAddComments__containerForm--email">
                  <label className="product__containerAddComments__containerForm--email--label">
                    Email
                  </label>
                  <input
                    className="product__containerAddComments__containerForm--email--input"
                    placeholder="Введите email"
                    type="text"
                  />
                </div>
                <div className="product__containerAddComments__containerForm--body">
                  <label className="product__containerAddComments__containerForm--body--label">
                    Комментарий
                  </label>
                  <textarea
                    className="product__containerAddComments__containerForm--body--textarea"
                    placeholder="Введите комментарий"
                  />
                </div>

                <div className="product__containerAddComments__containerForm--submit">
                  <button
                    className="product__containerAddComments__containerForm--submit__btn"
                    type="submit"
                    disabled={btnSubmitDisabeld ? true : false}
                  >
                    Добавить комментарий
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <Loader loading={loading} />
        )}
      </div>
    </section>
  );
};
