import React from 'react';

import './index.scss';
import {Helmet} from "react-helmet";

const DEFAULT_CLASSNAME = 'billing';

export const Billing = () => {
  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper`}>

      <Helmet>
        <title>DreamStore - Оплата</title>
        <meta name="description" content="Страница Оплаты" />
        <link rel="canonical" href="https://dreamstore.by/billing"/>
      </Helmet>

      <div className={DEFAULT_CLASSNAME}>
        <h1 className={`${DEFAULT_CLASSNAME}_title`}>{"Оплата"}</h1>
        <div className={`${DEFAULT_CLASSNAME}_text_item`}>
          {'Для удобной покупки в магазине Dreamstore.by мы предлагаем несколько способов оплаты. Например, вы можете оплатить товары картой или наличными, забирая заказ самостоятельно по адресу ТРЦ “АренаCity”, пр. Победителей 84.'}
        </div>
        <div className={`${DEFAULT_CLASSNAME}_text_item`}>
          <span>{"Наличный расчет"}</span>
          <ul>
            <li>{"При самовывозе из магазина вы можете оплатить покупки наличными."}</li>
            <li>{"При доставке курьером доступен только наличный расчет!"}</li>
          </ul>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_text_item`}>
          <span>{"Безналичный расчет"}</span>
          <ul>
            <li>{"Оплачивайте товары картой при самовывозе."}</li>
            <li>{"Также доступен с НДС для юридических лиц."}</li>
          </ul>
          <p>{"Обратите внимание, что товар оплачивается только при получении!"}</p>
          <p>{"Для того, чтобы вы могли позволить себе купить желаемую технику, а платить частями, то мы предлагаем рассрочку и кредит от РРБ-Банка."}</p>
          <ul>
            <li>{"Рассрочка до 5 месяцев на любой товар."}</li>
            <li>{"Кредит от 6 до 12 месяцев на любой товар."}</li>
            <li>{"Оплата картой рассрочки “Халва” сроком до 2 месяцев."}</li>
            <li>{"Обращаем ваше внимание: рассрочки и кредитование на технику Apple временно приостановлены!"}</li>
          </ul>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_text_item`}>{"Для оформления рассрочки вам нужен только паспорт и официальное трудоустройство в течение 3 предыдущих месяцев. Для того, чтобы узнать подробности, свяжитесь с нашими консультантами по номерам +375 (29) 155-30-20, +375 (29) 755-55-62 или отправьте письмо на нашу почту."}</div>
      </div>
    </div>
  )
}
