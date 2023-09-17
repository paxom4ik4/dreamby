import * as React from 'react';
import {Routes, Route, useNavigate, Redirect} from "react-router-dom";

import './admin.scss';
import {Login} from "./components/login/login";
import {Home} from "./components/home/home";
import {Clients} from "./components/clients/clients";
import {Orders} from "./components/orders/orders";
import {Products} from "./components/products/products";
import {useEffect, useState} from "react";
import {AddNewItem} from "./components/addNewItem/addNewItem";
import {Banners} from "./components/baners/baners";

// menu

import items from './menu_assets/items.png';
import clients from './menu_assets/clients.png';
import metrics from './menu_assets/metrics.png';
import close from './menu_assets/close.png';

import homeLogo from './assets/homeLogo.png';
import {Services} from "./components/services/services";
import {AddNewService} from "./components/addNewService/addNewService";
import {toast} from "react-toastify";
import {Subcategories} from "./components/subcategories/subcategories";
import {EditSubcategory, editSubcategory} from "./components/editSubcategory/editSubcategory";
import {AddSubcategory} from "./components/addNewSubcategory/addNewSubcategory";
import axios from "axios";
import EditChildItem from "./components/createNewItem/createNewItem";


const DEFAULT_CLASSNAME = 'dream-admin';

export const Admin = () => {
    const navigate = useNavigate();

    const userRole = sessionStorage.getItem('user-role');

    useEffect(() => {
        if (userRole !== "admin") {
            axios.interceptors.request.use(
                async config => {
                    if (!config.headers.Authorization) {
                        const token = sessionStorage.getItem('admin-dream-token');

                        if (token) {
                            config.headers.Authorization = token;
                        }
                    }

                    return config;
                },
                error => Promise.reject(error),
            );

            navigate('/admin/auth');
        }
    }, [userRole])

    const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
            {(!window.location.pathname.includes('/auth' || '/home')) && <div className={`${DEFAULT_CLASSNAME}_back`} onClick={() => navigate('/admin/home')}>{"Home"}</div>}
            <div className={DEFAULT_CLASSNAME}>
                {!window.location.pathname.includes('auth') && <div className={`${DEFAULT_CLASSNAME}_header ${!headerMenuOpen && 'close-menu'}`}>
                    <img className={`${DEFAULT_CLASSNAME}_header_btn`}
                         onClick={() => setHeaderMenuOpen((prev) => !prev)} src={homeLogo} alt={'home-logo'}/>
                    <div className={`${DEFAULT_CLASSNAME}_header_menu`}>
                        <img onClick={() => navigate('/admin/products')}
                             className={`${DEFAULT_CLASSNAME}_header_menu_item items`} src={items}/>
                        <img onClick={() => navigate('/admin/clients')}
                             className={`${DEFAULT_CLASSNAME}_header_menu_item clients`} src={clients}/>
                        <img className={`${DEFAULT_CLASSNAME}_header_menu_item metrics`} src={metrics}/>
                        <img onClick={() => {
                            sessionStorage.removeItem('admin-dream-token')
                            navigate('/admin/auth')
                        }} className={`${DEFAULT_CLASSNAME}_header_menu_item exit`} src={close}/>
                    </div>
                </div>}
                <Routes>
                    <Route path={'/auth'} element={<Login />} />
                    <Route path={'/home'} element={<Home />} />
                    <Route path={'/clients'} element={<Clients />} />
                    <Route path={'/orders'} element={<Orders />} />
                    <Route path={'/products'} element={<Products />} />
                    <Route path={'/subcategories'} element={<Subcategories />} />
                    <Route path={'/subcategories/:id'} element={<EditSubcategory />} />
                    <Route path={'/add-subcategory'} element={<AddSubcategory />} />
                    <Route path={'/add-subSubcategory'} element={<AddSubcategory subSubCategory />} />
                    <Route path={'/banners'} element={<Banners />} />
                    <Route path={'/admin-services'} element={<Services />} />
                    <Route path={'/add-new-service'} element={<AddNewService />} />
                    <Route path={'/add-product'} element={<AddNewItem />} />
                    <Route path={'/edit-child-item/:id'} element={<EditChildItem />} />
                    <Route path={'/add-product/:id'} element={<AddNewItem isEditMode={true} />} />
                </Routes>
            </div>
        </div>
    )
}
