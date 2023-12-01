import React from 'react';

import './new-category-card.scss';

import expandIcon from './icons/expand.svg';

const DEFAULT_CLASSNAME = 'new-category-card';

export const NewCategoryCard = ({ onClick, active = false, image, title, amount, index }) => {
  return (
    <div onClick={onClick} className={`${DEFAULT_CLASSNAME} ${active && 'active'}`}>
      <div className={`${DEFAULT_CLASSNAME}_image`}>
        <img src={image} alt={`new-category-card-${index}`} />
      </div>
      <div className={`${DEFAULT_CLASSNAME}_text`}>
        <div className={`${DEFAULT_CLASSNAME}_text_title`}>{title}</div>
        <div className={`${DEFAULT_CLASSNAME}_text_amount`}>Товаров: {amount}</div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_expand`}>
        <img src={expandIcon} alt={`${index}_expand`} />
      </div>
    </div>
  );
};
