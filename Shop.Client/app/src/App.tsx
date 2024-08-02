import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { FC } from "react";
import "./App.css";

import { Nav } from "./components/nav_page/nav";
import { Main } from "./components/main_page/main";
import { ProductsList } from "./components/products_page/products_List";
import { Product } from "./components/products_page/product";

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