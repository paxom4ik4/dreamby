import React, { useEffect, useState } from 'react';

import './footer_menu.scss';
import { useLocation, useNavigate } from 'react-router-dom';

import main from './icons/main.svg';
import search from './icons/search.svg';
import menu from './icons/menu.svg';
import account from './icons/account.svg';
import cart from './icons/cart.svg';
import closeSearch from './icons/close-search.svg';
import search_small from './icons/search-small.svg';
import spin from '../../../Logo_Screensaver.gif';

import phone from './icons/phone.svg';

import { Loader } from '../loader/loader';
import { objReplacer } from '../../catalog/catalog';
import { useSwipeable } from 'react-swipeable';

const DEFAULT_CLASSNAME = 'footer-menu';

const FOOTER_MENU_ITEMS = [
  {
    title: 'Главная',
    link: '/',
    image: spin,
  },
  {
    title: 'Поиск',
    link: '',
    image: search,
  },
  {
    title: 'Меню',
    link: '',
    image: menu,
  },
  {
    title: 'Аккаунт',
    link: '/profile',
    image: account,
  },
  {
    title: 'Связаться',
    link: '',
    image: phone,
  },
];

export const FooterMenu = ({ setIsMobileMenuOpened }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchOpened, setIsSearchOpened] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [isSearchDataLoading, setIsSearchDataLoading] = useState(false);

  const [searchData, setSearchData] = useState(null);

  const handleNavToItem = (event, link, category, itemSubcategory) => {
    event.preventDefault();

    const itemCategory = objReplacer[category];

    if (link.includes('catalog')) {
      window.location = `${window.location.origin}/${link}`;
    } else {
      navigate(`catalog/${itemCategory}/${itemSubcategory}/${link}`);
    }

    setIsSearchOpened(false);
    setSearchText('');
  };

  useEffect(() => {
    if (!!searchText.length) {
      setIsSearchDataLoading(true);
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

  const [swipeStared, setSwipeStarted] = useState(false);

  const handleSwipe = (e) => {
    if (e.dir === 'Down') {
      setIsSearchOpened(false);
      setSwipeStarted(false);
    }
  };

  const handlers = useSwipeable({
    onSwipeStart: () => setSwipeStarted(true),
    onSwiped: (e) => handleSwipe(e),
  });

  return (
    <>
      <div
        className={`${DEFAULT_CLASSNAME}_search ${!isSearchOpened && 'footer-menu-search-closed'}`}>
        <img
          className={`${swipeStared && 'search-close-zoomed'}`}
          {...handlers}
          onClick={() => setIsSearchOpened(false)}
          alt={'close-search'}
          src={closeSearch}
        />
        <div className={`${DEFAULT_CLASSNAME}_search_input`}>
          <input
            placeholder={'Поиск...'}
            value={searchText}
            onChange={(e) => setSearchText(e.currentTarget.value)}
            type={'text'}
          />
          <img src={search_small} alt={'search-i'} />
        </div>

        <div className={`${DEFAULT_CLASSNAME}_search_shadow`} />

        {isSearchDataLoading && <Loader />}

        {!isSearchDataLoading && searchText.length >= 1 && isSearchOpened && (
          <div className={`${DEFAULT_CLASSNAME}_searched-items`}>
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
                    <div>
                      <img
                        alt={'product-photo'}
                        src={
                          item?.img_path?.includes('http')
                            ? item?.img_path
                            : `http://194.62.19.52:7000/${item?.img_path}`
                        }
                      />
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_searched-items_item_content`}>
                      <div className={`${DEFAULT_CLASSNAME}_searched-items_item_text`}>
                        {item.name}
                      </div>
                      <div className={`${DEFAULT_CLASSNAME}_searched-items_item_footer`}>
                        <span className={`${DEFAULT_CLASSNAME}_searched-items_item_price`}>
                          {item.price === 0 ? 'Уточните' : item.price} {item.price !== 0 && 'BYN'}
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
      {!isSearchOpened && (
        <div className={DEFAULT_CLASSNAME}>
          {FOOTER_MENU_ITEMS.map(({ title, link, image }) => {
            if (title === 'Связаться') {
              return (
                <a
                  href={'tel:+375291553020,297555562'}
                  className={`${DEFAULT_CLASSNAME}_item ${
                    location.pathname === link && `${DEFAULT_CLASSNAME}_item_active`
                  }`}>
                  <div className={`${DEFAULT_CLASSNAME}_item_image`}>
                    <img src={image} alt={title} />
                  </div>
                  <span>{title}</span>
                </a>
              );
            }

            return (
              <div
                onClick={() => {
                  if (link.length) navigate(link);

                  if (title === 'Меню') {
                    setIsMobileMenuOpened(true);
                  }

                  if (title === 'Поиск') {
                    setIsSearchOpened(!isSearchOpened);
                  }

                  if (title === 'Связаться') {
                  }
                }}
                className={`${DEFAULT_CLASSNAME}_item ${
                  location.pathname === link && `${DEFAULT_CLASSNAME}_item_active`
                }`}>
                <div className={`${DEFAULT_CLASSNAME}_item_image`}>
                  <img src={image} alt={title} />
                </div>

                <span>{title}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
