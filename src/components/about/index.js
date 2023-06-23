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
        <div className={'about_additional_text'}>
            <p>
                ООО «ДиС концепт» <br />
                220116, г. Минск, пр-т Дзержинского, д.69, корп. 2, пом. 49, комната 123 <br />
                УНП 193383048 <br />
                р/с BY96 MTBK 3012 0001 0933 0009 8738 в ЗАО «МТБанк» 220035, г. Минск, РКЦ 15, ул. Тимирязева, 67, BIC MTBKBY22 <br />
                e-mail: disconcept@mail.ru <br />
                Тел. +37529 155 30 20 <br />
                Управляющий:  Червяков  В.В., действует на основании приказа № 1 от 12.02.2020г. <br />
                220020, г. Минск, пр-т Победителей, 84, магазин «Dream Store» <br />
            </p>
        </div>
      <PopularItems setSelectedCategory={setSelectedCategory} setSelectedSubcategories={setSelectedSubcategories} favoriteItems={favoriteItems} favoriteNotify={favoriteNotify} setCartItems={setCartItems} setFavoriteItems={setFavoriteItems} />
    </div>
  )
}