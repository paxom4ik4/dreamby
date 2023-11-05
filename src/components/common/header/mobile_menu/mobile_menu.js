import React, {useEffect} from 'react';

import logo from '../Logo.png';
import closeIcon from './close_icon.svg';

import './mobile_menu.scss';
import {useNavigate} from "react-router-dom";

const DEFAULT_CLASSNAME = 'new-mobile-menu';

const MOBILE_MENU_ITEMS = [
    {
        title: 'Каталог',
        link: '/catalog',
    },
    {
        title: 'Услуги',
        link: '/services',
    },
    {
        title: 'Избарнные',
        link: '/favorite',
    },
    {
        title: 'Сравнение',
        link: '/compare',
    },
    {
        title: 'О нас',
        link: '/about',
    },
    {
        title: 'Оплата',
        link: '/billing',
    },
]

export const MobileMenu = ({ isMobileMenuOpened, setIsMobileMenuOpened }) => {
    const navigate = useNavigate();

    useEffect(() => {
        setIsMobileMenuOpened(false);
    }, [navigate])

    return (
        <div className={`${DEFAULT_CLASSNAME} ${isMobileMenuOpened && `${DEFAULT_CLASSNAME}_opened`}`}>
            <div className={`${DEFAULT_CLASSNAME}_header`}>
                <img src={logo} alt={'mobile-menu-logo'}/>
                <div className={`${DEFAULT_CLASSNAME}_header_phones`}>
                    <a href={"tel:375297555562"}>{'+375 (29) 755-55-62'}</a>
                    <a href={"tel:375291553020"}>{'+375 (29) 155-30-20'}</a>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_header_email`}>
                    <a href={"mailto:dreamstoreby@gmail.com"}>{'dreamstoreby@gmail.com'}</a>
                </div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_items`}>
                {MOBILE_MENU_ITEMS.map(({title, link}) =>
                    <div onClick={() => navigate(link)}>{title}</div>
                )}
            </div>
            <button onClick={() => setIsMobileMenuOpened(false)}><img src={closeIcon} alt={'mobile-menu-close-icon'}/></button>
        </div>
    )
}
