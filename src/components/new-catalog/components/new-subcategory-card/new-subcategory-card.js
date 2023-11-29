import React from 'react';

import './new-subcategory-card.scss';

const DEFAULT_CLASSNAME = 'new-subcategory-card';

export const NewSubcategoryCard = ({ active = false, onClick, image, title, index }) => {
  return (
    <div className={`${DEFAULT_CLASSNAME} ${active && 'active'}`} onClick={onClick}>
      <div className={`${DEFAULT_CLASSNAME}_image`}>
        <img src={image} alt={`new-subcategory-image-${index}`} />
      </div>
      <div className={`${DEFAULT_CLASSNAME}_title`}>{title}</div>
    </div>
  );
};
