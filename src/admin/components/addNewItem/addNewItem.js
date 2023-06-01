import * as React from 'react';

import './addNewItem.scss';

import addImage from './assets/addImage.svg';
import addColor from './assets/addColor.svg';
import addMemory from './assets/addMemory.svg';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {ItemDescription} from "./item_description/itemDescription";
import {TechnicalSpecs} from "./technical_specs/technicalSpecs";
import {ItemServices} from "./item_services/itemServices";

const DEFAULT_CLASSNAME = 'add-new-item';

export const CARD_TEXT_POSITIONS = {
    "RIGHT": "LEFT",
    "LEFT": "RIGHT",
}

const EditMainPhoto = ({ productId, setEditMainPhoto}) => {
    const [newImage, setNewImage] = useState(null);

    const saveNewMainPhoto = (productId, setEditMainPhoto) => {
        if (!!newImage) {
            const data = new FormData();
            data.append("prod_photo", newImage)

            fetch(`${process.env["REACT_APP_API_URL"]}product/${productId}`, {
                method: "PATCH",
                body: data,
            })
              .finally(() => {
                  setEditMainPhoto(false);
                  toast.info("Главное фото обновлено")
              });
        }
    }

    return (
      <div className={`${DEFAULT_CLASSNAME}_main_photo`}>
          <img src={newImage ? URL.createObjectURL(newImage) : addImage} />
          <input type={"file"} onChange={(e) => setNewImage(e.target.files[0])} />
          <div onClick={() => saveNewMainPhoto(productId, setEditMainPhoto)}>Сохранить</div>
      </div>
    )
}

export const AddNewItem = ({ isEditMode }) => {
    const token = sessionStorage.getItem('admin-dream-token');
    const navigate = useNavigate();

    const userRole = sessionStorage.getItem('user-role');

    useEffect(() => {
        if (userRole !== "admin") {
            navigate('/admin/auth');
        }
    }, [userRole])

    const [activeMenuItem, setActiveMenuItem] = useState("Описание");

    const [currentProduct, setCurrentProduct] = useState(null);

    useEffect(() => {
        fetch(`${process.env["REACT_APP_API_URL"]}category`)
            .then(res => res.json())
            .then(data => setCategories(data));

        fetch(`${process.env["REACT_APP_API_URL"]}subcategory`)
            .then(res => res.json())
            .then(data => setSubcategories(data));

        fetch(`${process.env["REACT_APP_API_URL"]}manufacturer`)
            .then(res => res.json())
            .then(data => setManufacturers(data));

        if (isEditMode) {
            const pathArr = window.location.href.split('/');
            const id = pathArr[pathArr.length - 1];
            fetch(`${process.env["REACT_APP_API_URL"]}product/${id}?f='1234'`)
                .then(res => res.json())
                .then(data => setCurrentProduct(data));
        }
    }, [])

    const [currentProductId, setCurrentProductId] = useState(null);

    const [dataUpdated, setDataUpdated] = useState(1);

    const [productUpdated, setProductUpdated] = useState(1);

    const [manufacturers, setManufacturers] = useState([]);

    // meta description
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");

    useEffect(() => {
        if (isEditMode) {
            const pathArr = window.location.href.split('/');
            const id = pathArr[pathArr.length - 1];
            setTimeout(() => {
                fetch(`${process.env["REACT_APP_API_URL"]}product/${id}?f='1234'`)
                    .then(res => res.json())
                    .then(data => {
                        let currentPhotosToSet = [];
                        const itemColorPhotos = data?.colors.find(item => item.link === data.product.link_name);
                        if (itemColorPhotos) {
                            currentPhotosToSet = {
                                ...itemColorPhotos,
                                img_path: itemColorPhotos.img_path.filter(Boolean),
                            }
                            setCurrentPhotos(currentPhotosToSet)
                        } else {
                            data.product.colors.map(item => {
                                if (!!item.img_path) {
                                    currentPhotosToSet.push(item);
                                }
                            })
                            setCurrentPhotos(currentPhotosToSet);
                        }
                        setCurrentProduct(() => data)
                    })
                    .finally(() => setProductUpdated(productUpdated + 1))
            }, 100);
        }
    }, [dataUpdated]);

    useEffect(() => {
        if (!!manufacturers.length && currentProduct) {
            const manufacturerName = manufacturers?.find(item => item.id === currentProduct.product.manufacturerId)?.name;

            setCurrentProductId(currentProduct?.product.id);
            setNewItemTitle(currentProduct?.product.name);
            setColors(currentProduct?.colors);
            setEditColors(currentProduct?.product.colors);
            setMemories(currentProduct?.product.Memory);
            setPrice(currentProduct?.product.price);
            setInStock(currentProduct?.product.in_stock);
            setUSDCurrency(!Boolean(currentProduct?.product.currency === "BYN"));
            setCurrentManufacturer(manufacturerName);
            setSelectedCategory(currentProduct?.product.categoryId);
            setServices(currentProduct?.product.services);
            setNewServices(currentProduct?.product.ServicePrice);
            setCurrentPhoto(currentProduct?.product.img_path);
            setLinkName(currentProduct?.product.link_name);
            setHidePayment(currentProduct?.product?.hidePayment);
            setPopularItems(currentProduct?.product?.popular.map(item => item.link_name));
            setMetaDescription(currentProduct?.product?.meta_description ?? "");
            setMetaTitle(currentProduct?.product?.meta_title ?? "");

            setItemSpecs(currentProduct?.characts);

            const sortedItemDescriptions = currentProduct?.product.Information.sort((a, b) => a.priority - b.priority);

            setItemDescriptions(sortedItemDescriptions)
            setDescriptionPhotos(currentProduct?.product.Information.map(item => item.img_path))

            const productSubcategoryName = currentProduct?.product?.subcategory?.name;

            const productSubcategory = subcategories?.find(item => item?.name === productSubcategoryName);

            if (productSubcategory && productSubcategoryName) {
                setCurrentSelectedSubcategory(productSubcategoryName)
            } else if (productSubcategoryName) {
                setCurrentSubcategory(productSubcategoryName)
            }

            setNewIn(currentProduct?.product?.stickers.find(item => item.name === "Новое поступление"))
            setLeaders(currentProduct?.product?.stickers.find(item => item.name === "Лидер продаж"))
            setSpecialOffer(currentProduct?.product?.stickers.find(item => item.name === "Специальное предложение"))
        }
    }, [manufacturers, productUpdated])

    const [categories, setCategories] = useState(null);
    const [subcategories, setSubcategories] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [addNewSpecItem, setAddNewSpecItem] = useState(false);

    const [itemSpecs, setItemSpecs] = useState([]);

    const [addNewColor, setAddNewColor] = useState(false);
    const [colors, setColors] = useState([]);
    const [editColors, setEditColors] = useState([]);

    const [newColorValue, setNewColorValue] = useState("");
    const [newLink, setNewLink] = useState("");

    const [newItemTitle, setNewItemTitle] = useState("");

    const [addNewMemory, setAddNewMemory] = useState(false);
    const [memories, setMemories] = useState([]);

    const [newMemoryAmount, setNewMemoryAmount] = useState("");
    const [newMemoryCost, setNewMemoryCost] = useState("");

    const [addNewDescriptionItem, setAddNewDescriptionItem] = useState(false);
    const [itemDescriptions, setItemDescriptions] = useState([]);
    const [newItemDescriptionTitle, setNewItemDescriptionTitle] = useState("");
    const [newItemDescriptionText, setNewItemDescriptionText] = useState("");

    const [price, setPrice] = useState('');

    const [in_stock, setInStock] = useState(0);
    const [USDCurrency, setUSDCurrency] = useState(false);
    const [emptyStock, setEmptyStock] = useState(false);

    const [newIn, setNewIn] = useState(false);
    const [leaders, setLeaders] = useState(false);
    const [specialOffer, setSpecialOffer] = useState(false);

    const [currentManufacturer, setCurrentManufacturer] = useState(null);
    const [newManufacturer, setNewManufacturer] = useState("");

    const currentImagePreview = currentProduct?.product.img_path || null;

    const [services, setServices] = useState([]);
    const [newServices, setNewServices] = useState([]);
    const [newService, setNewService] = useState(false);

    const [newServiceName, setNewServiceName] = useState("");
    const [newServicePrice, setNewServicePrice] = useState("");

    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [currentPhotos, setCurrentPhotos] = useState([]);

    const [newCardThere, setNewCardThere] = useState("BLUE");
    const [newCardTextPosition, setNewCardTextPosition] = useState("RIGHT");
    const [newCardPriority, setNewCardPriority] = useState(null);

    const [isAddPhotoInEdit, setIsAddPhotoInEdit] = useState(false);

    const [editItem, setEditItem] = useState(null);

    const [linkName, setLinkName] = useState("");

    const [hidePayment, setHidePayment] = useState(false);

    const [newPopularItem, setNewPopularItem] = useState("");
    const [popularItems, setPopularItems] = useState([]);

    const saveNewDescriptionItem = (event, setItemEditDescription = () => {}) => {
        event.preventDefault();

        let color, color_text, pic_pos;

        if (newCardThere === "WHITE") {
            color = "#FFFFFF";
            color_text = "#434343"
        } else {
            color = "#0B3FC5";
            color_text = "#FFFFFF"
        }

        pic_pos = newCardTextPosition === "RIGHT" ? "left" : "right";

        if (isEditMode) {
            const data = new FormData();

            data.append('prodId', currentProductId);
            data.append('color', color);
            data.append('color_text', color_text);
            data.append('text', newItemDescriptionText);
            data.append('title', newItemDescriptionTitle);
            data.append('file', currentDescriptionPhotoForEdit);
            data.append('pic_pos', pic_pos);
            data.append('priority', Number(newCardPriority) || itemDescriptions.length + 1);

            fetch(`${process.env["REACT_APP_API_URL"]}information`, {
                method: "POST",
                headers: {
                    "Authorization": token,
                },
                body: data,
            })
                .finally(() => {
                    toast.info("Карточка добавлена!");
                    setDataUpdated((data) => data + 1);
                })
        }

        setDescriptionPhotos((descriptionPhotos) => [...descriptionPhotos, currentDescriptionPhoto]);
        setCurrentDescriptionPhoto(null);
        setCurrentDescriptionPhotoForEdit(null);
        setEditItem(null);
        setItemEditDescription(null)
        setNewCardPriority(null)

        if (newItemDescriptionText?.trim().length && newItemDescriptionTitle?.trim().length) {
            setItemDescriptions([...itemDescriptions, {
                title: newItemDescriptionTitle,
                text: newItemDescriptionText,
                color,
                color_text,
                pic_pos,
                priority: newCardPriority,
            }])

            setNewCardPriority(null);
            setNewItemDescriptionTitle("");
            setNewItemDescriptionText("");
            setNewCardThere("BLUE");
            setNewCardTextPosition("RIGHT");
            setAddNewDescriptionItem(false)
        }
    }

    const saveNewDescriptionItemEditMode = (event, itemId, callback) => {
        event.preventDefault();

        let dataToPost;

        let color, color_text, pic_pos;

        if (newCardThere === "WHITE") {
            color = "#FFFFFF";
            color_text = "#434343"
        } else {
            color = "#0B3FC5";
            color_text = "#FFFFFF"
        }

        pic_pos = newCardTextPosition === "RIGHT" ? "left" : "right";

        if (currentDescriptionPhotoForEdit) {
            dataToPost = new FormData();

            dataToPost.append('color', color);
            dataToPost.append('color_text', color_text);
            dataToPost.append('text', newItemDescriptionText);
            dataToPost.append('title', newItemDescriptionTitle);
            dataToPost.append('file', currentDescriptionPhotoForEdit);
            dataToPost.append('pic_pos', pic_pos);
            dataToPost.append('priority', Number(newCardPriority));
        } else {
            dataToPost = JSON.stringify({
                title: newItemDescriptionTitle,
                text: newItemDescriptionText,
                color,
                color_text,
                pic_pos,
                priority: Number(newCardPriority),
            });
        }

        const headers = currentDescriptionPhotoForEdit ? {
                "Authorization": token
            } : {
            "Authorization": token,
            "Content-Type": "application/json",
        }

        fetch(`${process.env["REACT_APP_API_URL"]}information/${itemId}`, {
            method: "PATCH",
            headers,
            body: dataToPost,
        })
            .finally(() => {
                toast("Карточка отредактирована!")
                setDataUpdated((data) => data + 1);
            })

        setNewItemDescriptionTitle("");
        setNewItemDescriptionText("");
        setNewCardThere("BLUE");
        setNewCardTextPosition("RIGHT");
        setCurrentDescriptionPhotoForEdit(null);
        setNewCardPriority(null)
        callback(null);
    }

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [descriptionPhotos, setDescriptionPhotos] = useState([]);
    const [currentDescriptionPhoto, setCurrentDescriptionPhoto] = useState(null);
    const [currentDescriptionPhotoForEdit, setCurrentDescriptionPhotoForEdit] = useState(null);

    const handleUploadFiles = files => {
        const uploaded = [...uploadedFiles];

        files.some(file => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
            }

            setUploadedFiles(uploaded);
        })
    }

    const handleFileEvent = (e) => {

        const chosenFiles = Array.prototype.slice.call(e.target.files);
        handleUploadFiles(chosenFiles);

        const uploadedFile = e.target.files[e.target.files.length - 1];

        if (isEditMode) {
            const currentColorId = currentProduct.colors.find(item => item.link === linkName).id;

            const data = new FormData();

            data.append('file', uploadedFile);
            data.append('colorId', currentColorId);


            fetch(`${process.env["REACT_APP_API_URL"]}image`, {
                method: "POST",
                headers: {
                    "Authorization": token,
                },
                body: data
            })
                .finally(() => {
                    toast.info("Фото загружено");
                    setDataUpdated(dataUpdated + 1);
                })
        }
    }

    const updateCharacteristics = () => {
        const token = sessionStorage.getItem('admin-dream-token');

        const formData = new FormData();
        formData.append('characteristics', JSON.stringify(itemSpecs))

        fetch(`${process.env["REACT_APP_API_URL"]}product/${currentProductId}`, {
            method: "PATCH",
            headers: {
                "Authorization": token,
            },
            body: formData
        })
            .finally(() => {
                toast.info("Характеристики обновлены");
                setDataUpdated(dataUpdated + 1);
            })
    }

    const [currentSubcategory, setCurrentSubcategory] = useState("");
    const [currentSelectedSubcategory, setCurrentSelectedSubcategory] = useState(null);


    const saveNewItem = event => {
        event.preventDefault();

        const descriptionToPost = itemDescriptions.map((item, index) => Object.assign(item, {
            filename: descriptionPhotos[index].name,
        }))

        const formData = new FormData();

        const token = sessionStorage.getItem("admin-dream-token");

        const stickersToPost = [];

        specialOffer && stickersToPost.push({name: "Специальное предложение"});
        newIn && stickersToPost.push({name: "Новое поступление"});
        leaders && stickersToPost.push({name: "Лидер продаж"});

        const colorsToPost = colors.map(item => ({
            color: item.color,
            color_code: item.color_code,
            link: item.link,
        }))

        const memoryToPost = memories.map(item => ({
            size: item.amount,
            price: item.cost,
        }))

        if (!!descriptionToPost.length) {
            for (let i = 0, len = descriptionPhotos.length; i < len; i++) {
                formData.append('inform_photo', descriptionPhotos[i], descriptionPhotos[i].name);
            }

            formData.append('information', JSON.stringify(descriptionToPost));
        }

        if (!isEditMode) {
            if (uploadedFiles.length > 1) {
                formData.append('prod_photo', uploadedFiles[0]);

                for (let i = 1, len = uploadedFiles.length; i < len; i++) {
                    formData.append(`color_photo`, uploadedFiles[i], uploadedFiles[i].name);
                }
            } else {
                formData.append("prod_photo", uploadedFiles[0]);
            }
        }

        const popularItemsToSet = popularItems.map(item => ({
            link_name: item,
        }))

        formData.append('name', newItemTitle);
        formData.append('colors', JSON.stringify(colorsToPost));
        formData.append('currency', USDCurrency ? "USD" : "BYN");
        formData.append('in_stock', Number(in_stock));
        formData.append('hidePayment', JSON.stringify(hidePayment));
        formData.append('popular', JSON.stringify(popularItemsToSet));

        if (!!newManufacturer?.trim().length || !!currentManufacturer?.trim().length) {
            formData.append('manufacturer', newManufacturer?.trim().length ? newManufacturer : currentManufacturer);
        }

        if (metaTitle.trim().length) {
            formData.append('meta_title', metaTitle);
        } else {
            formData.append('meta_title', newItemTitle);
        }

        if (metaDescription.trim().length) {
            formData.append('meta_description', metaDescription);
        } else {
            formData.append('meta_description', newItemTitle);
        }

        formData.append('price', Number(price));
        formData.append('year', 2022);
        formData.append('memory', JSON.stringify(memoryToPost));
        formData.append('categoryId', selectedCategory);
        formData.append('raiting', 10);
        formData.append('characteristics', JSON.stringify(itemSpecs))
        formData.append('services', JSON.stringify(services));
        formData.append('stickers', JSON.stringify(stickersToPost));

        if (linkName.trim().length > 0) {
            formData.append('link_name', linkName);
        }

        if (currentSubcategory?.trim().length > 0) {
            formData.append('subcategory', currentSubcategory);
        } else if (!!currentSelectedSubcategory) {
            formData.append('subcategory', currentSelectedSubcategory)
        }

        if (isEditMode) {
            const formEditData = new FormData();

            const popularItemsToSet = popularItems.map(item => ({
                link_name: item,
            }))

            formEditData.append('name', newItemTitle);
            formEditData.append('currency', USDCurrency ? "USD" : "BYN");
            formEditData.append('in_stock', Number(in_stock));
            formEditData.append('manufacturer', newManufacturer?.trim().length ? newManufacturer : currentManufacturer);
            formEditData.append('price', Number(price));
            formEditData.append('memory', JSON.stringify(memoryToPost));
            formEditData.append('categoryId', selectedCategory);
            formEditData.append('stickers', JSON.stringify(stickersToPost));
            formEditData.append('popular', JSON.stringify(popularItemsToSet));
            formEditData.append('hidePayment', hidePayment);

            let editRequest = new Request(`${process.env["REACT_APP_API_URL"]}product/${currentProductId}`, {
                body: formEditData,
                headers: {
                    'Authorization': token,
                },
                method: "PATCH",
            })

            fetch(editRequest)
                .finally(() => {
                    toast.info("Продукт отредактирован!");
                })
        } else {
            let request = new Request(`${process.env["REACT_APP_API_URL"]}product`, {
                body: formData,
                headers: {
                    "Authorization": token,
                },
                mode: 'no-cors',
                method: 'POST',
            });
            fetch(request)
                .finally(() => {
                    toast.info("Товар создан!")
                    navigate('/admin/products')
                })
        }
    }

    const saveEdits = () => {
        const formEditData = new FormData();

        const stickersToPost = [];

        specialOffer && stickersToPost.push({ name: "Специальное предложение" });
        newIn && stickersToPost.push({ name: "Новое поступление" });
        leaders && stickersToPost.push({ name: "Лидер продаж" });

        const popularItemsToSet = popularItems.map(item => ({
            link_name: item,
        }))

        formEditData.append('name', newItemTitle);
        formEditData.append('currency', USDCurrency ? "USD" : "BYN");
        formEditData.append('in_stock', Number(in_stock));
        formEditData.append('manufacturer', newManufacturer?.trim().length ? newManufacturer : currentManufacturer);
        formEditData.append('price', Number(price));
        formEditData.append('categoryId', selectedCategory);
        formEditData.append('stickers', JSON.stringify(stickersToPost));
        formEditData.append('link_name', linkName);
        formEditData.append('hidePayment', hidePayment);
        formEditData.append('popular', JSON.stringify(popularItemsToSet));
        formEditData.append('meta_title', metaTitle.trim().length ? metaTitle : newItemTitle);
        formEditData.append('meta_description', metaDescription);

        if (!!currentSubcategory && currentSubcategory?.trim().length > 0) {
            formEditData.append('subcategory', currentSubcategory);
        } else if (!!currentSelectedSubcategory) {
            formEditData.append('subcategory', currentSelectedSubcategory)
        }

        let editRequest = new Request(`${process.env["REACT_APP_API_URL"]}product/${currentProductId}`, {
            body: formEditData,
            headers: {
                'Authorization': token,
            },
            method: "PATCH",
        })

        fetch(editRequest)
            .finally(() => {
                toast.info("Продукт отредактирован!");
            })
    }

    const deleteColor = clr => {
        const idx = colors.findIndex(color => color.color === clr);
        setColors([...colors.slice(0, idx), ...colors.slice(idx + 1)]);
    }

    const deleteMemory = amt => {
        const idx = memories.findIndex(memory => memory.amount === amt);
        setMemories([...memories.slice(0, idx), ...memories.slice(idx + 1)])
    }

    const deleteLastPhoto = () => {
        setUploadedFiles([...uploadedFiles.slice(0, uploadedFiles.length - 1)])
    }

    const [technicalSpecs, setTechnicalSpecs] = useState([]);

    const [editMainPhoto, setEditMainPhoto] = useState(false);

    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
            <div className={DEFAULT_CLASSNAME}>

                <form onSubmit={saveNewItem}>
                    {isEditMode ? <div className={`${DEFAULT_CLASSNAME}_save-item`} onClick={() => saveEdits()}>{"Применить изменения"}</div> : <input onClick={saveNewItem} type={"button"} className={`${DEFAULT_CLASSNAME}_save-item`} value={"Сохранить товар"} />}
                    <div className={`${DEFAULT_CLASSNAME}_info`}>
                        <div className={`${DEFAULT_CLASSNAME}_info_image`}>
                            {editMainPhoto && <EditMainPhoto productId={currentProductId} setEditMainPhoto={setEditMainPhoto} />}
                            {isEditMode && <div style={{ cursor: "pointer", backgroundColor: "#0B3FC5", color: "#fff", width: "fit-content", padding: '4px 8px', borderRadius: '8px'}} onClick={() => setIsAddPhotoInEdit(!isAddPhotoInEdit)}>Загрузка фото: {isAddPhotoInEdit ? "Да" : "Нет"}</div>}
                            {/*<div className={`${DEFAULT_CLASSNAME}_info_image_delete`} onClick={() => deleteLastPhoto()}>{"Удалить последнее фото"}</div>*/}
                            <div className={`${DEFAULT_CLASSNAME}_main_image_edit`} onClick={() => setEditMainPhoto(true)}>{"Изменить главное фото"}</div>
                            {(!isEditMode || (isEditMode && isAddPhotoInEdit)) && <input multiple onChange={handleFileEvent} name={"main-image"} type={"file"} />}
                            {isEditMode && <img src={currentPhoto?.includes('http') ? currentPhoto : `http://194.62.19.52:7000/${currentPhoto}`} />}
                            {!isEditMode && <img src={uploadedFiles.length ? URL.createObjectURL(uploadedFiles[0]) : currentImagePreview ? currentImagePreview.includes('htpp') ? currentImagePreview : `http://194.62.19.52:7000/${currentImagePreview}` : addImage} alt={''} />}
                            {!isEditMode && <div className={`${DEFAULT_CLASSNAME}_info_uploadedImages`}>
                                {!!uploadedFiles && uploadedFiles?.map((item, idx) => {
                                    if (idx === 0) return
                                    return (
                                      <img key={idx.toString()} alt={'image'} src={URL.createObjectURL(item)}/>
                                    )
                                })}
                            </div>}
                            {isEditMode && currentPhotos && <div className={`${DEFAULT_CLASSNAME}_info_uploadedImages`}>
                                {Array.isArray(currentPhotos) ? currentPhotos.map((item, idx) => {
                                        return !!item && <img key={item.img_path.toString()} alt={'image'} src={item.img_path} onClick={() => {
                                            console.log(item);

                                            fetch(`${process.env["REACT_APP_API_URL"]}image/${item.id}`, {
                                                method: "DELETE",
                                                headers: {
                                                    'Authorization': token,
                                                }
                                            }).finally(() => setDataUpdated(dataUpdated + 1))
                                        }}/>
                                    }) : !!currentPhotos?.img_path?.filter(Boolean).length && currentPhotos.img_path.map(item => {
                                        return <img key={item.toString()} alt={'image'} src={item} onClick={() => {
                                            fetch(`${process.env["REACT_APP_API_URL"]}image/?img_path=${item}`, {
                                                method: "DELETE",
                                                headers: {
                                                    'Authorization': token,
                                                }
                                            }).finally(() => setDataUpdated(dataUpdated + 1))
                                        }}/>
                                    }
                                )}
                            </div>}
                        </div>
                        <div className={`${DEFAULT_CLASSNAME}_info_specs`}>
                            <input className={`${DEFAULT_CLASSNAME}_info_specs_title`} value={newItemTitle} onChange={(e) => setNewItemTitle(e.currentTarget.value)} type={"text"} placeholder={"Введите название..."} />

                            <input style={{ margin: "12px 0"}} className={`${DEFAULT_CLASSNAME}_info_specs_manufacturer`} value={linkName} onChange={(e) => setLinkName(e.currentTarget.value)} placeholder={"Введите ссылку-имя товара"} />

                            <input className={`${DEFAULT_CLASSNAME}_info_specs_manufacturer`} value={newManufacturer} onChange={(e) => setNewManufacturer(e.currentTarget.value)} type={"text"} placeholder={"Введите производителя или выберите из списка"}/>
                            <div className={`${DEFAULT_CLASSNAME}_manufacturer`}>
                                <select onChange={(e) => setCurrentManufacturer(e.currentTarget.value)}>
                                    {manufacturers.map(item => {
                                        return (
                                            <option key={item.toString()} selected={item.name === currentManufacturer} value={item.name}>{item.name}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className={`${DEFAULT_CLASSNAME}_price`}>
                                <div>
                                    <label>Цена</label>
                                    <input className={'admin-input'} placeholder={'Введите цену товара'} value={price} onChange={(e) => setPrice(e.currentTarget.value)} type={"text"} />
                                </div>
                                <div className={`${DEFAULT_CLASSNAME}_price_currency`}>
                                    <input checked={USDCurrency} onChange={() => setUSDCurrency(!USDCurrency)} type={"checkbox"} />
                                    <label>$</label>
                                </div>
                            </div>

                            <div className={`${DEFAULT_CLASSNAME}_info_specs_item`}>
                                <label>{"Ссылка / Цвет"}</label>
                                <div style={{ display: "flex", flexDirection: "row"}} className={`${DEFAULT_CLASSNAME}_info_specs_item_colors`}>
                                    {colors?.map(color => <div key={color.toString()} onClick={isEditMode ? () => {
                                        const deleteColorId = editColors.find(col => col.color_code === color.color_code).id

                                        fetch(`${process.env["REACT_APP_API_URL"]}color/${deleteColorId}`, {
                                            method: "DELETE",
                                            headers: {
                                                'Authorization': token,
                                            }
                                        }).finally(() => {
                                            toast.info("Цвет удален")
                                            setTimeout(() => setDataUpdated(dataUpdated + 1), 500)
                                        })
                                    } : () => deleteColor(color.color)} style={{ margin: "0 4px", width: "32px", height: "32px", borderRadius: "50px", background: color.color_code}}></div>)}
                                    <img onClick={() => setAddNewColor(true)} src={addColor} alt={''} />
                                </div>
                                    {addNewColor && <><input
                                        placeholder={"Цвет: #123456"}
                                        onChange={(e) => setNewColorValue(e.currentTarget.value)}
                                        type={"text"} value={newColorValue}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                if (newColorValue?.trim().length) {

                                                    if (isEditMode) {
                                                        const formData = new FormData();

                                                        formData.append('prodId', currentProductId);
                                                        formData.append('color', "edit_color_name");
                                                        formData.append('color_code', newColorValue);

                                                        fetch(`${process.env["REACT_APP_API_URL"]}color`, {
                                                            method: "POST",
                                                            headers: {
                                                                'Authorization': token,
                                                                'Content-Type': "application/json",
                                                            },
                                                            body: JSON.stringify({
                                                                prodId: currentProductId,
                                                                color: "edit_color_name",
                                                                color_code: newColorValue
                                                            }),
                                                        }).finally(() => {
                                                            toast("Цвет добавлен");
                                                            setDataUpdated(data => data + 1);
                                                        })
                                                    } else {
                                                        setColors([...colors, {color: "", color_code: newColorValue, link: newLink?.trim().length ? newLink : ""}]);
                                                    }

                                                    setNewColorValue("");
                                                    setNewLink("");
                                                    setAddNewColor(false);
                                                }
                                            }
                                        }
                                    }/>
                                    <input
                                        placeholder={"Ссылка на товар"}
                                        value={newLink}
                                        onChange={(e) => setNewLink(e.currentTarget.value)}
                                        type={"text"}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();

                                                if (isEditMode) {
                                                    fetch(`${process.env["REACT_APP_API_URL"]}color`, {
                                                        method: "POST",
                                                        headers: {
                                                            'Authorization': token,
                                                            'Content-Type': "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            prodId: currentProductId,
                                                            color: "edit_color_name",
                                                            color_code: newColorValue,
                                                            link: newLink
                                                        }),
                                                    }).finally(() => {
                                                        toast("Цвет добавлен");
                                                        setDataUpdated(data => data + 1);
                                                    })
                                                } else if (newColorValue?.trim().length && newLink?.trim().length) {
                                                    setColors([...colors, {color: "", color_code: newColorValue, link: newLink?.trim().length ? newLink : ""}]);
                                                }

                                                setNewColorValue("");
                                                setNewLink("");
                                                setAddNewColor(false);
                                            }
                                        }
                                    }/>
                                </>}
                            </div>

                            <div className={`${DEFAULT_CLASSNAME}_info_specs_item`}>
                                <label>{"Объем встроенной памяти"}</label>
                                <div style={{ display: "flex", flexDirection: "row"}} className={`${DEFAULT_CLASSNAME}_info_specs_item_colors`}>
                                    {memories?.map(memory => <div key={memory.toString()} onClick={() => {
                                        if (isEditMode) {
                                            fetch(`${process.env["REACT_APP_API_URL"]}memory/${memory.id}`, {
                                                method: "DELETE",
                                                headers: {
                                                    "Authorization": token,
                                                },
                                            })
                                        }

                                        deleteMemory(memory.amount)
                                    }} style={{ fontSize: '12px', textAlign: "center", lineHeight: "32px", color: "#FFF", margin: "0 4px", width: "56px", height: "32px", borderRadius: "50px", background: "#ccc"}}>{memory.size ? memory.size : memory.amount}</div>)}
                                    <img onClick={() => setAddNewMemory(true)} src={addMemory} alt={''} />
                                </div>
                                {addNewMemory && <> <input placeholder={"Объем памяти"} value={newMemoryAmount} onChange={(e) => setNewMemoryAmount(e.currentTarget.value)} type={"text"} alt={'memory-text'} />
                                <input onKeyDown={(e) => {
                                    if (e.key === "Enter") {

                                        if (isEditMode) {
                                            fetch(`${process.env["REACT_APP_API_URL"]}memory`, {
                                                method: "POST",
                                                headers: {
                                                    "Authorization": token,
                                                    "Content-Type": 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    size: newMemoryAmount.toString(),
                                                    price: +newMemoryCost,
                                                    prodId: currentProductId.toString(),
                                                }),
                                            })
                                                .finally(() => {
                                                    toast('Память добавлена');
                                                    setDataUpdated(data => data + 1);
                                                })
                                        } else {
                                            setMemories([...memories, {
                                                amount: newMemoryAmount,
                                                cost: newMemoryCost,
                                            }]);
                                        }

                                        setNewMemoryCost("");
                                        setNewMemoryAmount("");
                                        setAddNewMemory(false)
                                    }
                                }} placeholder={"Цена..."} value={newMemoryCost} onChange={(e) => setNewMemoryCost(e.currentTarget.value)} className={`memory_price`} type={"text"} alt={'memory-text'} /> </>}

                            </div>

                            <select style={{ marginTop: '32px'}} placeholder={"Категория"} onChange={(e) => setSelectedCategory(e.currentTarget.value)}>
                                <option>{"Категория"}</option>
                                {categories?.map(item => (
                                    <option key={item.id.toString()} selected={item.id === selectedCategory} value={item.id}>{item.categoryName}</option>
                                ))}
                            </select>

                            <div className={`${DEFAULT_CLASSNAME}_info_subcategory`}>
                                <label>Введите подкатегорию товара</label>
                                <input placeholder={"Подкатегория..."} type={'text'} onChange={(e) => setCurrentSubcategory(e.currentTarget.value)} value={currentSubcategory} />
                                <select onChange={(e) => e.currentTarget.value === "Подкатегория" ? setCurrentSelectedSubcategory( null) : setCurrentSelectedSubcategory(e.currentTarget.value)}>
                                    <option value={null} defaultChecked={true}>{"Подкатегория"}</option>
                                    {subcategories?.map(item => (
                                        <option key={item.name.toString()} selected={item.name === currentSelectedSubcategory} value={item.name}>{item.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={`${DEFAULT_CLASSNAME}_info_specs_categories`}>
                                <div>
                                    <input checked={newIn} onChange={() => setNewIn(!newIn)} type={"checkbox"} />
                                    <label>{"Новое поступление"}</label>
                                </div>
                                <div>
                                    <input checked={leaders} onChange={() => setLeaders(!leaders)} type={"checkbox"} />
                                    <label>{"Лидер продаж"}</label>
                                </div>
                                <div>
                                    <input checked={specialOffer} onChange={() => setSpecialOffer(!specialOffer)} type={"checkbox"} />
                                    <label>{"Специальное предложение"}</label>
                                </div>
                                <div>
                                    <input checked={hidePayment} onChange={() => setHidePayment(!hidePayment)} type={"checkbox"} />
                                    <label style={{ fontWeight: "500" }}>{"Скрыть метод оплаты"}</label>
                                </div>
                                <div>
                                    <input checked={emptyStock} onChange={() => setEmptyStock(!emptyStock)} type={"checkbox"} />
                                    <label>{"НЕТ В НАЛИЧИИ"}</label>

                                    <input value={in_stock} onChange={(e) => setInStock(e.currentTarget.value)} type={"number"} className={'admin-input'} />
                                    <label>{"Количество товара"}</label>
                                </div>
                            </div>

                            <div style={{ width: "100%" }} className={"popular_items"}>
                                <div className={"popular_items_new"}>
                                    <input type={"text"} value={newPopularItem} onChange={(e) => setNewPopularItem(e.currentTarget.value)} placeholder={"Введите ссылку-имя товара"} />
                                    <div onClick={() => {
                                        setNewPopularItem("");
                                        if (popularItems.length < 4) {
                                            setPopularItems([newPopularItem, ...popularItems])
                                        } else {
                                            toast.info("Максимум 4 товара!");
                                        }
                                    }} className={"popular_items_new_btn"}>+</div>
                                </div>
                                {popularItems.map(item => <div onClick={() => {
                                    const deleteItemIdx = popularItems.findIndex(popItem => popItem === item);
                                    const itemsToSet = [...popularItems.slice(0, deleteItemIdx), ...popularItems.slice(deleteItemIdx + 1)];

                                    setPopularItems(itemsToSet);
                                }} key={item} className={'popular_items_item'}>{item}</div>)}
                            </div>

                            <div className={`${DEFAULT_CLASSNAME}_metaItem`}>
                                <label>Заголовок для поисковых систем</label>
                                <input style={{ display: ""}} type={"text"} value={metaTitle} onChange={(e) => setMetaTitle(e.currentTarget.value)} placeholder={"Мета тайтл"}/>
                            </div>

                            <div className={`${DEFAULT_CLASSNAME}_metaItem`}>
                                <label>Описание для поисковых систем</label>
                                <textarea rows={4} type={"text"} value={metaDescription} onChange={(e) => setMetaDescription(e.currentTarget.value)} placeholder={"Мета Описание"}/>
                            </div>
                        </div>
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_item-info`}>

                        <div className={`${DEFAULT_CLASSNAME}_item-info_title`}>{"Информация о товаре"}</div>
                        <div className={`${DEFAULT_CLASSNAME}_item-info_menu`}>
                            <div onClick={() => setActiveMenuItem("Описание")} className={`${activeMenuItem === "Описание" && "active"}`}>{"Описание"}</div>
                            <div onClick={() => setActiveMenuItem("Технические характеристики")} className={`${activeMenuItem === "Технические характеристики" && "active"}`}>{"Технические характеристики"}</div>
                            <div onClick={() => setActiveMenuItem("Услуги")} className={`${activeMenuItem === "Услуги" && "active"}`}>{"Услуги"}</div>
                        </div>

                        {activeMenuItem === "Описание" && <ItemDescription
                            newCardTextPosition={newCardTextPosition}
                            saveNewDescriptionItemEditMode={saveNewDescriptionItemEditMode}
                            editItem={editItem}
                            setEditItem={setEditItem}
                            setAddNewDescriptionItem={setAddNewDescriptionItem}
                            currentDescriptionPhoto={currentDescriptionPhoto}
                            descriptionPhotos={descriptionPhotos}
                            isEditMode={isEditMode}
                            setDataUpdated={setDataUpdated}
                            dataUpdated={dataUpdated}
                            itemDescriptions={itemDescriptions}
                            setItemDescriptions={setItemDescriptions}
                            setDescriptionPhotos={setDescriptionPhotos}
                            setCurrentDescriptionPhotoForEdit={setCurrentDescriptionPhotoForEdit}
                            saveNewDescriptionItem={saveNewDescriptionItem}
                            newItemDescriptionTitle={newItemDescriptionTitle}
                            setNewItemDescriptionTitle={setNewItemDescriptionTitle}
                            newItemDescriptionText={newItemDescriptionText}
                            addNewDescriptionItem={addNewDescriptionItem}
                            setCurrentDescriptionPhoto={setCurrentDescriptionPhoto}
                            setNewItemDescriptionText={setNewItemDescriptionText}
                            setNewCardThere={setNewCardThere}
                            newCardThere={newCardThere}
                            setNewCardTextPosition={setNewCardTextPosition}
                            newCardPriority={newCardPriority}
                            setNewCardPriority={setNewCardPriority}
                        />}

                        {activeMenuItem === "Технические характеристики" && <TechnicalSpecs
                            setItemSpecs={setItemSpecs}
                            updateCharacteristics={updateCharacteristics}
                            setAddNewSpecItem={setAddNewSpecItem}
                            isEditMode={isEditMode}
                            addNewSpecItem={addNewSpecItem}
                            itemSpecs={itemSpecs}
                            technicalSpecs={technicalSpecs}
                            setTechnicalSpecs={setTechnicalSpecs}
                        />}

                        {activeMenuItem === "Услуги" && <ItemServices
                            setNewServiceName={setNewServiceName}
                            newService={newService}
                            newServiceName={newServiceName}
                            setNewService={setNewService}
                            setNewServicePrice={setNewServicePrice}
                            setServices={setServices}
                            setDataUpdated={setDataUpdated}
                            isEditMode={isEditMode}
                            dataUpdated={dataUpdated}
                            newServices={newServices}
                            services={services}
                            currentProductId={currentProductId}
                            newServicePrice={newServicePrice}
                        />}
                    </div>
                </form>
            </div>
        </div>
    )
}