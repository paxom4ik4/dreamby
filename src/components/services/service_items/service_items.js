import React from 'react';

import './service_items.scss';
import { ItemCard } from "../../common/item_card/item_card";

const DEFAULT_CLASSNAME = 'service_items';

export const ServiceItems = ({ setSelectedCategory, compareItems, addItemToCompare, isServicePage, favoriteItems, favoriteNotify, items, setCartItems, setFavoriteItems}) => {
  let itemsToShow = items?.length && items;

  if (!itemsToShow) {
    return <div className={`${DEFAULT_CLASSNAME}_empty`}>{"Нет соответствуюших товаров"}</div>
  }

  console.log(itemsToShow);

  return (
    <div className={DEFAULT_CLASSNAME}>
      {itemsToShow?.length ? itemsToShow.map(item => <ItemCard
        product={item}
        setSelectedCategory={setSelectedCategory}
        hidePayment={item.hidePayment}
        key={item.id.toString()}
        productId={item.link ? item.link : item.prodId}
        minEquipment={item?.Memory ? item?.Memory[0]?.size : "0"}
        productIdForCart={item.id}
        serviceId={item.id}
        favoriteNotify={favoriteNotify}
        setFavoriteItems={setFavoriteItems}
        image={item.img_path || item.image}
        isAvailable={isServicePage || item?.in_stock > 0}
        isFavorite={favoriteItems?.includes(item?.id) || favoriteItems?.includes(item?.link)}
        inCompareMode={compareItems?.includes(item?.id) || compareItems?.includes(item?.link)}
        title={item.name || item.title}
        isServiceItem={item.isServiceItem}
        roundedBorders={true}
        link={item.link}
        price={(+item.price)}
        setCartItems={setCartItems}
        addItemToCompare={addItemToCompare}
      />) : <div className={`${DEFAULT_CLASSNAME}_empty`}>{"Загрузка..."}</div>}
    </div>
  )
}
