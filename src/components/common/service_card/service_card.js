import React from 'react'

import './service_card.scss';

const DEFAULT_CLASSNAME = 'service_card';

export const ServiceCard = ({
  title,
  image
}) => {
  return (
    <div className={DEFAULT_CLASSNAME}>
      <img className={`${DEFAULT_CLASSNAME}_image`} src={`http://194.62.19.52:7000/${image}`} alt={'service-card-image'}/>
      <div className={`${DEFAULT_CLASSNAME}_title`}>{title}</div>
    </div>
  )
}