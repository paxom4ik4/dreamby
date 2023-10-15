import * as React from 'react';

import './addNewItem.scss';

import addImage from './assets/addImage.svg';
import addPhoto from './add-photo.svg';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {ItemDescription} from "./item_description/itemDescription";
import {TechnicalSpecs} from "./technical_specs/technicalSpecs";
import axios from "axios";
import {ItemServices} from "./item_services/itemServices";
import addIcon from "../createNewItem/add-icon.svg";

const DEFAULT_CLASSNAME = 'add-new-item';

export const CARD_TEXT_POSITIONS = {
    "RIGHT": "LEFT",
    "LEFT": "RIGHT",
}

const SECTIONS = ['Основные', 'Критерии', 'Описание', 'Характеристики', 'Услуги', 'Метаданные'];

export const AddNewItem = ({ isEditMode }) => {
    const navigate = useNavigate();

    const userRole = sessionStorage.getItem('user-role');

    useEffect(() => {
        if (userRole !== "admin") {
            navigate('/admin/auth');
        }
    }, [userRole])

    const [activeMenuItem, setActiveMenuItem] = useState("Основные");

    const [currentProduct, setCurrentProduct] = useState(null);

    const [gtin, setGtin] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem('admin-dream-token');

        fetch(`${process.env["REACT_APP_API_URL"]}category`, {
            headers: {
                "Authorization": token,
            },
        })
            .then(res => res.json())
            .then(data => setCategories(data));

        fetch(`${process.env["REACT_APP_API_URL"]}manufacturer`, {
            headers: {
                "Authorization": token,
            },
        })
            .then(res => res.json())
            .then(data => setManufacturers(data));

        if (isEditMode) {
            const token = sessionStorage.getItem('admin-dream-token');

            const pathArr = window.location.href.split('/');
            const id = pathArr[pathArr.length - 1];
            fetch(`${process.env["REACT_APP_API_URL"]}product/${id}?f=1234`, {
                headers: {
                    "Authorization": token,
                },
            })
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
                const token = sessionStorage.getItem('admin-dream-token');

                fetch(`${process.env["REACT_APP_API_URL"]}product/${id}?f=1234`, {
                    headers: {
                        "Authorization": token,
                    },
                })
                    .then(res => res.json())
                    .then(data => {
                        let currentPhotosToSet = [];
                        const itemColorPhotos = data?.colors?.find(item => item.link === data.product.link_name);
                        if (itemColorPhotos) {
                            currentPhotosToSet = {
                                ...itemColorPhotos,
                                img_path: itemColorPhotos.img_path.filter(Boolean),
                            }
                        } else {
                            data?.product?.colors?.map(item => {
                                if (!!item.img_path) {
                                    currentPhotosToSet.push(item);
                                }
                            })
                        }
                        setCurrentProduct(() => data)
                    })
                    .finally(() => setProductUpdated(productUpdated + 1))
            }, 100);
        }
    }, [dataUpdated]);

    const [categories, setCategories] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [subCategories, setSubcategories] = useState([]);
    const [allSubcategories, setAllSubcategories] = useState([]);

    const [currentSelectedSubcategory, setCurrentSelectedSubcategory] = useState(null);

    useEffect(() => {
        fetch(`${process.env["REACT_APP_API_URL"]}category/${selectedCategory}`)
            .then(res => res.json())
            .then(data => {
                setSubcategories(data?.subcats)
            });
    }, [selectedCategory]);

    useEffect(() => {
        fetch(`${process.env["REACT_APP_API_URL"]}subcategory`)
            .then(res => res.json())
            .then(data => setAllSubcategories(data));
    }, []);

    const [subSubCategories, setSubSubCategories] = useState([]);
    const [currentSubSubCategory, setCurrentSubSubCategory] = useState(null);

    useEffect(() => {
        if (!!manufacturers.length && currentProduct && allSubcategories.length && !!currentProduct) {
            const manufacturerName = manufacturers?.find(item => item.id === currentProduct.product.manufacturerId)?.name;

            setCurrentProductId(currentProduct?.product.id);
            setNewItemTitle(currentProduct?.product.name);
            setMemories(Array.isArray(currentProduct?.product.Memory) ? currentProduct?.product.Memory : [currentProduct?.product.Memory]);
            setPrice(currentProduct?.product.price);
            setInStock(currentProduct?.product.in_stock);
            setUSDCurrency(!Boolean(currentProduct?.product.currency === "BYN"));
            setCurrentManufacturer(manufacturerName);
            setSelectedCategory(currentProduct?.product.categoryId);
            setServices(currentProduct?.product.services);
            setNewServices(currentProduct?.product.ServicePrice);
            setLinkName(currentProduct?.product.link_name);
            setHidePayment(currentProduct?.product?.hidePayment);
            setPopularItems(currentProduct?.product?.popular.map(item => item.link_name));
            setMetaDescription(currentProduct?.product?.meta_description ?? "");
            setMetaTitle(currentProduct?.product?.meta_title ?? "");

            setCurrentProductColors(currentProduct?.product?.colors);

            setItemSpecs(currentProduct?.characts);

            const sortedItemDescriptions = currentProduct?.product.Information.sort((a, b) => a.priority - b.priority);

            setItemDescriptions(sortedItemDescriptions)
            setDescriptionPhotos(currentProduct?.product.Information.map(item => item.img_path))

            const productSubcategory = currentProduct?.product?.subcategory;

            if (productSubcategory?.parentId) {
                const subCategory = allSubcategories.find(item => item.id === productSubcategory.parentId)?.name;
                setCurrentSelectedSubcategory(subCategory);

                const subsubcategory = allSubcategories.find(item => item.id === productSubcategory.id)?.name;

                fetch(`${process.env["REACT_APP_API_URL"]}subcategory/${productSubcategory?.parentId}`)
                    .then(res => res.json())
                    .then(data => {
                        setCurrentSubSubCategory(subsubcategory);
                        setSubSubCategories(data?.subcats);
                    }).then(() => {
                })
            } else {
                const subCategory = allSubcategories.find(item => item.id === productSubcategory.id)?.name;
                setCurrentSelectedSubcategory(subCategory)
            }

            setNewIn(currentProduct?.product?.stickers.find(item => item.name === "Новое поступление"))
            setLeaders(currentProduct?.product?.stickers.find(item => item.name === "Лидер продаж"))
            setSpecialOffer(currentProduct?.product?.stickers.find(item => item.name === "Специальное предложение"))
        }
    }, [manufacturers, productUpdated, allSubcategories, currentProduct])

    useEffect(() => {
        if (selectedCategory) {
            fetch(`${process.env["REACT_APP_API_URL"]}subcategory/${subCategories?.find(item => item.name === currentSelectedSubcategory)?.id}`)
                .then(res => res.json())
                .then(data => {
                    setSubSubCategories(data?.subcats)
                });
        }
    }, [currentSelectedSubcategory]);


    const [addNewSpecItem, setAddNewSpecItem] = useState(false);

    const [itemSpecs, setItemSpecs] = useState([]);

    const [newColorValue, setNewColorValue] = useState("");
    const [newLink, setNewLink] = useState("");

    const [newItemTitle, setNewItemTitle] = useState("");

    const [memories, setMemories] = useState([]);

    const [newMemoryAmount, setNewMemoryAmount] = useState("");
    const [newMemoryCost, setNewMemoryCost] = useState("");
    const [newMemoryLink, setNewMemoryLink] = useState("");

    const [addNewDescriptionItem, setAddNewDescriptionItem] = useState(false);
    const [itemDescriptions, setItemDescriptions] = useState([]);
    const [newItemDescriptionTitle, setNewItemDescriptionTitle] = useState("");
    const [newItemDescriptionText, setNewItemDescriptionText] = useState("");

    const [price, setPrice] = useState('');

    const [in_stock, setInStock] = useState(0);
    const [USDCurrency, setUSDCurrency] = useState(false);

    const [newIn, setNewIn] = useState(false);
    const [leaders, setLeaders] = useState(false);
    const [specialOffer, setSpecialOffer] = useState(false);

    const [currentManufacturer, setCurrentManufacturer] = useState(null);
    const [newManufacturer, setNewManufacturer] = useState("");

    const [services, setServices] = useState([]);

    const [newCardThere, setNewCardThere] = useState("BLUE");
    const [newCardTextPosition, setNewCardTextPosition] = useState("RIGHT");
    const [newCardPriority, setNewCardPriority] = useState(null);

    const [editItem, setEditItem] = useState(null);

    const [linkName, setLinkName] = useState("");

    const [hidePayment, setHidePayment] = useState(false);

    const [newPopularItem, setNewPopularItem] = useState("");
    const [popularItems, setPopularItems] = useState([]);

    // services state
    const [newServices, setNewServices] = useState([]);
    const [newService, setNewService] = useState(false);

    const [newServiceName, setNewServiceName] = useState("");
    const [newServicePrice, setNewServicePrice] = useState("");

    const [currentColorPhotos, setCurrentColorPhotos] = useState([]);
    const [currentColors, setCurrentColors] = useState([]);
    const [currentProductColors, setCurrentProductColors] = useState([]);

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
            const token = sessionStorage.getItem('admin-dream-token');

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

        const token = sessionStorage.getItem('admin-dream-token');

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
            const token = sessionStorage.getItem('admin-dream-token');
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
        const formData = new FormData();
        formData.append('characteristics', JSON.stringify(itemSpecs))
        const token = sessionStorage.getItem('admin-dream-token');

        fetch(`${process.env["REACT_APP_API_URL"]}product/${currentProductId}?f=1234`, {
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

    const saveNewItem = event => {
        event.preventDefault();

        const descriptionToPost = itemDescriptions.map((item, index) => Object.assign(item, {
            filename: descriptionPhotos[index].name,
        }))

        const formData = new FormData();

        const stickersToPost = [];

        specialOffer && stickersToPost.push({name: "Специальное предложение"});
        newIn && stickersToPost.push({name: "Новое поступление"});
        leaders && stickersToPost.push({name: "Лидер продаж"});

        const colorsToPost = currentColors.map(item => ({
            color: item.color,
            link: item.link,
            img_names: item.img_path.map(item => item.name),
        }))

        const memoryToPost = memories.map(item => ({
            size: item.size,
            price: item.price,
            link: item.link,
        }))

        if (!!descriptionToPost.length) {
            for (let i = 0, len = descriptionPhotos.length; i < len; i++) {
                formData.append('inform_photo', descriptionPhotos[i], descriptionPhotos[i].name);
            }

            formData.append('information', JSON.stringify(descriptionToPost));
        }

        const popularItemsToSet = popularItems.map(item => ({
            link_name: item,
        }));

        formData.append('name', newItemTitle); //
        formData.append('colors', JSON.stringify(colorsToPost));

        const allPhotos = currentColors.map(item => item.img_path).flat();

        for (let i = 0, len = allPhotos.length; i < len; i++) {
            formData.append(`color_photo`, allPhotos[i], allPhotos[i].name);
        }

        formData.append('currency', USDCurrency ? "USD" : "BYN"); //
        formData.append('in_stock', Number(in_stock)); //
        formData.append('hidePayment', JSON.stringify(hidePayment)); //
        formData.append('popular', JSON.stringify(popularItemsToSet)); //

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

        formData.append('price', Number(price)); //
        formData.append('year', 2023); //
        formData.append('memory', JSON.stringify(memoryToPost));
        formData.append('categoryId', selectedCategory); //
        formData.append('raiting', 10); //
        formData.append('characteristics', JSON.stringify(itemSpecs)) //
        formData.append('services', JSON.stringify(services)); //
        formData.append('stickers', JSON.stringify(stickersToPost)); //

        if (linkName.trim().length > 0) {
            formData.append('link_name', linkName); //
        }

        if (currentSubSubCategory === "Под Подкатегория" || !currentSubSubCategory) {
            formData.append('subcategory', currentSelectedSubcategory);
        } else {
            formData.append('subcategory', currentSubSubCategory)
        }

        const token = sessionStorage.getItem('admin-dream-token');

        axios.post(`https://dreamstore.by/api/product`, formData, {
            headers: {'Authorization': 'Bearer ' + token.slice(7)}
        }).finally(() => {
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
        })
    }

    const saveEdits = () => {
        const formEditData = new FormData();

        // const stickersToPost = [];
        //
        // specialOffer && stickersToPost.push({ name: "Специальное предложение" });
        // newIn && stickersToPost.push({ name: "Новое поступление" });
        // leaders && stickersToPost.push({ name: "Лидер продаж" });

        const popularItemsToSet = popularItems.map(item => ({
            link_name: item,
        }))

        formEditData.append('name', newItemTitle);
        formEditData.append('currency', USDCurrency ? "USD" : "BYN");
        formEditData.append('manufacturer', newManufacturer?.trim().length ? newManufacturer : currentManufacturer);
        formEditData.append('price', Number(price));
        formEditData.append('categoryId', selectedCategory);
        // formEditData.append('stickers', JSON.stringify(stickersToPost));
        formEditData.append('link_name', linkName);
        formEditData.append('popular', JSON.stringify(popularItemsToSet));
        formEditData.append('meta_title', metaTitle.trim().length ? metaTitle : newItemTitle);
        formEditData.append('meta_description', metaDescription);

        if (currentSubSubCategory === "Под Подкатегория" || !currentSubSubCategory) {
            formEditData.append('subcategory', currentSelectedSubcategory);
        } else {
            formEditData.append('subcategory', currentSubSubCategory)
        }

        const token = sessionStorage.getItem('admin-dream-token');

        let editRequest = new Request(`${process.env["REACT_APP_API_URL"]}product/${currentProductId}?f=1234`, {
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

    const deleteMemory = async (amt, id) => {
        const token = sessionStorage.getItem('admin-dream-token');

        if (!!id) {
            await fetch(`${process.env["REACT_APP_API_URL"]}memory/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
            }).then(() => setDataUpdated(dataUpdated + 1));
        } else {
            const idx = memories.findIndex(memory => memory.amount === amt);
            setMemories([...memories.slice(0, idx), ...memories.slice(idx + 1)])
        }
    }

    const [technicalSpecs, setTechnicalSpecs] = useState([]);

    const generalContent = (
        <div className={`${DEFAULT_CLASSNAME}_general`}>
            <div className={`${DEFAULT_CLASSNAME}_general_title`}>Основные</div>
            <div className={`${DEFAULT_CLASSNAME}_general_product_info`}>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_title`}>Информация о товаре</div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>GTIN:</label><input type={'text'} placeholder={'Введите GTIN'} value={gtin} onChange={(e) => setGtin(e.currentTarget.value)} />
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>Название товара:</label><input value={newItemTitle} onChange={(e) => setNewItemTitle(e.currentTarget.value)} type={"text"} placeholder={"Введите название..."} />
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>Категория товара (подкатегория - подподкатегория):</label>
                    <select style={{ width: '37% '}} placeholder={"Категория"} onChange={(e) => setSelectedCategory(e.currentTarget.value)}>
                        <option>{"Категория"}</option>
                        {categories?.map(item => (
                            <option key={item.id.toString()} selected={item.id === selectedCategory} value={item.id}>{item.categoryName}</option>
                        ))}
                    </select>
                    <select style={{ width: '30% '}} onChange={(e) => e.currentTarget.value === "Подкатегория" ? setCurrentSelectedSubcategory( null) : setCurrentSelectedSubcategory(e.currentTarget.value)}>
                        <option value={null} defaultChecked={true}>{"Подкатегория"}</option>
                        {subCategories?.map(item => (
                            <option key={item.name.toString()} selected={item.name === currentSelectedSubcategory} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                    <select style={{ width: '30% '}} onChange={(e) => e.currentTarget.value === "Под Подкатегория" ? setCurrentSubSubCategory( null) : setCurrentSubSubCategory(e.currentTarget.value)}>
                        <option value={null} defaultChecked={true}>{"Под Подкатегория"}</option>
                        {subSubCategories?.map(item => (
                            <option key={item.name.toString()} selected={item.name === currentSubSubCategory} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>Производитель:</label>
                    <input style={{ width: '73%' }} className={`${DEFAULT_CLASSNAME}_info_specs_manufacturer`} value={newManufacturer} onChange={(e) => setNewManufacturer(e.currentTarget.value)} type={"text"} placeholder={"Введите производителя или выберите из списка"}/>
                    <select onChange={(e) => setCurrentManufacturer(e.currentTarget.value)}>
                        {manufacturers.map(item => {
                            return (
                                <option key={item.toString()} selected={item.name === currentManufacturer} value={item.name}>{item.name}</option>
                            )
                        })}
                    </select>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>Стоимость:</label><input value={price} onChange={(e) => setPrice(e.currentTarget.value)} type={"text"} />
                    <div className={`${DEFAULT_CLASSNAME}_general_product_info_item_small`}>
                        <label>$</label> <input checked={USDCurrency} onChange={() => setUSDCurrency(!USDCurrency)} type={'checkbox'} />
                    </div>
                </div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_general_product_info`}>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_title`}>Информация для магазина</div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>Ссылка:</label><input value={linkName} type={'text'} onChange={(e) => setLinkName(e.currentTarget.value)} placeholder={"Введите ссылку-имя товара"} />
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>Популярные товары:</label>
                    <input type={"text"} value={newPopularItem} onChange={(e) => setNewPopularItem(e.currentTarget.value)} placeholder={"Введите ссылку-имя товара"} />
                    <img src={addIcon} onClick={() => {
                        setNewPopularItem("");
                        if (popularItems.length < 4) {
                            setPopularItems([newPopularItem, ...popularItems])
                        } else {
                            toast.info("Максимум 4 товара!");
                        }
                    }}/>
                </div>
                <div style={{ width: "100%" }} className={"popular_items"}>
                    {popularItems.map(item => <div onClick={() => {
                        const deleteItemIdx = popularItems.findIndex(popItem => popItem === item);
                        const itemsToSet = [...popularItems.slice(0, deleteItemIdx), ...popularItems.slice(deleteItemIdx + 1)];

                        setPopularItems(itemsToSet);
                    }} key={item} className={'popular_items_item'}>{item}</div>)}
                </div>
            </div>
            <input onClick={isEditMode ? saveEdits : saveNewItem} type={"button"} className={`${DEFAULT_CLASSNAME}_save-item`} value={"Сохранить товар"} />
        </div>
    );

    const saveNewMemoryHandler = async () => {
        const pathArr = window.location.href.split('/');
        const id = pathArr[pathArr.length - 1];

        const token = sessionStorage.getItem('admin-dream-token');

        if (isEditMode) {
            await fetch(`${process.env["REACT_APP_API_URL"]}memory/`, {
                method: "POST",
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prodId: id,
                    size: newMemoryAmount,
                    price: newMemoryCost,
                    link: newMemoryLink,
                })
            })
        };

        setMemories([...memories, {
            size: newMemoryAmount,
            price: newMemoryCost,
            link: newMemoryLink,
        }]);

        setNewMemoryLink("");
        setNewMemoryAmount("");
        setNewMemoryCost("");
    }

    const MemoryComponent = props => {
        const { size, link, price, index, id } = props;

        const [sizeValue, setSize] = useState(size);
        const [linkValue, setLink] = useState(link);
        const [priceValue, setPrice] = useState(price);

        const editItem = async () => {
            const token = sessionStorage.getItem('admin-dream-token');

            await fetch(`${process.env["REACT_APP_API_URL"]}memory/${id}`, {
                method: "PATCH",
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price: Number(priceValue),
                    link: linkValue,
                    size: sizeValue,
                })
            })
        };

        return (
            <div className={`${DEFAULT_CLASSNAME}_general_product_info`} style={{ marginTop: '20px'}}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    # {index + 1}
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px'}}>
                        <div className={`edit-btn-admin`} style={{ cursor: 'pointer' }} onClick={() => editItem()}>Обновить</div>
                        <div className={`edit-btn-admin`} style={{ background: 'red', cursor: 'pointer' }} onClick={() => isEditMode ? deleteMemory(size, id) : deleteMemory(size)}>Удалить</div>
                    </div>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>Объём:</label>
                    <input onChange={(e) => setSize(e.currentTarget.value)} value={sizeValue} type={"text"} />
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>Ссылка:</label>
                    <input onChange={(e) => setLink(e.currentTarget.value)} value={linkValue} type={"text"} />
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>Стоимость:</label>
                    <input onChange={(e) => setPrice(e.currentTarget.value)} value={priceValue} type={"text"} />
                </div>
            </div>
        )
    };

    const ColorComponent = props => {
        const { Image, link, color, id } = props;

        const [linkValue, setLinkValue] = useState(link);
        const [colorValue, setColorValue] = useState(color);

        const editItem = async () => {
            const token = sessionStorage.getItem('admin-dream-token');

            await fetch(`${process.env["REACT_APP_API_URL"]}color/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    color: colorValue,
                    link: linkValue,
                })
            }).then(res => res.json()).then(() => setDataUpdated(dataUpdated + 1));
        }

        return (
            <>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>Название:</label>
                    <input value={colorValue} onChange={(e) => setColorValue(e.currentTarget.value)} type={"text"} />
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                    <label>Ссылка:</label>
                    <input value={linkValue} onChange={(e) => setLinkValue(e.currentTarget.value)} type={"text"} />
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
                    <input onChange={async (e) => {
                        const token = sessionStorage.getItem('admin-dream-token');

                        const photoData = new FormData();

                        photoData.append('file', e.target.files[0]);
                        photoData.append('colorId', id);

                        await fetch(`${process.env["REACT_APP_API_URL"]}image`, {
                            method: 'POST',
                            headers: {
                                'Authorization': token,
                            },
                            body: photoData,
                        }).then(res => res.json()).then(() => setDataUpdated(dataUpdated + 1));
                    }} style={{ width: '100px', height: '140px', borderRadius: '12px', opacity: 0, position: 'absolute' }} type={'file'} /><img src={addPhoto} />

                    {!!Image?.length && Image?.map(item => {
                        return <div className={`${DEFAULT_CLASSNAME}_general_product_info_item_image`}>
                            <img style={{ objectFit: 'contain', borderRadius: '12px' }} alt={item.id} src={item.img_path}/>
                            <div onClick={async () => {
                                const token = sessionStorage.getItem('admin-dream-token');

                                await fetch(`${process.env["REACT_APP_API_URL"]}image/${item.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': token,
                                        'Content-Type': 'application/json',
                                    }
                                }).then(res => res.json()).then(() => setDataUpdated(dataUpdated + 1))
                            }} style={{cursor: 'pointer', background: 'red', width: '100%', textAlign: 'center', color: '#fff', padding: '4px', borderRadius: '12px', fontSize: '12px'}}>Удалить</div>
                        </div>
                    })}
                </div>
                <div className={`color-component-btns`}>
                    <div className={`edit-btn-admin`} style={{ cursor: 'pointer' }} onClick={() => editItem()}>Обновить</div>
                    <div onClick={async () => {
                        const token = sessionStorage.getItem('admin-dream-token');

                        await fetch(`${process.env["REACT_APP_API_URL"]}color/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': token,
                                'Content-Type': 'application/json',
                            }
                        }).then(res => res.json()).then(() => setDataUpdated(dataUpdated + 1));
                    }} style={{ alignSelf: 'flex-end', cursor: 'pointer', background: 'red', textAlign: 'center', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '14px'}}>Удалить</div>
                </div>
            </>
        )
    }

    const criteriaContent = (
        <div className={`${DEFAULT_CLASSNAME}_metadata`}>
            <div className={`${DEFAULT_CLASSNAME}_general_title`}>Критерии</div>

            <div className={`${DEFAULT_CLASSNAME}_colors`}>
                <div className={`${DEFAULT_CLASSNAME}_memory_title`}>
                    <div style={{ fontWeight: '500', fontSize: '18px' }}>Цвета</div>
                    <div className={`${DEFAULT_CLASSNAME}_memory_add`} onClick={async () => {
                        if (isEditMode) {
                            const token = sessionStorage.getItem('admin-dream-token');

                            const photoData = new FormData();

                            for (let i = 0, len = currentColorPhotos.length; i < len; i++) {
                                photoData.append(`files`, currentColorPhotos[i], currentColorPhotos[i].name);
                            }

                            photoData.append('color', newColorValue);
                            photoData.append('link', newLink);
                            photoData.append('prodId', currentProductId);

                            await fetch(`${process.env["REACT_APP_API_URL"]}color`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': token,
                                },
                                body: photoData,
                            }).then(res => res.json()).then(() => setDataUpdated(dataUpdated + 1));
                        } else {
                            setCurrentColors([...currentColors, {
                                color: newColorValue,
                                link: newLink,
                                img_path: currentColorPhotos,
                            }]);
                        }

                        setNewLink("");
                        setNewColorValue("");
                        setCurrentColorPhotos([]);
                    }}>Добавить</div>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info`} style={{ marginBottom: '20px'}}>
                    <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                        <label>Название:</label>
                        <input value={newColorValue} onChange={(e) => setNewColorValue(e.currentTarget.value)} type={"text"} placeholder={"Введите Название"} />
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                        <label>Ссылка:</label>
                        <input value={newLink} onChange={(e) => setNewLink(e.currentTarget.value)} type={"text"} placeholder={"Введите Ссылку"} />
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
                        <input multiple={true} onChange={(e) => {
                            setCurrentColorPhotos([...currentColorPhotos, ...e.target.files])}
                        } style={{ width: '100px', height: '140px', borderRadius: '12px', opacity: 0, position: 'absolute' }} type={'file'} /><img src={addPhoto} />

                        {!!currentColorPhotos.length && currentColorPhotos.map(item => <div className={`${DEFAULT_CLASSNAME}_general_product_info_item_image`}><img style={{ objectFit: 'contain', borderRadius: '12px' }} alt={item} src={URL.createObjectURL(item)}/>
                            <div onClick={() => {
                                const deleteItem = currentColorPhotos.findIndex(image => image.name === item.name);
                                setCurrentColorPhotos([...currentColorPhotos.slice(0, deleteItem), ...currentColorPhotos.slice(deleteItem + 1)])
                            }} style={{cursor: 'pointer', background: 'red', width: '100%', textAlign: 'center', color: '#fff', padding: '4px', borderRadius: '12px', fontSize: '12px'}}>Удалить</div>
                        </div>)}
                    </div>


                    {!!currentColors?.length && currentColors.map(color => (
                        <>
                            <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                                <label>Название:</label>
                                <input value={color.color} type={"text"} disabled={true} />
                            </div>
                            <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                                <label>Ссылка:</label>
                                <input value={color.link} type={"text"} disabled={true} />
                            </div>
                            <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
                                {!!color?.img_path?.length && color?.img_path?.map(item => {
                                    return <div className={`${DEFAULT_CLASSNAME}_general_product_info_item_image`}>
                                        <img style={{ objectFit: 'contain', borderRadius: '12px' }} alt={item} src={isEditMode ? item : URL.createObjectURL(item)}/>
                                        <div onClick={() => {
                                            const deleteItem = currentColorPhotos.findIndex(image => image.name === item.name);
                                            setCurrentColorPhotos([...currentColorPhotos.slice(0, deleteItem), ...currentColorPhotos.slice(deleteItem + 1)])
                                        }} style={{cursor: 'pointer', background: 'red', width: '100%', textAlign: 'center', color: '#fff', padding: '4px', borderRadius: '12px', fontSize: '12px'}}>Удалить</div></div>
                                })}
                            </div>
                            <div onClick={() => {
                                const deleteItem = currentColors.findIndex(item => item.name === color.name);
                                setCurrentColors([...currentColors.slice(0, deleteItem), ...currentColors.slice(deleteItem + 1)])
                            }} style={{ alignSelf: 'flex-end', cursor: 'pointer', background: 'red', textAlign: 'center', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '14px'}}>Удалить</div>
                        </>
                    ))}

                    {!!currentProductColors?.length && currentProductColors.map(color => (
                        <ColorComponent Image={color.Image} link={color.link} color={color.color} id={color.id} />
                    ))}
                </div>
            </div>

            <div className={`${DEFAULT_CLASSNAME}_memory`}>
                <div className={`${DEFAULT_CLASSNAME}_memory_title`}>
                    <div style={{ fontWeight: '500', fontSize: '18px' }}>Память</div>
                    <div className={`${DEFAULT_CLASSNAME}_memory_add`} onClick={() => saveNewMemoryHandler()}>Добавить</div>
                </div>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info`} style={{ marginBottom: '20px'}}>
                    <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                        <label>Объём:</label>
                        <input value={newMemoryAmount} onChange={(e) => setNewMemoryAmount(e.currentTarget.value)} type={"text"} placeholder={"Введите Объём"} />
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                        <label>Ссылка:</label>
                        <input value={newMemoryLink} onChange={(e) => setNewMemoryLink(e.currentTarget.value)} type={"text"} placeholder={"Введите Ссылку"} />
                    </div>
                    <div className={`${DEFAULT_CLASSNAME}_general_product_info_item`}>
                        <label>Стоимость:</label>
                        <input value={newMemoryCost} onChange={(e) => setNewMemoryCost(e.currentTarget.value)} type={"text"} placeholder={"Введите Стоимость"} />
                    </div>
                </div>
                {!!memories?.length && memories.map((item, index) => (
                    <MemoryComponent id={item?.id} index={index} size={item?.size} link={item?.link || item?.size} price={item?.price} />
                ))}
            </div>
        </div>
    )

    const metadataContent = (
        <div className={`${DEFAULT_CLASSNAME}_metadata`}>
            <div className={`${DEFAULT_CLASSNAME}_general_title`}>Метаданные</div>
            <div className={`${DEFAULT_CLASSNAME}_metadata_item`}>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_title`}>Title</div>
                <textarea value={metaTitle} onChange={(e) => setMetaTitle(e.currentTarget.value)} rows={6} placeholder={"Введите заголовок..."}></textarea>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_metadata_item`}>
                <div className={`${DEFAULT_CLASSNAME}_general_product_info_title`}>Description</div>
                <textarea rows={10} value={metaDescription} onChange={(e) => setMetaDescription(e.currentTarget.value)} placeholder={"Введите краткое описание товара..."}></textarea>
            </div>
        </div>
    );

    return (
        <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
            <div className={DEFAULT_CLASSNAME}>

                <form onSubmit={saveNewItem}>
                    <div className={`${DEFAULT_CLASSNAME}_item-info`}>

                        <div className={`${DEFAULT_CLASSNAME}_sections`}>
                            {SECTIONS.map(item => <div className={`${DEFAULT_CLASSNAME}_sections_item ${activeMenuItem === item && 'active-section-item'}`} onClick={() => setActiveMenuItem(item)}>{item}</div>)}
                        </div>

                        {activeMenuItem === "Основные" && generalContent}

                        {activeMenuItem === "Критерии" && criteriaContent}

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
                            newCardPriority={newCardPriority}xf
                            setNewCardPriority={setNewCardPriority}
                        />}

                        {activeMenuItem === "Характеристики" && <TechnicalSpecs
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

                        {activeMenuItem === "Метаданные" && metadataContent}
                    </div>
                </form>
            </div>
        </div>
    )
}
