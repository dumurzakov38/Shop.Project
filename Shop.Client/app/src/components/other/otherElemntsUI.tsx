import React, { FC } from "react";
import loader_scan from "../../img/loader_scan.svg";
import "./style.css";

export const Loader: FC<{ loading: Boolean }> = (loading) => {
    return (
        <div className="container__loader">
            <img className={(!loading ? "" : " loaderAnimation" )} src={loader_scan} title="Загрузка" alt="Лоадер" />
            <p>Загрузка данных</p>
        </div>
    );
};