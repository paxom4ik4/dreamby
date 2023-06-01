import React, {useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './contact.scss';
import { faLocationDot, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";

const DEFAULT_CLASSNAME = 'contact';

const locationIcon = <FontAwesomeIcon icon={faLocationDot} />
const emailIcon = <FontAwesomeIcon icon={faEnvelope} />
const phoneIcon = <FontAwesomeIcon icon={faPhone} />

const ContactInfo = () => {
  return (
    <div className="contact_info">
      <div className="contact_info_group">
          <a className="contact_info_group" style={{ margin: "0" }} href={"https://yandex.by/maps/-/CCUnMGuDlB"} target={"_blank"}>
            <div className="contact_info_item"><div>{locationIcon}</div> {"Адрес магазина"}</div>
            <span className="contact_info_sub-item">{"ТЦ “АренаCity” 1 этаж"}</span>
            <span className="contact_info_sub-item">{"пр. Победителей 84"}</span>
            <span className="contact_info_sub-item">{"с  10-00 до 21-00, ежедневно"}</span>
          </a>
      </div>
      <div className="contact_info_group">
        <div className="contact_info_item"><div>{emailIcon}</div> {"Email"}</div>
        <span className="contact_info_sub-item"><a href={"mailto:dreamstoreby@gmail.com"}>{"dreamstoreby@gmail.com"}</a></span>
      </div>
      <div className="contact_info_group">
        <div className="contact_info_item"><div>{phoneIcon}</div> {"Телефоны"}</div>
        <span className="contact_info_sub-item"><a href={"tel:+375 (29) 155-30-20"}>{"+375 (29) 155-30-20"}</a></span>
        <span className="contact_info_sub-item"><a href={"tel:+375 (29) 755-55-62"}>{"+375 (29) 755-55-62"}</a></span>
      </div>
    </div>
  )
}

const ContactForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [text, setText] = useState("");

    const submitAboutForm = () => {
        const token = sessionStorage.getItem('token');

        if (name.trim().length && email.trim().length && text.trim().length) {
            fetch(`${process.env["REACT_APP_API_URL"]}email`, {
                method: "POST",
                headers: {
                    "Authorization": token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: email,
                    sender: name,
                    subject: "Contact form",
                    text: text
                })
            }).finally(() => {
                setEmail("");
                setName("");
                setText("");

                toast.info("Сообщение отправлено")
            })
        }
    }

  return (
    <div className="contact_form">
      <div className="contact_form_title">{"Связаться с нами"}</div>
      <div className="contact_form_group">
        <label form="name">{"Ваше имя"}</label>
        <input value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" placeholder={"Иван"} />
      </div>
      <div className="contact_form_group">
        <label form="email">{"Ваш E-mail"}</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder={"dreamstoreby@gmail.com"} />
      </div>
      <div className="contact_form_group">
        <label form="massage">{"Сообщение"}</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} id="massage" placeholder={"Как мы можем Вам помочь?"} />
      </div>
      <div className="contact_form__submit_btn" onClick={() => submitAboutForm()}>{"Отправить"}</div>
    </div>
  )
}

export const Contact = () => {
  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_content`}>
        <div className={`${DEFAULT_CLASSNAME}_contact_info_container`}>
          <ContactInfo />
        </div>
        <div className={`${DEFAULT_CLASSNAME}_form_container`}>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
