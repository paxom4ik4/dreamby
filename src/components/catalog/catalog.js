import React, {useEffect, useState} from 'react';

import './index.scss';
import { ServiceItems } from "../services/service_items/service_items";
import { ServicesFilter } from "../services";

import filter from './filter.svg';
import itemsFilter from './itemsFilter.svg';
import backArrow from './backArrow.svg';

import left from './left.svg';
import right from './right.svg';
import {cardSize, CategoryCard} from "../common/category_card/category_card";
import {useNavigate, useParams} from "react-router-dom";
import {Helmet} from "react-helmet";

const DEFAULT_CLASSNAME = 'catalog';

export const objReplacer = {
  "Телефоны и планшеты": "phones-and-tablets",
  "Товары для дома": "home-stuff",
  "Умный дом": "smart-house",
  "Аксессуары": "accessories",
  "Компьютеры и сети": "pc-and-networks",
  "Товары для спорта и активного отдыха": "sport-and-leisure",
  "Аксессуары для машин": "for-cars",
  "Аудио": "audio",
  "Товары для детей": "for-kids",
  "Часы и фитнес-браслеты": "smart-watches",
  "Носители информации": "flash-drives",
}

const objReplacer2 = {
  "phones-and-tablets": "Телефоны и планшеты",
  "home-stuff": "Товары для дома" ,
  "smart-house": "Умный дом",
  "accessories": "Аксессуары",
  "pc-and-networks": "Компьютеры и сети",
  "sport-and-leisure": "Товары для спорта и активного отдыха",
  "for-cars": "Аксессуары для машин",
  "audio": "Аудио",
  "for-kids": "Товары для детей",
  "smart-watches": "Часы и фитнес-браслеты",
  "flash-drives": "Носители информации",
}

export const Catalog = ({ selectedSubcategory, allSubcategories, setSelectedSubcategory, catalogFilterOpened, setCatalogFilterOpened, compareItems, selectedSubcategories, addItemToCompare, selectedCategory, favoriteItems, setSelectedCategory, categories, favoriteNotify, setFavoriteItems, setCartItems }) => {
  const navigate = useNavigate();

  const [catalogTitle, setCatalogTitle] = useState("Каталог");
  const [catalogDescription, setCatalogDescription] = useState("Каталог товаров");
  const [catalogKeywords, setCatalogKeywords] = useState("Техника, электронные устройства, аксессуары");

  const [catalogItems, setCatalogItems] = useState([])

  const [maxPage, setMaxPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { category, subcategory } = useParams();

  const [price, setPrice] = useState({
      from: null,
      to: null
  })

  const [sorting, setSorting] = useState('asc');

  const handlerSorting = () => sorting === 'asc' ? setSorting('desc') : setSorting('asc');

  const [currentRate, setCurrentRate] = useState(2.6);

  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  const [subcategories, setSubcategories] = useState([]);

  const [keyWord, setKeyWord] = useState("");
  const [alphabetSort, setAlphabetSort] = useState(null);
  const [sortingOrder, setSortingOrder] = useState(null);
  const [sortingInStock, setSortingInStock] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);

  const deleteManufacturer = item => {
      const deleteIdx = selectedManufacturers.indexOf(item);

      const newItems = [...selectedManufacturers.slice(0, deleteIdx), ...selectedManufacturers.slice(deleteIdx + 1)];

      setSelectedManufacturers(newItems)
  }

  //pagination
  const [pages, setPages] = useState(false);

  useEffect(() => {
    fetch(`${process.env["REACT_APP_API_URL"]}currency`)
      .then(res => res.json()).then(data => setCurrentRate(data.rate));
  }, []);

  useEffect(() => {
    if (!category) {
      setSelectedCategory(null);
    }

    if (!subcategory) {
      setSelectedSubcategory(null);
    }

    if (allSubcategories.length && subcategory) {
      setSelectedSubcategory(allSubcategories.find(item => item.link_name === subcategory).id);
    }

    if (categories.length && category) {
      setSelectedCategory(categories.find(item => item.categoryName === objReplacer2[category]).id);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [currentPage, allSubcategories, selectedCategory, category, subcategory, catalogItems, categories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubcategories]);

  useEffect(() => {
      if (!selectedCategory || !selectedSubcategory) {
          return;
      }

      let urlToFetch = `${process.env["REACT_APP_API_URL"]}product/search?category=${selectedCategory}`;

      if (currentPage !== 1) {
          urlToFetch += `&p=${currentPage}`;
      }

      const token = sessionStorage.getItem('admin-dream-token');

      let additionalFilters = {};

      if (!!price.from) {
        additionalFilters = {
          ...additionalFilters,
          minprice: price.from,
        }
      }

      if (!!price.to) {
        additionalFilters = {
          ...additionalFilters,
          maxprice: price.to,
        }
      }

      if (sortingOrder) {
        additionalFilters = {
          ...additionalFilters,
          priceSort: sortingOrder,
        }
      }

      if (sortingInStock !== null) {
        additionalFilters = {
          ...additionalFilters,
          in_stock: sortingInStock,
        }
      }

      if (alphabetSort) {
        additionalFilters = {
          ...additionalFilters,
          alphabetSort: alphabetSort,
        }
      }

      if (keyWord.length) {
        additionalFilters = {
          ...additionalFilters,
          name: keyWord
        }
      }

      if (selectedColor.length) {
        additionalFilters = {
          ...additionalFilters,
          colors: selectedColor
        }
      }

      if (selectedMemory.length) {
        additionalFilters = {
          ...additionalFilters,
          memory: selectedMemory
        }
      }

      const megaZapros = keyWord.length || alphabetSort || sortingOrder || sortingInStock !== null || price.to || price.from || selectedMemory.length || selectedColor.length;
      if(!!selectedManufacturers && selectedManufacturers.length || selectedSubcategory || megaZapros) {
          fetch(urlToFetch, {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json',
                  "Authorization": token,
              },
              body: JSON.stringify({
                  ...additionalFilters,
                  producer: selectedManufacturers,
                  subcategory: selectedSubcategory,
              })
          })
              .then(res => res.json())
              .then(data => {
                  if (data.statusCode === 500 || !data.products.length && data.max_page === 0) {
                    selectedSubcategory(null);
                  }

                  setCatalogItems(data.products)
                  setMaxPage(data.max_page);
              });
      } else {
          fetch(urlToFetch)
              .then(res => res.json())
              .then(data => {
                  setCatalogItems(data.products)
                  setMaxPage(data.max_page);
              });
      }
  }, [category, currentPage, selectedCategory, price, selectedManufacturers, selectedSubcategory, sortingOrder, sortingInStock, alphabetSort, keyWord, selectedMemory, selectedColor])

    const [categoryName, setCategoryName] = useState("Товары");

    useEffect(() => {
        if (!selectedCategory) {
          setSelectedManufacturers([]);
        }

        if(!!selectedCategory) {
            fetch(`${process.env["REACT_APP_API_URL"]}category/${selectedCategory}`)
                .then(res => res.json())
                .then(data => {
                  setCategoryName(data.categoryName);
                  setSubcategories(data.subcats)
                });
        }

        setPrice({
          from: null,
          to: null
        })

        setAlphabetSort(null);
        setKeyWord("");
        setSortingInStock(null);
        setSortingOrder(null);
        setSelectedMemory([]);
        setSelectedColor([]);

    }, [selectedCategory]);

    const metaText = allSubcategories.find(item => item.id === selectedSubcategory)?.meta_text || "";
    const metaTitle = allSubcategories.find(item => item.id === selectedSubcategory)?.meta_title || "";

    const metaTextCategory = categories.find(item => item.id === selectedCategory)?.meta_text || "";
    const metaTitleCategory = categories.find(item => item.id === selectedCategory)?.meta_title || "";

    useEffect(() => {
        if (!selectedSubcategory && !selectedCategory) {
            setCatalogTitle("Каталог");
        } else if (selectedCategory && selectedSubcategory && allSubcategories && subcategory) {
            const { meta_description, meta_keyword, name } = allSubcategories.find(item => item.link_name === subcategory);

            setCatalogTitle(name);
            setCatalogDescription(meta_description);
            setCatalogKeywords(meta_keyword);
        } else if (selectedCategory && category) {
            const { meta_description, meta_keyword } = categories?.find(item => item.id === selectedCategory);

            setCatalogDescription(meta_description);
            setCatalogKeywords(meta_keyword);
            setCatalogTitle(objReplacer2[category]);
        }
    }, [selectedSubcategory, selectedCategory, allSubcategories, subcategory, category]);

  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper`}>

    <Helmet>
        <title>{catalogDescription}</title>
        <meta name="description" content={catalogKeywords} />
    </Helmet>

      <div className={DEFAULT_CLASSNAME}>
        {!selectedCategory && <div className={`${DEFAULT_CLASSNAME}_select`}>
          <div className={`${DEFAULT_CLASSNAME}_select_title`}>{"Выберите категорию товаров"}</div>
          <div className={`${DEFAULT_CLASSNAME}_select_categories`}>
            {categories.map(category => {
                let size;

                if (["Телефоны и планшеты"].includes(category.categoryName)) {
                    size = cardSize.high
                }
                if (["Товары для дома",
                    "Компьютеры и сети",
                    "Товары для спорта и активного отдыха",
                    "Часы и фитнес-браслеты"].includes(category.categoryName)
                ) {
                    size = cardSize.wide
                }

              return <CategoryCard
                  linkCard={true}
                  link={objReplacer[category.categoryName]}
                  hideLink={true}
                  categoryId={category?.id}
                  title={category.categoryName}
                  image={category.img_path}
                  size={size}
                  itemsAmount={category._count.products > 0 ? category._count.products : "Нет в наличии"}
                  className={`${DEFAULT_CLASSNAME}_select_categories_item`}
                  clickHandler={() => {
                      setSelectedCategory(category?.id);
                  }
              } />
            })}
          </div>
        </div>}

        {selectedCategory && !selectedSubcategory && <div className={`${DEFAULT_CLASSNAME}_selectSubcategory`}>
          <div className={`${DEFAULT_CLASSNAME}_selectSubcategory__header`}>
            <div onClick={() => {
              navigate('/catalog');
              setSelectedCategory(null)
            }} style={{ color: "#4575EED9" }}>
              <img src={backArrow} alt={'back-arrow'} />
                <span>Вернуться к категориям </span>
              </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_selectSubcategory__items`}>
            <div className={`${DEFAULT_CLASSNAME}_selectSubcategory_category`}>
              <h1 style={{ fontSize: "20px", fontWeight: "400" }}>{categories.find(item => item.id === selectedCategory)["categoryName"]}</h1>
              <img src={categories.find(item => item.id === selectedCategory)["img_path"]} alt={'CategoryItem'}/>
            </div>
            {subcategories.length && subcategories.map(item => <div onClick={() => {
              navigate(`${window.location.pathname}/${item.link_name}`)
              setSelectedSubcategory(item.id)
            }} className={`${DEFAULT_CLASSNAME}_selectSubcategory_item`}>
              <div>{item.name}</div>
              <img src={item.img_path} alt={'subcategory-kartinka'} />
            </div>)}
          </div>
        </div>}

        {selectedCategory && selectedSubcategory &&
            <>
              <div className={`${DEFAULT_CLASSNAME}_title`}>
                <img onClick={() => navigate(window.location.pathname.split('/').slice(0, -1).join('/'))} src={filter} alt={'filter'} />
                <h1>{catalogTitle}</h1>
              </div>
              <div className={`${DEFAULT_CLASSNAME}_content`}>
                  <div className={`${DEFAULT_CLASSNAME}_content_filterWrapper`}>
                      <ServicesFilter
                        setCatalogFilterOpened={setCatalogFilterOpened}
                        catalogFilterOpened={catalogFilterOpened}
                        selectedMemory={selectedMemory}
                        setSelectedMemory={setSelectedMemory}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                        sortingInStock={sortingInStock}
                        setSortingInStock={setSortingInStock}
                        keyWord={keyWord}
                        setKeyWord={setKeyWord}
                        alphabetSort={alphabetSort}
                        setAlphabetSort={setAlphabetSort}
                        sortingOrder={sortingOrder}
                        setSortingOrder={setSortingOrder}
                        currentRate={currentRate} setCatalogItems={setCatalogItems}
                        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                        sorting={sorting} categories={categories} price={price} setPrice={setPrice} handlerSorting={handlerSorting}
                        selectedManufacturers={selectedManufacturers} selectedYears={selectedYears}
                        setSelectedManufacturers={setSelectedManufacturers} setSelectedYears={setSelectedYears}
                      />
                  </div>
                  <div className={`${DEFAULT_CLASSNAME}_content-main`}>
                      <div className={`${DEFAULT_CLASSNAME}_content_filter`}>
                          <img src={itemsFilter} alt={'items_filter'} />
                          {!!selectedManufacturers.length && selectedManufacturers.map(item => <div onClick={() => deleteManufacturer(item)} className={`${DEFAULT_CLASSNAME}_filter-label`}>{item} <span>x</span></div>)}
                      </div>
                      {!catalogFilterOpened && <ServiceItems setSelectedCategory={setSelectedCategory} compareItems={compareItems} addItemToCompare={addItemToCompare} favoriteItems={favoriteItems} favoriteNotify={favoriteNotify}
                                    setCartItems={setCartItems} setFavoriteItems={setFavoriteItems}
                                    items={catalogItems}
                      />}
                      <div className={`${DEFAULT_CLASSNAME}_pagination`}>
                          {pages && <div className={`${DEFAULT_CLASSNAME}_pagination_block`}>
                            {Array.from(Array(maxPage)).map((item, index) => <div onClick={() => {
                              setCurrentPage(index + 1);
                              setPages(false);
                            }}>{index + 1}</div>)}
                          </div>}
                          <img style={{ display: pages && "none" }}  onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)} src={left} alt={'left'} />
                          <div style={{ display: pages && "none" }}  className={`${DEFAULT_CLASSNAME}_btn pagination-btn`} onClick={() => setPages(true)}>{currentPage} <img src={left}/></div>
                          <img style={{ display: pages && "none" }}  onClick={() => setCurrentPage(currentPage === maxPage ? maxPage : currentPage + 1)} src={right} alt={'right'} />
                      </div>
                  </div>
              </div>
              {(!!metaText.length || !!metaTextCategory.length) && <div className={'catalog-additional-info'}>
                    <h2>{selectedSubcategory ? metaTitle : metaTextCategory}</h2>
                    <p>{selectedSubcategory ? metaText : metaTextCategory}</p>
                </div>}
            </>
        }
      </div>
    </div>
  )
}