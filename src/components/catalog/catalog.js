import React, {useEffect, useState} from 'react';

import './index.scss';
import { ServiceItems } from "../services/service_items/service_items";
import { ServicesFilter } from "../services";

import filter from './filter.svg';
import backArrow from './backArrow.svg';

import down from './subsubCategory.svg';
import up from './subsubCategory2.svg';

import left from './left.svg';
import right from './right.svg';
import { cardSize, CategoryCard } from "../common/category_card/category_card";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";

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

const MOBILE_PHONES_NAME = "Смартфоны Apple";

const Catalog = React.memo(({ setSelectedDeviceName, selectedSubcategory, allSubcategories, setSelectedSubcategory, catalogFilterOpened, setCatalogFilterOpened, compareItems, selectedSubcategories, addItemToCompare, selectedCategory, setSelectedCategory, categories, setCartItems }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (location.pathname.endsWith('/null')) {
          navigate(location.pathname.replace('/null', ''));
      }

      setSelectedDeviceName(null);
    }, [location]);

    const [catalogTitle, setCatalogTitle] = useState("Каталог");
    const [catalogMetaTitle, setCatalogMetaTitle] = useState("Каталог");
    const [catalogDescription, setCatalogDescription] = useState("Каталог товаров");

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

    const [isDataLoading, setIsDataLoading] = useState(true);

    //subsub
    const [selectedCatalogSubcategory, setSelectedCatalogSubcategory] = useState(null);

    const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);

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
            const targetCategory = allSubcategories?.find(item => item.link_name === subcategory);

            if (targetCategory?.parentId?.length) {
                setSelectedSubcategory(targetCategory.parentId);
                setSelectedSubSubCategory(targetCategory);
            } else {
                setSelectedSubcategory(targetCategory.id);
                setSelectedSubSubCategory(null);
            }
        }

        if (categories.length && category) {
          setSelectedCategory(categories.find(item => item.categoryName === objReplacer2[category]).id);
        }
    }, [currentPage, allSubcategories, selectedCategory, category, subcategory, categories, setSelectedSubSubCategory]);

    useEffect(() => {
      window.scrollTo({
          top: 80,
          behavior: "smooth",
      })
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedSubcategories]);

    useEffect(() => {
        setCurrentPage(1);

        if (!selectedCategory) {
            setSelectedManufacturers([]);
        }

        if(selectedCategory) {
            fetch(`${process.env["REACT_APP_API_URL"]}category/${selectedCategory}`)
                .then(res => res.json())
                .then(data => {
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
    }, [selectedCategory, selectedSubSubCategory]);

    useEffect(() => {
      if (!selectedCategory || !selectedSubcategory) {
          return;
      }

      setIsDataLoading(true);

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
                  subcategory: selectedSubSubCategory?.id || selectedSubcategory,
              })
          })
              .then(res => res.json())
              .then(data => {
                  setCatalogItems(data.products)
                  setMaxPage(data.max_page);
                  setIsDataLoading(false);
              });
      } else {
          fetch(urlToFetch)
              .then(res => res.json())
              .then(data => {
                  setCatalogItems(data.products)
                  setMaxPage(data.max_page);
                  setIsDataLoading(false);
              });
      }
    }, [category, currentPage, selectedCategory, price, selectedManufacturers, selectedSubcategory, sortingOrder, sortingInStock, alphabetSort, keyWord, selectedMemory, selectedColor, selectedSubSubCategory])

    const selectedSubcategoryItem = allSubcategories.find(item => item.id === selectedSubcategory);

    useEffect(() => {
        if (selectedSubcategory) {
            fetch(`${process.env["REACT_APP_API_URL"]}subcategory/${selectedSubcategory}`).then(res => res.json()).then(data => setSelectedCatalogSubcategory(data))
        }
    }, [selectedSubcategory]);

    useEffect(() => {
        if (!selectedSubcategory && !selectedCategory) {
            setCatalogTitle("Каталог товаров DreamStore.by - Все для вашего комфорта и развлечения");
            setCatalogDescription("В каталоге DreamStore.by представлены товары различных категорий: от телефонов и планшетов до аксессуаров для дома и автомобиля. Выбирайте и покупайте качественные товары по доступным ценам с доставкой по Минску")
            setCatalogMetaTitle("Каталог товаров DreamStore.by - Все для вашего комфорта и развлечения")
        } else if (selectedSubSubCategory) {
            const { name, meta_keyword, meta_description } = selectedSubSubCategory;

            setCatalogTitle(name);
            setCatalogMetaTitle(meta_keyword ?? name)
            setCatalogDescription(meta_description);
        }
            else if (selectedCategory && selectedSubcategory && allSubcategories && subcategory) {
            const { meta_description, meta_keyword, name } = allSubcategories.find(item => item.link_name === subcategory);

            setCatalogTitle(name);
            setCatalogMetaTitle(meta_keyword ?? name)
            setCatalogDescription(meta_description);
        } else if (selectedCategory && category) {
            const { meta_description, meta_keyword, categoryName } = categories?.find(item => item.id === selectedCategory);

            setCatalogDescription(meta_description);

            setCatalogTitle(categoryName);
            setCatalogMetaTitle(meta_keyword ?? categoryName)
        }
    }, [selectedSubcategory, selectedCategory, allSubcategories, subcategory, category, selectedSubSubCategory]);

    const [subSubcategories, setSubSubcategories] = useState([]);

    useEffect(() => {
        if (selectedCatalogSubcategory) {

            setSubSubcategories((selectedCatalogSubcategory.name === MOBILE_PHONES_NAME ? selectedCatalogSubcategory?.subcats.reverse() : selectedCatalogSubcategory?.subcats) || []);
        }
    }, [selectedCatalogSubcategory]);

    const metaText = (selectedSubSubCategory ? selectedSubSubCategory.meta_text : selectedSubcategoryItem?.meta_text) || "";
    const metaTitle = (selectedSubSubCategory ? selectedSubSubCategory.meta_title : selectedSubcategoryItem?.meta_title) || "";

    const metaTextCategory = categories.find(item => item.id === selectedCategory)?.meta_text || "";
    const metaTitleCategory = categories.find(item => item.id === selectedCategory)?.meta_h1 || "";

    const linkArrow = <FontAwesomeIcon icon={faCircleArrowLeft} />;

  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper`}>

    <Helmet>
        <title>{catalogMetaTitle}</title>
        <meta name="description" content={catalogDescription} />
        <link rel="canonical" href={`https://dreamstore.by${location.pathname}`}/>
    </Helmet>

        <div style={{ display: 'none'}} itemScope itemType="https://schema.org/Store">
            <h1 itemProp="name">DreamStore</h1>
            <div itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
                <span itemScope itemProp="streetAddress">г. Минск, пр-т Победителей, 84, магазин «Dream Store» </span>
                <span itemScope itemProp="addressLocality">Минск</span>
                <span itemScope itemProp="postalCode">220020</span>
            </div>
            Телефон: <span itemProp="telephone">+375 29 155 30 20</span>
            <a href="https://dreamstore.by" itemScope itemProp="url">Сайт Компании</a>
            <div itemScope itemProp="description">Интернет Магазин Электронной Техники</div>
            <img itemProp="image" itemScope src="data:image/png;base64,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" alt={'dreamStore.by'}/>
            <span itemProp="priceRange">$$</span>
        </div>

      <div className={DEFAULT_CLASSNAME}>
        {(!selectedSubcategory && !selectedCategory) && <h1 className={`${DEFAULT_CLASSNAME}_page_title`}>{"Каталог"}</h1>}

        {!selectedCategory && <div className={`${DEFAULT_CLASSNAME}_select`}>
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
            }}>
                {linkArrow}
                <span>Вернуться к категориям </span>
              </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_selectSubcategory__items`}>
            <div className={`${DEFAULT_CLASSNAME}_selectSubcategory_category`}>
              <h1 style={{ fontSize: "20px", fontWeight: "400" }}>{categories.find(item => item.id === selectedCategory)["categoryName"]}</h1>
              <img src={categories.find(item => item.id === selectedCategory)["img_path"]} alt={'CategoryItem'}/>
            </div>
            {!!subcategories.length && subcategories.map(item => <div onClick={() => {
              navigate(`${window.location.pathname}/${item.link_name}`)
              setSelectedSubcategory(item.id)
            }} className={`${DEFAULT_CLASSNAME}_selectSubcategory_item`}>
              <div>{item.name}</div>
              <img src={item.img_path} alt={'subcategory-kartinka'} />
            </div>)}
          </div>

            {(!!metaTextCategory.length) && <div className={'catalog-additional-info'}>
                <h2>{metaTitleCategory}</h2>
                <p>{metaTextCategory}</p>
            </div>}
        </div>}


        {selectedCategory && selectedSubcategory &&
            <>
              <div className={`${DEFAULT_CLASSNAME}_title`}>
                <img onClick={() => {
                    navigate(window.location.pathname.split('/').slice(0, -1).join('/'))
                    setSelectedSubSubCategory(null);
                }} src={filter} alt={'filter'} />
                <h1>{catalogTitle}</h1>
              </div>
              <div className={`${DEFAULT_CLASSNAME}_content`}>
                  <div className={`${DEFAULT_CLASSNAME}_content_filterWrapper`}>
                      <ServicesFilter
                        selectedSubcategory={selectedSubcategory}
                        selectedSubSubcategory={selectedSubSubCategory}
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
                      {!isDataLoading && !!subSubcategories?.length && <div className={`${DEFAULT_CLASSNAME}_content-main_subsubcategories_wrapper`}>
                          <div className={`${DEFAULT_CLASSNAME}_content-main_subsubcategories`}>
                              {subSubcategories?.map(item => <div className={`${DEFAULT_CLASSNAME}_content-main_subsubcategories_item ${selectedSubSubCategory?.id === item.id && 'active-subSubCategory'}`}>
                                  <div className={`${DEFAULT_CLASSNAME}_content-main_subsubcategories_item_image_wrapper`}>
                                  <div onClick={() => {
                                      setSelectedSubSubCategory(selectedSubSubCategory === item ? null : item);

                                      const locationArr = location.pathname.split('/');

                                      if (selectedSubSubCategory?.id === item.id) {
                                          locationArr[locationArr.length - 1] = allSubcategories.find(item => item.id === selectedSubSubCategory.parentId)["link_name"];
                                      } else {
                                          locationArr[locationArr.length - 1] = item.link_name;
                                      }

                                      const link = locationArr.join('/');
                                      navigate(link);

                                  }} className={`${DEFAULT_CLASSNAME}_content-main_subsubcategories_item_image`}>
                                        <img src={item.img_path} alt={item.link_name}/>
                                    </div>
                                  </div>
                                  <div className={`${DEFAULT_CLASSNAME}_content-main_subsubcategories_item_text`}>{item.name}</div>
                              </div>)}
                          </div>
                      </div>}
                      {isDataLoading && <div>Loading...</div>}
                      {!catalogFilterOpened && !isDataLoading && <ServiceItems compareItems={compareItems} addItemToCompare={addItemToCompare} setCartItems={setCartItems} items={catalogItems} />}
                      {!isDataLoading && <div className={`${DEFAULT_CLASSNAME}_pagination`}>
                          {pages && <div className={`${DEFAULT_CLASSNAME}_pagination_block`}>
                              {Array.from(Array(maxPage)).map((item, index) => <div onClick={() => {
                                  setCurrentPage(index + 1);
                                  setPages(false);
                              }}>{index + 1}</div>)}
                          </div>}
                          <img style={{ display: pages && "none" }}  onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)} src={left} alt={'left'} />
                          <div style={{ display: pages && "none" }}  className={`${DEFAULT_CLASSNAME}_btn pagination-btn`} onClick={() => setPages(true)}>{currentPage} <img src={left}/></div>
                          <img style={{ display: pages && "none" }}  onClick={() => setCurrentPage(currentPage === maxPage ? maxPage : currentPage + 1)} src={right} alt={'right'} />
                      </div>}
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
});

export default Catalog;
