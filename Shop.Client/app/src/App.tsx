import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { FC } from "react";
import "./App.css";

import { Nav } from "./components/NavPage/FNav";
import { Main } from "./components/MainPage/FMain";
import { Product } from "./components/ProductsPage/FProduct";
import { ProductsList } from "./components/ProductsPage/ProductsList";

const App: FC = () => {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="*" element={<Main />} />
          <Route path="/products-list" element={<ProductsList />} />
          <Route path="/:id" element={<Product />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
