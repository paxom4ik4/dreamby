import * as React from 'react'

import './categories.scss';
import { CategoryCard } from "../../../components/common/category_card/category_card";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

    const DEFAULT_CLASSNAME = 'admin-categories';

export const Categories = () => {
    const navigate = useNavigate();

    const userRole = sessionStorage.getItem('user-role');

    useEffect(() => {
        if (userRole !== "admin") {
            navigate('/admin/auth');
        }
    }, [userRole, navigate])

    const [categories, setCategories] = useState([]);

    const [dataChanges, setDataChanges] = useState(0);

    useEffect(() => {
        fetch(`${process.env["REACT_APP_API_URL"]}category`)
            .then(res => res.json())
            .then(data => setCategories(data));
    }, [dataChanges])

    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
            <div className={DEFAULT_CLASSNAME}>
                <div className={`${DEFAULT_CLASSNAME}_nav`}>
                    <div onClick={() => navigate('/admin/categories')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Категории"}</div>
                    <div onClick={() => navigate('/admin/products')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Товары"}</div>
                    <div onClick={() => navigate('/admin/banners')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Банеры"}</div>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_content`}>
                    {categories && categories?.map(category => {
                            return (
                                <CategoryCard
                                    dataChanges={dataChanges}
                                    setDataChanges={setDataChanges}
                                    categoryId={category.id}
                                    title={category.categoryName}
                                    itemsAmount={category._count.products > 0 ? category._count.products : "Нет в наличии"}
                                    image={category.img_path}
                                    categoryLink={category.categoryLink}
                                    isAdmin={true}
                                />
                            )
                        }
                    )}
                </div>
            </div>
        </div>
    )
}