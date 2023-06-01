import React, {useEffect, useState} from 'react';

import './favorite_items.scss';
import { ItemCard } from "../common/item_card/item_card";
import { Helmet } from "react-helmet";
import { objReplacer } from "../catalog/catalog";

const DEFAULT_CLASSNAME = 'favorite-items';

export const FavoriteItems = ({ setFavoriteItems, setFavoriteServices, favoriteItems, setCartItems, favoriteServices }) => {
  const [itemsToShow, setItemsToShow] = useState([]);

  const [servicesToShow, setServicesToShow] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}product`)
      .then(res => res.json())
      .then(data => {
          console.log(data);
          setItemsToShow(data.products.filter(item => favoriteItems.includes(item.id) || favoriteItems.includes(item.link_name)))
      })

    fetch(`${process.env.REACT_APP_API_URL}service`)
      .then(res => res.json())
      .then(data => {
          console.log(data);
          setServicesToShow(data.products.filter(item => favoriteServices.includes(item.id) || favoriteItems.includes(item.link_name)))
      })
  }, [favoriteItems, favoriteServices])

  const showItems = (!!itemsToShow.length || !!servicesToShow.length) && [...itemsToShow, ...servicesToShow];

  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper`}>

      <Helmet>
        <title>DreamStore - Избранное</title>
        <meta name="description" content="Страница избранных товаров" />
      </Helmet>

      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_title`}>{"Избранные"}</div>
        <div className={`${DEFAULT_CLASSNAME}_content`}>
          {showItems.length && <div className={`${DEFAULT_CLASSNAME}_clear`} onClick={() => {
            setFavoriteItems([]);
            setFavoriteServices([]);
            localStorage.removeItem('favoriteItems');
          }}>{'Очистить'}</div>}

          {!showItems && <div className={`${DEFAULT_CLASSNAME}_no-content`}>Нет избранных товаров</div>}

          {!!showItems && showItems?.map(item => {
            const categoryName = objReplacer[item.category.categoryName];
            const subcategory = item.subcategory.link_name;

            return item.categoryId ? <ItemCard
              clickLink={`${categoryName}/${subcategory}/${item.link_name ? item.link_name : item.id}`}
              setFavoriteItems={setFavoriteItems}
              productId={item.link_name || item.id}
              image={item.img_path}
              isAvailable={item.in_stock.length}
              isFavorite={true}
              title={item.name}
              price={+item.price}
              isServiceItem={item.isServiceItem}
              roundedBorders={true}
              setCartItems={setCartItems}
          /> : <ItemCard
                clickLink={`${categoryName}/${subcategory}/${item.link_name ? item.link_name : item.id}`}
                itemCategory={item.category.categoryName}
                itemSubcategory={item.subcategory.link_name}
              productId={item.id}
              setFavoriteItems={setFavoriteServices}
              image={item.img_path || item.image}
              isAvailable={item.isAvailable}
              isFavorite={true}
              title={item.name || item.title}
              isServiceItem={true}
              roundedBorders={true}
              link={item.link}
              price={+item.price}
              setCartItems={setCartItems}
            />})}
        </div>
      </div>
    </div>
  )
}