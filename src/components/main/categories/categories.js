import React from 'react';

import './categories.scss';
import { cardSize, CategoryCard } from '../../common/category_card/category_card';
import { objReplacer } from '../../catalog/catalog';

const DEFAULT_CLASSNAME = 'categories';

export const Categories = ({ setSelectedCategoryName, setSelectedCategory, categories }) => {
  return (
    <div className={DEFAULT_CLASSNAME}>
      {categories &&
        categories.map((category, index) => {
          let size;

          if (['Телефоны и планшеты'].includes(category.categoryName)) {
            size = cardSize.high;
          }
          if (
            [
              'Товары для дома',
              'Компьютеры и сети',
              'Товары для спорта и активного отдыха',
              'Часы и фитнес-браслеты',
            ].includes(category.categoryName)
          ) {
            size = cardSize.wide;
          }

          return (
            <CategoryCard
              linkCard={true}
              link={`/catalog/${objReplacer[category.categoryName]}`}
              key={category.id.toString()}
              setSelectedCategory={setSelectedCategory}
              setSelectedCategoryName={setSelectedCategoryName}
              categoryId={category.id}
              title={category.categoryName}
              itemsAmount={
                category._count.products > 0 ? category._count.products : 'Нет в наличии'
              }
              image={category.img_path}
              categoryLink={category.categoryLink}
              size={size}
            />
          );
        })}
    </div>
  );
};
