import * as React from 'react';

import '../addNewItem/addNewItem.scss';
import "./editSubcategory.scss";
import addImage from "../addNewItem/assets/addImage.svg";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";

const DEFAULT_CLASSNAME = 'add-new-item';

export const EditSubcategory = () => {
  const { id } = useParams();

  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryLinkName, setSubcategoryLinkName] = useState("");
  const [category, setCategory] = useState("");

  const [subcategoryDescription, setSubcategoryDescription] = useState("");
  const [subcategoryKeyWords, setSubcategoryKeyWords] = useState("");

  const [subcategoryMetaText, setSubcategoryMetaText] = useState("");
  const [subcategoryMetaTitle, setSubcategoryMetaTitle] = useState("");

  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${process.env["REACT_APP_API_URL"]}category`)
      .then(res => res.json())
      .then(data => setCategories(data));


    fetch(`${process.env["REACT_APP_API_URL"]}subcategory/${id}`)
      .then(res => res.json())
      .then(data => {
        setSubcategoryName(data.name);
        setSubcategoryLinkName(data.link_name ?? "");
        setCategory(data.categoryId);
        setSubcategoryImage(data.img_path);
        setSubcategoryDescription(data.meta_description);
        setSubcategoryKeyWords(data.meta_keyword);
        setSubcategoryMetaText(data.meta_text);
        setSubcategoryMetaTitle(data.meta_title);
      });
  }, []);

  const saveSubcategory = () => {
    const token = sessionStorage.getItem('admin-dream-token');

    const data = new FormData();

    data.append("name", subcategoryName);
    data.append("link_name", subcategoryLinkName);
    data.append("categoryId", category);
    if (uploadedFile) {
      data.append("file", uploadedFile);
    }
    data.append("meta_description", subcategoryDescription);
    data.append("meta_keyword", subcategoryKeyWords);
    data.append("meta_text", subcategoryMetaText);
    data.append("meta_title", subcategoryMetaTitle);

    fetch(`${process.env["REACT_APP_API_URL"]}subcategory/${id}`, {
      method: "PATCH",
      body: data,
      headers: {
        "Authorization": token,
      },
    })
      .finally(() => {
        toast("Подкатегорию сохранена")
      })
  }

  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_info`}>
          <div className={`${DEFAULT_CLASSNAME}_info_image`}>
            <input onChange={(e) => setUploadedFile(e.target.files[0])} name={"main-image"} type={"file"} />
            <img src={uploadedFile ? URL.createObjectURL(uploadedFile) : subcategoryImage ?? addImage} alt={''} />
          </div>
          <div className={`${DEFAULT_CLASSNAME}_info_specs services-specs`}>
            <select onChange={(e) => setCategory(e.currentTarget.value)}>
              <option>Выберите категорию</option>
              {categories.map(item => <option selected={category === item.id} value={item.id}>{item.categoryName}</option>)}
            </select>

            <input className={`${DEFAULT_CLASSNAME}_info_specs_title`} value={subcategoryName} onChange={(e) => setSubcategoryName(e.currentTarget.value)} type={"text"} placeholder={"Введите название подкатегории..."} />
            <input className={`${DEFAULT_CLASSNAME}_info_specs_title`} value={subcategoryLinkName} onChange={(e) => setSubcategoryLinkName(e.currentTarget.value)} type={"text"} placeholder={"Введите ссылку подкатегории..."} />

            <input className={`${DEFAULT_CLASSNAME}_info_specs_title`} value={subcategoryDescription} onChange={(e) => setSubcategoryDescription(e.currentTarget.value)} type={"text"} placeholder={"Введите описание для SEO..."} />
            <input className={`${DEFAULT_CLASSNAME}_info_specs_title`} value={subcategoryKeyWords} onChange={(e) => setSubcategoryKeyWords(e.currentTarget.value)} type={"text"} placeholder={"Введите ключевые слова SEO..."} />

            <input className={`${DEFAULT_CLASSNAME}_info_specs_title`} value={subcategoryMetaText} onChange={(e) => setSubcategoryMetaText(e.currentTarget.value)} type={"text"} placeholder={"Введите мета описание для подкатегории"} />
            <input className={`${DEFAULT_CLASSNAME}_info_specs_title`} value={subcategoryMetaTitle} onChange={(e) => setSubcategoryMetaTitle(e.currentTarget.value)} type={"text"} placeholder={"Введите мета заголовок для подкатегории"} />

            <div onClick={() => saveSubcategory()} className={`${DEFAULT_CLASSNAME}_saveService`}>{"Сохранить подкатегорию"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}