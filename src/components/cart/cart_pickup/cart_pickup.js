import React, { useState } from 'react';

import './cart_pickup.scss';
import { CartCard } from "../../common/cart_card/cart_card";
import { CartOrder } from "../cart_order/cart_order";

const DEFAULT_CLASSNAME = 'cart_pickup';

export const CartPickup = ({ setCartItems, orderSuccess, loginData, cartItems }) => {
  const [deliveryType, setDeliveryType] = useState(null);
  const [billingType, setBillingType] = useState(null);

  const [addressName, setAddressName] = useState("");
  const [addressLastName, setAddressLastName] = useState("");
  const [addressPatronymic, setAddressPatronymic] = useState("");
  const [addressText, setAddressText] = useState("");

  const [addressFull, setAddressFull] = useState(false);

  const saveAddressHandler = () => {
    setAddressFull(true);
  };

  const hidePaymentMethod = cartItems.some(item => item.hidePayment);

  console.log(hidePaymentMethod);

  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_info`}>
          <CartCard cool={!!loginData} edit={false} firstSubItem={`${loginData?.firstName} ${loginData?.lastName}`} secondSubItem={''} additionalInfo={!!loginData} />
          <CartCard deleteHandler={setDeliveryType} additionalInfo={false} stageTitle={'Тип доставки'} stage={'b'} edit={!!deliveryType} cool={!!deliveryType} />
          {!deliveryType && <div className={`${DEFAULT_CLASSNAME}_type`}>
            <form className={`${DEFAULT_CLASSNAME}_delivery-type-form`}>
              <div className={`${DEFAULT_CLASSNAME}_type_title`}>{'Тип доставки'}</div>
              <div>
                <input onChange={(e) => setDeliveryType(e.currentTarget.value)} name={'delivery_type'} id={'delivery'} type={"radio"} value={'Доставка (по Минску)'}/>
                <label htmlFor={'delivery'}>{'Доставка (по Минску)'}</label>
              </div>
              <div>
                <input onChange={(e) => setDeliveryType(e.currentTarget.value)} name={'delivery_type'} id={'self'} type={"radio"} value={'Самовывоз'}/>
                <label htmlFor={'self'}>{'Самовывоз'}</label>
              </div>
            </form>
          </div>}
          {deliveryType && <CartCard deleteHandler={setAddressFull} additionalInfo={false} stageTitle={deliveryType.includes('Доставка') ? 'Адресс доставки' : 'Контактные данные'} stage={'с'} edit={addressFull} cool={addressFull} />}
          {deliveryType && !addressFull && <div className={`${DEFAULT_CLASSNAME}_type`}>
            <form className={`${DEFAULT_CLASSNAME}_delivery-type-form`}>
              <div className={`${DEFAULT_CLASSNAME}_delivery_container`}>
                <div className={`${DEFAULT_CLASSNAME}_delivery_item`}>
                  <label htmlFor={'deliveryName'}>{'Ваше Имя'}</label>
                  <input name={'delivery_name'} id={'deliveryName'} type={"text"} value={addressName} onChange={(e) => setAddressName(e.currentTarget.value)} />
                </div>
                <div className={`${DEFAULT_CLASSNAME}_delivery_item`}>
                  <label htmlFor={'deliveryLastName'}>{'Ваша Фамилия'}</label>
                  <input name={'delivery_lastName'} id={'deliveryLastName'} type={"text"} value={addressLastName} onChange={(e) => setAddressLastName(e.currentTarget.value)} />
                </div>
                <div className={`${DEFAULT_CLASSNAME}_delivery_item`}>
                  <label htmlFor={'deliveryPatronymic'}>{'Контактный номер'}</label>
                  <input placeholder={"Введите телефон"} name={'delivery_patronymic'} id={'deliveryPhone'} type={"tel"} value={addressPatronymic} onChange={(e) => setAddressPatronymic(e.currentTarget.value)} />
                </div>
              </div>
                {deliveryType.includes('Доставка') && <div className={`${DEFAULT_CLASSNAME}_delivery_item`} style={{ width: "90%", marginBottom: '24px'}}>
                <label htmlFor={'address'}>{'Адрес доставки'}</label>
                <input value={addressText} onChange={(e) => setAddressText(e.currentTarget.value)} name={'delivery_address'} id={'address'} type={"text"} />
              </div>}
              <button onClick={() => saveAddressHandler()} type={"button"} disabled={!addressName || !addressLastName || !addressPatronymic || deliveryType.includes('Доставка') && !addressText} className={`${DEFAULT_CLASSNAME}_save-btn`}>{"Сохранить"}</button>
            </form>
          </div>}
          {(!hidePaymentMethod && !!deliveryType) && <CartCard deleteHandler={setBillingType} additionalInfo={false} stageTitle={'Способ оплаты'} stage={'c'} edit={!!billingType} cool={!!billingType} />}
          {(!hidePaymentMethod && (!!deliveryType && !billingType)) && <form className={`${DEFAULT_CLASSNAME}_payment-type-form`}>
            <div className={`${DEFAULT_CLASSNAME}_type_title`}>{'Выберите способ оплаты'}</div>
            <div>
              <input onChange={(e) => setBillingType(e.currentTarget.value)} name={'payment_type'} id={'cash'} type={"radio"} value={'Наличными'}/>
              <label htmlFor={'cash'}>{'Наличными'}</label>
            </div>
            {!deliveryType?.includes("Доставка") && <div>
              <input onChange={(e) => setBillingType(e.currentTarget.value)} name={'payment_type'} id={'card'} type={"radio"} value={'Картой (visa / mastercard)'}/>
              <label htmlFor={'card'}>{'Картой (visa / mastercard)'}</label>
            </div>}
          </form>
          }
        </div>
        <div className={`${DEFAULT_CLASSNAME}_order`}>
          <CartOrder hidePaymentMethod={hidePaymentMethod} addressText={addressText} addressName={addressName} addressLastName={addressLastName} addressPatronymic={addressPatronymic} setCartItems={setCartItems} orderSuccess={orderSuccess} loginData={loginData} deliveryType={deliveryType} billingType={billingType} cartItems={cartItems} />
        </div>
      </div>
    </div>
  )
}