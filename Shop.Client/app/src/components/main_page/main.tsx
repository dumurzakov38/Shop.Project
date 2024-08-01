import React, { useEffect, useState, FC } from "react";
import { Link } from "react-router-dom";
import { IProduct } from "../../../../../Shared/types";
import axiosInstance from "axios";
import { Loader } from "../other/otherElemntsUI";


export const Main: FC<{}> = () => {
    const [data, setData] = useState< IProduct[] >([]);
    const [loading, setLoading] = useState< Boolean >(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get< IProduct[] >('http://localhost:3000/api/products');
                setData(response.data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    },[]);

    return(
        <section className="main content">
            <div className="content__container">
                {!loading ? (
                    <>
                        <div className="main__h1">
                            <h1>Shop.Client</h1>
                        </div>
                        <div className="main__p">
                            <p>В базе данных находится {data.length} товаров общей стоимостью {data.reduce((acc, product) => acc + product.price, 0)}</p>
                        </div>
                        <div className="main__buttons">
                            <div>
                                <Link to="/products-list">
                                    <button>Перейти к списку товаров</button>
                                </Link>
                            </div>
                            <div>
                                <a href="http://localhost:3000/admin" target="_blanck">
                                    <button>Перейти в систему администрирования</button>
                                </a>
                            </div>
                        </div>
                    </>
                ):(
                    <Loader loading={loading} />
                )}
            </div>
        </section>
    );
};