import React, { useEffect, useState } from "react";
import { IProduct } from "../../../../../Shared/types";
import axios from "axios";

import { ItemProductsList } from "./ItemProductsList";
import { ProductsFilter } from "./components/ProductsFilterFunction";
import { Loader } from "../other/Loader";

export function ProductsList() {
  const [data, setData] = useState<IProduct[]>([]);
  const [isBtnSubmitDisabeld, setIsBtnSubmitDisabeld] = useState<Boolean>(true);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<IProduct[]>(
          "http://localhost:3000/api/products"
        );
        setData(response.data);
      } catch (e) {
        console.log(e);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    ProductsFilter(setData, setIsBtnSubmitDisabeld, setIsLoading);
  }, []);

  return (
    <section className="main content">
      <div className="content__container">
        <div className="products">
          <div className="products__filter">
            <form className="products__filter__form">
              <h3 className="products__filter--h3">
                Фильтр для поиска товаров
              </h3>
              <div className="products__filter__title">
                <label>Название:</label>
                <input
                  className="products__filter__title--innTitle_product"
                  type="text"
                  placeholder="Название продукта"
                />
              </div>
              <div className="products__filter__price">
                <div>
                  <label>Цена:</label>
                  <input
                    className="products__filter__price--innPrice_productFrom"
                    type="text"
                    placeholder="От"
                  />
                  <input
                    className="products__filter__price--innPrice_productTo"
                    type="text"
                    placeholder="До"
                  />
                </div>
              </div>

              <button
                className="products__filter--submit"
                disabled={isBtnSubmitDisabeld ? true : false}
                type="submit"
              >
                Применить
              </button>
              <button
                className="products__filter--submit--reset"
                disabled={isBtnSubmitDisabeld ? true : false}
              >
                Сбросить
              </button>
            </form>
          </div>
          {!isLoading ? (
            <div className="products__list">
              <div className="products__list__containerH1">
                <h1>Список товаров {data.length}</h1>
              </div>
              <div className="products__list__containerProducts">
                {data.map((item, index) => {
                  return <ItemProductsList product={item} />;
                })}
              </div>
            </div>
          ) : (
            <Loader loading={isLoading} />
          )}
        </div>
      </div>
    </section>
  );
}
