import * as React from 'react';
import { useState } from 'react';

import '../addNewItem.scss';
import addNewSpecCategory from "../assets/addItemCategory.svg";

const DEFAULT_CLASSNAME = 'add-new-item';

const NewCategoryItem = ({
    itemSpecs,
    setItemSpecs,
    item,
    setTechnicalSpecs,
    technicalSpecs,
    editSpecs,
    editCategoryName,
    setEditCategory,
}) => {
    const [specs, setSpecs] = useState(editSpecs ? editSpecs : []);

    const [categoryName, setCategoryName] = useState(editCategoryName ? editCategoryName : "");
    const [categoryValueName, setCategoryValueName] = useState("");
    const [categoryValue, setCategoryValue] = useState("");

    return (
        <div className={`${DEFAULT_CLASSNAME}_item-info_specs_item`}>
            <div className={`${DEFAULT_CLASSNAME}_item_info_specs_item_category`}>
                <input placeholder={"Введите категорию"} type={"text"} value={categoryName}
                       onChange={(e) => setCategoryName(e.currentTarget.value)}/>
                <div onClick={() => {
                    const itemIdx = technicalSpecs.indexOf(item);
                    setTechnicalSpecs([...technicalSpecs.slice(0, itemIdx), ...technicalSpecs.slice(itemIdx + 1)]);
                }} className={'delete-item-spec'}>-</div>
            </div>
            {specs?.map(item => {
                return (
                    <div className={`${DEFAULT_CLASSNAME}_item_specs`} style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <div style={{width: "50%"}}>{item.name}</div>
                        <div style={{width: "50%"}}>{item.value}</div>
                        <div onClick={() => {
                            const itemIdx = specs.indexOf(item);
                            setSpecs((specs) => [...specs.slice(0, itemIdx), ...specs.slice(itemIdx + 1)])
                        }} className={'delete-item-spec'}>-</div>
                    </div>
                )
            })}
            <div className={`${DEFAULT_CLASSNAME}_item_info_specs_item_spec`}>
                <input placeholder={"Введите название характеристики"} type={"text"} value={categoryValueName}
                       onChange={(e) => setCategoryValueName(e.currentTarget.value)}/>
                <input placeholder={"Введите значение характеристики"} type={"text"} value={categoryValue}
                       onChange={(e) => setCategoryValue(e.currentTarget.value)}/>
            </div>
            <div style={{
                cursor: "pointer",
                backgroundColor: "rgba(9, 91, 210, 0.75)",
                color: "#FFF",
                textAlign: "center",
                borderRadius: '12px',
                padding: '12px'
            }} onClick={() => {
                if (categoryValueName.trim().length && categoryValue.trim().length) {
                    setSpecs([...specs, { name: categoryValueName, value: categoryValue }]);
                    setCategoryValueName("");
                    setCategoryValue("");
                }
            }} className={`${DEFAULT_CLASSNAME}_item_info_specs_save`}>{"Добавить характеристику"}</div>
            <div style={{
                cursor: "pointer",
                margin: "12px 0",
                backgroundColor: "rgba(9, 91, 210, 0.75)",
                color: "#FFF",
                textAlign: "center",
                borderRadius: '12px',
                padding: '12px'
            }} onClick={() => {
                if (editSpecs || editCategoryName) {
                    setEditCategory(null);
                }

                if (categoryName.trim().length) {
                    setItemSpecs([...itemSpecs, {
                        name: categoryName,
                        value: specs,
                    }])
                    setCategoryName("");
                    setCategoryValueName("");
                    setCategoryValue("");
                    setTechnicalSpecs((specs) => [...specs.slice(0, specs.length - 1)])
                }
            }} className={`${DEFAULT_CLASSNAME}_item_info_specs_save`}>{"Сохранить Категорию"}</div>
        </div>
    )
}

const mock = [{
    name: "Category",
    value: [{
        name: "name",
        value: 'value'
    }, {
        name: "name 2",
        value: 'value 2'
    }]
}];

export const TechnicalSpecs = ({ technicalSpecs, setTechnicalSpecs, isEditMode, itemSpecs, addNewSpecItem, setAddNewSpecItem, updateCharacteristics, setItemSpecs }) => {

    const [editMode, setEditMode] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const [editCategory, setEditCategory] = useState(null);

    return (
        <React.Fragment>
            {isEditMode && <div style={{ background: '#0A5BD3', color: "#fff", borderRadius: "12px", padding: '4px 12px', cursor: "pointer"}} className={`${DEFAULT_CLASSNAME}_item-info_update`} onClick={() => updateCharacteristics()}>{"Обновить характеристики"}</div>}

            {!!itemSpecs.length && itemSpecs.map(item => {
                return (
                    <div className={`${DEFAULT_CLASSNAME}_item-info_specs`}>
                        <div className={`${DEFAULT_CLASSNAME}_item_info_specs_item_category`}>
                            <input disabled={!editItem} value={item?.name} />
                            <div>
                                <div className={`${DEFAULT_CLASSNAME}_item_info_specs_item_category_edit`} onClick={() => {
                                    const editCategoryIdx = itemSpecs.findIndex(spec => spec.name === item.name);
                                    const editCategory = itemSpecs[editCategoryIdx];

                                    setEditCategory(editCategory)

                                    setItemSpecs([...itemSpecs.slice(0, editCategoryIdx), ...itemSpecs.slice(editCategoryIdx + 1)]);
                                }}>{"Редактировать"}</div>
                                <div className={`${DEFAULT_CLASSNAME}_item_info_specs_item_category_edit`} onClick={() => {
                                    const deleteCategoryIdx = itemSpecs.findIndex(spec => spec.name === item.name);

                                    setItemSpecs([...itemSpecs.slice(0, deleteCategoryIdx), ...itemSpecs.slice(deleteCategoryIdx + 1)]);
                                }}>{"Удалить"}</div>
                            </div>
                        </div>
                        {item.value && item.value.map(item => {
                            return(
                                <div className={`${DEFAULT_CLASSNAME}_item_info_specs_item_spec`}>
                                    <input value={item?.name} disabled={!editItem} style={{ width: "50%"}} />
                                    <input value={item?.value} disabled={!editItem} style={{ width: "50%"}} />
                                </div>
                            )
                        })}
                    </div>
                )
            })}

            <div className={`${DEFAULT_CLASSNAME}_item-info_specs`}>
                {technicalSpecs.map((item) => (<NewCategoryItem
                    setAddNewSpecItem={setAddNewSpecItem}
                    itemSpecs={itemSpecs}
                    setItemSpecs={setItemSpecs}
                    setTechnicalSpecs={setTechnicalSpecs}
                    item={item}
                    technicalSpecs={technicalSpecs}
                />))}
                {!!editCategory && <NewCategoryItem setEditCategory={setEditCategory} itemSpecs={itemSpecs} setItemSpecs={setItemSpecs} editSpecs={editCategory.value} editCategoryName={editCategory.name} />}
                <img
                    onClick={() => {
                        setTechnicalSpecs(specs => [...specs, specs.length + 1])
                    }} className={`${DEFAULT_CLASSNAME}_item_info_specs_new`}
                    src={addNewSpecCategory}
                    alt={'image'}
                />
            </div>
        </React.Fragment>
    )
}