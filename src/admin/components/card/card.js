import * as React from 'react';

import './card.scss';

import accept from './accept.png';
import reject from './reject.png';

import {useEffect, useState} from "react";

const DEFAULT_CLASSNAME = 'card';

export const Card = ({ paymentMethod = "Самовывоз", orderType = "Наличными", servicePriceId, isServiceOrder, totalCost = 10, isConfirmed = false, onConfirm, onDelete, buckets = [], orderId, client, number, address }) => {
    const [productsData, setProductsData] = useState([]);

    const [servicesData, setServicesData] = useState([]);

    const totalOrderPrice = buckets.reduce((total, item) => {
        return total + (Number(item?.totalCost) * item?.quantity);
    }, 0);

    useEffect(() => {
        const services = buckets.filter(item => item.servicePriceId);

        services.forEach(item => {
            fetch(`${process.env["REACT_APP_API_URL"]}serviceprice/${item.servicePriceId}`)
              .then(res => res.json())
              .then(data => setServicesData([...productsData, {...data.product, service: data.service.name}]));
        })

    }, [isServiceOrder]);

    return (
        <div className={`${DEFAULT_CLASSNAME} ${isConfirmed && 'confirmed-card'}`}>
            {isConfirmed && <div className={`${DEFAULT_CLASSNAME}_confirmed`}>{"Заказ подтвержден"}</div>}
            <img className={`${DEFAULT_CLASSNAME}_reject`} src={reject} alt={'reject'} onClick={() => onDelete(orderId)} />
            {!isConfirmed && <img className={`${DEFAULT_CLASSNAME}_accept`} src={accept} alt={'accept'} onClick={() => onConfirm(orderId)} />}
            <div className={`${DEFAULT_CLASSNAME}_content`}>
                <div className={`${DEFAULT_CLASSNAME}_cost`}>{`Сумма заказа: ${totalOrderPrice} BYN`}</div>
                <div style={{ marginTop: "12px", fontWeight: "700"}}>{"Заказ: "}</div>
                {buckets?.length && buckets.map(bucket => {
                    return (
                      <>
                          <div className={`${DEFAULT_CLASSNAME}_order`}>
                              <div className={`${DEFAULT_CLASSNAME}_order_description`}>
                                  {!!bucket?.service && <div>Услгуга: {bucket?.service}</div>}
                                  <div className={`${DEFAULT_CLASSNAME}_order-title`}>{bucket?.product?.name} {bucket?.equipment > 0 && `(${bucket?.equipment} GB)`}</div>
                                  {!bucket?.service && <div className={`${DEFAULT_CLASSNAME}_order_price`}>Цена товара: {bucket?.totalCost} (BYN)</div>}
                                  {bucket?.quantity > 1 && <div>Количество: {bucket?.quantity} шт.</div>}
                                  <br />
                                  <div>Тип доставки: {orderType}</div>
                                  <div>Способ оплаты: {paymentMethod}</div>
                              </div>
                              {!bucket?.service && <img src={bucket?.product?.img_path.includes('http') ? bucket?.product?.img_path : `https://dreamstore.by/${bucket?.product?.img_path}`}  className={`${DEFAULT_CLASSNAME}_order-title`} />}
                          </div>
                          <hr />
                      </>
                    )
                })}

                {!!servicesData?.length && servicesData.map(item => {
                    return (
                      <div className={`${DEFAULT_CLASSNAME}_order`}>
                          <div>Услгуга: {item?.service} <br /> (доп. информация)</div>
                          <div className={`${DEFAULT_CLASSNAME}_order-title`}>{item?.name}</div>
                          <div className={`${DEFAULT_CLASSNAME}_order_price`}>Цена товара: {item?.price} (BYN)</div>
                      </div>
                    )
                })}

                <div className={`${DEFAULT_CLASSNAME}_text`}>{`Клиент: ${client}`}</div>
                <div className={`${DEFAULT_CLASSNAME}_text`}>{`Номер: ${number}`}</div>
                {address && <div className={`${DEFAULT_CLASSNAME}_text`}>{`Адрес: ${address}`}</div>}
                {buckets[0]?.quantity >= 2 && <div style={{ paddingTop: "4px" }} className={`${DEFAULT_CLASSNAME}_text`}>{`Количество позиций: ${buckets[0]?.quantity}`}</div>}
            </div>

        </div>
    )
}
