import React, { useEffect, useRef, useState } from 'react';

import './new-catalog.scss';
import { useQuery } from 'react-query';
import API from '../../api';
import { NewCategoryCard } from './components/new-category-card/new-category-card';
import { Loader } from '../common/loader/loader';
import { NewSubcategoryCard } from './components/new-subcategory-card/new-subcategory-card';
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from '../../hooks/useClickOutside';

const DEFAULT_CLASSNAME = 'new-catalog';

const getCategories = () => {
  return API.get('/category').then((res) => res.data);
};

const getSubCategories = (categoryId) => {
  return API.get(`/category/${categoryId}`).then((res) => res.data);
};

export const NewCatalog = ({ selectedCategory, selectedSubcategory, setIsCatalogOpened }) => {
  const navigate = useNavigate();

  const newCatalogRef = useRef();

  useClickOutside(newCatalogRef, () => setIsCatalogOpened(false));

  const { data: categories, isLoading } = useQuery(['categories'], () => getCategories());
  const [activeCategory, setActiveCategory] = useState(null);

  const { data: subcategories, isLoading: isSubcategoriesLoading } = useQuery(
    ['subcategories', activeCategory],
    () => getSubCategories(activeCategory.id),
  );
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  useEffect(() => {
    if (categories?.length) {
      if (selectedCategory && selectedSubcategory) {
        setActiveSubcategory(selectedSubcategory);

        setActiveCategory(categories.find((item) => item.id === selectedCategory));
      } else {
        setActiveCategory(categories[0]);
      }
    }
  }, [categories, selectedCategory, selectedSubcategory]);

  const openSubcategoryHandler = (subcategoryLinkName) => {
    navigate(`catalog/${activeCategory.link_name}/${subcategoryLinkName}`);
    setIsCatalogOpened(false);
  };

  if (isLoading) {
    return (
      <div className={DEFAULT_CLASSNAME}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={DEFAULT_CLASSNAME} ref={newCatalogRef}>
      <div className={`${DEFAULT_CLASSNAME}_categories`}>
        {categories.map((category, index) => (
          <>
            <NewCategoryCard
              key={category.id}
              onClick={() => setActiveCategory(category)}
              active={category.id === activeCategory?.id}
              index={index}
              title={category.categoryName}
              amount={category._count.products}
              image={category.img_path}
            />
            {category === activeCategory && (
              <div className={`${DEFAULT_CLASSNAME}_categories_subCategories`}>
                {!!subcategories &&
                  subcategories?.subcats.map((subcategory, index) => (
                    <NewSubcategoryCard
                      active={subcategory.id === activeSubcategory}
                      onClick={() => openSubcategoryHandler(subcategory.link_name)}
                      key={subcategory.id}
                      title={subcategory.name}
                      image={subcategory.img_path}
                      index={index}
                    />
                  ))}
              </div>
            )}
          </>
        ))}
      </div>
      <div className={`${DEFAULT_CLASSNAME}_sub-categories`}>
        {isSubcategoriesLoading && <Loader />}

        <div className={`${DEFAULT_CLASSNAME}_sub-categories_title`}>
          {activeCategory?.categoryName}
        </div>

        <div className={`${DEFAULT_CLASSNAME}_sub-categories_list`}>
          {!isSubcategoriesLoading &&
            !!subcategories &&
            subcategories?.subcats.map((subcategory, index) => (
              <NewSubcategoryCard
                active={subcategory.id === activeSubcategory}
                onClick={() => openSubcategoryHandler(subcategory.link_name)}
                key={subcategory.id}
                title={subcategory.name}
                image={subcategory.img_path}
                index={index}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
