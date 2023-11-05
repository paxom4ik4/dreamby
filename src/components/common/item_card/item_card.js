import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faScaleUnbalancedFlip } from '@fortawesome/free-solid-svg-icons';

import './item_card.scss';
import available from '../../../assets/item_card/available.svg';
import unavailable from '../../../assets/item_card/unavailable.svg';
import cart from '../../../assets/item_card/buy.svg';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {objReplacer} from "../../catalog/catalog";

const DEFAULT_CLASSNAME = 'item_card';

const AVAILABLE_TEXT = 'В наличии';
const UNAVAILABLE_TEXT = 'Под заказ';

const AVAILABLE_SERVICE_TEXT = 'Доступна';
const UNAVAILABLE_SERVICE_TEXT = 'Недоступна';

export const ItemCard = React.memo(({
    hideControls = false,
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
  link,
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
  const location = useLocation();

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

    if (!isServiceItem && event.target.className !== "item_card_content_buttons" && event.target.className !== "item_card_content_buttons" && event.target.className !== 'item_card_content_buttons_add_to_card' && event.target.closest('div').className !== 'item_card_content_buttons' && clickLink) {
      if (clickLink === "default") {
        navigate('/catalog/')
      }

      (location.pathname.split('/').length < 5 && location.pathname.includes('catalog')) ? navigate(link.split('/').slice(1).join('/')) : navigate(`/catalog/${clickLink}`);
      return;
    }

    if (!isServiceItem && event.target.className !== "item_card_content_buttons_favorite" && event.target.className !== "item_card_content_buttons_favorite" && event.target.className !== 'item_card_content_buttons_add_to_card' && event.target.closest('div').className !== 'item_card_content_buttons') {
      if (!isServiceItem && link) {
        if (link.includes('catalog')) {
          window.location = `${window.location.origin}/${link}`;
        } else {
          navigate(`${window.location.pathname}/${link}`)
        }
      }
    }

    if (isServiceItem && event.target.className !== 'item_card_content_buttons_favorite' && event.target.closest('div').className !== 'item_card_content_buttons') {
      navigate(`/services/${serviceId}`);
    }
  }

  return (
    <div itemScope itemType={"https://schema.org/ItemList"} onClick={openProductHandler} className={`${DEFAULT_CLASSNAME} ${!isAvailable && 'unavailable'}`} style={{ borderRadius: roundedBorders && "12px", background: compareMode && '#FFF'}}>
      <div className={`${DEFAULT_CLASSNAME}_wrapper`} itemScope itemType={isServiceItem ? 'https://schema.org/Service' : 'https://schema.org/Product'}>
        {isServiceItem && <meta itemProp="serviceType" content={title} />}
        <div className={`${DEFAULT_CLASSNAME}_image_wrapper`}>
          <img itemProp="image" className={`${DEFAULT_CLASSNAME}_image`} src={image?.includes('http') ? image : `http://194.62.19.52:7000/${image}`} alt={title} title={`Купить ${title}`} />
        </div>
        <div className={`${DEFAULT_CLASSNAME}_content_status`}>
          <div className={`${DEFAULT_CLASSNAME}_availability`}>
            {availableContent}
          </div>
          {!isServiceItem && <div style={{ display: 'none'}} itemScope itemProp="aggregateRating" itemType="https://schema.org/AggregateRating">
            <meta itemProp="reviewCount" content="100"/>
            <meta itemProp="ratingValue" content="5"/>
          </div>}
        </div>
        <span className={`${DEFAULT_CLASSNAME}_content_title`} itemProp="name">{`${title}`}</span>
        {!isServiceItem && <div style={{ display: 'none '}} itemProp="offers" itemScope itemType="http://schema.org/Offer">
          <link itemProp="availability" href="https://schema.org/InStock"/>
          <meta itemProp="priceCurrency" content="BYN"/>
          <span itemProp="price">{price === 0 ? "Уточните цену" : `${price}.00`}</span> <span>{price !== 0 && "BYN"}</span>
        </div>}
        {!isServiceItem && <div className={`${DEFAULT_CLASSNAME}_content_buttons`}>
          <button onClick={() => {setFavoriteItems(product)}} style={{ color: isFavorite && "red" }} className={`${DEFAULT_CLASSNAME}_content_buttons_favorite`}>{favoriteIcon}</button>
          <button className={`${DEFAULT_CLASSNAME}_content_buttons_add_to_card`}>
              <span
                  itemProp="price"
                  className={`${DEFAULT_CLASSNAME}_content_buttons_add_to_card_price`}
              >
                {price === 0 ? "Уточните цену" : `${price}.00`}
                {price !== 0 && " BYN"}
              </span>
            <span className={`${DEFAULT_CLASSNAME}_content_buttons_add_to_card_btn`}>В корзину</span>
          </button>
        </div>}
      </div>
    </div>
  )
})

{/*{(compareMode) && <div className={'delete-from-compare'} onClick={deleteFromCompare}>Убрать из сравнения</div>}*/}
{/*{ !compareMode && <div className={`${DEFAULT_CLASSNAME}_favoriteWrapper`}>*/}
{/*  {!isServiceItem && <span className={`${DEFAULT_CLASSNAME}_favorite`} onClick={() => {setFavoriteItems(product)}} style={{ color: isFavorite && "red" }}>{favoriteIcon}</span>}*/}
{/*  {!isServiceItem && <span className={`${DEFAULT_CLASSNAME}_compare`} onClick={() => addItemToCompare(product)} style={{ fontSize: "19px", color: inCompareMode && "#0A5BD3" }}>{compareIcon}</span>}*/}
{/*</div>*/}
{/*}*/}

{/*{!isServiceItem && !compareMode &&*/}
{/*<div className={`${DEFAULT_CLASSNAME}_cart`} onClick={() => {*/}
{/*  setCartItems({*/}
{/*    id: productIdForCart,*/}
{/*    image,*/}
{/*    title,*/}
{/*    price,*/}
{/*    inStock: isAvailable,*/}
{/*    hidePayment: hidePayment,*/}
{/*    equipment: minEquipment ?? "0",*/}
{/*})}}>*/}
{/*  <button disabled={!isAvailable} className={'add-to-cart'}>{"В корзину"} <img src={cart} alt={'cart-image'} /></button>*/}
{/*</div>}*/}
