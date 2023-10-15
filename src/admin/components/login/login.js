import * as React from 'react';

import './login.scss';
import { useState } from "react";

import logo from '../../assets/logo.png';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const DEFAULT_CLASSNAME = 'auth';

export const Login = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = () => {
        if (userName.trim().length && password.trim().length) {
            fetch(`${process.env["REACT_APP_API_URL"]}auth/login`, {
                method: "POST",
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                body: JSON.stringify({
                    "email": userName,
                    "password": password
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(res => res.json())
                .then(data => {
                    sessionStorage.setItem('admin-dream-token', data.token);
                    sessionStorage.setItem('user-role', data.user.role);

                    if (data.user.role === "admin") {
                        navigate('/admin/home');
                        toast.info(`Добро пожаловать, ${data.user.firstName} ${data.user.lastName}`)
                    } else {
                        toast.error("Отказано в доступе!")
                    }
                });
        }
    }

    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
            <div className={DEFAULT_CLASSNAME}>
                <div className={`${DEFAULT_CLASSNAME}_title`}>{"DreamStore"}</div>
                <div className={`${DEFAULT_CLASSNAME}_text`}>{"Admin Panel"}</div>

                <div className={`${DEFAULT_CLASSNAME}_form`}>
                    <input type={"text"} placeholder={"Имя пользователя"} value={userName} onChange={(e) => setUserName(e.currentTarget.value)}/>
                    <input type={"password"} placeholder={"Пароль"} value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>
                </div>
                <div onClick={() => {
                    loginHandler()
                }} className={`${DEFAULT_CLASSNAME}_btn`}>{"ВОЙТИ"}</div>

                <img src={logo} alt={'logo'} />
            </div>
        </div>
    )
}
