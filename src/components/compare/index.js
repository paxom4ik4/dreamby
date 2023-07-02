import React, { useEffect, useState } from 'react';

import './index.scss';
import { ItemCard } from "../common/item_card/item_card";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";
import {objReplacer} from "../catalog/catalog";

const DEFAULT_CLASSNAME = 'compare';

export const Compare = ({ deleteFromCompare, compareItems }) => {

  const navigate = useNavigate();

  const [compareData, setCompareData] = useState(null);

  useEffect(() => {
    if (compareItems.length) {
      fetch(`${process.env["REACT_APP_API_URL"]}product/compare`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          "prod_ids": compareItems.map(item => item?.id)
        })
      }).then(res => res.json()).then(data => setCompareData(data));
    }
  }, [compareItems]);

  const ids = compareData?.find(item => item.key === "id");
  const names = compareData?.find(item => item.key === "name");
  const prices = compareData?.find(item => item.key === "price");
  const images = compareData?.find(item => item.key === "img_path");
  const items = compareData?.find(item => item.key === "characteristics");

  if (compareItems.length === 0) {
    return <>
      <Helmet>
        <title>DreamStore - Сравнение (Товаров не выбрано)</title>
        <meta name="description" content="Страница сравнения товаров" />
      </Helmet>

      <div style={{ marginTop: "32px", textAlign: "center" }}>Выберите товары для сравнения в
      <span onClick={() => navigate('/catalog')} style={{ color: "#0A5BD3", cursor: "pointer" }}> Каталоге</span>
    </div></>
  }

  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper`}>
      <div className={`${DEFAULT_CLASSNAME}_title`}>{"Сравнение товаров"}</div>

      {!!compareData && <>

        <Helmet>
          <title>DreamStore - Сравнение</title>
          <meta name="description" content="Страница сравнения товаров" />
        </Helmet>

        <div className={`${DEFAULT_CLASSNAME}_sub-title`}>{'Технические характеристики'}</div>
      </>
      }

      <div className={DEFAULT_CLASSNAME}>
        <>
          {!!compareData &&
            <>
              <div className={`${DEFAULT_CLASSNAME}_goods`}>

                <Helmet>
                  <title>DreamStore - Сравнение</title>
                  <meta name="description" content="Страница сравнения товаров" />
                  <link rel="canonical" href="https://dreamstore.by/compare"/>
                </Helmet>

                <div className={`${DEFAULT_CLASSNAME}_goods_content`}>
                  {compareItems.map((item, index) => {
                      const categoryName = objReplacer[item?.category?.categoryName];
                      const subcategory = item?.subcategory?.link_name;

                      return (
                        <ItemCard
                          clickLink={`${categoryName}/${subcategory}/${item.id}`}
                          productId={ids?.value[index]}
                          image={images?.value[index]}
                          title={names?.value[index]}
                          price={prices?.value[index]}
                          roundedBorders={true}
                          compareMode={true}
                          deleteFromCompare={(event) => deleteFromCompare(item, event)}
                        />
                      )
                    }
                  )}
                </div>
              </div>
              <div className={`${DEFAULT_CLASSNAME}_goods_items`}>
                <>
                  {!!items.value.length && items?.value?.map(item => (
                    <>
                      <div className={`${DEFAULT_CLASSNAME}_subtitle`}>{item.key}</div>
                      {item.value?.map(item2 => (
                        <div className={`${DEFAULT_CLASSNAME}_subitem`}>
                          <div className={`${DEFAULT_CLASSNAME}_subtitle2`}>{item2.key}</div>
                          <div className={`${DEFAULT_CLASSNAME}_values ${compareItems.length === 1 && "only-one-item"}`}>
                            {compareItems.map((it, index) => <div>{item2.value[index] ?? "Нет данных"}</div>)}
                          </div>
                        </div>
                      ))}
                    </>
                  ))}
                </>
              </div>
            </>
          }
        </>
      </div>
    </div>
  )
}
