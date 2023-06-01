import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import './cart_order.scss';
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";

const DEFAULT_CLASSNAME = 'cart_order';

const trashIcon = <FontAwesomeIcon icon={faTrash} />

export const CartOrder = ({ hidePaymentMethod, addressName, addressLastName, addressPatronymic, addressText, setCartItems, orderSuccess, loginData, deliveryType, billingType, cartItems }) => {
  const overallPrice = cartItems.reduce((totalPrice, item) => {
    return totalPrice + (item.itemAmount * item.price);
  }, 0);

  const navigate = useNavigate();

  const orderHandler = () => {
    const devices = cartItems.filter(item => !item.serviceItem);

    const orders = devices.length > 0 ? devices.map((item) => {
      return ({
        prodId: item.id,
        equipment: `${item.selectedMemory ?? 0}`,
        quantity: item.itemAmount,
      })
    }) : [];

    const services = cartItems.filter(item => item.serviceItem);

    const servicesToPost = services.length > 0 ? services.map(item => {
      return !!item.servicePriceId ? {
        servicePriceId: item.servicePriceId,
        quantity: 1,
      } : {
        serviceId: item.serviceId,
        price: item.price,
        quantity: 1,
      }
    }) : [];

    const ordersToPost = [...orders, ...servicesToPost];

    let orderBody = !!addressText ? {
        cartItems: ordersToPost,
        firstName: addressName,
        lastName: addressLastName,
        address: addressText,
        phoneNumber: addressPatronymic,
        orderType: deliveryType,
        paymentMethod: billingType
        } : {
      cartItems: ordersToPost,
      firstName: addressName,
      lastName: addressLastName,
      phoneNumber: addressPatronymic,
      orderType: deliveryType,
      paymentMethod: billingType
    }

    if (loginData) {
        orderBody = {
            ...orderBody,
            userid: loginData.id
        }
    }

    fetch(`${process.env["REACT_APP_API_URL"]}order`, {
      method: "POST",
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      body: JSON.stringify(orderBody),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json()).then(() => {
      setCartItems([]);
      orderSuccess();
    });
  }

  let btnDisabled = false;

  if (hidePaymentMethod) {
    btnDisabled = false;
  } else if (!hidePaymentMethod && !billingType) {
    btnDisabled = true;
  }

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_title`}><div>{'Ваш заказ'}</div><span onClick={() => setCartItems([])}>{trashIcon}</span></div>
      <div className={`${DEFAULT_CLASSNAME}_items`}>
        {cartItems.map(item => {
          return <div className={`${DEFAULT_CLASSNAME}_item`}>
            <div className={`${DEFAULT_CLASSNAME}_item_image`}>
              <img src={item.image.includes('http') ? item.image : `http://194.62.19.52:7000/${item.image}`} alt={'item-image'}/>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_item_description`}>
              <div className={`${DEFAULT_CLASSNAME}_item_title`} onClick={() => {}}>{`${item.title} ${(item?.selectedMemory > 0) ? (`(${item.selectedMemory} GB)`) : ""}`}</div>
              <div className={`${DEFAULT_CLASSNAME}_item_model`}>{item.model}</div>
              <div className={`${DEFAULT_CLASSNAME}_price_amount`} style={{ gridTemplateColumns: !item.inStock ? "60% 40%" : "60% 40%",}}>
                <div className={`${DEFAULT_CLASSNAME}_item_price`}>{item.price === 0 ? "Для уточнения стоимости вам позвонит оператор" : typeof item.price === 'number' ? item.price.toFixed(2) + " BYN": item.price + " BYN"}</div>
                <div className={`${DEFAULT_CLASSNAME}_item_amount`}>
                  <span onClick={() => item.increaseAmount()}>{'+'}</span>
                  <span style={{cursor: "initial", padding: "0 4px"}}>{item.itemAmount}</span>
                  <span onClick={() => {
                    if (item.itemAmount > 1) {
                      item.decreaseAmount()
                    } else {
                      setCartItems(cartItems.filter(itm => itm.id !== item.id))
                    }
                  }}>{'-'}</span>
                </div>
                {!item.inStock && <div className={`${DEFAULT_CLASSNAME}_item_available`} style={{ fontSize: '11px', fontWeight: "700"}}>Под заказ (в течении 2 - 3 рабочих дней)</div>}
              </div>
            </div>
          </div>
        })}
      </div>
      <div className={`${DEFAULT_CLASSNAME}_additional-info`}>
        <div className={`${DEFAULT_CLASSNAME}_additional_item`}>
          <span>{'Доставка'}</span>
          <span>{'Бесплатно'}</span>
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_overall`}>
        <span>{'Итого'}</span>
        <span>{overallPrice === 0 ? "Требуется уточнение стоимости" : `${overallPrice.toFixed(2)} BYN`}</span>
      </div>
      <button disabled={!deliveryType || btnDisabled || !addressName || !addressLastName || !addressPatronymic} className={`${DEFAULT_CLASSNAME}_confirm-order`} onClick={() => orderHandler()}>{'Оформить'}</button>
    </div>
  )
}