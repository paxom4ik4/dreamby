import React, { useEffect, useState } from "react";

import './main_slider.scss';
import { Slider } from "../../common/slider/slider";

import mockedSlide from '../../../assets/main-widget-mocked.png';
import mockedSlide2 from '../../../assets/main-widget-mocked2.png';

const DEFAULT_CLASSNAME = 'main-slider'

export const MainSlider = () => {
  const [slides, setSlides] = useState([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}slider`)
      .then(res => res.json())
      .then(data => {
        const slides = data.filter(item => !item.aboutPage);
        setSlides(slides)
      });
  }, [])

    const mockedSlides = [
      {
        aboutPage: false,
        description: null,
        id: "d647208b-dfcf-4437-94b2-c572a251766b",
        img_path: mockedSlide,
        link: "catalog/smart-watches/apple-watch-ultra/umnyye-chasy-apple-watch-ultra-lte-49-mm-midnight-32",
        priority: 0,
        productId: null,
        title: null,
        used: true
      },
      {
        aboutPage: false,
        description: null,
        id: "e647208b-dfcf-4437-94b2-c572a251766b",
        img_path: mockedSlide2,
        link: "catalog/phones-and-tablets/iphone-15-pro-max/smartfon-apple-iphone-15-pro-max-titan-512",
        priority: 1,
        productId: null,
        title: null,
        used: true
      },
    ];

  return (
    <div className={DEFAULT_CLASSNAME}>
      <Slider slides={mockedSlides} slidesPerView={1} />
    </div>
  )
}
