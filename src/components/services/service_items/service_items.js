import React, {useCallback, useContext, useMemo} from 'react';

import './service_items.scss';
import { ItemCard } from "../../common/item_card/item_card";
import {FavoriteContext} from "../../../index";

const DEFAULT_CLASSNAME = 'service_items';

export const ServiceItems = React.memo(({ setSelectedCategory, compareItems, addItemToCompare, isServicePage, items, setCartItems }) => {
  const { setFavoriteItems, favoriteItems, favoriteNotify } = useContext(FavoriteContext)

  let itemsToShow = items?.length && items;

  if (!itemsToShow) {
    return <div className={`${DEFAULT_CLASSNAME}_empty`}>{"Нет соответствуюших товаров"}</div>
  }

  return (
    <div className={DEFAULT_CLASSNAME}>
      {itemsToShow?.length ? itemsToShow.map(item => {
        // mocked until BE ready
        const productPriceToShow = Number(item.price) === 0 ? Number(item?.memory?.price ?? 0) : Number(item.price)

        return (<ItemCard
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
          isFavorite={!!favoriteItems?.find(product => product.id === item.id)}
          image={item.img_path || item.image}
          isAvailable={isServicePage || item?.in_stock > 0}
          inCompareMode={compareItems?.find(product => product.id === item.id)}
          title={item.name || item.title}
          isServiceItem={item.isServiceItem}
          roundedBorders={true}
          link={item.link}
          price={productPriceToShow}
          setCartItems={setCartItems}
          addItemToCompare={addItemToCompare}
        />)}) : <div className={`${DEFAULT_CLASSNAME}_empty`}>{"Загрузка..."}</div>}
    </div>
  )
})
