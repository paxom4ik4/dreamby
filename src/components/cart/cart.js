import React, {useEffect} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './cart.scss';
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { CartPickup } from "./cart_pickup/cart_pickup";
import {Helmet} from "react-helmet";

const DEFAULT_CLASSNAME = 'cart';

export const Cart = ({ setCartItems, orderSuccess, rerenderCart, cartItems, mode = 'pickup', loginData}) => {
  useEffect(() => {}, [rerenderCart])

  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper`}>

      <Helmet>
        <title>DreamStore - Корзина</title>
        <meta name="description" content="Корзина" />
          <link rel="canonical" href="https://dreamstore.by/cart"/>
      </Helmet>

      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_title`}>{"Ваша корзина"}</div>
        <div className={`${DEFAULT_CLASSNAME}_content`}>
          {!cartItems.length && <div className={`${DEFAULT_CLASSNAME}_empty-cart_title`}>{"Ваша корзина пуста."}</div>}
          {!cartItems.length && <div className={`${DEFAULT_CLASSNAME}_empty-cart_content`}>{<FontAwesomeIcon icon={faCartPlus} />}</div>}

          {!!cartItems.length && mode === 'pickup' && <CartPickup setCartItems={setCartItems} orderSuccess={orderSuccess} loginData={loginData} cartItems={cartItems} />}
        </div>
      </div>
    </div>
  )
}
