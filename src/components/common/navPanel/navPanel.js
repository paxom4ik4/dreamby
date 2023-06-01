import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";

import './navPanel.scss';
import { objReplacer } from "../../catalog/catalog";

const DEFAULT_CLASSNAME = 'nav-panel';


const PathNames = {
  "services": 'Услуги',
  "about": "О нас",
  "billing": "Оплата",
  "catalog": "Каталог",
  "registration": "Регистрация",
  "favorite": "Избранные",
  "cart": "Корзина",
  "compare": "Сравнение товаров",
  "login": "Авторизация",
}

export const NavPanel = ({ subcategories, setSelectedSubcategory, selectedSubcategory, selectedCategory, setSelectedCategory, selectedDeviceName, selectedSubcategories, setSelectedSubcategories }) => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const pathItems = pathname.split('/').slice(1);

  const pathItemsToShow = pathItems.filter(item => !!item);

  const currentPath = ["Главная", ...pathItemsToShow.map(item => PathNames[item])].filter(Boolean);

  const showNavPanel = currentPath.length > 1;

  const [categoryInfo, setCategoryInfo] = useState(null);

  useEffect(() => {
    if (!selectedCategory) {
      setSelectedSubcategory(null)
      setSelectedSubcategories([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedCategory) {
      setCategoryInfo(null);
    }

    fetch(`${process.env["REACT_APP_API_URL"]}category/${selectedCategory}`)
      .then(res => res.json())
      .then(data => setCategoryInfo(data));
  }, [selectedCategory]);

  const subcategory = subcategories.find(item => item.id === selectedSubcategory);

  return (
    showNavPanel &&
      <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
        <div className={DEFAULT_CLASSNAME}>
          {currentPath.map((item, idx) => {
            return <div style={{ display: "flex", alignItems: "center" }} onClick={() => {

              if (idx === 0 ) navigate("/");

              if (item === "Каталог") {
                navigate("/catalog");
                setSelectedCategory(null);
                setSelectedSubcategory(null);
                setSelectedSubcategories([]);
              }

            }} className={`${DEFAULT_CLASSNAME}_item`}>
                {idx !== 0 && <div style={{ marginRight: "8px", marginLeft: "8px"}} className={`${DEFAULT_CLASSNAME}_item-circle`} />}
                {item}
            </div>
          })}

          {currentPath[1] === "Каталог" && categoryInfo?.id && <div style={{  display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => {
            setSelectedCategory(categoryInfo.id);
            setSelectedSubcategory(null);
            navigate(`/catalog/${objReplacer[categoryInfo?.categoryName]}`);
          }}><div style={{ marginRight: "8px", marginLeft: "8px", paddingLeft: "6px"}} className={`${DEFAULT_CLASSNAME}_item-circle`} />{categoryInfo.categoryName}</div>}

          {currentPath[1] === "Каталог" && subcategory && <div style={{  display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => {
              navigate(`/catalog/${objReplacer[categoryInfo?.categoryName]}/${subcategory.link_name}`);
              setSelectedSubcategory(subcategory.id);
          }}><div style={{ marginRight: "8px", marginLeft: "8px", paddingLeft: "6px"}} className={`${DEFAULT_CLASSNAME}_item-circle`} />{subcategory?.name}</div>}

          {selectedDeviceName && <div style={{ display: "flex", alignItems: "center", cursor: "pointer", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}><div style={{ marginRight: "8px", marginLeft: "8px", paddingLeft: "6px"}} className={`${DEFAULT_CLASSNAME}_item-circle`} /> {selectedDeviceName}</div>}
        </div>
      </div>
    )
}