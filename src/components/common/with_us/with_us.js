import React, {useEffect, useRef, useState} from 'react';

import './index.scss';

import it from './svg/inst.svg';
import tg from './svg/telegram.svg';
import vk from './svg/vk.svg';

const DEFAULT_CLASSNAME = 'with-us';

export const WithUs = ({ isHidden }) => {
    return (
        <div className={`${DEFAULT_CLASSNAME} ${isHidden && 'with-us-hidden'}`}>
            <div className={`${DEFAULT_CLASSNAME}_title`}>{"Связаться с нами"}</div>
            <div className={`${DEFAULT_CLASSNAME}_phones`}>
                <a href={"tel:375297555562"}>{'+375 (29) 755-55-62'}</a>
                <a href={"tel:375291553020"}>{'+375 (29) 155-30-20'}</a>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_email`}>
                <a href={"mailto:dreamstoreby@gmail.com"}>{'dreamstoreby@gmail.com'}</a>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_links`}>
                <a rel={'nofollow'} href={'https://t.me/DreamStore_by'} target={"_blank"} className={`${DEFAULT_CLASSNAME}_links_item`}><img alt={'icon'} src={tg} /></a>
                <a rel={'nofollow'} href={'https://instagram.com/dreamstore_by'} target={"_blank"} className={`${DEFAULT_CLASSNAME}_links_item`}><img alt={'icon'} src={it} /></a>
                <a rel={'nofollow'} href={'viber://chat?number=%2B375291553020'} className={`${DEFAULT_CLASSNAME}_links_item`}><img style={{ marginBottom: '2px' }}  alt={'icon'} src={vk} /></a>
            </div>
        </div>
    )
}
