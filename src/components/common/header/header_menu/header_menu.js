import React, { useEffect, useRef } from 'react';

import './header_menu.scss';
import { useNavigate } from 'react-router-dom';

import favorite from './svg/favorite.svg';
import compare from './svg/compare.svg';
import logout from './svg/logout.svg';
import login from './svg/login.svg';
import profile from '../cabinet.svg';

const DEFAULT_CLASSNAME = 'header_menu';

const menuItems = (isLoggedIn) => [
  !isLoggedIn
    ? {
        title: 'Войти',
        link: '/login',
        icon: login,
      }
    : {
        title: 'Выйти',
        link: '',
        icon: logout,
      },
  {
    title: 'Избранное',
    link: '/favorite',
    icon: favorite,
  },
  {
    title: 'Сравнение',
    link: '/compare',
    icon: compare,
  },
  isLoggedIn
    ? {
        title: 'Профиль',
        link: '/profile',
        icon: profile,
      }
    : null,
];

export const HeaderMenu = ({ setIsMenuOpen, isLoggedIn, setLoginData }) => {
  const navigate = useNavigate();

  const onLogout = (title) => {
    if (title === 'Выйти') {
      setLoginData(null);
      sessionStorage.removeItem('loginData');
      navigate('/login');
    }
  };

  return (
    <div
      onClick={(e) => e.currentTarget === e.target && setIsMenuOpen(false)}
      className={`${DEFAULT_CLASSNAME}_wrapper`}>
      <div className={DEFAULT_CLASSNAME}>
        {menuItems(isLoggedIn)
          .filter(Boolean)
          .map((item) => (
            <div
              className={`${DEFAULT_CLASSNAME}_item`}
              onClick={() => {
                navigate(item.link);
                setIsMenuOpen(false);
                onLogout(item.title);
              }}>
              <span>{item.title}</span>
              <img
                loading={'lazy'}
                style={{ height: item.icon === logout && '16px' }}
                src={item.icon}
                alt={'item-icon'}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
