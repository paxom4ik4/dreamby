import * as React from 'react';

import '../addNewItem/addNewItem.scss';
import './addNewService.scss';
import addImage from "../addNewItem/assets/addImage.svg";
import {useState} from "react";
import {toast} from "react-toastify";

const DEFAULT_CLASSNAME = 'add-new-item';

const token = sessionStorage.getItem('admin-dream-token');

export const AddNewService = () => {
    const [newItemTitle, setNewItemTitle] = useState("");
    const [itemDescription, setItemDescription] = useState("");

    const [uploadedFile, setUploadedFile] = useState(null);

    const saveNewService = () => {
        const data = new FormData();

        data.append("name", newItemTitle);
        data.append("description", itemDescription);
        data.append("file", uploadedFile);

        fetch(`${process.env["REACT_APP_API_URL"]}service`, {
            method: "POST",
            headers: {
                "Authorization": token,
            },
            body: data,
        })
            .finally(() => {
                toast("Услуга добавлена")
            })
    }

    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
            <div className={DEFAULT_CLASSNAME}>
                <div className={`${DEFAULT_CLASSNAME}_info`}>
                    <div className={`${DEFAULT_CLASSNAME}_info_image`}>
                        <input onChange={(e) => setUploadedFile(e.target.files[0])} name={"main-image"} type={"file"} />
                        <img src={uploadedFile ? URL.createObjectURL(uploadedFile) : addImage} alt={''} />
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_info_specs services-specs`}>
                        <input className={`${DEFAULT_CLASSNAME}_info_specs_title`} value={newItemTitle} onChange={(e) => setNewItemTitle(e.currentTarget.value)} type={"text"} placeholder={"Введите название услуги..."} />
                        <textarea rows={17} value={itemDescription} onChange={(e) => setItemDescription(e.currentTarget.value)} placeholder={"Введите описание услуги..."}></textarea>
                        <div onClick={() => saveNewService()} className={`${DEFAULT_CLASSNAME}_saveService`}>{"Сохранить услугу"}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
