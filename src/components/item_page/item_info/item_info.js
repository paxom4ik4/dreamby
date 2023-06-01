import React, { useState } from 'react';

import './item_info.scss';

import { ContentBlock } from "../../common/content_block/content_block";
import { Table } from "../../common/table/table";
import { Review } from "../../common/review/review";
import {useNavigate} from "react-router-dom";

const DEFAULT_CLASSNAME = 'item-info';

export const ItemInfo = ({ id, itemData, technicalSpecs, contentData = [], loginData, setLoginData }) => {
  const navigate = useNavigate();

  const sections = [!!contentData.length && 'Описание', technicalSpecs.length && 'Технические характеристики', (!!itemData.product.services.length || !!itemData.product.ServicePrice.length) && 'Услуги', 'Отзывы'].filter(Boolean);

  const [section, setSection] = useState(sections[0])

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_title`}>{'Информация о товаре'}</div>
      <div className={`${DEFAULT_CLASSNAME}_menu`}>
        {sections.map(item => <div onClick={() => setSection(item)} className={`${DEFAULT_CLASSNAME}_menu_item ${section === item && 'active_menu_item'}`}>{item}</div>)}
      </div>
      <div className={`${DEFAULT_CLASSNAME}_content`}>
        {section === 'Описание' && itemData?.product.Information.map(data => {
            return <ContentBlock imagePosition={data.pic_pos} image={data.img_path} text={data.text} colored={data.color} textColor={data.color_text} title={data.title} textPosition={data.textPosition} />
        })}
        {section === 'Технические характеристики' && technicalSpecs.map(item => <Table tableConfig={item} />)}
        {section === 'Отзывы' && <Review itemData={itemData} id={id} isAuthorized={!!loginData} setLoginData={setLoginData} />}
          {section === 'Услуги' && <div className={`${DEFAULT_CLASSNAME}_services`}>
            {itemData.product.ServicePrice.length ? <Table
                  tableConfig={{
                      headerRight: "Цена",
                      headerLeft: "Услуга",
                      tableItems: itemData.product.ServicePrice.map(service => {
                          return {
                              title: service.service.name,
                              value: service.price,
                              onClick: () => navigate(`/services/${service.service.id}`)
                          }
                      })
                  }}
            /> : <div style={{ textAlign: "center", paddingTop: "32px" }}>Нет услуг для данного товара</div>}
          </div>}
      </div>
    </div>
  )
}