import React from 'react';

import './cart_card.scss';

import coolIcon from '../../../assets/coolicon.png';

const DEFAULT_CLASSNAME = 'cart_card';

export const CartCard = ({deleteHandler, stage = 'a', additionalInfo = true, stageTitle = 'Вход', firstSubItem = 'Иван Иванов', secondSubItem = '+375(29)777-77-77', edit = true, cool = true}) => {
  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_stage`}>{stage}</div>
      <div className={`${DEFAULT_CLASSNAME}_content`}>
        <div className={`${DEFAULT_CLASSNAME}_content_title`}>{stageTitle} {cool && <img src={coolIcon} alt={'cool-icon'}/>}</div>
        {additionalInfo && <div className={`${DEFAULT_CLASSNAME}_content_additional`}>
          <span>{firstSubItem}</span>
          <span>{secondSubItem}</span>
        </div>}
      </div>
      {edit && <div className={`${DEFAULT_CLASSNAME}_edit`} onClick={() => deleteHandler(null)}>{'Изменить'}</div>}
    </div>
  )
}