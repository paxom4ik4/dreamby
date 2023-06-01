import React, { useState } from 'react';

import './index.scss';
import { CartCard } from "../common/cart_card/cart_card";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import {Helmet} from "react-helmet";

const DEFAULT_CLASSNAME = "login";

export const Login = ({ fromReview, loginNotify, loginFailed, setLoginData }) => {
    const navigate = useNavigate();

    const [userEmail, setEmail] = useState('');
    const [userPassword, setPassword] = useState('');

    const onLogin = async () => {
      const res = fetch(`${process.env["REACT_APP_API_URL"]}auth/login`, {
        method: "POST",
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
        })
      })

      res.then((res) => {
        return res.json()
      })
        .then((data) => {
            if (data.statusCode === 401) {
                toast.error("Неверный E-mail или пароль");
            } else if (data.user.auth === 'basic' && !data.statusCode) {
                setLoginData(data.user);
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('loginData', JSON.stringify(data.user));
                loginNotify ? loginNotify() : toast.info("Вы успешно вошли в аккаунт!");
                !fromReview && navigate("/");
            }
        })
          .finally(() => {
              setPassword('');
              setEmail('');
          })
    }

    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>

          <Helmet>
            <title>DreamStore - Авторизация</title>
            <meta name="description" content="Страница Авторизации" />
          </Helmet>

            <div className={DEFAULT_CLASSNAME}>
                {!fromReview && <div className={`${DEFAULT_CLASSNAME}_title`}>{"Авторизация"}</div>}
                <div className={`${DEFAULT_CLASSNAME}_content`}>
                    {!fromReview && <CartCard additionalInfo={false} stageTitle={'Личные данные'} stage={'a'} cool={false} edit={false}/>}
                    <div className={`registration_group`}>
                        <label htmlFor={'login_user_email'}>{'Ваш email'}</label>
                        <input value={userEmail} onInput={(e) => {
                          setEmail(e.currentTarget.value)
                        }} id={'login_user_email'} type={"text"} placeholder={"dreamstoreby@gmail.com"}/>
                    </div>
                    <div className={`registration_group`}>
                        <label htmlFor={'login_user_pass'}>{'Ваш пароль'}</label>
                        <input value={userPassword} onInput={(e) => setPassword(e.currentTarget.value)} id={'login_user_pass'} type={"password"} placeholder={"*******"}/>
                    </div>
                </div>
                <button disabled={!userEmail.length || userPassword.length < 4} className={`registration_btn`} onClick={() => onLogin()}>{"Войти"}</button>

                <div className={`${DEFAULT_CLASSNAME}_forget`}>{"Нет аккаунта?"} <span onClick={() => navigate("/registration")}>{"Зарегистрироваться"}</span></div>
            </div>
        </div>
    )
}