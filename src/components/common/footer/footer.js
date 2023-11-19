import React from 'react';

import './footer.scss';

import it from './svg/inst.svg';
import tg from './svg/telegram.svg';
import vk from './svg/vk.svg';
import { useNavigate } from 'react-router-dom';

import logoSpin from '../../../Logo_Screensaver.gif';
import logo from '../../common/header/logo-dream-new.svg';

const DEFAULT_CLASSNAME = 'footer';

export const Footer = ({ footerRef }) => {
  const navigate = useNavigate();

  const showFooter = window.location.pathname.includes('/admin');

  return (
    !showFooter && (
      <div className={`${DEFAULT_CLASSNAME}_wrapper`} ref={footerRef}>
        <div className={DEFAULT_CLASSNAME}>
          <div className={`${DEFAULT_CLASSNAME}_title`}>
            <img
              loading={'lazy'}
              className={`${DEFAULT_CLASSNAME}_title_logo`}
              src={logoSpin}
              alt={'logo-spin'}
            />
            <img
              loading={'lazy'}
              className={`${DEFAULT_CLASSNAME}_title_spin`}
              src={logo}
              alt={'logo'}
            />
          </div>
          <div className={`${DEFAULT_CLASSNAME}_content`}>
            <div className={`${DEFAULT_CLASSNAME}_contact-info`}>
              <div className={`${DEFAULT_CLASSNAME}_contact-info_title`}>{'Контакты'}</div>
              <div className={`${DEFAULT_CLASSNAME}_contact_info_item_title`}>
                {'Адрес магазина'}
              </div>
              <div className={`${DEFAULT_CLASSNAME}_contact_info_item_text`}>
                <a href={'https://yandex.by/maps/-/CCUnMGuDlB'} target={'_blank'}>
                  {'ТЦ “АренаCity” 1 этаж пр. Победителей 84'}
                </a>
              </div>
              <div className={`${DEFAULT_CLASSNAME}_contact_info_item_text`}>
                <a href={'https://yandex.by/maps/-/CCUnMGuDlB'} target={'_blank'}>
                  {'с 10-00 до 21-00 ежедневно'}
                </a>
              </div>
              <div className={`${DEFAULT_CLASSNAME}_contact_info_item_title`}>{'Контакты'}</div>
              <div className={`${DEFAULT_CLASSNAME}_contact_info_item_text`}>
                <a href={'tel:375291553020'}>{'+375 (29) 155-30-20'}</a>
              </div>
              <div className={`${DEFAULT_CLASSNAME}_contact_info_item_text`}>
                <a href={'tel:375297555562'}>{'+375 (29) 755-55-62'}</a>
              </div>
              <div className={`${DEFAULT_CLASSNAME}_contact_info_item_text`}>
                <a href={'mailto:dreamstoreby@gmail.com'}>{'dreamstoreby@gmail.com'}</a>
              </div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_navigation`}>
              <div className={`${DEFAULT_CLASSNAME}_navigation_item`}>
                <div className={`${DEFAULT_CLASSNAME}_navigation_sub-item-title`}>
                  {'Навигация'}
                </div>
                <div
                  className={`${DEFAULT_CLASSNAME}_navigation_sub-item`}
                  onClick={() => navigate('/catalog')}>
                  {'Каталог'}
                </div>
                <div
                  className={`${DEFAULT_CLASSNAME}_navigation_sub-item`}
                  onClick={() => navigate('/services')}>
                  {'Услуги'}
                </div>
                <div
                  className={`${DEFAULT_CLASSNAME}_navigation_sub-item`}
                  onClick={() => navigate('/about')}>
                  {'О нас'}
                </div>
                <div
                  className={`${DEFAULT_CLASSNAME}_navigation_sub-item`}
                  onClick={() => navigate('/billing')}>
                  {'Оплата'}
                </div>
              </div>
              <div className={`${DEFAULT_CLASSNAME}_navigation_item`}>
                <div className={`${DEFAULT_CLASSNAME}_navigation_sub-item-title`}>{'Аккаунт'}</div>
                <div
                  className={`${DEFAULT_CLASSNAME}_navigation_sub-item`}
                  onClick={() => navigate('/profile')}>
                  {'Профиль'}
                </div>
                {/*<div className={`${DEFAULT_CLASSNAME}_navigation_sub-item`} onClick={() => navigate('/cart')}>{'Корзина'}</div>*/}
                <div
                  className={`${DEFAULT_CLASSNAME}_navigation_sub-item`}
                  onClick={() => navigate('/favorite')}>
                  {'Избранное'}
                </div>
                <div
                  className={`${DEFAULT_CLASSNAME}_navigation_sub-item`}
                  onClick={() => navigate('/compare')}>
                  {'Сравнение'}
                </div>
              </div>
              <div className={`${DEFAULT_CLASSNAME}_navigation_item`}>
                <div className={`${DEFAULT_CLASSNAME}_navigation_sub-item-title`}>
                  {'Служба поддержки '}
                </div>
                <div
                  className={`${DEFAULT_CLASSNAME}_navigation_sub-item`}
                  onClick={() => navigate('/about')}>
                  {'Связаться с нами'}
                </div>
                <div
                  className={`${DEFAULT_CLASSNAME}_navigation_sub-item`}
                  onClick={() => navigate('/info')}>
                  {'Юридическая информация'}
                </div>
              </div>
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_footerContent`}>
            <div className={`${DEFAULT_CLASSNAME}_links`}>
              <a
                rel={'nofollow'}
                href={'https://t.me/DreamStore_by'}
                target={'_blank'}
                className={`${DEFAULT_CLASSNAME}_links_item`}>
                <img loading={'lazy'} alt={'icon'} src={tg} />
              </a>
              <a
                rel={'nofollow'}
                href={'https://instagram.com/dreamstore_by'}
                target={'_blank'}
                className={`${DEFAULT_CLASSNAME}_links_item`}>
                <img loading={'lazy'} alt={'icon'} src={it} />
              </a>
              <a
                rel={'nofollow'}
                href={'viber://chat?number=%2B375291553020'}
                className={`${DEFAULT_CLASSNAME}_links_item`}>
                <img loading={'lazy'} style={{ marginBottom: '2px' }} alt={'icon'} src={vk} />
              </a>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_text`}>
              {'Dreamstore © Premium Tech Retail 2023'}
            </div>
          </div>
        </div>
      </div>
    )
  );
};
