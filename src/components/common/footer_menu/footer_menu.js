import React, {useState} from 'react';

import './footer_menu.scss';
import {useNavigate} from "react-router-dom";

import main from './icons/main.svg';
import search from './icons/search.svg';
import menu from './icons/menu.svg';
import account from './icons/account.svg';
import cart from './icons/cart.svg';

const DEFAULT_CLASSNAME = 'footer-menu';

const FOOTER_MENU_ITEMS = [
    {
        title: 'Главная',
        link: '/',
        image: main
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
        image: account
    },
    {
        title: 'Корзина',
        link: '/cart',
        image: cart
    },
]

export const FooterMenu = ({ setIsMobileMenuOpened }) => {
    const navigate = useNavigate();

    const [isSearchOpened, setIsSearchOpened] = useState(false);

    return (
        <div className={DEFAULT_CLASSNAME}>
            {FOOTER_MENU_ITEMS.map(({ title, link, image }) =>
                <div onClick={!!link.length ? () => navigate(link)
                                   : title === "Меню" ? () => setIsMobileMenuOpened(true) : () => setIsSearchOpened(true)
                } className={`${DEFAULT_CLASSNAME}_item`}>
                    <img src={image} alt={title} />
                    <span>{title}</span>
                </div>
            )}
        </div>
    )
}
