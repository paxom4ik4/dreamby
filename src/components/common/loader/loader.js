import React from 'react';

import loaderGIF from './Logo_Preloader_Dark.gif';

import './loader.scss';

export const Loader = () => {
    return (
        <div className={'dreamStore-loader'}>
            <img src={loaderGIF} alt={'loader'}/>
        </div>
    )
}
