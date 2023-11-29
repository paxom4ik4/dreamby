import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './navPanel.scss';
import { objReplacer } from '../../catalog/catalog';

const DEFAULT_CLASSNAME = 'nav-panel';

const PathNames = {
  services: 'Услуги',
  about: 'О нас',
  billing: 'Оплата',
  catalog: 'Каталог',
  registration: 'Регистрация',
  favorite: 'Избранные',
  cart: 'Корзина',
  compare: 'Сравнение товаров',
  login: 'Авторизация',
};

export const NavPanel = ({
  setSelectedDeviceName,
  subcategories,
  setSelectedSubcategory,
  selectedSubcategory,
  selectedCategory,
  setSelectedCategory,
  selectedDeviceName,
  setSelectedSubcategories,
}) => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const pathItems = pathname.split('/').slice(1);

  const pathItemsToShow = pathItems.filter((item) => !!item);

  const currentPath = ['Главная', ...pathItemsToShow.map((item) => PathNames[item])].filter(
    Boolean,
  );

  const showNavPanel = currentPath.length > 1;

  const [categoryInfo, setCategoryInfo] = useState(null);

  useEffect(() => {
    if (!selectedCategory) {
      setSelectedSubcategory(null);
      setSelectedSubcategories([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedCategory) {
      setCategoryInfo(null);
    }

    fetch(`${process.env['REACT_APP_API_URL']}category/${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => setCategoryInfo(data));
  }, [selectedCategory]);

  const subcategory = subcategories.find((item) => item.id === selectedSubcategory);

  return (
    showNavPanel && (
      <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
        <div className={DEFAULT_CLASSNAME} itemScope itemType="https://schema.org/BreadcrumbList">
          {currentPath.map((item, idx) => {
            return (
              <div
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                style={{ display: 'flex', alignItems: 'center' }}
                // onClick={() => {
                //   if (idx === 0) navigate('/');
                //
                //   if (item === 'Каталог') {
                //     setSelectedCategory(null);
                //     setSelectedSubcategory(null);
                //     setSelectedSubcategories([]);
                //     setSelectedDeviceName(null);
                //     navigate('/catalog');
                //   }
                // }}
                className={`${DEFAULT_CLASSNAME}_item`}>
                <div style={{ display: 'none' }} itemProp="item">
                  <div itemProp="name">{item}</div>
                  <meta itemProp="position" content={`${idx + 1}`} />
                </div>
                {idx !== 0 && (
                  <div
                    style={{ marginRight: '8px', marginLeft: '8px' }}
                    className={`${DEFAULT_CLASSNAME}_item-circle`}
                  />
                )}
                {item}
              </div>
            );
          })}

          {currentPath[1] === 'Каталог' && categoryInfo?.id && (
            <div
              itemScope
              itemType="https://schema.org/ListItem"
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              // onClick={() => {
              //   setSelectedCategory(categoryInfo.id);
              //   setSelectedDeviceName(null);
              //   setSelectedSubcategory(null);
              //   navigate(
              //     `/catalog/${objReplacer[categoryInfo?.categoryName ?? 'Телефоны и планшеты']}`,
              //   );
              // }}
            >
              <div
                style={{ marginRight: '8px', marginLeft: '8px', paddingLeft: '6px' }}
                className={`${DEFAULT_CLASSNAME}_item-circle`}
              />
              <div style={{ display: 'none' }} itemProp="item">
                <div itemProp="name">{categoryInfo.categoryName}</div>
                <meta itemProp="position" content={`3`} />
              </div>
              {categoryInfo.categoryName}
            </div>
          )}

          {currentPath[1] === 'Каталог' && subcategory && (
            <div
              itemScope
              itemType="https://schema.org/ListItem"
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => {
                setSelectedDeviceName(null);
                setSelectedSubcategory(subcategory.id);
                navigate(
                  `/catalog/${objReplacer[categoryInfo?.categoryName ?? 'Телефоны и планшеты']}/${
                    subcategory?.link_name ?? ''
                  }`,
                );
              }}>
              <div
                style={{ marginRight: '8px', marginLeft: '8px', paddingLeft: '6px' }}
                className={`${DEFAULT_CLASSNAME}_item-circle`}
              />
              <div style={{ display: 'none' }} itemProp="item">
                <div itemProp="name">{subcategory?.name}</div>
                <meta itemProp="position" content={`4`} />
              </div>
              {subcategory?.name}
            </div>
          )}

          {categoryInfo && subcategory && selectedDeviceName && (
            <div
              itemScope
              itemType="https://schema.org/ListItem"
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}>
              <div
                style={{ marginRight: '8px', marginLeft: '8px', paddingLeft: '6px' }}
                className={`${DEFAULT_CLASSNAME}_item-circle`}
              />
              <div style={{ display: 'none' }} itemProp="item">
                <div itemProp="name">{selectedDeviceName}</div>
                <meta itemProp="position" content={`5`} />
              </div>
              {selectedDeviceName}
            </div>
          )}
        </div>
      </div>
    )
  );
};
