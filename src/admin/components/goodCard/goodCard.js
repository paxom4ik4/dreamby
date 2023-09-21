import * as React from 'react';

import './goodCard.scss';

import close from  './close.svg';
import preview from './preview.svg';
import edit from './edit.svg';
import right from './right.svg';
import copy from './copy.png';

import gear from './gear.png';
import goodCardExample from '../../assets/goodCardExample.png';
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";

const DEFAULT_CLASSNAME = 'good-card';

export const GoodCard = ({ serviceItem, dataUpdated, setDataUpdated, id, link, imgUrl, title = "Телефон Iphone 13 Pro Max" }) => {
    const navigate = useNavigate();

    const token = sessionStorage.getItem('admin-dream-token');

    const [editMode, setEditMode] = useState(false);

    const deleteItemHandler = id => {
        fetch(`${process.env["REACT_APP_API_URL"]}product/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token,
            },
            method: "DELETE"
        })
            .finally(() => {
                toast.info("Товар удален")
                setDataUpdated(dataUpdated + 1);
            })
    }

    const editItem = (id) => {
        navigate(`/admin/add-product/${id}`);
    }

    const deleteServiceItem = id => {
        fetch(`${process.env["REACT_APP_API_URL"]}service/${id}`, {
            method: "DELETE",
        })
            .finally(() => {
                toast.info("Услуга удалена")
                setDataUpdated(dataUpdated + 1);
            })
    }

    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (editMode) {
            fetch(`http://194.62.19.52:7001/api/product/${id}?f=1234`)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setSelectedProduct(data.product.ProductModel)
                });
        }

    }, [editMode]);

    if (editMode && selectedProduct) {
        return (
            <>
            <div className={DEFAULT_CLASSNAME}>
                <div className={`${DEFAULT_CLASSNAME}_left`}>
                    {imgUrl && <img className={`${DEFAULT_CLASSNAME}_image`} src={imgUrl?.includes('http') ? imgUrl : `http://194.62.19.52:7000/${imgUrl}`} alt={'good-card-image'} />}
                    <div className={`${DEFAULT_CLASSNAME}_title`}>{title}</div>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_btns`}>
                    {serviceItem ? <div className={`${DEFAULT_CLASSNAME}_config`} style={{ fontWeight: "700"}} onClick={() => deleteServiceItem(id)}>{"Удалить"}</div> : <div className={`${DEFAULT_CLASSNAME}_config`}>
                        {editMode
                            ? <div className={`${DEFAULT_CLASSNAME}_btn`}>
                                <img src={close} onClick={() => deleteItemHandler(id)}
                                     className={`${DEFAULT_CLASSNAME}_btn_item red`}/>

                                <img src={edit} onClick={() => editItem(id)} className={`${DEFAULT_CLASSNAME}_btn_item white`}/>

                                <img src={right} onClick={() => setEditMode(!editMode)}
                                     className={`${DEFAULT_CLASSNAME}_btn_item close-btn`}/>
                            </div>
                            : <img onClick={() => setEditMode(!editMode)} src={gear} alt={'config'}/>
                        }
                    </div>}
                </div>
            </div>
            {selectedProduct.map(product => (
                <div className={DEFAULT_CLASSNAME}>
                    <div className={`${DEFAULT_CLASSNAME}_left`}>
                        <img className={`${DEFAULT_CLASSNAME}_image`} src={product?.img_path} alt={'good-card-image'} />
                        <div className={`${DEFAULT_CLASSNAME}_title`}>{product.name}</div>
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_btns`}>
                        {serviceItem ? <div className={`${DEFAULT_CLASSNAME}_config`} style={{ fontWeight: "700"}} onClick={() => deleteServiceItem(id)}>{"Удалить"}</div> : <div className={`${DEFAULT_CLASSNAME}_config`}>
                            {editMode
                                ? <div className={`${DEFAULT_CLASSNAME}_btn`}>
                                    <img src={edit} onClick={() => navigate(`/admin/edit-child-item/${product.id}`)} />
                                </div>
                                : <img onClick={() => setEditMode(!editMode)} src={gear} alt={'config'}/>
                            }
                        </div>}
                    </div>
                </div>
            ))}
            </>
        )
    }

    return (
        <div className={DEFAULT_CLASSNAME}>
            <div className={`${DEFAULT_CLASSNAME}_left`}>
                {imgUrl && <img className={`${DEFAULT_CLASSNAME}_image`} src={imgUrl?.includes('http') ? imgUrl : `http://194.62.19.52:7000/${imgUrl}`} alt={'good-card-image'} />}
                <div className={`${DEFAULT_CLASSNAME}_title`}>{title}</div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_btns`}>
                {serviceItem ? <div className={`${DEFAULT_CLASSNAME}_config`} style={{ fontWeight: "700"}} onClick={() => deleteServiceItem(id)}>{"Удалить"}</div> : <div className={`${DEFAULT_CLASSNAME}_config`}>
                    {editMode
                        ? <div className={`${DEFAULT_CLASSNAME}_btn`}>
                            <img src={close} onClick={() => deleteItemHandler(id)}
                                 className={`${DEFAULT_CLASSNAME}_btn_item red`}/>

                            <img src={edit} onClick={() => editItem(link)} className={`${DEFAULT_CLASSNAME}_btn_item white`}/>
                            <Link to={`/catalog/${id}`} target={"_blank"}><img src={preview} className={`${DEFAULT_CLASSNAME}_btn_item blue`}/></Link>

                            <img src={right} onClick={() => setEditMode(!editMode)}
                                 className={`${DEFAULT_CLASSNAME}_btn_item close-btn`}/>

                            <img src={edit} onClick={() => navigate(`/admin/edit-child-item/${id}`)} />
                        </div>
                        : <img onClick={() => setEditMode(!editMode)} src={gear} alt={'config'}/>
                    }
                </div>}
            </div>
        </div>
    )
}
