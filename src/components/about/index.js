import React from 'react';

import './index.scss';
import { Contact } from "./contact/contact";
import {PopularItems} from "../common/popular_items/popular_items";
import {YMaps, Map, Placemark, Clusterer} from 'react-yandex-maps';
import {Gallery} from "./galery/gallery";
import {Helmet} from "react-helmet";
import {helmetJsonLdProp} from "react-schemaorg";

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
      <Helmet script={[
          helmetJsonLdProp({
              "@context": "https://schema.org",
              "@type": "MovingCompany",
              name: "DreamStore.by",
              brand: "Интернет магазин электронной техники",
          }),
      ]}>
        <title>Интернет-магазин электроники и акссесуаров - DreamStore.by</title>
        <meta name="description" content="Узнайте больше о DreamStore.by, нашей миссии и ценностях. Мы предлагаем широкий выбор электроники и аксессуаров в Минске." />
        <link rel="canonical" href="https://dreamstore.by/about"/>
      </Helmet>

      <h1 align="center">{"О Нас"}</h1>

      <Gallery />
      <Contact />
      <AboutMap />
        <div className={'about_additional_text'}>
            <p>
                ООО «ДиС концепт» <br />
                220116, г. Минск, пр-т Дзержинского, д.69, корп. 2, пом. 49, комната 123 <br />
                УНП 193383048 <br />
                e-mail: disconcept@mail.ru <br />
                Тел. +37529 155 30 20 <br />
                220020, г. Минск, пр-т Победителей, 84, магазин «Dream Store» <br />
            </p>
        </div>
      <PopularItems showTitle={false} setSelectedCategory={setSelectedCategory} setSelectedSubcategories={setSelectedSubcategories} favoriteItems={favoriteItems} favoriteNotify={favoriteNotify} setCartItems={setCartItems} setFavoriteItems={setFavoriteItems} />
    </div>
  )
}
