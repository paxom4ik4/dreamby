import React from 'react';

import './table.scss';

const DEFAULT_CLASSNAME = 'table'

export const Table = ({ tableConfig }) => {
  const { headerLeft, headerRight, tableItems } = tableConfig

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_header`}>
        <div>{headerLeft || "Вид работы"}</div>
        <div>{headerRight === null ? "" : headerRight || "Стоимость"}</div>
      </div>
      {tableItems.map((item) => {
        return <div onClick={item.onClick} className={`${DEFAULT_CLASSNAME}_item`}>
          <div>{item.title}</div>
          <div style={{width: item.second_value && '25%'}}>{item.value}</div>
          {item.second_value && <div>{item.second_value}</div>}
        </div>
      })}
    </div>
  )
}