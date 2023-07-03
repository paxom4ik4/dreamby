import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart, faScaleUnbalancedFlip} from '@fortawesome/free-solid-svg-icons';

import './item_card.scss';
import available from '../../../assets/item_card/available.svg';
import unavailable from '../../../assets/item_card/unavailable.svg';
import cart from '../../../assets/item_card/buy.svg';
import { useNavigate, useParams } from "react-router-dom";
import {objReplacer} from "../../catalog/catalog";

const DEFAULT_CLASSNAME = 'item_card';

const AVAILABLE_TEXT = 'В наличии';
const UNAVAILABLE_TEXT = 'Под заказ';

const AVAILABLE_SERVICE_TEXT = 'Доступна';
const UNAVAILABLE_SERVICE_TEXT = 'Недоступна';

export const ItemCard = ({
    product,
  clickLink,
  setSelectedCategory = () => {},
  hidePayment = false,
  deleteFromCompare,
  addItemToCompare,
  minEquipment,
  productId, serviceId, productIdForCart,
  setFavoriteItems,
  image,
  isFavorite,
  inCompareMode,
  isAvailable = true,
  title,
  price,
  isServiceItem = false,
  roundedBorders = true,
  compareMode = false,
  setCartItems = () => {},
}) => {
  const navigate = useNavigate();

  const availableIcon = <img src={isAvailable ? available : unavailable} alt={'availability'} />
  const availableText = isAvailable ?
    isServiceItem ?  AVAILABLE_SERVICE_TEXT : AVAILABLE_TEXT :
    isServiceItem ? UNAVAILABLE_SERVICE_TEXT : UNAVAILABLE_TEXT

  const availableContent = <div className={`${DEFAULT_CLASSNAME}_availability_content`}>{availableIcon} {availableText}</div>

  const favoriteIcon = <FontAwesomeIcon icon={faHeart} />
  const compareIcon = <FontAwesomeIcon icon={faScaleUnbalancedFlip} />

  const { category } = useParams();

  const openProductHandler = (event) => {
    setSelectedCategory(category);

    if (!isServiceItem && event.target.className !== "add-to-cart" && event.target.className !== "tem_card_cart" && event.target.className !== 'item_card_compare' && event.target.closest('div').className !== 'item_card_favoriteWrapper' && clickLink) {
      if (clickLink === "default") {
        navigate('/catalog/')
      }

      navigate(`/catalog/${clickLink}`);
      return;
    }

    if (!isServiceItem && event.target.className !== "add-to-cart" && event.target.className !== "tem_card_cart" && event.target.className !== 'item_card_compare' && event.target.closest('div').className !== 'item_card_favoriteWrapper') {
      !isServiceItem && productId && navigate(`${window.location.pathname}/${productId}`)
    }

    if (isServiceItem && event.target.className !== 'add-to-cart' && event.target.closest('div').className !== 'item_card_favorite') {
      navigate(`/services/${serviceId}`);
    }
  }

  return (
    <div onClick={openProductHandler} className={`${DEFAULT_CLASSNAME} ${!isAvailable && 'unavailable'}`} style={{ borderRadius: roundedBorders && "12px", background: compareMode && '#FFF'}}>
      <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
        {compareMode && <div className={'delete-from-compare'} onClick={deleteFromCompare}>Убрать из сравнения</div>}
        { !compareMode && <div className={`${DEFAULT_CLASSNAME}_favoriteWrapper`}>
          {!isServiceItem && <span className={`${DEFAULT_CLASSNAME}_favorite`} onClick={() => {setFavoriteItems(productId)}} style={{ color: isFavorite && "red" }}>{favoriteIcon}</span>}
          {!isServiceItem && <span className={`${DEFAULT_CLASSNAME}_compare`} onClick={() => addItemToCompare(product)} style={{ fontSize: "19px", color: inCompareMode && "#0A5BD3" }}>{compareIcon}</span>}
        </div>
        }
        <img className={`${DEFAULT_CLASSNAME}_image`} src={image?.includes('http') ? image : `http://194.62.19.52:7000/${image}`} alt={title} title={`Купить ${title}`} />
        <div className={`${DEFAULT_CLASSNAME}_content`} style={{ boxShadow: compareMode && '0px 0px 29px 11px rgba(52, 100, 223, 0.23)' }}>
          <div className={`${DEFAULT_CLASSNAME}_content_status`}>
            <div className={`${DEFAULT_CLASSNAME}_availability`}>
              {availableContent}
            </div>
            {!isServiceItem && !compareMode &&
            <div className={`${DEFAULT_CLASSNAME}_cart`} onClick={() => {
              setCartItems({
                id: productIdForCart,
                image,
                title,
                price,
                inStock: isAvailable,
                hidePayment: hidePayment,
                equipment: minEquipment ?? "0",
            })}}>
              <button disabled={!isAvailable} className={'add-to-cart'}>{"В корзину"} <img src={cart} alt={'cart-image'} /></button>
            </div>}
          </div>
          <div className={`${DEFAULT_CLASSNAME}_content_title`}>
            {title}
          </div>
          {!isServiceItem && <div className={`${DEFAULT_CLASSNAME}_content_price`}>
            {price === 0 ? "Уточните цену" : typeof price === "number" ? price.toFixed(2) + " BYN" : `${price}.00 BYN`}
          </div>}
          {isServiceItem && <div className={`${DEFAULT_CLASSNAME}_more`}>{"Подробнее"}</div>}
        </div>
      </div>
    </div>
  )
}
