import React, { useState, useEffect } from 'react';

import './profile.scss';
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";

const DEFAULT_CLASSNAME = 'profile';

export const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    fetch(`${process.env["REACT_APP_API_URL"]}user`, {
      headers: {
        "Authorization": token,
      }
    }).then(res => res.json()).then(data => setUserData(data));
  }, [])

  const navigate = useNavigate();

  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper`}>

      <Helmet>
        <title>DreamStore - Профиль</title>
        <meta name="description" content="Страница Профиля" />
          <link rel="canonical" href="https://dreamstore.by/profile"/>
      </Helmet>

      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_title`}>Мой профиль</div>
        {!(userData?.message === "Unauthorized") ? <>
          <div className={`${DEFAULT_CLASSNAME}_field`}>
            <div className={`${DEFAULT_CLASSNAME}_field_label`}>E-mail</div>
            <div className={`${DEFAULT_CLASSNAME}_field_value`}>{userData?.email}</div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_field`}>
            <div className={`${DEFAULT_CLASSNAME}_field_label`}>Имя</div>
            <div className={`${DEFAULT_CLASSNAME}_field_value`}>{userData?.firstName}</div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_field`}>
            <div className={`${DEFAULT_CLASSNAME}_field_label`}>Фамилия</div>
            <div className={`${DEFAULT_CLASSNAME}_field_value`}>{userData?.lastName}</div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_field`}>
            <div className={`${DEFAULT_CLASSNAME}_field_label`}>Номер телефона</div>
            <div className={`${DEFAULT_CLASSNAME}_field_value`}>{userData?.phoneNumber}</div>
          </div>
        </> : <><div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate('/login')}>Войдите в аккаунт</div> </>}
      </div>
    </div>
  )
}
