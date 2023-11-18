import React from 'react';

import './category_card.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

import categoryCardExample from './category_card.png';

import phonesAndTables from './Apple-IPhone-15-Natural-Titanium-PNG.png';

export const cardSize = {
  default: 'DEFAULT',
  wide: 'WIDE',
  high: 'HIGH',
};

const DEFAULT_CLASSNAME = 'category_card';

export const CategoryCard = ({
  cardImage,
  linkCard = false,
  link,
  clickHandler,
  setSelectedCategory,
  categoryId,
  title = 'Аксессуары',
  itemsAmount = '22',
  categoryLink,
  image = categoryCardExample,
  size = cardSize.default,
  setSelectedCategoryName,
  hideAmount = false,
  hideLink = false,
}) => {
  const navigate = useNavigate();

  const linkArrow = <FontAwesomeIcon icon={faCircleArrowRight} />;

  const cardStyle = {
    flexDirection: size === cardSize.wide ? 'row' : 'column',
    gridRow: size === cardSize.high && 'span 2',
    gridColumn: size === cardSize.wide && 'span 2',
  };

  const contentStyle = {
    width: size === cardSize.wide ? '40%' : 'auto',
  };

  const categoryCardHandler = () => {
    setSelectedCategory(categoryId);
    setSelectedCategoryName(title);
    navigate('/catalog');
  };

  // const token = sessionStorage.getItem('admin-dream-token');

  // const deleteCategory = (id) => {
  //   fetch(`${process.env["REACT_APP_API_URL"]}category/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       'Content-Type': 'application/json',
  //       "Authorization": token,
  //     }
  //   }).finally(() => {
  //     setDataChanges(dataChanges + 1);
  //     toast("Категория Удалена")
  //   })
  // }

  // const [isEditMode, setIsEditMode] = useState(false)
  // const [newTitle, setNewTitle] = useState(title);
  //
  // const saveCategory = (event) => {
  //   event.preventDefault();
  //
  //   const file = event.target['1'].files[0];
  //
  //   const formData = new FormData();
  //
  //   if (!!file) {
  //     formData.append('file', file);
  //     formData.append('categoryName', newTitle);
  //
  //     fetch(`${process.env["REACT_APP_API_URL"]}category/${categoryId}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Authorization": token,
  //       },
  //       body: formData
  //     })
  //         .finally(() => setIsEditMode(false));
  //   } else {
  //     const formData = new FormData();
  //     formData.append('categoryName', newTitle);
  //
  //     fetch(`${process.env["REACT_APP_API_URL"]}category/${categoryId}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Authorization": token,
  //       },
  //       body: formData
  //     })
  //         .finally(() => {
  //           setIsEditMode(false)
  //           setDataChanges(dataChanges + 1)
  //         });
  //   }
  // }

  // const [imagePreview, setImagePreview] = useState(null);

  if (linkCard)
    return (
      <Link
        itemScope
        itemType="https://schema.org/Product"
        to={link}
        className={`${DEFAULT_CLASSNAME}`}
        style={{ ...cardStyle, maxHeight: size === cardSize.high && '800px' }}
        onClick={clickHandler ? clickHandler : () => categoryCardHandler()}>
        <div className={`${DEFAULT_CLASSNAME}_content`} style={contentStyle}>
          <div className={`${DEFAULT_CLASSNAME}_title`} itemProp="name">
            {title}
          </div>
          <meta content="BYN" itemProp="priceCurrency" />
          {!hideAmount && (
            <div
              className={`${DEFAULT_CLASSNAME}_amount`}
              itemProp="offers"
              itemScope
              itemType="http://schema.org/Offer">
              <meta itemProp="offerCount" content={itemsAmount} />
              <meta itemProp="priceCurrency" content="BYN" />

              <span style={{ display: 'none' }} itemProp="price">
                119.99
              </span>
              {`Товаров: ${itemsAmount}`}
            </div>
          )}
          {!hideLink && (
            <div className={`${DEFAULT_CLASSNAME}_link`}>
              <a itemProp="url" href={categoryLink || '#'}>
                <span>{'Смотреть модели'}</span>
                {linkArrow}
              </a>
            </div>
          )}
        </div>
        <img
          itemProp="image"
          style={{ width: size === cardSize.wide ? '50%' : '100%' }}
          className={`${DEFAULT_CLASSNAME}_image`}
          src={
            title === 'Телефоны и планшеты'
              ? phonesAndTables
              : image?.includes('http')
              ? image
              : `http://194.62.19.52:7000/${image}`
          }
          alt={'category-src'}
        />
      </Link>
    );

  return (
    <div
      className={`${DEFAULT_CLASSNAME}`}
      style={{ ...cardStyle, maxHeight: size === cardSize.high && '800px' }}
      onClick={clickHandler ? clickHandler : () => categoryCardHandler()}>
      <div
        itemScope
        itemType="https://schema.org/Product"
        className={`${DEFAULT_CLASSNAME}_content`}
        style={contentStyle}>
        <div className={`${DEFAULT_CLASSNAME}_title`} itemProp="name">
          {title}
        </div>
        {!hideAmount && (
          <div
            className={`${DEFAULT_CLASSNAME}_amount`}
            itemProp="offers"
            itemScope
            itemType="http://schema.org/Offer">
            <meta itemProp="offerCount" content={itemsAmount} />
            <meta itemProp="priceCurrency" content="BYN" />

            <span style={{ display: 'none' }} itemProp="price">
              119.99
            </span>
            {`Товаров: ${itemsAmount}`}
          </div>
        )}
        {!hideLink && (
          <div className={`${DEFAULT_CLASSNAME}_link`}>
            <a itemProp="url" href={categoryLink || '#'}>
              <span>{'Смотреть модели'}</span>
              <span color={'#000'} className={`${DEFAULT_CLASSNAME}_link_arrow`}>
                {linkArrow}
              </span>
            </a>
          </div>
        )}
      </div>
      <img
        itemProp="image"
        style={{ width: size === cardSize.wide ? '50%' : '100%' }}
        className={`${DEFAULT_CLASSNAME}_image`}
        src={
          title === 'Телефоны и планшеты'
            ? phonesAndTables
            : image?.includes('http')
            ? image
            : `http://194.62.19.52:7000/${image}`
        }
        alt={'category-src'}
      />
    </div>
  );
};
