import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

import './slider.scss';

import SwiperCore, { Autoplay, Navigation, Scrollbar} from 'swiper';
import { useNavigate } from "react-router-dom";

SwiperCore.use([Scrollbar, Navigation, Autoplay]);

const DEFAULT_CLASSNAME = 'slider';

export const Slider = ({ slides, slidesPerView, aboutPage = false }) => {
  const navigate = useNavigate();

  return (
    <Swiper
      loop={true}
      mousewheel={{
        forceToAxis: true,
      }}
      key={slides.length.toString()}
      scrollbar={{
        hide: false,
        draggable: false,
      }}
      slidesPerView={slidesPerView ?? 1}
      spaceBetween={40}
      speed={500}
      autoplay={{
        delay: 4000,
        disableOnInteraction: true,
      }}
      className="mySwiper"
      navigation={!aboutPage}
      modules={[Autoplay, Scrollbar]}
    >
      {slides.map((slide) => {
        let linkUrl = "";

        if (!aboutPage) {
          const link = slide.link.split('/');

          linkUrl = aboutPage ? "#" : slide.link;
        }

        return (
          <div className={DEFAULT_CLASSNAME} key={slide.img_path.toString()}>
            <SwiperSlide>
              <div onClick={() => navigate(linkUrl)} style={{backgroundImage: `url(${slide.img_path})`}} className={`${DEFAULT_CLASSNAME}_slide`} />
            </SwiperSlide>
          </div>
        )
      })}
    </Swiper>
  )
}
