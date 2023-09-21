import React, {useEffect, useState} from 'react';
import { Helmet } from 'react-helmet';

import "swiper/css";
import "swiper/css/pagination";

import './index.scss';
import { ItemInfo } from "./item_info/item_info";
import { PopularItems } from "../common/popular_items/popular_items";
import {useLocation, useNavigate, useParams} from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";

import { Pagination } from "swiper";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faScaleUnbalancedFlip} from "@fortawesome/free-solid-svg-icons";
import {objReplacer} from "../catalog/catalog";
import {Loader} from "../../index";
import {isNumber} from "lodash";

const DEFAULT_CLASSNAME = 'item-page';

const conditions = {
  'new': 'Новый',
  'activated': 'Активированный'
}

export const ItemPage = ({ allSubcategories, setCartItems, compareItems, setSelectedCategory, setSelectedSubcategory, setSelectedSubcategories, setSelectedDeviceName, setLoginData, setFavoriteItems, favoriteItems, loginData, addItemToCompare, addToCart = () => {}}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.endsWith('/null')) {
      navigate(location.pathname.replace('/null', ''));
    }
  }, [location]);

  const { id: productId, subcategory, category } = useParams();

  const [itemData, setItemData] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);

  const [productModel, setProductModel] = useState([]);

  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    setSelectedMemory(null);

    fetch(`${process.env["REACT_APP_API_URL"]}product/${productId}`)
      .then(res => res.json()).then(data => {

        setImages(data?.product?.color?.Image);

        setProductModel(data?.product?.ProductModel?.models);
        setItemData(data);
        setSelectedDeviceName(data.product?.name);
        setSelectedCategory(data?.product?.categoryId)
        setCurrentImage(data?.product?.color?.Image[0]?.img_path);
    })
  }, [navigate]);

  useEffect(() => {
    if(itemData?.product?.category) {
      fetch(`${process.env["REACT_APP_API_URL"]}category/${itemData?.product?.categoryId}`)
        .then(res => res.json())
        .then(data => setSubcategories(data.subcats));
    }
  }, [itemData]);

  useEffect(() => {
    if (!!subcategories) {
      if (!itemData?.product?.subcategory?.name) {
        setSelectedSubcategories([]);
      } else {
        const selectedSubcategory = subcategories.find(item => item.name === itemData?.product?.subcategory.name);
        setSelectedSubcategories([selectedSubcategory]);
      }
    }
  }, [subcategories])

  useEffect(() => {
    return () => {
      setSelectedDeviceName(null);
    }
  }, [])

  const [servicesNewData, setServicesNewData] = useState([]);

  useEffect(() => {
    if (!!itemData) {
      setServicesNewData(itemData?.product?.ServicePrice)
    }
  }, [itemData])

  const [config, setConfig] = useState({});

  useEffect(() => {
    if (!!itemData && itemData !== {}) {
      setConfig({
        colors: itemData?.product?.ProductModel?.colors.filter(Boolean),
        memory: itemData?.product?.ProductModel?.memory.filter(Boolean),
      })
    }
  }, [itemData]);

  const technicalSpecs = itemData?.characts?.map(item => {
    return {
      headerLeft: item.name,
      headerRight: null,
      tableItems: item.value.map((item) => {
        return {
          title: item.name,
          value: item.value,
        }
      })
    }
  })

  useEffect(() => {
    if (allSubcategories.length) {
      const subCat = allSubcategories.find(item => item.link_name === subcategory);

      setSelectedCategory(category);
      setSelectedSubcategory(subCat["id"]);
    }
  }, [category, subcategory, allSubcategories])

  const contentData = itemData?.product?.Information?.map((item, idx) => {
    return idx === 1 ? {
      colored: item.color !== 'white',
      image: item.img_path,
      content: item.text.split('\n'),
    } : {
      colored: item.color !== 'white',
      image: item.img_path,
      content: item.text.split('\n'),
      textPosition: 'left'
    }
  })

  //TODO: add to card handler after BE integration
  const addToCartHandler = () => {
    addToCart({
      id: itemData.product.id,
      image: itemData.product.img_path,
      title: itemData.product.name,
      price: selectedMemory ? selectedMemory?.price ? Number(selectedMemory.price) : itemData.product.price : itemData.product.price,
      selectedMemory: selectedMemory ? selectedMemory.size : 0,
      selectedColor: selectedColor ? selectedColor : "no_color_selected",
      inStock: itemData.product.in_stock > 0,
      hidePayment: itemData.product.hidePayment
    });
  }

  const likeIcon = <FontAwesomeIcon icon={faHeart} />
  const compareIcon = <FontAwesomeIcon icon={faScaleUnbalancedFlip} />

  const [fullSize, setFullSize] = useState(false)

  const [noItemOrder, setNoItemOrder] = useState(false);

  const [currentImage, setCurrentImage] = useState(itemData?.product?.img_path);

  const [images, setImages] = useState([]);

  if (!itemData) {
    return (
        <Loader />
    )
  }

  return (
    <div className={DEFAULT_CLASSNAME} itemScope itemType="https://schema.org/Product">
      <Helmet>
        <title>{itemData?.product?.meta_title || `${itemData?.product?.name} купить в Минске - Dreamstore.by`}</title>
        <meta name="description" content={itemData?.product?.meta_description || `${itemData?.product?.name} купить в Минске по выгодной цене ✔️ Быстрая доставка ✔️ ${itemData?.product?.name} купить в рассрочку или в кредит в интернет-магазине dreamstore.by` } />
        <link rel="canonical" href={`https://dreamstore.by${location.pathname}`} />
      </Helmet>

      <div className={`${DEFAULT_CLASSNAME}_fullSizeImage ${fullSize && "opened"}`} onClick={(event) => {
        setFullSize(false)
      }}>
        <div onClick={(event) => {
          event.stopPropagation()
          const currentImageIndex = images.indexOf(currentImage);
          setCurrentImage(currentImageIndex === 0 ? images[images.length - 1].img_path : images[currentImageIndex - 1].img_path);
        }} className={`${DEFAULT_CLASSNAME}_image prev_photo`}>{"<"}</div>
        <img src={currentImage?.includes('http') ? currentImage : `http://194.62.19.52:7000/${currentImage}`}/>
        <div onClick={(event) => {
          event.stopPropagation()
          const currentImageIndex = images.indexOf(currentImage);
          setCurrentImage(currentImageIndex === (images.length - 1) ? images[0].img_path : images[currentImageIndex + 1].img_path);
        }} className={`${DEFAULT_CLASSNAME}_image next_photo`}>{">"}</div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
        <div className={`${DEFAULT_CLASSNAME}_stickers`}></div>
        <div className={`${DEFAULT_CLASSNAME}_compareLike`}>
          <button className={`${DEFAULT_CLASSNAME}_like ${favoriteItems.includes(itemData?.product?.id) && 'like-active'}`} onClick={() => setFavoriteItems(itemData?.product.id)}>
            {likeIcon}
          </button>
          <button className={`${DEFAULT_CLASSNAME}_compare ${compareItems.includes(itemData?.product?.id) && 'compare-active'}`} onClick={() => addItemToCompare(itemData?.id)}>
            {compareIcon}
          </button>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_content`}>
          {(images.length ? <div className={`${DEFAULT_CLASSNAME}_carousel ${itemData?.product?.in_stock <= 0 && "disabled"}`}>
            <>
            <Swiper
                style={{ width: "25%", maxHeight: "50%"}}
                direction={"vertical"}
                slidesPerView={3}
                modules={[Pagination]}
                className="mySwiper"
            >
              {images.map(item => (
                <SwiperSlide onClick={() => setCurrentImage(item.img_path)} style={{ padding: "12px 0"}} className={`${DEFAULT_CLASSNAME}_carousel_slide`}>
                  <img src={item.img_path?.includes('http') ? item.img_path : `http://194.62.19.52:7000/${item.img_path}`} alt={'slide_image'}/>
                </SwiperSlide>)
                )}
            </Swiper>
            <Swiper
                style={{ width: "100%", maxHeight: "50%"}}
                direction={"horizontal"}
                slidesPerView={1}
                modules={[Pagination]}
                pagination={true}
                className="mySwiperMobile"
            >
              {images.length ? images.map(item => {
                return (
                    !!item && <SwiperSlide onClick={() => setCurrentImage(item.img_path)} style={{ padding: "12px 0"}} className={`${DEFAULT_CLASSNAME}_carousel_slide`}>
                      <img src={item.img_path.includes('http') ? item.img_path : `http://194.62.19.52:7000/${item.img_path}`} alt={'slide_image'}/>
                    </SwiperSlide>
                )}) : null}
            </Swiper>
            </>
            <div className={`${DEFAULT_CLASSNAME}_image hide_on_mobile`}>
              <img onClick={() => setFullSize(true)} itemProp="image" src={currentImage?.includes('http') ? currentImage : `http://194.62.19.52:7000/${currentImage}`} alt={"item-page-image"}/>
            </div>
          </div> : <div className={`${DEFAULT_CLASSNAME}_image`} itemProp="image">
            <img onClick={() => setFullSize(true)} src={currentImage?.includes('http') ? currentImage : `http://194.62.19.52:7000/${currentImage}`} alt={"item-page-image"}/>
          </div>)}
          <div className={`${DEFAULT_CLASSNAME}_configuration`}>
            <div style={{ display: 'none'}} itemProp="aggregateRating" itemType="https://schema.org/AggregateRating" itemScope>
              <meta itemProp="reviewCount" content="100"/>
              <meta itemProp="ratingValue" content="5"/>
            </div>

            <h1 className={`${DEFAULT_CLASSNAME}_title`} itemProp="name">{itemData?.product?.name}</h1>
            {!!config?.colors?.length && <div className={`${DEFAULT_CLASSNAME}_configuration_group`}>
              <div className={`${DEFAULT_CLASSNAME}_configuration_group_title`}>{"Цвет: "}</div>
              <div className={`${DEFAULT_CLASSNAME}_configuration_items`}>
                {config.colors.map(item => (
                  <img className={`${DEFAULT_CLASSNAME}_product_color-item ${itemData.product.color.link === item.link && 'active-image-selected'}`} alt={'photo-wtf'} onClick={() => {
                    const link = window.location.href.split('/');
                    const productLink = link[link.length - 1];

                    const product = productLink.split('-');
                    product[product.length - 2] = item.link;

                    const linkProductFinal = product.join('-');

                    link[link.length - 1] = linkProductFinal;

                    const linkToFinal = link.join('/');

                    window.location.replace(linkToFinal);
                  }} src={item?.img_path[0]} />
                ))}
              </div>
            </div>}
            {!!config?.memory?.length && <div className={`${DEFAULT_CLASSNAME}_configuration_group`}>
              <div className={`${DEFAULT_CLASSNAME}_configuration_group_title`}>{"Объем встроенной памяти: "}</div>
              <div className={`${DEFAULT_CLASSNAME}_configuration_items`}>
                {config?.memory?.map(memory => <div onClick={() => {
                  const link = window.location.href.split('/');
                  const productLink = link[link.length - 1];

                  const product = productLink.split('-');
                  product[product.length - 1] = memory.size;

                  const linkProductFinal = product.join('-');

                  link[link.length - 1] = linkProductFinal;

                  const linkToFinal = link.join('/');

                  window.location.replace(linkToFinal);
                }} className={`${DEFAULT_CLASSNAME}_configuration_item config-item-block ${itemData.product.memory.size === memory.size && 'config-item-block-active'}`}>{memory.size}</div>)}
              </div>
            </div> }
            {!!config?.condition?.length && <div className={`${DEFAULT_CLASSNAME}_configuration_group`}>
              <div className={`${DEFAULT_CLASSNAME}_configuration_group_title`}>{"Состояние: "}</div>
              <div className={`${DEFAULT_CLASSNAME}_configuration_items`}>
                {config?.condition?.map(condition => <div onClick={() => setSelectedCondition(condition)} className={`${DEFAULT_CLASSNAME}_configuration_item config-item-block ${selectedCondition === condition && 'config-item-block-active'}`}>{conditions[condition]}</div>)}
              </div>
            </div> }
            <div className={`${DEFAULT_CLASSNAME}_price`} itemProp="price">{(((selectedMemory?.price === 0 || itemData?.product?.price === 0) || (selectedMemory?.price === "0" || itemData?.product?.price === "0")) ? "Уточните стоимость" : selectedMemory?.price ? Number(itemData.product.price).toFixed(2) : Number(itemData?.product?.memory.price).toFixed(2)) + " (BYN)"}</div>
            {/*<button disabled={itemData?.product?.in_stock <= 0 && !noItemOrder} onClick={() => addToCartHandler()} className={`${DEFAULT_CLASSNAME}_add-to-cart`}>{"Добавить в корзину"}</button>*/}

            {itemData?.product?.in_stock <= 0 && <span style={{ display: "flex", alignItems: "center", marginTop: "12px", fontSize: "14px" }}>{"Товара нет в наличии. Доступно под заказ"}
              <input style={{ position: "initial", marginLeft: "12px" }} id={'no-order'} type={"checkbox"} className={`order-checkbox`} value={noItemOrder} onChange={() => setNoItemOrder(!noItemOrder)} />
              <label style={{ width: "fit-content", marginLeft: "0"}} htmlFor={'no-order'}>Под заказ</label>
            </span>}
          </div>
        </div>

        {(!!technicalSpecs?.length || !!contentData?.length || !!servicesNewData?.length) && <ItemInfo itemData={itemData} setLoginData={setLoginData} id={itemData.product.id} loginData={loginData} technicalSpecs={technicalSpecs} contentData={contentData} />}
        <PopularItems setCartItems={setCartItems} setSelectedCategory={setSelectedCategory} popularProductItems={itemData?.product?.popular} setSelectedSubcategories={setSelectedSubcategories} setFavoriteItems={setFavoriteItems} favoriteItems={favoriteItems} isRecommended={true} />
      </div>
    </div>
  )
}
