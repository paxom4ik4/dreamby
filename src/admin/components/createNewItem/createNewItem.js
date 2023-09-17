import React, {useEffect, useState} from 'react';

import './createNewItem.scss';
import axios from "axios";

const DEFAULT_CLASSNAME = 'create-new-item';

const EditChildItem = () => {
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");

    const [amount, setAmount] = useState(0);

    const [newIn, setNewIn] = useState(false);
    const [leaders, setLeaders] = useState(false);
    const [specialOffer, setSpecialOffer] = useState(false);

    const [productData, setProductData] = useState(null);

    const [hidePayment, setHidePayment] = useState(false);
    const [hideProduct, setHideProduct] = useState(false);

    useEffect(() => {
        const pathArr = window.location.href.split('/');
        const id = pathArr[pathArr.length - 1];
        const token = sessionStorage.getItem('admin-dream-token');

        fetch(`${process.env["REACT_APP_API_URL"]}productModel/${id}`, {
            headers: {
                "Authorization": token,
            },
        })
            .then(res => res.json())
            .then(data => setProductData(data));
    }, []);

    useEffect(() => {
        if (productData) {
            setAmount(productData?.in_stock);
            setMetaTitle(productData?.meta_title);
            setMetaDescription(productData?.meta_description);

            setHideProduct(!productData?.isVisible);
            setHidePayment(productData?.hidePayment);
        }
    }, [productData]);

    const saveEdits = async () => {
        const token = sessionStorage.getItem('admin-dream-token');

        await axios.patch(`${process.env["REACT_APP_API_URL"]}productModel/${productData?.id}`, JSON.stringify({
            meta_title: metaTitle ?? "",
            meta_description: metaDescription ?? "",
            in_stock: Number(amount),
            isVisible: !hideProduct,
            hidePayment: hidePayment,
        }), { headers: { 'Authorization': 'Bearer '+token.slice(7), 'Content-Type': 'application/json' } });
    }

    const generalContent = (
        <div className={`${DEFAULT_CLASSNAME}_general`}>
            <div className={`${DEFAULT_CLASSNAME}_general_title`}>{productData?.name}</div>
            <div className={`${DEFAULT_CLASSNAME}_general_product_info`}>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_title`}>Информация о товаре</div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <input checked={newIn} onChange={(e) => setNewIn(!newIn)} style={{ width: '40px' }} type={'checkbox'}/> <label>Новое поступление</label>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <input checked={leaders} onChange={(e) => setLeaders(!leaders)} style={{ width: '40px' }} type={'checkbox'}/> <label>Лидер продаж</label>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <input checked={specialOffer} onChange={(e) => setSpecialOffer(!specialOffer)} style={{ width: '40px' }} type={'checkbox'}/> <label>Специальное предложение</label>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <input checked={hidePayment} onChange={(e) => setHidePayment(!hidePayment)} style={{ width: '40px' }} type={'checkbox'}/> <label>Скрыть метод оплаты</label>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label style={{ width: '80px' }}>Кол-во:</label><input type={'text'} value={amount} onChange={(e) => setAmount(e.currentTarget.value)}/>
                </div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_general_product_info`}>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_title`}>Информация для магазина</div>
                <div className={`${DEFAULT_CLASSNAME}_metadata`}>
                    <div className={`${DEFAULT_CLASSNAME}_metadata_item`}>
                        <div className={`${DEFAULT_CLASSNAME}_general_product_info_title`}>Title</div>
                        <textarea value={metaTitle} onChange={(e) => setMetaTitle(e.currentTarget.value)} rows={6} placeholder={"Введите заголовок..."}></textarea>
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_metadata_item`}>
                        <div className={`${DEFAULT_CLASSNAME}_general_product_info_title`}>Description</div>
                        <textarea rows={10} value={metaDescription} onChange={(e) => setMetaDescription(e.currentTarget.value)} placeholder={"Введите краткое описание товара..."}></textarea>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
            <div className={DEFAULT_CLASSNAME}>
                {generalContent}
                <div className={`${DEFAULT_CLASSNAME}_buttons`}>
                    <div className={`${DEFAULT_CLASSNAME}_buttons_hide`}><input checked={hideProduct} onChange={() => setHideProduct(!hideProduct)} type={"checkbox"}/>Скрыть</div>
                    <input onClick={() => saveEdits()} type={"button"} className={`${DEFAULT_CLASSNAME}_save-item`} value={"Сохранить товар"} />
                </div>
            </div>
        </div>
    )
}

export default React.memo(EditChildItem);
