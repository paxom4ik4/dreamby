import React, {useEffect, useState} from 'react';

import './baners.scss';

import bannerUpload from './bannerUpload.png';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const DEFAULT_CLASSNAME = 'banners';

const NewBannerItem = ({ setUploadNewBannerItem }) => {
    const [newItemLink, setNewItemLink] = useState("");
    const [newItemPhoto, setNewItemPhoto] = useState(null);
    const [isAboutPage, setIsAboutPage] = useState(false);

    const uploadSliderImage = () => {
        if (!newItemPhoto) {
            return;
        }

        const formData = new FormData();

        formData.append('file', newItemPhoto);

        if (!isAboutPage) {
            formData.append('link', newItemLink);
        } else {
            formData.append('aboutPage', JSON.stringify(true));
            formData.append('link', '');
        }

        const token = sessionStorage.getItem("admin-dream-token");

        fetch(`${process.env["REACT_APP_API_URL"]}slider`, {
            method: "POST",
            headers: {
                "Authorization": token,
            },
            body: formData
        })
            .finally(() => {
                toast.info("Фото слайдера загружено");
                setUploadNewBannerItem(false);
            })
    }

    return (
        <div className={`${DEFAULT_CLASSNAME}_new-item_wrapper`}>
            <div className={`${DEFAULT_CLASSNAME}_new-item`}>
                <div onClick={() => setUploadNewBannerItem(false)} className={`${DEFAULT_CLASSNAME}_new-item_close`}>{"X"}</div>
                <div className={`${DEFAULT_CLASSNAME}_new-item_photo`}>
                    <input type={"file"} onChange={(e) => setNewItemPhoto(e.target.files[0])} />
                    <img src={newItemPhoto ? URL.createObjectURL(newItemPhoto) : bannerUpload} alt={'upload-photo'} />
                </div>

                {!isAboutPage && <input
                    className={`${DEFAULT_CLASSNAME}_new-item_link`}
                    type={'text'}
                    value={newItemLink}
                    onChange={(e) => setNewItemLink(e.currentTarget.value)}
                    placeholder={'Введите ссылку на товар'}
                />}

                <div className={`${DEFAULT_CLASSNAME}_new-item_about`}>
                    <input id={'isAboutPage'} type={"checkbox"} checked={isAboutPage} onChange={() => setIsAboutPage(!isAboutPage)} />
                    <label htmlFor={'isAboutPage'}>На страницу "О НАС"</label>
                </div>
                <div onClick={() => uploadSliderImage()} className={`${DEFAULT_CLASSNAME}_new-item_upload`}>{"Загрузить"}</div>
            </div>
        </div>
    )
}

const deleteSlide = (id, setDataChanges) => {
    const token = sessionStorage.getItem("admin-dream-token");

    fetch(`${process.env["REACT_APP_API_URL"]}slider/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token,
        },
    })
      .finally(() => {
          toast.info("Фото слайдера Удалено")
          setDataChanges((prev) => prev + 1)
      })
}

const saveSlidePriority = (id, priority, setDataChanges) => {
    fetch(`${process.env["REACT_APP_API_URL"]}slider/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            priority: priority,
        })
    }).finally(() => {
        toast.info("Приоритет обновлен");
        setDataChanges((prev) => prev + 1)
    })
}

const SlideItem = ({ setDataChanges, item }) => {
    const [priority, setPriority] = useState(Number(item?.priority));

    return (
      <div className={`${DEFAULT_CLASSNAME}_slider_item`}>
          <div className={`${DEFAULT_CLASSNAME}_slider_item_content`}>
              <div className={`${DEFAULT_CLASSNAME}_slider_item_content_priority`}>
                  <input
                    value={priority}
                    placeholder={"Введите приоритет карточки"}
                    onChange={(e) => setPriority(e.currentTarget.value)}
                    type={"number"}
                  />
                  <div onClick={() => saveSlidePriority(item.id, priority, setDataChanges)}>Сохранить приоритет</div>
              </div>
              <div onClick={() => deleteSlide(item.id, setDataChanges)}>Удалить слайд</div>
          </div>
          <img src={item.img_path} />
      </div>
    )
}

export const Banners = () => {
    const navigate = useNavigate();

    const [currentSlides, setCurrentSlides] = useState([]);

    const [uploadNewBannerItem, setUploadNewBannerItem] = useState(false);

    const userRole = sessionStorage.getItem('user-role');

    const [dataChanges, setDataChanges] = useState(1);

    useEffect(() => {
        if (userRole !== "admin") {
            navigate('/admin/auth');
        }
    }, [userRole])

    useEffect(() => {
        fetch(`${process.env["REACT_APP_API_URL"]}slider`)
            .then(res => res.json())
            .then(data => setCurrentSlides(data));
    }, [dataChanges])

    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
            {uploadNewBannerItem && <NewBannerItem setUploadNewBannerItem={setUploadNewBannerItem} />}

            <div className={DEFAULT_CLASSNAME}>
                <div className={`${DEFAULT_CLASSNAME}_nav`}>
                    <div onClick={() => navigate('/admin/products')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Товары"}</div>
                    <div onClick={() => navigate('/admin/subcategories')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Подкатегории"}</div>
                    <div onClick={() => navigate('/admin/admin-services')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Услуги"}</div>
                    <div onClick={() => navigate('/admin/banners')} className={`${DEFAULT_CLASSNAME}_nav_item`}>{"Банеры"}</div>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_item`}>
                    <div className={`${DEFAULT_CLASSNAME}_item_header`}>
                        <h2>{"Баннеры"}</h2>
                        <div onClick={() => setUploadNewBannerItem(true)}>{"Загрузить новый баннер"}</div>
                    </div>
                    <div>
                        <div className={`${DEFAULT_CLASSNAME}_content`}>
                            {currentSlides.length ? currentSlides.map(item => <SlideItem setDataChanges={setDataChanges} item={item} />) : <div>{"Банеров нет"}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}