import React, {useEffect, useState} from 'react'

import './popular_items.scss';
import { ItemCard } from "../item_card/item_card";
import {objReplacer} from "../../catalog/catalog";

const DEFAULT_CLASSNAME = 'popular-items';

const menuItems = ['Новые поступления', 'Лидеры продаж', 'Специальные предложения'];

export const PopularItems = ({ setSelectedCategory, popularProductItems, setSelectedSubcategories, favoriteItems, favoriteNotify, setCartItems, setFavoriteItems, isRecommended }) => {
  const [popularItems, setPopularItems] = useState([]);

  const [activeMenuItem, setActiveMenuItem] = useState('Лидеры продаж');

  useEffect(() => {
    if (!popularProductItems?.length) {
      fetch(`${process.env["REACT_APP_API_URL"]}product/search`, {
          method: "POST",
      }).then(res => res.json())
        .then(data => {
          if (activeMenuItem === 'Лидеры продаж') {
              const itemStart = Math.round(Math.random() * 10);
              setPopularItems(data.products.slice(itemStart, itemStart + 4))
          } else if (activeMenuItem === 'Специальные предложения') {
              const itemStart = Math.round(Math.random() * 10);
              setPopularItems(data.products.slice(itemStart, itemStart + 4))
          } else {
              setPopularItems(data.products.slice(0, 4))
          }
        });
    } else {
      setPopularItems(popularProductItems)
    }
  }, [activeMenuItem, popularProductItems]);


  return (
    <div className={DEFAULT_CLASSNAME}>
      {!isRecommended && <div className={`${DEFAULT_CLASSNAME}_menu`}>
        {menuItems.map((item, id) =>
          <span
            key={id.toString()}
            className={`${DEFAULT_CLASSNAME}_menu_item ${item === activeMenuItem && 'active_menu_item'}`}
            onClick={() => setActiveMenuItem(item)}
          >
            {item}
          </span>
        )}
      </div>}
      <div className={`${DEFAULT_CLASSNAME}_content`}>
        {popularItems.map(item => {
          const categoryName = objReplacer[item?.category?.categoryName];
          const subcategory = item?.subcategory?.link_name;

          if (!categoryName || !subcategory) return <>{"Популярных товаров нет"}</>

          return (
              <ItemCard
                product={item}
                productIdForCart={item?.id}
                clickLink={`${categoryName}/${subcategory}/${item.link}`}
                itemCategory={item?.category?.categoryName}
                itemSubcategory={item?.subcategory.link_name}
                itemSubcategoryId={item?.subcategoryId}
                productId={item.id}
                favoriteNotify={favoriteNotify}
                setCartItems={setCartItems}
                setFavoriteItems={setFavoriteItems}
                image={item.img_path}
                isAvailable={item.in_stock > 0}
                isFavorite={favoriteItems?.includes(item)}
                title={item.name}
                link={item.link}
                price={+item.price}
                roundedBorders={true}
                setSelectedCategory={setSelectedCategory}
                setSelectedSubcategory={setSelectedSubcategories}
             />
           )
        })}
      </div>
    </div>
  )
}
