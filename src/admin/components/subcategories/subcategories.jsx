import * as React from 'react';
import {useEffect, useState} from "react";

import close from '../goodCard/close.svg';
import edit from '../goodCard/edit.svg';

import './subcategories.scss';
import {useNavigate} from "react-router-dom";

const DEFAULT_CLASSNAME = 'admin-subcategories';

export const Subcategories = () => {
  const navigate = useNavigate();

  const userRole = sessionStorage.getItem('user-role');
  const token = sessionStorage.getItem('admin-dream-token');

  useEffect(() => {
    if (userRole !== "admin") {
      navigate('/admin/auth');
    }
  }, [userRole]);

  useEffect(() => {
    fetch(`${process.env["REACT_APP_API_URL"]}subcategory`)
      .then(res => res.json())
      .then(data => setSubcategories(data));
  }, [])

  const [subcategories, setSubcategories] = useState([]);

  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_nav`}>
          <div onClick={() => navigate('/admin/products')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Товары"}</div>
          <div onClick={() => navigate('/admin/subcategories')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Подкатегории"}</div>
          <div onClick={() => navigate('/admin/admin-services')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Услуги"}</div>
          <div onClick={() => navigate('/admin/banners')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Банеры"}</div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_title`}>
          <span>{"Подкатегории"}</span>
        </div>

        <div className={`${DEFAULT_CLASSNAME}_new`} onClick={() => navigate('/admin/add-subcategory')}>{"Добавить новую подкатегорию"}</div>
        <div className={`${DEFAULT_CLASSNAME}_new`} onClick={() => navigate('/admin/add-subSubcategory')}>{"Добавить новую Под подкатегорию"}</div>

        <div className={`${DEFAULT_CLASSNAME}_container`}>
          {subcategories.map(item => <div className={`${DEFAULT_CLASSNAME}_item`}>
            <div>{item.name}</div>
            <img src={item.img_path} className={`${DEFAULT_CLASSNAME}_item-img`}/>

            <img className={`${DEFAULT_CLASSNAME}_item_delete`} onClick={() => fetch(`${process.env["REACT_APP_API_URL"]}subcategory/${item.id}`, {
              method: "DELETE",
              headers: {
                "Authorization": token,
              },
            })} src={close} />
            <img className={`${DEFAULT_CLASSNAME}_item_edit`} src={edit} onClick={() => navigate(`/admin/subcategories/${item.id}`)} />
          </div>)}
        </div>
      </div>
    </div>
  )
}
