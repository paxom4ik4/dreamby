import * as React from 'react'

import './clients.scss';

import searchIcon from './search.png';
import {RegCard} from "../regCard/regCard";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const DEFAULT_CLASSNAME = 'clients';

export const Clients = () => {
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);

    const userRole = sessionStorage.getItem('user-role');

    useEffect(() => {
        if (userRole !== "admin") {
            navigate('/admin/auth');
        }
    }, [userRole, navigate])

    useEffect(() => {
        const token = sessionStorage.getItem("admin-dream-token");

        fetch(`${process.env["REACT_APP_API_URL"]}user`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
        })

            .then(res => res.json())
            .then(data => setClients(data));
    }, [])

    const [filteredClients, setFilteredClients] = useState([]);

    const [searchName, setSearchName] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [searchEmail, setSearchEmail] = useState("");

    useEffect(() => {
        const initialClients = [...clients];

        const clientsFilteredByName = searchName.trim().length ? initialClients.filter((client) => `${client.firstName} ${client.lastName}`?.toLowerCase().includes(searchName.toLowerCase())) : [];

        const clientsFilteredByPhone = searchPhone.trim().length ? initialClients.filter(client => client.phoneNumber?.includes(searchPhone)) : []

        const clientsFilteredByEmail = searchEmail.trim().length ? initialClients.filter(client => client.email?.toLowerCase().includes(searchEmail.toLowerCase())) : [];

        setFilteredClients([...clientsFilteredByName, ...clientsFilteredByPhone, ...clientsFilteredByEmail])

    }, [clients, searchName, searchPhone, searchEmail]);

    const clientsToRender = (searchName.trim().length || searchPhone.trim().length || searchEmail.trim().length) ? filteredClients?.length ? filteredClients : clients : clients;


    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
            <div className={DEFAULT_CLASSNAME}>
                <div className={`${DEFAULT_CLASSNAME}_nav`}>
                    <div className={`${DEFAULT_CLASSNAME}_nav_item`} onClick={() => navigate('/admin/clients')}>{"Клиенты"}</div>
                    <div className={`${DEFAULT_CLASSNAME}_nav_item`} onClick={() => navigate('/admin/orders')}>{"Заказы"}</div>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_search`}>
                    <div className={`${DEFAULT_CLASSNAME}_search_item`}>
                        <input value={searchName} onChange={(e) => setSearchName(e.currentTarget.value)} type={"text"} placeholder={"Введите имя заказчика"} />
                        <img src={searchIcon} alt={'search-icon'} />
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_search_item`}>
                        <input value={searchPhone} onChange={(e) => setSearchPhone(e.currentTarget.value)} type={"text"} placeholder={"Введите номер телефона заказчика"} />
                        <img src={searchIcon} alt={'search-icon'} />
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_search_item`}>
                        <input value={searchEmail} onChange={(e) => setSearchEmail(e.currentTarget.value)} type={"text"} placeholder={"Введите почту заказчика"} />
                        <img src={searchIcon} alt={'search-icon'} />
                    </div>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_content`}>
                    {clientsToRender?.length ? clientsToRender.map((item) => {
                        return (
                            <RegCard expanded={true} number={`00${item.id}`} address={item.adress} name={`${item.firstName} ${item.lastName}`} email={item.email} phone={item.phoneNumber} />
                        )
                    }) : <span>Loading</span>}
                </div>
            </div>
        </div>
    )
}
