import React, { useEffect, useState } from "react";

import './main_slider.scss';
import { Slider } from "../../common/slider/slider";

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

    console.log(slides)

  return (
    <div className={DEFAULT_CLASSNAME}>
      <Slider slides={slides} />
    </div>
  )
}