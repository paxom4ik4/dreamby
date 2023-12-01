import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import './header.scss';
import { objReplacer } from '../../catalog/catalog';

import searchIcon from './icons/search.svg';
import favoriteIcon from './icons/favorite.svg';
import profileIcon from './icons/profile.svg';
import compareIcon from './icons/compare.svg';
import menu from './icons/menu.svg';
import catalog from './icons/catalog.svg';

import logo from './logo-dream-new.svg';
import logoSpin from '../../../Logo_Screensaver.gif';
import { Loader } from '../loader/loader';

const DEFAULT_CLASSNAME = 'header';

const NAV_ITEMS = [
  // { title: 'Каталог', link: '/catalog' },
  { title: 'Услуги', link: 'services' },
  { title: 'Оплата', link: 'billing' },
  { title: 'О нас', link: 'about' },
];

export const Header = ({
  setSelectedCategory,
  setIsCatalogOpened,
  isCatalogOpened,
  setIsMobileMenuOpened,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchOpened, setSearchOpened] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const navigate = useNavigate();

  const inputHandler = (e) => setSearchText(e.currentTarget.value);

  useEffect(() => {
    setIsSearchDataLoading(true);
    if (searchText.length) {
      fetch(`${process.env.REACT_APP_API_URL}product/search?name=${searchText}`, {
        method: 'POST',
        mode: 'cors',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.statusCode === 500) {
            setSearchData([]);
          } else {
            setSearchData(data.products);
          }
        })
        .finally(() => setIsSearchDataLoading(false));
    } else {
      setSearchData([]);
    }
  }, [searchText]);

  const handleNavToItem = (event, link, category, itemSubcategory) => {
    event.preventDefault();

    const itemCategory = objReplacer[category];

    if (link.includes('catalog')) {
      window.location = `${window.location.origin}/${link}`;
    } else {
      navigate(`catalog/${itemCategory}/${itemSubcategory}/${link}`);
    }
    setSearchText('');
  };

  useEffect(() => {
    if (searchText.trim() === '' && searchData.length) setSearchData([]);
  }, [searchText, searchData]);

  useEffect(() => {
    setSearchOpened(false);
  }, [navigate]);

  const clickOnCatalog = (item) => {
    if (item.link === '/catalog') {
      setSelectedCategory(null);
    }
  };

  const searchRef = useRef();

  const showHeader = window.location.pathname.includes('/admin');

  const [isSearchDataLoading, setIsSearchDataLoading] = useState(true);

  return (
    !showHeader && (
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
          <div className={`${DEFAULT_CLASSNAME}_wrapper_logo`} onClick={() => navigate('/')}>
            <img
              loading={'lazy'}
              className={`${DEFAULT_CLASSNAME}_wrapper_logo_spin`}
              src={logoSpin}
              alt={'header-logo-spin'}
            />
            <img
              loading={'lazy'}
              className={`${DEFAULT_CLASSNAME}_wrapper_logo_logo`}
              src={logo}
              alt={'header-logo'}
            />
          </div>
          <div className={`${DEFAULT_CLASSNAME}_wrapper_navigation`}>
            <nav className={`${'menu'} ${searchOpened && 'menu-hidden'}`}>
              <span
                onClick={() => setIsCatalogOpened(!isCatalogOpened)}
                className={`${DEFAULT_CLASSNAME}_wrapper_navigation_item`}>
                Каталог
              </span>
              {NAV_ITEMS.map((item, id) => (
                <NavLink
                  onClick={() => clickOnCatalog(item)}
                  to={item.link}
                  key={id.toString()}
                  className={`${DEFAULT_CLASSNAME}_wrapper_navigation_item`}
                  activeClassName="selected">
                  {item.title}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_wrapper_control-panel`}>
            <input
              autoFocus={true}
              className={`${'search-input'} ${!searchOpened && 'search-input-hidden'}`}
              onBlur={() => setTimeout(() => setSearchFocused(false), 100)}
              onFocus={() => setSearchFocused(true)}
              value={searchText}
              onInput={inputHandler}
              type={'text'}
              placeholder={'Поиск'}
            />
            <img
              loading={'lazy'}
              onClick={() => setSearchOpened(!searchOpened)}
              src={searchIcon}
              alt={'search'}
              className={`${DEFAULT_CLASSNAME}_wrapper_control-panel_search`}
            />

            <div
              className={`${DEFAULT_CLASSNAME}_tablet_catalog`}
              onClick={() => {
                isCatalogOpened ? setIsCatalogOpened(false) : setIsCatalogOpened(true);
              }}>
              <img
                className={`${DEFAULT_CLASSNAME}_tablet_catalog_image`}
                src={catalog}
                alt={'header-catalog'}
              />
              <div className={`${DEFAULT_CLASSNAME}_tablet_catalog_title`}>{'Каталог'}</div>
            </div>

            <img
              loading={'lazy'}
              className={`tablet-hide`}
              onClick={() => navigate('/favorite')}
              src={favoriteIcon}
              alt={'favorite'}
            />
            {/*<img onClick={() => navigate('/cart')} src={cartIcon} alt={'cart'} />*/}
            <img
              loading={'lazy'}
              onClick={() => navigate('/profile')}
              src={profileIcon}
              alt={'profile'}
            />
            <img
              loading={'lazy'}
              className={`tablet-hide`}
              onClick={() => navigate('/compare')}
              src={compareIcon}
              alt={'compare'}
            />
            <img
              loading={'lazy'}
              className={'tablet-show'}
              onClick={() => setIsMobileMenuOpened(true)}
              src={menu}
              alt={'menu'}
            />
          </div>
        </div>
        {searchOpened && (
          <div ref={searchRef}>
            {searchText.length >= 1 && searchOpened && (
              <div className={`${DEFAULT_CLASSNAME}_searched-items`}>
                {isSearchDataLoading && <Loader />}

                {!searchData.length && !isSearchDataLoading && (
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '500',
                      lineHeight: '70vh',
                    }}>
                    {'Товаров не найдено'}
                  </div>
                )}

                {!isSearchDataLoading &&
                  searchData?.map((item) => {
                    const itemCategory = item?.category?.categoryName;
                    const itemLink = item?.link || item?.id;
                    const itemSubcategory = item?.subcategory?.link_name;

                    return (
                      <div
                        className={`${DEFAULT_CLASSNAME}_searched-items_item`}
                        onClick={(event) =>
                          handleNavToItem(event, itemLink, itemCategory, itemSubcategory)
                        }>
                        <img
                          loading={'lazy'}
                          alt={'product-photo'}
                          src={
                            item?.img_path?.includes('http')
                              ? item?.img_path
                              : `http://194.62.19.52:7000/${item?.img_path}`
                          }
                        />
                        <div className={`${DEFAULT_CLASSNAME}_searched-items_item_content`}>
                          <div className={`${DEFAULT_CLASSNAME}_searched-items_item_text`}>
                            {item.name}
                          </div>
                          <div className={`${DEFAULT_CLASSNAME}_searched-items_item_footer`}>
                            <span className={`${DEFAULT_CLASSNAME}_searched-items_item_price`}>
                              {item.price === 0 || item.price === '0'
                                ? 'Уточните стоимость'
                                : item.price}{' '}
                              {item.price !== 0 && item.price !== '0' && 'BYN'}
                            </span>
                            <span className={`${DEFAULT_CLASSNAME}_searched-items_item_about`}>
                              Перейти
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
};
