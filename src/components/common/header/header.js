import React, {useEffect, useState} from 'react';
import { slide as Menu } from 'react-burger-menu';
import { NavLink, useNavigate } from "react-router-dom";
import cabinet from './cabinet.svg';
import cartIcon from './cart.svg';

import './header.scss';
import header_logo from '../../../assets/logo.png';
import search_icon from '../../../assets/header/search_icon.png';
import {HeaderMenu} from "./header_menu/header_menu";
import {objReplacer} from "../../catalog/catalog";

const DEFAULT_CLASSNAME = 'header';

const NAV_ITEMS = [
  {title: 'Каталог', link: '/catalog'},
  {title: 'Услуги', link: 'services'},
  {title: 'О нас', link: 'about'},
  {title: 'Оплата', link: 'billing'},
];

const MobileMenu = () => {
  const [isOpen, setOpen] = useState(false)

  const handleIsOpen = () => {
    setOpen(!isOpen)
  }

  const closeSideBar = () => {
    setOpen(false)
  }

  return (
    <div className={`${DEFAULT_CLASSNAME}_mobile_menu`}>
      <Menu
        isOpen={isOpen}
        onOpen={handleIsOpen}
        onClose={handleIsOpen}
      >
        {NAV_ITEMS.map((item, id) =>
          <NavLink onClick={closeSideBar} to={item.link} key={id.toString()} className={`${DEFAULT_CLASSNAME}_wrapper_navigation_item`} activeClassName="selected">
            <span>{item.title}</span>
          </NavLink>)}
      </Menu>
    </div>
  )
};

export const Header = ({ setSelectedCategory, isLoggedIn, setLoginData }) => {
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  const cartItemsLength = cartItems ? cartItems.length : 0;

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);

  const navigate = useNavigate();

  const inputHandler = (e) => setSearchText(e.currentTarget.value);

  useEffect(() => {
    if(searchText.length) {
      fetch(`${process.env.REACT_APP_API_URL}product/search?name=${searchText}`, {
        method: "POST",
        mode: 'cors',
      }).then(res => res.json()).then(data => {
        if (data.statusCode === 500) {
          setSearchData([]);
        } else {
          setSearchData(data.products)
        }
      });
    } else {
      setSearchData([]);
    }  }, [searchText])

  const handleNavToItem = (event, link, category, itemSubcategory) => {
    event.preventDefault();

    const itemCategory = objReplacer[category];

    if (link.includes('catalog')) {
      window.location = `${window.location.origin}/${link}`;
    } else {
      navigate(`catalog/${itemCategory}/${itemSubcategory}/${link}`);
    }
    setSearchText('');
  }

  useEffect(() => {
    if (searchText.trim() === "" && searchData.length) setSearchData([]);
  }, [searchText, searchData]);

  const clickOnCatalog = (item) => {
    if (item.link === "/catalog") {
      setSelectedCategory(null)
    }
  }

  const showHeader = window.location.pathname.includes('/admin');

  return (
      !showHeader && <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
          <div className={`${DEFAULT_CLASSNAME}_wrapper_logo`} onClick={() => navigate('/')}>
            <img src={header_logo} alt={'header-logo'}/>
            <span>{'dreamstore'}</span>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_wrapper_navigation`}>
            <MobileMenu />
            <nav className={`menu`}>
              {NAV_ITEMS.map((item, id) =>
                  <NavLink onClick={() => clickOnCatalog(item)} to={item.link} key={id.toString()} className={`${DEFAULT_CLASSNAME}_wrapper_navigation_item`}
                           activeClassName="selected">{item.title}</NavLink>)}
            </nav>
          </div>
          {
              !!searchData && searchText.length >= 1 && searchFocused && <div className={`${DEFAULT_CLASSNAME}_searched-items`}>

                {!searchData.length && <div style={{ textAlign: "center", fontSize: "14px", fontWeight: "500", lineHeight: "70vh"}}>{"Товаров не найдено"}</div>}

                {searchData?.map(item => {
                  const itemCategory = item?.category?.categoryName;
                  const itemLink = item?.link || item?.id;
                  const itemSubcategory = item?.subcategory?.link_name;

                  return (
                      <div className={`${DEFAULT_CLASSNAME}_searched-items_item`} onClick={(event) => handleNavToItem(event, itemLink, itemCategory, itemSubcategory)}>
                        <div className={`${DEFAULT_CLASSNAME}_searched-items_item_img`} style={{ width: "10%" }}>
                          <img src={item?.img_path?.includes('http') ? item?.img_path : `http://194.62.19.52:7000/${item?.img_path}`}/>
                        </div>
                        <div className={`${DEFAULT_CLASSNAME}_searched-items_item_text`}>{item.name}</div>
                        <span className={`${DEFAULT_CLASSNAME}_searched-items_item_about`}>Подробнее</span>
                      </div>
                  )
                })}
              </div>
          }
          <div className={`${DEFAULT_CLASSNAME}_wrapper_control-panel`}>
            <div className={`${DEFAULT_CLASSNAME}_wrapper_control-panel_search`}>
              <input onBlur={() => setTimeout(() => setSearchFocused(false), 100)} onFocus={() => setSearchFocused(true)} value={searchText} onInput={inputHandler} type={"text"} placeholder={"Поиск"}/>
              <img className={`${DEFAULT_CLASSNAME}_wrapper_control-panel_search_icon`} src={search_icon}
                   alt={'search-icon'}/>
            </div>
            {/*<div className={`${DEFAULT_CLASSNAME}_wrapper_control-panel_cart`} onClick={() => navigate('/cart')}>*/}
            {/*  <img src={cartIcon} alt={'cart-icon'} />*/}
            {/*  {cartItemsLength > 0 && <div className={`${DEFAULT_CLASSNAME}_cart-in`}>{cartItemsLength}</div>}*/}
            {/*</div>*/}
            <div className={`${DEFAULT_CLASSNAME}_phone--text`}>
              <a href={"tel:375291553020"}>{'+375 (29) 155-30-20'}</a>
              <a href={"tel:375297555562"}>{'+375 (29) 755-55-62'}</a>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_wrapper_control-panel_profile`} onClick={() => setIsMenuOpen(true)}>
              <img src={cabinet} alt={'profile-icon'} />
              {isLoggedIn && <div className={`${DEFAULT_CLASSNAME}_logged-in`} />}
            </div>
          </div>
          {isMenuOpen && <HeaderMenu setIsMenuOpen={setIsMenuOpen} isLoggedIn={isLoggedIn} setLoginData={setLoginData}/>}
        </div>
        <div className={`${DEFAULT_CLASSNAME}_phone`}>
          <a href={"tel:375291553020"}>{'+375 (29) 155-30-20'}</a>
          <a href={"tel:375297555562"}>{'+375 (29) 755-55-62'}</a>
        </div>
      </div>
  )
}
