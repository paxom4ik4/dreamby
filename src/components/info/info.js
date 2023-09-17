import React from 'react';

import './info.scss';

const DEFAULT_CLASSNAME = 'info';

export const Info = () => {
    return (
        <div className={DEFAULT_CLASSNAME}>
            <h1 className={`${DEFAULT_CLASSNAME}_title`}>{"Юридическая Информация"}</h1>
            <div className={`${DEFAULT_CLASSNAME}_text_item`}>
                <div>{'ООО "ДиС концепт"'}</div>
                <div>{'УНП 193383048 Свидетельство о регистрации 0173335 от 12.02.2020'}</div>
                <div>{'Юридический адрес: 220116, г. Минск, пр-т Держинского, д. 69/2, офис 49'}</div>
                <div>{'Зарегистрирован в Торговом реестре Республики Беларусь 24.02.2020'}</div>
                <div>{'Регистрационный номер в Торговом реестре Республики Беларусь: 474496'}</div>
            </div>
        </div>
    )
}
