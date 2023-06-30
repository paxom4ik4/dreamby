import React from "react";
import { PopularItems } from "../common/popular_items/popular_items";
import { Services } from "./services/services";
import { Categories } from "./categories/categories";

import './index.scss';
import {MainSlider} from "./main_slider/main_slider";
import {Helmet} from "react-helmet";

const DEFAULT_CLASSNAME = 'main';

export const Main = ({ setSelectedSubcategories, setSelectedCategoryName, setFavoriteServices, favoriteServices, favoriteItems, setSelectedCategory, favoriteNotify, setFavoriteItems, setCartItems, categories, setCategories }) => {
  return (
    <div className={`${DEFAULT_CLASSNAME}`}>

      <Helmet>
        <title>DreamStore - Главная</title>
        <meta name="description" content="Главная страница DreamStore" />
        <meta name="keywords" content="Купить Мобильные телефоны, Аксессуары, Электронную технику Минск" />
      </Helmet>

      <MainSlider />

      <h1 align={"center"}>{"Интернет-магазин Dreamstore.by"}</h1>

      <Categories setSelectedCategoryName={setSelectedCategoryName} setSelectedCategory={setSelectedCategory} categories={categories} setCategories={setCategories} />
      <PopularItems setSelectedCategory={setSelectedCategory} setSelectedSubcategories={setSelectedSubcategories} favoriteItems={favoriteItems} favoriteNotify={favoriteNotify} setCartItems={setCartItems} setFavoriteItems={setFavoriteItems} />
      <Services favoriteItems={favoriteServices} setFavoriteItems={setFavoriteServices} />
    </div>
  )
}
