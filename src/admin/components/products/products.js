import * as React from 'react';

import './products.scss'

import left from './left.svg';
import right from './right.svg';

import searchIcon from '../clients/search.png';
import {GoodCard} from "../goodCard/goodCard";
import addProduct from './addProduct.svg';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const DEFAULT_CLASSNAME = 'products';

export const Products = () => {
    const token = sessionStorage.getItem('admin-dream-token');

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [maxPage, setMaxPage] = useState(1);

    const [currentPage, setCurrentPage] = useState(1);

    const [searchName, setSearchName] = useState("");
    const [searchProducts, setSearchProducts] = useState([]);

    const [dataUpdated, setDataUpdated] = useState(0);

    const [currentRate, setCurrentRate] = useState(2.5);

    const [filteredUrl, setFilteredUrl] = useState(null);

    const userRole = sessionStorage.getItem('user-role');

    useEffect(() => {
        if (userRole !== "admin") {
            navigate('/admin/auth');
        }
    }, [userRole, navigate])

    useEffect(() => {
        fetch(`${process.env["REACT_APP_API_URL"]}currency`)
            .then(res => res.json()).then(data => setCurrentRate(data.rate));
    }, [])

    useEffect(() => {
        fetch(`${process.env["REACT_APP_API_URL"]}product`, {
            method: "GET",
            headers: {
                "Authorization": token,
            },
        })
            .then(res => res.json())
            .then(data => {
                setProducts(data.products)
                setMaxPage(data.max_page);
            })
    }, [dataUpdated])

    // useEffect(() => {
    //     fetch(`${process.env["REACT_APP_API_URL"]}product?p=${currentPage}`, {
    //         headers: {
    //             "Authorization": token,
    //         },
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             setProducts(data.products);
    //         })
    // }, [searchName, currentPage]);

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        fetch(`${process.env["REACT_APP_API_URL"]}category`, {
            headers: {
                "Authorization": token,
            },
        })
            .then(res => res.json())
            .then(data => setCategories(data));
    }, []);


    const [categoryToFilter, setCategoryToFilter] = useState("");
    const [subcategoryToFilter, setSubcategoryToFilter] = useState("");

    useEffect(() => {
        if (categoryToFilter) {
            fetch(`${process.env["REACT_APP_API_URL"]}category/${categoryToFilter}`)
                .then(res => res.json())
                .then(data => setSubCategories(data.subcats));
        }
    }, [categoryToFilter]);

    const [manufacturer, setManufacturer] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        (async () => {
            await filterProducts()
        })();
    }, [currentPage]);

    const productsToShow = products;

    const filterProducts = async () => {
        let url = `${process.env["REACT_APP_API_URL"]}product`;

        if (searchName) {
            url += url.includes('?') ? `&name=${searchName}` : `?name=${searchName}`;
        }

        if (!!categoryToFilter && categoryToFilter !== "Категория") {
            url += url.includes('?') ? `&category=${categoryToFilter}` : `?category=${categoryToFilter}`;
        }

        if (!!minPrice) {
            url += url.includes('?') ? `&min=${(minPrice / currentRate).toFixed(2)}`
                : `?min=${(minPrice / currentRate).toFixed(2)}`
        }

        if (!!maxPrice) {
            url += url.includes('?') ? `&max=${(maxPrice / currentRate).toFixed(2)}`
                : `?max=${(maxPrice / currentRate).toFixed(2)}`
        }

        if (!!subcategoryToFilter && subcategoryToFilter !== "Подкатегория") {
            url += url.includes('?') ? `&subcategory=${subcategoryToFilter}` : `?subcategory=${subcategoryToFilter}`;
        }

        if (manufacturer) {
            url += url.includes('?') ? `&producer=${manufacturer}` : `?producer=${manufacturer}`;
        }

        if (currentPage) {
            url += url.includes('?') ? `&p=${currentPage}` : `?p=${currentPage}`;
        }

        if (url !== `${process.env["REACT_APP_API_URL"]}product`) setFilteredUrl(url);

        await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
        })
            .then(res => res.json())
            .then(data => {
                setMaxPage(data.max_page);
                setProducts(data.products)
            });
    }

    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
            <div className={DEFAULT_CLASSNAME}>
                <div className={`${DEFAULT_CLASSNAME}_nav`}>
                    <div onClick={() => navigate('/admin/products')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Товары"}</div>
                    <div onClick={() => navigate('/admin/subcategories')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Подкатегории"}</div>
                    <div onClick={() => navigate('/admin/admin-services')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Услуги"}</div>
                    <div onClick={() => navigate('/admin/banners')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Банеры"}</div>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_search-bar`}>
                    <input value={searchName} onChange={(e) => setSearchName(e.currentTarget.value)} type={"text"} placeholder={"Введите требуемый товар"} />
                    <img src={searchIcon} alt={'search-icon'} />
                </div>
                <div className={`${DEFAULT_CLASSNAME}_content`}>
                    <div className={`${DEFAULT_CLASSNAME}_content_items`}>
                        <img onClick={() => navigate("/admin/add-product")} className={`${DEFAULT_CLASSNAME}_content_items_new`} src={addProduct} alt={'add-product'}/>
                        {productsToShow?.map(item => {
                            return (
                                <>
                                <GoodCard link={item.link} dataUpdated={dataUpdated} setDataUpdated={setDataUpdated} id={item.id} title={item.name} />
                                </>
                            )
                        })}
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_content_filter`}>
                        <div className={`${DEFAULT_CLASSNAME}_content_filter_title`}>
                            <span>{"Фильтр"}</span>
                            <span onClick={() => {
                                setMinPrice((prev) => "");
                                setMaxPrice((prev) => "");
                                setCategoryToFilter((prev) => "");
                                setManufacturer((prev) => "");
                                setFilteredUrl((prev) => null);
                                filterProducts();
                            }}>{"Сбросить"}</span>
                        </div>

                        {/*<input type={}/>*/}

                        <select style={{ marginTop: '32px'}} placeholder={"Категория"} onChange={(e) => setCategoryToFilter(e.currentTarget.value)}>
                            <option>{"Категория"}</option>
                            {categories?.map(item => (
                                <option selected={item.id === categoryToFilter} value={item.id}>{item.categoryName}</option>
                            ))}
                        </select>

                        <select style={{ marginTop: '32px'}} placeholder={"Под Категория"} onChange={(e) => setSubcategoryToFilter(e.currentTarget.value)}>
                            <option>{"Подкатегория"}</option>
                            {subCategories?.map(item => (
                                <option selected={item.id === subcategoryToFilter} value={item.id}>{item.name}</option>
                            ))}
                        </select>

                        <div className={`${DEFAULT_CLASSNAME}_content_filter_item`}>
                            <label>Цена</label>
                            <div className={`${DEFAULT_CLASSNAME}_price-filter`}>
                                <input placeholder={'Минимальная цена'} value={minPrice} onChange={(e) => setMinPrice(e.currentTarget.value)}/>
                                <input placeholder={'Максимальная цена'} value={maxPrice} onChange={(e) => setMaxPrice(e.currentTarget.value)}/>
                            </div>
                        </div>

                        <div className={`${DEFAULT_CLASSNAME}_content_filter_item`}>
                            <label>Производитель</label>
                            <input placeholder={"Производитель..."} value={manufacturer} onChange={(e) => setManufacturer(e.currentTarget.value)}/>
                        </div>

                        <div onClick={() =>{
                            setCurrentPage(1);
                            filterProducts()
                        }} className={`${DEFAULT_CLASSNAME}_content_filter_search`}>Отфильтровать</div>
                    </div>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_pagination`}> <img alt={'left-arrow'} src={left} className={`${DEFAULT_CLASSNAME}_nav_prev`} onClick={() => setCurrentPage(currentPage === 1 ? currentPage : currentPage - 1)} /> {"" + currentPage} / {maxPage} <img alt={'right-arrow'} src={right} onClick={() => setCurrentPage(currentPage === maxPage ? currentPage : currentPage + 1)} className={`${DEFAULT_CLASSNAME}_nav_next`} /></div>
            </div>
        </div>
    )
}
