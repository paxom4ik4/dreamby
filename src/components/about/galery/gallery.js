import React, {useEffect, useState} from 'react';

import './gallery.scss';

import { Slider } from "../../common/slider/slider";

const DEFAULT_CLASSNAME = 'gallery';

export const Gallery = () => {
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
      let filteredSlides;

      fetch(`${process.env.REACT_APP_API_URL}slider`)
          .then(res => res.json())
          .then(data => {
            filteredSlides= data.filter(item => item.aboutPage);

            setSlides(filteredSlides)
          });

      const width = document.documentElement.clientWidth;

      if ( width < 600 ) {
          setSlidesPerView(1)
      }
  }, []);

  const [slides, setSlides] = useState([]);

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_title`}>{"Галерея"}</div>
      <Slider slides={slides} slidesPerView={slidesPerView} aboutPage={true} />
    </div>
  )
}