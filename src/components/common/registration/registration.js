import React, {useState} from 'react';

import './registration.scss';
import {useNavigate} from "react-router-dom";
import {CartCard} from "../cart_card/cart_card";
import {toast} from "react-toastify";
import {Helmet} from "react-helmet";

const DEFAULT_CLASSNAME = 'registration';

export const Registration = ({registerNotify, registrationMode}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    repeatPassword: '',
    lastName: '',
  })

  const submitRegistration = () => {
    if (!formData.password === formData.repeatPassword) {
      return null;
    }

    fetch(`${process.env["REACT_APP_API_URL"]}auth/register`, {
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }),
    }).then(res => res.json()).then((data) => {

      if (data.statusCode === 401) {
        if (data.message === "user with this email already exist") {
          toast.info("Пользователь с таким E-mail уже существует!")
        }
      } else {
        registerNotify();
        navigate("/login")
      }
    });
  }

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validateUserEmail = value => setIsEmailValid(!!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));
  const validateUserPassword = value => setIsPasswordValid(value.length >= 8);

  const [isNameValid, setIsNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);

  const validateName = value => setIsNameValid(!/[0-9]/.test(value) && value.length >= 1);
  const validateLastName = value => setIsLastNameValid(!/[0-9]/.test(value) && value.length >= 1);

  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper`}>

      <Helmet>
        <title>DreamStore - Регистрания</title>
        <meta name="description" content="Страница Регистрации" />
      </Helmet>

      {registrationMode && <div className={`${DEFAULT_CLASSNAME}_title`}>{"Регистрация"}</div>}
      <div className={DEFAULT_CLASSNAME}>
        <CartCard additionalInfo={false} edit={false} cool={false} stageTitle={"Личные данные"}/>
        <div className={`${DEFAULT_CLASSNAME}_group`}>
          <label htmlFor={'user_name'}>{'Ваше имя'}</label>
          <input onInput={(e) => {
            validateName(e.currentTarget.value)
            setFormData({
              ...formData,
              firstName: e.currentTarget.value
            })
          }} id={'user_name'} type={"text"} placeholder={"Иван"} value={formData.firstName} />
          {!isNameValid && <div style={{ color: "red" }}>Поле не должно быть пустым</div>}
        </div>
        <div className={`${DEFAULT_CLASSNAME}_group`}>
          <label htmlFor={'user_last_name'}>{'Ваша фамилия'}</label>
          <input onInput={(e) => {
            validateLastName(e.currentTarget.value);

            setFormData({
              ...formData,
              lastName: e.currentTarget.value,
            })
          }} id={'user_last_name'} type={"text"} placeholder={"Иванов"} value={formData.lastName} />
          {!isLastNameValid && <div style={{ color: "red" }}>Поле не должно быть пустым</div>}
        </div>
        <div className={`${DEFAULT_CLASSNAME}_group`}>
          <label htmlFor={'user_email'}>{'Ваш email'}</label>
          <input onInput={(e) => {
            validateUserEmail(e.currentTarget.value);
            setFormData({
              ...formData,
              email: e.currentTarget.value,
            })
          }} id={'user_email'} type={"text"} placeholder={"dreamstoreby@gmail.com"} value={formData.email} />
          {!isEmailValid && <div style={{ color: "red" }}>Введите корректный email</div>}
        </div>
        { registrationMode &&
          <>
            <div className={`${DEFAULT_CLASSNAME}_group`}>
              <label htmlFor={'user_pass'}>{'Ваш пароль'}</label>
              <input onInput={(e) => {
                validateUserPassword(e.currentTarget.value);

                setFormData({
                  ...formData,
                  password: e.currentTarget.value,
                })
              }} id={'user_pass'} type={"password"} placeholder={"*******"} value={formData.password} />
              <span>{!isPasswordValid ? <span style={{ color: "red" }}>Длина должна быть не менее 8 символов"</span> : "Введите 8 символов или больше, содержащих буквы и цифры"}</span>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_group`}>
              <label htmlFor={'user_pass_repeat'}>{'Подтверждение пароля'}</label>
              <input onInput={(e) => setFormData({
                ...formData,
                repeatPassword: e.currentTarget.value,
              })} id={'user_pass_repeat'} type={"password"} placeholder={"*******"} value={formData.repeatPassword}/>
              {formData.password.length >= 8 && formData.repeatPassword !== formData.password && <span style={{ color: 'red' }}>Пароли не совпадают</span>}
            </div>
          </>
        }
        {registrationMode && <button disabled={ !isEmailValid || !isPasswordValid || !isNameValid || !isLastNameValid ||
          !formData.firstName || !formData.lastName || !formData.email || formData.password.length < 4 || formData.password !== formData.repeatPassword
        } className={`${DEFAULT_CLASSNAME}_btn`} onClick={() => submitRegistration()}>{"Зарегистрироваться"}</button>}
      </div>
    </div>
  )
}