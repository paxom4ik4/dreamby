import React, {useEffect, useState} from 'react';

import './index.scss';
import { PopularItems } from "../common/popular_items/popular_items";
import {toast} from "react-toastify";
import {Helmet} from "react-helmet";

const DEFAULT_CLASSNAME = 'service-page';

const ServicePageContent = ({ cartItems, setCartItems }) => {
    const [currentServiceId, setCurrentServiceId] = useState(null);
    const [serviceInfo, setServiceInfo] = useState(null);
    const [minPrice, setMinPrice] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);

    const [availableDevices, setAvailableDevices] = useState(null);

    useEffect(() => {
        const serviceId = window.location.pathname.slice(10);

        setCurrentServiceId(serviceId);
    }, []);

    useEffect(() => {
        if (currentServiceId) {
            fetch(`${process.env["REACT_APP_API_URL"]}service/${currentServiceId}`)
                .then(res => res.json())
                .then(data => {
                  setServiceInfo(data)

                  setMinPrice(!!data.minprice ? data.minprice : data.ServicePrice[0].price);

                  const devices = data.ServicePrice.filter(item => !!item.prodId);

                  setAvailableDevices(devices);
                });
        }
    }, [currentServiceId]);

    const onOrderHandler = () => {
      const selectedDeviceInfo = !!selectedDevice && availableDevices[selectedDevice];

      if (selectedDeviceInfo) {
        if (Array.isArray(cartItems) && cartItems.length) {
          setCartItems([...cartItems, {
            serviceId: currentServiceId,
            productId: selectedDeviceInfo.prodId,
            price: Number(selectedDeviceInfo.price),
            image: serviceInfo.img_path,
            title: serviceInfo.name,
            serviceItem: true,
            servicePriceId: selectedDeviceInfo.id,
            itemAmount: 1,
            inStock: true,
          }]);
        } else {
          setCartItems([{
            serviceId: currentServiceId,
            productId: selectedDeviceInfo.prodId,
            price: Number(selectedDeviceInfo.price),
            image: serviceInfo.img_path,
            title: serviceInfo.name,
            serviceItem: true,
            servicePriceId: selectedDeviceInfo.id,
            itemAmount: 1,
            inStock: true,
          }])
        }
      } else {
        if (Array.isArray(cartItems) && cartItems.length) {
          setCartItems([...cartItems, {
            serviceId: currentServiceId,
            image: serviceInfo.img_path,
            price: Number(minPrice),
            title: serviceInfo.name,
            serviceItem: true,
            itemAmount: 1,
            inStock: true,
          }])
        } else {
          setCartItems([{
            serviceId: currentServiceId,
            image: serviceInfo.img_path,
            price: Number(minPrice),
            title: serviceInfo.name,
            serviceItem: true,
            itemAmount: 1,
            inStock: true,
          }])
        }
      }

      toast.info("Услуга добавлена в корзину");
    }

  return (
    <div className={`${DEFAULT_CLASSNAME}_content`}>
      <div className={`${DEFAULT_CLASSNAME}_preview`}>
        <div className={`${DEFAULT_CLASSNAME}_preview_image`}>
          <img src={serviceInfo?.img_path?.includes('http') ? serviceInfo?.img_path : `http://194.62.19.52:7000/${serviceInfo?.img_path}`} alt={'service-2'} />
        </div>
        <div className={`${DEFAULT_CLASSNAME}_preview_description`}>
            <span>{serviceInfo?.name}</span>
            <div style={{ fontSize: "16px" }}>{serviceInfo?.description}</div>
            <div style={{ marginTop: "20px", fontSize: "16px"}}>{(selectedDevice !== "Выберите ваш девайс" && selectedDevice !== null) ? (availableDevices[selectedDevice]?.price) + " BYN" : minPrice ? "От: " + (minPrice) + " BYN" : "Уточните стоимость у менеджера"}</div>

            <div className={`${DEFAULT_CLASSNAME}_device-order`}>
              {!!availableDevices && !!availableDevices.length && <select onChange={(e) => setSelectedDevice(e.currentTarget.value)}>
                <option value={null} defaultChecked={true}>Выберите ваш девайс</option>
                {availableDevices.map((item, idx) => {
                  return <option value={idx}>{item?.product.name}</option>
                })}
              </select>}
              <button onClick={() => onOrderHandler()}>Заказать</button>
            </div>
        </div>
      </div>
    </div>
  )
};

export const ServicePage = ({ cartItems, setCartItems, setLoginData, isAuthorized }) => {
  return (
    <div className={DEFAULT_CLASSNAME}>

      <Helmet>
        <title>DreamStore - Услуги</title>
        <meta name="description" content="Страница Услуг" />
      </Helmet>

      <ServicePageContent cartItems={cartItems} setCartItems={setCartItems} isAuthorized={isAuthorized} setLoginData={setLoginData} />
      <PopularItems />
    </div>
  )
}