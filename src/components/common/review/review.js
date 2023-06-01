import React, { useState } from "react";

import './review.scss';
import { Registration } from "../registration/registration";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom";
import {Login} from "../../login";

const DEFAULT_CLASSNAME = 'review';

export const Review = ({ itemData, isAuthorized, id, setLoginData }) => {
    const navigate = useNavigate();

  const reviewNotify = () => toast("Ваш отзыв принят!", {
    type: "info"
  });

  const reviewNotifyEmpty = () => toast("Ваш отзыв не может быть пустым", {
    type: "error"
  });

  const [comments, setComments] = useState(itemData?.product.reviews);

  const [reviewText, setReviewText] = useState("");

  const reviewHandler = () => {
    const token = sessionStorage.getItem('token');

    if (!reviewText.trim()) {
        reviewNotifyEmpty();
        return;
    }

    fetch(`${process.env.REACT_APP_API_URL}product/makereview/${id}`, {
      method: "POST",
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      body: JSON.stringify({
        text: reviewText.trim(),
        raiting: 10,
      })
    }).then(res => res.json())
      .finally(() => {
          reviewNotify();
            setReviewText("");
      });
  }

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_comments`}>
        {!comments.length &&
        <div className={`${DEFAULT_CLASSNAME}_no-comments`}>
          {'Пока что никто не оставил комментарий. Будьте первым!'}
          {!isAuthorized && <div>
            Чтобы оставить комментарий <span onClick={() => navigate('/login')} className="colored_span">войдите</span> или <span onClick={() => navigate('/registration')} className="colored_span">зарегистрируйтесь</span>
          </div>}
        </div>
        }
      </div>
      <div className={`${DEFAULT_CLASSNAME}_own`}>
        {isAuthorized && <div className={`${DEFAULT_CLASSNAME}_own_title`}>{"Оставить комментарий"}</div>}
        {isAuthorized && <textarea value={reviewText} onChange={(e) => setReviewText(e.currentTarget.value)} className={`${DEFAULT_CLASSNAME}_own_text`} />}
        {!isAuthorized && <Login fromReview={true} setLoginData={setLoginData} />}
        {isAuthorized && <div className={`${DEFAULT_CLASSNAME}_submit-btn`} onClick={reviewHandler}>{'Отправить'}</div>}
      </div>
        <div className={`${DEFAULT_CLASSNAME}_comments_content`}>
            <div className={`${DEFAULT_CLASSNAME}_comments_content_title`}>Комментарии</div>
            {comments?.map(item => {
                return (
                    <div className={`${DEFAULT_CLASSNAME}_comments_content_item`}>
                        <div>{item.authorName}</div>
                        <div>{item.text}</div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}