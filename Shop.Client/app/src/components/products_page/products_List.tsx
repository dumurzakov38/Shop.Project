import React, { useEffect, useState } from "react";
import { IProduct } from "../../../../../Shared/types";
import axios from "axios";

import { ItemProductsList } from "./item_products_List";
import { products_Filter } from "./components/products_filterFunction";
import { Loader } from "../other/otherElemntsUI";

export function ProductsList () {
    const [data, setData] = useState< IProduct[] >([]);
    const [btnSubmitDisabeld, setBtnSubmitDisabeld] = useState< Boolean >(true);
    const [loading, setLoading] = useState< Boolean >(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get< IProduct[] >('http://localhost:3000/api/products');
                setData(response.data);
            } catch (e) {
                console.log(e);
                setData([]);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
        products_Filter(setData, setBtnSubmitDisabeld, setLoading);
    },[]);

    return(
        <section className="main content">
            <div className="content__container">
                    <div className="products">
                        <div className="products__filter">
                            <form className="products__filter__form">
                                <h3 className="products__filter--h3">Фильтр для поиска товаров</h3>
                                <div className="products__filter__title">
                                    <label>Название:</label>
                                    <input className="products__filter__title--innTitle_product" type="text" placeholder="Название продукта"/>
                                </div>
                                <div className="products__filter__price">
                                    <div>
                                        <label>Цена:</label>
                                        <input className="products__filter__price--innPrice_productFrom" type="text" placeholder="От"/>
                                        <input className="products__filter__price--innPrice_productTo" type="text" placeholder="До"/>
                                    </div>
                                </div>

                                <button className="products__filter--submit" disabled={btnSubmitDisabeld? true : false} type="submit">Применить</button>
                                <button className="products__filter--submit--reset" disabled={btnSubmitDisabeld? true : false}>Сбросить</button>
                            </form>
                        </div>
                        {!loading ? (
                            <div className="products__list">
                                <div className="products__list__containerH1">
                                    <h1>Список товаров {data.length}</h1>
                                </div>
                                <div className="products__list__containerProducts">
                                    {data.map((item, index) => {
                                        return(
                                            <ItemProductsList index={index} product={item}/>
                                        );
                                    })}
                                </div>
                            </div>
                        ):(
                            <Loader loading={loading} />
                        )}
                    </div>
            </div>
        </section>
    );
};