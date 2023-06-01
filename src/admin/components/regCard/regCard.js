import * as React from 'react';

import './regCard.scss';

const DEFAULT_CLASSNAME = 'reg-card';

export const RegCard = ({ number = "0001", name = "Грек Панкратион", email = "qwerty12345@gmail.com", expanded = false, phone = "+3754412340506", address = "ул. Железнодорожная 198, кв. 122" }) => {
    return (
        <div className={DEFAULT_CLASSNAME}>
            <div style={{ width: !expanded && "20%" }} className={`${DEFAULT_CLASSNAME}_text`}>{number}</div>
            <div style={{ width: !expanded && "40%" }}className={`${DEFAULT_CLASSNAME}_text`}>{name}</div>
            <div style={{ width: !expanded && "40%" }} className={`${DEFAULT_CLASSNAME}_text`}>{email}</div>
            {expanded && <>
                <div className={`${DEFAULT_CLASSNAME}_text`}>{phone}</div>
                <div className={`${DEFAULT_CLASSNAME}_text`}>{address}</div>
            </>}
        </div>
    )
}