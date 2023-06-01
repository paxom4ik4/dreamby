import React, { useState, useEffect } from 'react';

import './services.scss';
import {ItemCard} from "../../common/item_card/item_card";

const DEFAULT_CLASSNAME = 'services';

export const Services = ({ favoriteItems, setFavoriteItems }) => {
  const [servicesItems, setServicesItems] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}service`)
      .then(res => res.json())
      .then(data => setServicesItems(data.slice(0, 4)));
  }, [])

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_title`}>{'Наши услуги'}</div>
      <div className={`${DEFAULT_CLASSNAME}_content`}>
        {servicesItems.map(item => <ItemCard
          key={item.id.toString()}
          serviceId={item.id}
          setFavoriteItems={setFavoriteItems}
          image={item.img_path}
          title={item.name}
          price={item.price}
          isAvailable={true}
          isServiceItem={true}
          isFavorite={favoriteItems?.includes(item.id)}
        />)}
      </div>
    </div>
  )
}