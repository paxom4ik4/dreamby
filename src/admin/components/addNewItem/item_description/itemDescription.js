import * as React from 'react';

import '../addNewItem.scss';
import { toast } from "react-toastify";
import addImageForCard from "../assets/addImageForCard.png";
import addNewCard from "../assets/addNewCard.svg";
import { CARD_TEXT_POSITIONS } from "../addNewItem";
import {useState} from "react";

const DEFAULT_CLASSNAME = 'add-new-item';

const token = sessionStorage.getItem('admin-dream-token');

const DescriptionItem = ({ priority, isEditMode, setItemEditDescriptionHandler, setEditItem, item, index, setDataUpdated, dataUpdated, descriptionPhotos }) => {
    const reversedCard = item.pic_pos === 'right';

    return (
        <div className={`${DEFAULT_CLASSNAME}_item-info_card`} style={{ flexDirection: reversedCard ? 'row-reverse' : 'row', background: item.color, color: item.color_text }}>
            {!isEditMode && <div className={`${DEFAULT_CLASSNAME}_item-info_card_edit`} onClick={() => setEditItem(item)}>{"Редактировать"}</div>}

            {isEditMode && <div className={`${DEFAULT_CLASSNAME}_item-info_card_delete`} onClick={() => {
                if (isEditMode) {
                    fetch(`${process.env["REACT_APP_API_URL"]}information/${item.id}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": token,
                        }
                    })
                        .finally(() => {
                            setDataUpdated(dataUpdated + 1);
                            toast.info("Карточка удалена");
                        })
                }}
            }>{"Удалить"}</div>}
            {isEditMode && <div className={`${DEFAULT_CLASSNAME}_item-info_card_edit`} onClick={() => setItemEditDescriptionHandler(item)}>{"Редактировать"}</div>}

            <div className={`${DEFAULT_CLASSNAME}_item-info_card_photo`}>
                <img src={item.img_path ? item.img_path : !!descriptionPhotos[index] ? URL.createObjectURL(descriptionPhotos[index]) : addImageForCard} alt={''} />
            </div>
            <div className={`${DEFAULT_CLASSNAME}_item-info_card_description`}>
                <input disabled={true} style={{ color: item.color_text }} type={"text"} className={`${DEFAULT_CLASSNAME}_item-info_card_title`} value={item.title} />
                <textarea disabled={true} style={{ color: item.color_text }} type={"text"} className={`${DEFAULT_CLASSNAME}_item-info_card_text`} value={item.text}></textarea>
            </div>
        </div>
    )
}

const NewDescriptionItem = ({
    newCardPriority,
    setNewCardPriority,
    newCardThere,
    itemId,
    saveNewDescriptionItemEditMode,
    isEditMode,
    setCurrentDescriptionPhoto,
    setCurrentDescriptionPhotoForEdit,
    currentDescriptionPhoto,
    newItemDescriptionTitle,
    setNewItemDescriptionTitle,
    newItemDescriptionText,
    setNewItemDescriptionText,
    setNewCardThere,
    setNewCardTextPosition,
    saveNewDescriptionItem,
    setItemEditDescription,
    newCardTextPosition,
}) => {

    let photo;

    if (!!currentDescriptionPhoto) {
        if (typeof(currentDescriptionPhoto) === "string") {
            photo = currentDescriptionPhoto
        } else {
            photo = URL.createObjectURL(currentDescriptionPhoto)
        }
    }

    return (
        <div className={`${DEFAULT_CLASSNAME}_item-info_card_wrapper`}>
            <div className={`${DEFAULT_CLASSNAME}_item-info_card`} style={{ background: newCardThere === "WHITE" ? "#fff" : "linear-gradient(271.38deg, #0B3FC5 -8.46%, #0681E4 75.71%)", border: newCardThere === "WHITE" && "1px solid #eeeeee"}}>
                <div className={`${DEFAULT_CLASSNAME}_item-info_card_photo`}>
                    <input type={"file"} onChange={(e) => {
                        setCurrentDescriptionPhoto(e.target.files[0]);
                        setCurrentDescriptionPhotoForEdit(e.target.files[0]);
                    }} />
                    {!isEditMode && <img src={currentDescriptionPhoto ? photo : addImageForCard} alt={''}/>}
                    {isEditMode && <img src={currentDescriptionPhoto ? photo : addImageForCard} alt={''} />}
                </div>
                <div className={`${DEFAULT_CLASSNAME}_item-info_card_description`}>
                    <input style={{ color: newCardThere === "WHITE" && "rgb(67, 67, 67)"}}
                      placeholder={"Введите заголовок..."} type={"text"}
                           className={`${DEFAULT_CLASSNAME}_item-info_card_title`}
                           value={newItemDescriptionTitle}
                           onChange={(e) => setNewItemDescriptionTitle(e.currentTarget.value)}/>
                    <textarea style={{ color: newCardThere === "WHITE" && "rgb(67, 67, 67)"}}
                      placeholder={"Введите текст..."}
                              className={`${DEFAULT_CLASSNAME}_item-info_card_text`}
                              value={newItemDescriptionText}
                              onChange={(e) => setNewItemDescriptionText(e.currentTarget.value)}></textarea>
                </div>
                <input className={`${DEFAULT_CLASSNAME}_new_item_priority`} type={"number"} value={newCardPriority} onChange={(e) => setNewCardPriority(e.currentTarget.value)} />
                <select className={`${DEFAULT_CLASSNAME}_new_item_color`} defaultValue={newCardThere} onChange={(e) => setNewCardThere(e.currentTarget.value)}>
                    <option value={"WHITE"}>{"Белая"}</option>
                    <option value={"BLUE"}>{"Синяя"}</option>
                </select>
                <select className={`${DEFAULT_CLASSNAME}_new_item_color text-position`} defaultValue={newCardTextPosition} onChange={(e) => setNewCardTextPosition(e.currentTarget.value)}>
                    <option value={"RIGHT"}>{"Справа"}</option>
                    <option value={"LEFT"}>{"Слева"}</option>
                </select>
                <button className={`${DEFAULT_CLASSNAME}_save_new_item`}
                        onClick={isEditMode ? (e) => saveNewDescriptionItemEditMode(e, itemId, setItemEditDescription) : (e) => {saveNewDescriptionItem(e, setItemEditDescription)}}
                        type={"submit"}>
                    {"Сохранить"}
                </button>
            </div>
        </div>
    )
}

export const ItemDescription = ({
    newCardPriority,
    setNewCardPriority,
    newCardThere,
    newCardTextPosition,
    saveNewDescriptionItemEditMode,
    editItem,
    setEditItem,
    dataUpdated,
    setDataUpdated,
    addNewDescriptionItem,
    itemDescriptions,
    setItemDescriptions,
    isEditMode,
    descriptionPhotos,
    currentDescriptionPhoto,
    newItemDescriptionText,
    newItemDescriptionTitle,
    saveNewDescriptionItem,
    setCurrentDescriptionPhoto,
    setCurrentDescriptionPhotoForEdit,
    setAddNewDescriptionItem,
    setDescriptionPhotos,
    setNewItemDescriptionTitle,
    setNewItemDescriptionText,
    setNewCardTextPosition,
    setNewCardThere
}) => {
    const setEditItemHandler = item => {
        const editItemIdx = itemDescriptions.indexOf(item);

        const editItem = itemDescriptions[editItemIdx];
        const descriptionPhoto = descriptionPhotos[editItemIdx];

        setEditItem(editItem);

        setNewItemDescriptionTitle(editItem.title);
        setNewItemDescriptionText(editItem.text);
        setCurrentDescriptionPhoto(descriptionPhoto);
        setNewCardTextPosition(CARD_TEXT_POSITIONS[editItem.pic_pos.toUpperCase()]);
        setNewCardPriority(item?.priority);

        setDescriptionPhotos([...descriptionPhotos.slice(0, editItemIdx), ...descriptionPhotos.slice(editItemIdx + 1)]);
        setItemDescriptions([...itemDescriptions.slice(0, editItemIdx), ...itemDescriptions.slice(editItemIdx + 1)]);
    }

    const [itemEditDescription, setItemEditDescription] = useState(null);

    const setItemEditDescriptionHandler = item => {
        const editedItemIdx = itemDescriptions.indexOf(item);

        const editedItem = itemDescriptions[editedItemIdx];
        const descriptionPhoto = descriptionPhotos[editedItemIdx];

        setItemEditDescription(editedItem);

        setNewItemDescriptionTitle(editedItem.title);
        setNewItemDescriptionText(editedItem.text);
        setCurrentDescriptionPhoto(descriptionPhoto);
        setNewCardThere(editedItem.color === "#0B3FC5" ? "BLUE" : "WHITE");
        setNewCardPriority(item?.priority);

        setNewCardTextPosition(CARD_TEXT_POSITIONS[editedItem.pic_pos.toUpperCase()]);

        setDescriptionPhotos([...descriptionPhotos.slice(0, editedItemIdx), ...descriptionPhotos.slice(editedItemIdx + 1)]);
        setItemDescriptions([...itemDescriptions.slice(0, editedItemIdx), ...itemDescriptions.slice(editedItemIdx + 1)]);
    }

    return (
        <div className={`${DEFAULT_CLASSNAME}_item_info_cards`} style={{ marginTop: '30px'}}>
            {itemDescriptions.map((item, index) => <DescriptionItem
                priority={item?.priority}
                setItemEditDescriptionHandler={setItemEditDescriptionHandler}
                item={item}
                index={index}
                dataUpdated={dataUpdated}
                setDataUpdated={setDataUpdated}
                isEditMode={isEditMode}
                descriptionPhotos={descriptionPhotos}
                setEditItem={setEditItemHandler}
            />)}

            {itemEditDescription && <NewDescriptionItem
                newCardPriority={newCardPriority}
                setNewCardPriority={setNewCardPriority}
                newCardThere={newCardThere}
                newCardTextPosition={newCardTextPosition}
                setDataUpdated={setDataUpdated}
                itemId={itemEditDescription.id}
                setItemEditDescription={setItemEditDescription}
                isEditMode={true}
                descriptionPhotos={descriptionPhotos}
                currentDescriptionPhoto={currentDescriptionPhoto}
                newItemDescriptionText={newItemDescriptionText}
                newItemDescriptionTitle={newItemDescriptionTitle}
                setCurrentDescriptionPhoto={setCurrentDescriptionPhoto}
                setNewItemDescriptionTitle={setNewItemDescriptionTitle}
                setNewItemDescriptionText={setNewItemDescriptionText}
                setNewCardTextPosition={setNewCardTextPosition}
                setCurrentDescriptionPhotoForEdit={setCurrentDescriptionPhotoForEdit}
                setNewCardThere={setNewCardThere}
                saveNewDescriptionItemEditMode={saveNewDescriptionItemEditMode}
            />}

            {editItem && <NewDescriptionItem
                newCardPriority={newCardPriority}
                setNewCardPriority={setNewCardPriority}
                newCardTextPosition={newCardTextPosition}
                setEditItem={setEditItem}
                isEditMode={false}
                descriptionPhotos={descriptionPhotos}
                currentDescriptionPhoto={currentDescriptionPhoto}
                newItemDescriptionText={newItemDescriptionText}
                newItemDescriptionTitle={newItemDescriptionTitle}
                saveNewDescriptionItem={saveNewDescriptionItem}
                setCurrentDescriptionPhoto={setCurrentDescriptionPhoto}
                setNewItemDescriptionTitle={setNewItemDescriptionTitle}
                setNewItemDescriptionText={setNewItemDescriptionText}
                setNewCardTextPosition={setNewCardTextPosition}
                setNewCardThere={setNewCardThere}
            />}

            {addNewDescriptionItem && <NewDescriptionItem
                newCardPriority={newCardPriority}
                setNewCardPriority={setNewCardPriority}
                newCardThere={newCardThere}
                isEditMode={false}
                descriptionPhotos={descriptionPhotos}
                currentDescriptionPhoto={currentDescriptionPhoto}
                newItemDescriptionText={newItemDescriptionText}
                newItemDescriptionTitle={newItemDescriptionTitle}
                saveNewDescriptionItem={saveNewDescriptionItem}
                setCurrentDescriptionPhoto={setCurrentDescriptionPhoto}
                setCurrentDescriptionPhotoForEdit={setCurrentDescriptionPhotoForEdit}
                setDescriptionPhotos={setDescriptionPhotos}
                setNewItemDescriptionTitle={setNewItemDescriptionTitle}
                setNewItemDescriptionText={setNewItemDescriptionText}
                setNewCardTextPosition={setNewCardTextPosition}
                setNewCardThere={setNewCardThere}
            />}

            <img onClick={() => setAddNewDescriptionItem(true)} className={`${DEFAULT_CLASSNAME}_item-info_new-card`} src={addNewCard} alt={""} />
        </div>
    )
}
