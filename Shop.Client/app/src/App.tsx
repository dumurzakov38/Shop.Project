import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { FC } from "react";
import "./App.css";

import { Nav } from "./components/NavPage/Nav";
import { Main } from "./components/MainPage/Main";
import { Product } from "./components/ProductsPage/Product";
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
