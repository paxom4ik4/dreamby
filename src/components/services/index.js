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

export const ServicesFilter = ({ setCatalogFilterOpened, catalogFilterOpened, selectedColor, setSelectedColor, selectedMemory, setSelectedMemory, sortingInStock, setSortingInStock, keyWord, setKeyWord, alphabetSort, setAlphabetSort, sortingOrder, setSortingOrder, selectedSubcategories, setSelectedSubcategories, subcategories, price, setPrice, selectedCategory, selectedManufacturers, selectedYears, setSelectedManufacturers, setSelectedYears }) => {
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
      fetch(`${process.env["REACT_APP_API_URL"]}product/filters?category=${selectedCategory}`)
          .then(res => res.json())
          .then(data => {
              setCategoryFilters(data);
          });
  }, []);

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

export const Services = ({ setSelectedCategory, catalogFilterOpened, setSelectedSubcategories, favoriteItems, favoriteCatalogItems, setFavoriteItems, setFavoriteServices, setCartItems }) => {
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
        <title>DreamStore - Услуги</title>
        <meta name="description" content="Страница Услуг" />
          <link rel="canonical" href="https://dreamstore.by/services"/>
      </Helmet>

      <CommonServices />
      <div className={`${DEFAULT_CLASSNAME}_content`}>
        <ServiceItems isServicePage={true} favoriteItems={favoriteItems} currentRate={currentRate} items={services} setCartItems={setCartItems} setFavoriteItems={setFavoriteServices} />
      </div>
      <PopularItems setSelectedCategory={setSelectedCategory} setSelectedSubcategories={setSelectedSubcategories} favoriteItems={favoriteCatalogItems} currentRate={currentRate} setCartItems={setCartItems} setFavoriteItems={setFavoriteItems} />
    </div>
  )
}
