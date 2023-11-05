import React, { useEffect, useState } from 'react';

import './index.scss';
import { PopularItems } from "../common/popular_items/popular_items";

import { ServiceItems } from "./service_items/service_items";
import arrow from "../catalog/arrow.svg";
import {Helmet} from "react-helmet";

const DEFAULT_CLASSNAME = 'services';

const CommonServices = () => {
  return (
    <div className="common-services">
      <h1 className="common-services_title">{"Услуги"}</h1>
    </div>
  )
}

export const ServicesFilter = ({ setCatalogFilterOpened, catalogFilterOpened, selectedMemory, setSelectedMemory, sortingInStock, setSortingInStock, keyWord, setKeyWord, alphabetSort, setAlphabetSort, sortingOrder, setSortingOrder, selectedSubcategories, setSelectedSubcategories, subcategories, price, setPrice, selectedCategory, selectedManufacturers, setSelectedManufacturers, selectedSubcategory, selectedSubSubcategory }) => {
  const classname = "services-filter";

  const fromPriceHandler = (event) => {
    setPrice({
      ...price,
      from: event.currentTarget.value
    })
  }

  const toPriceHandler = (event) => {
    setPrice({
      ...price,
      to: event.currentTarget.value
    })
  }

  const [categoryFilters, setCategoryFilters] = useState(null);

  useEffect(() => {
      fetch(`${process.env["REACT_APP_API_URL"]}product/filters?category=${selectedSubSubcategory?.id || selectedSubcategory || selectedCategory}`)
          .then(res => res.json())
          .then(data => {
              setCategoryFilters(data);
          });
  }, [selectedSubSubcategory, selectedSubcategory, selectedCategory]);

  const deleteItem = (selected, setSelected, item) => {
        const deleteIdx = selected.indexOf(item);

        const newItems = [...selected.slice(0, deleteIdx), ...selected.slice(deleteIdx + 1)];

        setSelected(newItems);
  }

  const addItem = (selected, setSelected, item) => {
      const newItems = [...selected, item];

      setSelected(newItems);
  }

  return (
      <div className={`${classname} ${!catalogFilterOpened && "servies_filter_hidden"}`}>

        <div className={`${classname}_filter`} style={{ fontWeight: "500" }}>Фильтр по продуктам</div>

        <div className={`${classname}_price`}>
          <div className={`${classname}_price_title`}>{'Стоимость'}</div>
          <div className={`${classname}_price_wrapper`}>
            <input value={price.from} onInput={fromPriceHandler} type={"number"} className={`${classname}_price_input`} placeholder={"от"} />
            <input value={price.to} onInput={toPriceHandler} type={"number"} className={`${classname}_price_input`} placeholder={"до"}/>
          </div>
        </div>

        <div className={`${classname}_manufacturer`}>
          <div className={`${classname}_manufacturer_title`}>{"Сортировка по ключевому слову"}</div>
          <input className={'manufacturer-input-keyword'} type={"text"} value={keyWord} onChange={(e) => setKeyWord(e.currentTarget.value)} placeholder={"Введите ключевое слово..."}/>
        </div>

        {!!subcategories && subcategories.length > 0 && <div className={`${classname}_manufacturer`}>
          <div className={`${classname}_manufacturer_title`}>{"Подкатегория"}</div>
          {subcategories.map(item => (
            <div className={`${classname}_manufacturer_item`}>
              <input checked={selectedSubcategories.includes(item)} onChange={() => selectedSubcategories.includes(item) ? deleteItem(selectedSubcategories, setSelectedSubcategories, item) : addItem(selectedSubcategories, setSelectedSubcategories, item)} type={"checkbox"} value={item.id} />
              <label>{item.name}</label>
            </div>
          ))}
        </div>}

        {!!categoryFilters?.manufacts.filter(Boolean).length && <div className={`${classname}_manufacturer`}>
          <div className={`${classname}_manufacturer_title`}>{"Производитель"}</div>
          {categoryFilters.manufacts.filter(item => item !== "null" && item !== "undefined").map(item => (
            <div key={item.toString()} className={`${classname}_manufacturer_item`}>
              <input checked={selectedManufacturers.includes(item)} onChange={() => selectedManufacturers.includes(item) ? deleteItem(selectedManufacturers, setSelectedManufacturers, item) : addItem(selectedManufacturers, setSelectedManufacturers, item)} type={"checkbox"} value={item} />
              <label>{item}</label>
            </div>
          ))}
        </div>
        }

        {/*{!!categoryFilters?.colors.filter(Boolean).length && <div className={`${classname}_manufacturer`}>*/}
        {/*  <div className={`${classname}_manufacturer_title`}>*/}
        {/*    {"Цвет товара"}*/}
        {/*    {!!selectedColor.length && <span onClick={() => setSelectedColor([])}>Очистить</span>}*/}
        {/*  </div>*/}
        {/*  <div className={"colors_container"}>*/}
        {/*    {categoryFilters.colors.filter(Boolean).map(item => (*/}
        {/*      <div onClick={() => selectedColor.includes(item) ? deleteItem(selectedColor, setSelectedColor, item) : addItem(selectedColor, setSelectedColor, item)} key={item.toString()} className={`${classname}_color_item ${selectedColor.includes(item)  && "selected_color"}`} style={{ backgroundColor: item }} />*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*}*/}

        {!!categoryFilters?.memory.filter(Boolean).length && <div className={`${classname}_manufacturer`}>
          <div className={`${classname}_manufacturer_title`}>
            {"Память"}
            {!!selectedMemory.length && <span onClick={() => setSelectedMemory([])}>Очистить</span>}
          </div>
          <div className={"colors_container"}>
            {[...new Set(categoryFilters.memory.map(item => item.trim()))].filter(Boolean).sort((a, b) => a - b).map(item => (
              <div onClick={() => selectedMemory.includes(item) ? deleteItem(selectedMemory, setSelectedMemory, item) : addItem(selectedMemory, setSelectedMemory, item)} key={item.toString()} className={`${classname}_memory_item ${selectedMemory.includes(item) && "selected_color"}`}>{item}</div>
            ))}
          </div>
        </div>
        }

        {/*{!!categoryFilters?.years.filter(Boolean).length && <div className={`${classname}_manufacturer`}>*/}
        {/*    <div className={`${classname}_manufacturer_title`}>{"Год Выпуска"}</div>*/}
        {/*    {categoryFilters.years.filter(Boolean).map(item => (*/}
        {/*        <div key={item.toString()} className={`${classname}_manufacturer_item`}>*/}
        {/*            <input onChange={() => selectedYears.includes(item) ? deleteItem(selectedYears, setSelectedYears, item) : addItem(selectedYears, setSelectedYears, item)} type={"checkbox"} value={item} />*/}
        {/*            <label>{item}</label>*/}
        {/*        </div>*/}
        {/*    ))}*/}
        {/*</div>}*/}

        <div className={`${classname}_manufacturer`}>
          <div className={`${classname}_manufacturer_title`}>
            {"Сортировка"}
            {!!(sortingOrder || alphabetSort || (sortingInStock === false || sortingInStock)) && <span onClick={() => {
              setSortingInStock(null);
              setAlphabetSort(null);
              setSortingOrder(null);
            }
            }>{"Сбросить"}</span>}
          </div>

          <form>
            <div>
              <input checked={sortingOrder === "asc"} onClick={() => {
                setAlphabetSort(null);
                setSortingInStock(null);
                setSortingOrder("asc")
              }} name={'sorting'} id={'price-desc'} type={"radio"} />
              <label>По возрастанию цены</label>
            </div>
            <div>
              <input checked={sortingOrder === "desc"} onClick={() => {
                setAlphabetSort(null);
                setSortingInStock(null);
                setSortingOrder("desc")
              }} name={'sorting'} id={'price-asc'} type={"radio"} />
              <label>По убыванию цены</label>
            </div>
            <hr />
            <div>
              <input checked={alphabetSort === "asc"} onClick={() => {
                setSortingOrder(null);
                setSortingInStock(null);
                setAlphabetSort("asc")
              }} name={'sorting'} id={'price-desc'} type={"radio"} />
              <label>По альфавиту (A - Я)</label>
            </div>
            <div>
              <input checked={alphabetSort === "desc"} onClick={() => {
                setSortingOrder(null);
                setSortingInStock(null);
                setAlphabetSort("desc")
              }} name={'sorting'} id={'price-asc'} type={"radio"} />
              <label>По альфавиту (Я - А)</label>
            </div>
            <hr />
            <div>
              <input checked={sortingInStock === true} onClick={() => {
                setSortingOrder(null);
                setAlphabetSort(null);
                setSortingInStock(true)
              }} name={'sorting'} id={'price-desc'} type={"radio"} />
              <label>Есть в наличии</label>
            </div>
            <div>
              <input checked={sortingInStock === false} onClick={() => {
                setSortingOrder(null);
                setAlphabetSort(null);
                setSortingInStock(false)
              }} name={'sorting'} id={'price-asc'} type={"radio"} />
              <label>Нет в наличии</label>
            </div>

            {catalogFilterOpened && <div onClick={() => setCatalogFilterOpened(false)} className={"confirm-filter-btn"}>Применить</div>}
          </form>
        </div>

        {/*<div className={`${classname}_manufacturer`}>*/}
        {/*  <div className={`${classname}_manufacturer_title`}>{"Сортировка по названию"}</div>*/}
        {/*  <div className={`${classname}_manufacturer_select`}>*/}
        {/*    <select onChange={(e) => e.currentTarget.value === "Нет" ? setAlphabetSort(null) : setAlphabetSort(e.currentTarget.value)}>*/}
        {/*      <option value={null}>Нет</option>*/}
        {/*      <option selected={alphabetSort === "asc"} value={"asc"}>По названию (А - Я)</option>*/}
        {/*      <option selected={alphabetSort === "desc"} value={"desc"}>По названию (Я - А)</option>*/}
        {/*    </select>*/}
        {/*    <img src={arrow} />*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className={`${classname}_manufacturer`}>*/}
        {/*  <div className={`${classname}_manufacturer_title`}>{"Сортировка по наличию"}</div>*/}
        {/*  <div className={`${classname}_manufacturer_select`}>*/}
        {/*    <select onChange={(e) => {*/}
        {/*      const value = e.currentTarget.value;*/}

        {/*      if (value === "Нет") {*/}
        {/*        setSortingInStock(null)*/}
        {/*      } else if (value === "true") {*/}
        {/*        setSortingInStock(true)*/}
        {/*      } else {*/}
        {/*        setSortingInStock(false);*/}
        {/*      }*/}

        {/*    }}>*/}
        {/*      <option value={null}>Нет</option>*/}
        {/*      <option selected={sortingInStock === true} value={"true"}>Есть в наличии</option>*/}
        {/*      <option selected={sortingInStock === false} value={"false"}>Нет в наличии</option>*/}
        {/*    </select>*/}
        {/*    <img src={arrow} />*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className={`${classname}_search`}>{"Показать товары"}</div>*/}
      </div>
  )
}

export const Services = ({ setSelectedCategory, catalogFilterOpened, setSelectedSubcategories, favoriteItems, favoriteCatalogItems, setFavoriteItems, setCartItems }) => {
  const [services, setServices] = useState([]);

  const [currentRate, setCurrentRate] = useState(2.6);

  useEffect(() => {
    fetch(`${process.env["REACT_APP_API_URL"]}service`)
      .then(res => res.json()).then(data => {
        const dataToSet = data.map(item => ({
          ...item,
          isServiceItem: true,
        }))

        setServices(dataToSet)
    });

    fetch(`${process.env["REACT_APP_API_URL"]}currency`)
      .then(res => res.json()).then(data => setCurrentRate(data.rate));
  }, [])

  return (
    <div className={DEFAULT_CLASSNAME}>
      <Helmet>
        <title>Услуги по восстановлению и настройке техники Apple в Минске - DreamStore.by</title>
        <meta name="description" content="DreamStore.by предлагает услуги по восстановлению и настройке техники Apple. Обратитесь к нам в Минске и мы поможем вам с вашими устройствами." />
          <link rel="canonical" href="https://dreamstore.by/services"/>
      </Helmet>

        <div style={{ display: 'none'}} itemScope itemType="https://schema.org/Store">
            <p itemProp="name">DreamStore.by </p>
            <div itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
                <span itemProp="streetAddress">г. Минск, пр-т Победителей, 84, магазин «Dream Store» </span>
                <span itemProp="addressLocality">Минск</span>
                <span itemProp="postalCode">220020</span>
            </div>
            Телефон: <span itemScope itemProp="telephone">+37529 155 30 20</span>
            <a href="https://dreamstore.by" itemScope itemProp="url">Сайт Компании</a>
            <div itemScope itemProp="description">Интернет Магазин Электронной Техники</div>
            <img itemProp="image" itemScope src="data:image/png;base64,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" alt={'dreamStore.by'}/>
            <span itemProp="priceRange">$$</span>
        </div>

      <CommonServices />
      <div className={`${DEFAULT_CLASSNAME}_content`}>
        <ServiceItems isServicePage={true} favoriteItems={favoriteItems} currentRate={currentRate} items={services} setCartItems={setCartItems} />
      </div>
      <PopularItems showTitle={false} setSelectedCategory={setSelectedCategory} setSelectedSubcategories={setSelectedSubcategories} favoriteItems={favoriteCatalogItems} currentRate={currentRate} setCartItems={setCartItems} setFavoriteItems={setFavoriteItems} />
    </div>
  )
}
