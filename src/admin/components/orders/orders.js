import * as React from 'react';

import '../clients/clients.scss';
import './orders.scss';
import searchIcon from "../clients/search.png";
import {Card} from "../card/card";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const DEFAULT_CLASSNAME = 'orders';

export const Orders = () => {
    const navigate = useNavigate();

    const userRole = sessionStorage.getItem('user-role');

    useEffect(() => {
        if (userRole !== "admin") {
            navigate('/admin/auth');
        }
    }, [userRole, navigate])

    const [orders, setOrders] = useState([]);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const [dataUpdated, setDataUpdated] = useState(0);

    useEffect(() => {
        if(!name && !phone && !email) {
            fetch(`${process.env["REACT_APP_API_URL"]}order`)
                .then(res => res.json())
                .then(data => setOrders(data));
        }
    }, [name, phone, email])

    useEffect(() => {
        if (name.trim().length) {
            setOrders(orders.filter((order) => (`${order.user.firstName} ${order.user.lastName}`.includes(name))))
        }
    }, [name]);

    useEffect(() => {
        if(phone.trim().length) {
            setOrders(orders.filter(order => `${order.user.phoneNumber}`.includes(phone)));
        }
    }, [phone]);

    useEffect(() => {
        if(email.trim().length) {
            setOrders(orders.filter(order => `${order.user.email}`.includes(email)));
        }
    }, [email]);

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
                <div className={`${DEFAULT_CLASSNAME}_nav`}>
                    <div className={`${DEFAULT_CLASSNAME}_nav_item`} onClick={() => navigate('/admin/clients')}>{"Клиенты"}</div>
                    <div className={`${DEFAULT_CLASSNAME}_nav_item`} onClick={() => navigate('/admin/orders')}>{"Заказы"}</div>
                </div>
                <div className={`clients_search`}>
                    <div className={`clients_search_item`}>
                        <input value={name} onChange={(e) => setName(e.currentTarget.value)} type={"text"} placeholder={"Введите имя заказчика"} />
                        <img src={searchIcon} alt={'search-icon'} />
                    </div>
                    <div className={`clients_search_item`}>
                        <input value={phone} onChange={(e) => setPhone(e.currentTarget.value)} type={"text"} placeholder={"Введите номер телефона заказчика"} />
                        <img src={searchIcon} alt={'search-icon'} />
                    </div>
                    <div className={`clients_search_item`}>
                        <input value={email} onChange={(e) => setEmail(e.currentTarget.value)} type={"text"} placeholder={"Введите почту заказчика"} />
                        <img src={searchIcon} alt={'search-icon'} />
                    </div>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_content`}>
                    {orders.map(order => {
                          return order.servicePriceId
                            ? <Card isServiceOrder={true} servicePriceId={order.servicePriceId}
                                    totalCost={order?.totalCost} address={order?.address} onConfirm={confirmOrder}
                                    isConfirmed={order?.isConfirmed} onDelete={deleteOrder} buckets={order?.buckets}
                                    orderId={order?.id} number={order?.phone}
                                    email={order.user?.email} client={`${order?.firstName} ${order?.lastName}`}/>
                            : <Card paymentMethod={order?.paymentMethod} orderType={order?.orderType} totalCost={order?.totalCost} address={order?.address} onConfirm={confirmOrder}
                                    isConfirmed={order?.isConfirmed} onDelete={deleteOrder} buckets={order?.buckets}
                                    orderId={order?.id} number={order?.phone}
                                    email={order.user?.email} client={`${order?.firstName} ${order?.lastName}`}/>
                    })}
                </div>
            </div>
        </div>
    )
}