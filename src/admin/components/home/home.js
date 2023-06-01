import * as React from 'react';

import './home.scss';

import {Card} from "../card/card";
import {RegCard} from "../regCard/regCard";
import {GoodCard} from "../goodCard/goodCard";
import {useEffect, useState} from "react";

const DEFAULT_CLASSNAME = 'admin-home';

export const Home = () => {
    const [lastOrders, setLastOrders] = useState([]);
    const [lastUsers, setLastUsers] = useState([]);
    const [lastItems, setLastItems] = useState([]);
    const [currentCurrency, setCurrentCurrency] = useState(null);

    const [noteTitle, setNoteTitle] = useState("Заметка");
    const [note, setNote] = useState("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi aspernatur at consequuntur debitis ducimus ea ex ipsam ipsum libero necessitatibus officia quam quasi, quibusdam quo quod sint tempore vel, veritatis.")

    const [dataUpdated, setDataUpdated] = useState(1);

    useEffect(() => {
        const token = sessionStorage.getItem('admin-dream-token');

        fetch(`${process.env["REACT_APP_API_URL"]}product?p=1`)
            .then(res => res.json())
            .then(data => setLastItems(data.products.slice(0, 3)))

        fetch(`${process.env['REACT_APP_API_URL']}currency`, {
            method: "GET"
        })
            .then(res => res.json())
            .then(data => setCurrentCurrency(data.rate));

        fetch(`${process.env["REACT_APP_API_URL"]}order`)
            .then(res => res.json())
            .then(data => setLastOrders(data.slice(-3)))

        fetch(`${process.env["REACT_APP_API_URL"]}user`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
        })
            .then(res => res.json())
            .then(data => setLastUsers(data.slice(0, 5)))
    }, [dataUpdated]);

    const setCurrencyHandler = () => {
        const token = sessionStorage.getItem('admin-dream-token');

        fetch(`${process.env["REACT_APP_API_URL"]}currency`, {
            method: "POST",
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            body: JSON.stringify({
                "rate": Number(currentCurrency),
            }),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            }
        })
    }

    const deleteOrder = id => {
        const token = sessionStorage.getItem('admin-dream-token');

        fetch(`${process.env.REACT_APP_API_URL}order/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token,
            }
        })
            .finally(() => {
                setDataUpdated(dataUpdated + 1)
            })
    }

    const confirmOrder = id => {
        const token = sessionStorage.getItem('admin-dream-token');

        fetch(`${process.env.REACT_APP_API_URL}order/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isConfirmed: true,
            })
        })
            .finally(() => {
                setDataUpdated(dataUpdated + 1)
            })
    }

    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
            <div className={DEFAULT_CLASSNAME}>
                <div className={`${DEFAULT_CLASSNAME}_content`}>
                    <div className={`${DEFAULT_CLASSNAME}_content_left`}>
                        <div className={`${DEFAULT_CLASSNAME}_lastOrders`}>
                            <div className={`${DEFAULT_CLASSNAME}_title`}>{"Последние заказы"}</div>
                            {lastOrders.length > 0 && lastOrders.map(order => (
                                <Card paymentMethod={order?.paymentMethod} orderType={order?.orderType} totalCost={order?.totalCost} onConfirm={confirmOrder} onDelete={deleteOrder} isConfirmed={order?.isConfirmed} buckets={order?.buckets} orderId={order?.id} number={order?.phone} address={order?.address} memorySize={order?.buckets[0]?.equipment} title={order?.buckets[0]?.id} email={order?.buckets[0]?.email} client={`${order?.firstName} ${order?.lastName}`}/>
                            ))}
                        </div>
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_content_right`}>
                        <div className={`${DEFAULT_CLASSNAME}_lastRegistration`}>
                            <div className={`${DEFAULT_CLASSNAME}_title`}>{"Последние регистрации"}</div>
                            {lastUsers?.map((user, id) => <RegCard email={user.email} address={user.adress} number={`00${id + 1}`} expanded={false} phone={user.phoneNumber} name={`${user.firstName} ${user.lastName}`} />)}
                        </div>
                        <div className={`${DEFAULT_CLASSNAME}_lastItems`}>
                            <div className={`${DEFAULT_CLASSNAME}_title`}>{"Последние добавленые товары"}</div>
                            {lastItems.map(item => <GoodCard id={item?.id} title={item?.name} imgUrl={item?.img_path} />)}
                        </div>
                        <div className={`${DEFAULT_CLASSNAME}_currency`}>
                            <div>{"Курс доллара: "}</div>
                            <input value={currentCurrency} onChange={(e) => setCurrentCurrency(e.currentTarget.value)} type={"number"} alt={'currency'} />
                            <div onClick={() => setCurrencyHandler()} className={`${DEFAULT_CLASSNAME}_currency_save`}>{"Изменить"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}