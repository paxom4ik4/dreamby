import * as React from 'react';

import '../addNewItem.scss';
import {toast} from "react-toastify";
import addService from "../assets/addService.svg";
import {useEffect, useState} from "react";

const DEFAULT_CLASSNAME = 'add-new-item';

export const ItemServices = ({
     services,
     newServices,
     isEditMode,
     setDataUpdated,
     dataUpdated,
     newService,
     newServiceName,
     setNewServiceName,
     newServicePrice,
     setNewServicePrice,
     currentProductId,
     setNewService,
     setServices
}) => {
    const [availableServices, setAvailableServices] = useState(null);

    useEffect(() => {
        fetch(`${process.env["REACT_APP_API_URL"]}service`)
            .then(res => res.json())
            .then(data => setAvailableServices(data));
    }, [])

    return (
        <div className={`${DEFAULT_CLASSNAME}_item_info_services`}>

            {!!services?.length && <div className={`${DEFAULT_CLASSNAME}_item_info_services_items`}>
                {services.map((item) => {
                    const serviceName = availableServices?.find(service => service.id === item.id);

                    return (
                        <div>
                            <div>{serviceName?.name}</div>
                            <div>{item?.price}</div>
                            {isEditMode && <div onClick={() => {
                                const token = sessionStorage.getItem('admin-dream-token');

                                if (isEditMode) {
                                    fetch(`${process.env["REACT_APP_API_URL"]}service/${item.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Authorization": token,
                                        },
                                    })
                                        .finally(() => {
                                            toast.info('Услуга удалена');
                                            setDataUpdated(dataUpdated + 1);
                                        })
                                }
                            }} style={{ width: '64px', cursor: "pointer" }}>Удалить</div>}
                        </div>
                    )
                })}
            </div>}

            {!!newServices?.length && <div className={`${DEFAULT_CLASSNAME}_item_info_services_items`}>
                {newServices.map((item) => {
                    return (
                        <div>
                            <div>{item.service.name}</div>
                            <div>{item.price}</div>
                            {isEditMode && <div onClick={() => {
                                const token = sessionStorage.getItem('admin-dream-token');

                                if (isEditMode) {
                                    fetch(`${process.env["REACT_APP_API_URL"]}serviceprice/${item.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Authorization": token,
                                        },
                                    })
                                        .finally(() => {
                                            toast.info('Услуга удалена');
                                            setDataUpdated(dataUpdated + 1);
                                        })
                                }
                            }} style={{ width: '64px', cursor: "pointer" }}>Удалить</div>}
                        </div>
                    )
                })}
            </div>}

            {newService && <div className={`${DEFAULT_CLASSNAME}_item_info_services_new`}>
                <select onChange={(e) => {setNewServiceName(e.currentTarget.value)}}>
                    <option defaultChecked={true}>{"Выберите услугу из списка"}</option>
                    {availableServices.map(item => <option value={item.id}>{item.name}</option>)}
                </select>
                <input type={"text"} placeholder={"Стоимость услуги"} value={newServicePrice} onChange={(e) => setNewServicePrice(e.currentTarget.value)}/>
            </div>}
            <img src={addService} alt={'add-service'} onClick={!newService ? () => setNewService(true) : () => {
                if (newServicePrice.trim().length && newServiceName.trim().length) {

                    if (isEditMode) {
                        const token = sessionStorage.getItem('admin-dream-token');

                        fetch(`${process.env["REACT_APP_API_URL"]}serviceprice`, {
                            method: "POST",
                            headers: {
                                "Authorization": token,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                prodId: currentProductId,
                                servId: newServiceName,
                                price: newServicePrice,
                            }),
                        }).finally(() => {
                            toast("Сервис добавлен");
                            setDataUpdated(data => data + 1);
                        })
                    } else {
                        setServices([...services, {
                            id: newServiceName,
                            price: newServicePrice,
                        }]);
                    }

                    setNewServiceName("")
                    setNewServicePrice("");
                    setNewService(false);
                }
            }}/>
        </div>
    )
}
