import * as React from 'react';

import './services.scss';
import {useEffect, useState} from "react";
import {GoodCard} from "../goodCard/goodCard";
import {useNavigate} from "react-router-dom";

const DEFAULT_CLASSNAME = 'admin-services';

export const Services = () => {
    const navigate = useNavigate();

    const [services, setServices] = useState([]);

    const [dataUpdated, setDataUpdated] = useState(1);

    const userRole = sessionStorage.getItem('user-role');

    useEffect(() => {
        if (userRole !== "admin") {
            navigate('/admin/auth');
        }
    }, [userRole])

    useEffect(() => {
        fetch(`${process.env["REACT_APP_API_URL"]}service`)
            .then(res => res.json())
            .then(data => setServices(data));
    }, [dataUpdated])

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
                    <span>{"Услуги"}</span>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_items`}>
                    {services.length && services.map(item => <GoodCard dataUpdated={dataUpdated} setDataUpdated={setDataUpdated} serviceItem={true} id={item.id} title={item.name} imgUrl={ item?.img_path?.includes('http') ? item.img_path : `http://194.62.19.52:7000/${item.img_path}`} />)}
                </div>
                <div className={`${DEFAULT_CLASSNAME}_new`} onClick={() => navigate('/admin/add-new-service')}>{"Добавить новую услугу"}</div>
            </div>
        </div>
    )
}