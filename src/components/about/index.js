import React from 'react';

import './index.scss';
import { Contact } from "./contact/contact";
import {PopularItems} from "../common/popular_items/popular_items";
import {YMaps, Map, Placemark, Clusterer} from 'react-yandex-maps';
import {Gallery} from "./galery/gallery";
import {Helmet} from "react-helmet";

const DEFAULT_CLASSNAME = 'about'

const AboutMap = () => {
  return (
    <div className={`${DEFAULT_CLASSNAME}_map`}>
      <YMaps>
        <Map defaultState={{ center: [53.938071, 27.488142], zoom: 17 }}>
          <Clusterer
            options={{
              preset: "islands#invertedVioletClusterIcons",
              groupByCoordinates: false
            }}
          >
            <Placemark geometry={[53.938071, 27.488142]} />
          </Clusterer>
        </Map>
      </YMaps>
    </div>
  )
}

export const About = ({setSelectedCategory, setSelectedSubcategories, favoriteItems, favoriteNotify, setCartItems, setFavoriteItems}) => {
  return (
    <div className={`${DEFAULT_CLASSNAME}`}>

      <Helmet>
        <title>DreamStore - О нас</title>
        <meta name="description" content="О нас" />
      </Helmet>

      <Gallery />
      <Contact />
      <AboutMap />
      <PopularItems setSelectedCategory={setSelectedCategory} setSelectedSubcategories={setSelectedSubcategories} favoriteItems={favoriteItems} favoriteNotify={favoriteNotify} setCartItems={setCartItems} setFavoriteItems={setFavoriteItems} />
    </div>
  )
}