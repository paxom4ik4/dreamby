import React from 'react';

import './content_block.scss';

const DEFAULT_CLASSNAME = 'content_block';

export const ContentBlock = ({ imagePosition = 'left', image, text, title, colored, textColor, textPosition = 'right'}) => {
  return (
    <div className={`${DEFAULT_CLASSNAME}`} style={{ background: colored === "#0B3FC5" ? "linear-gradient(271.38deg, #0B3FC5 -8.46%, #0681E4 75.71%)" : "#FFFFFF" }}>
      {imagePosition === 'left'
        ? <div className={`${DEFAULT_CLASSNAME}_image_wrapper`}><img className={`${DEFAULT_CLASSNAME}_image`} src={image.includes('http') ? image : `http://194.62.19.52:7000/${image}`} alt={'content-block-image'} /></div>
        : <div className={`${DEFAULT_CLASSNAME}_textBlock`} style={{ textAlign: "right"}}>
            <div className={`${DEFAULT_CLASSNAME}_title`} style={{ color: textColor}}>{title}</div>
            <div className={`${DEFAULT_CLASSNAME}_text`} style={{ color: textColor, width: "100%", whiteSpace: "pre-line"}}>
              {Array.isArray(text) ? text.map(item => <div style={{ color: textColor}}>{item}</div>) : text}
            </div>
          </div>
      }
      {imagePosition === 'right'
        ? <div className={`${DEFAULT_CLASSNAME}_image_wrapper`}><img className={`${DEFAULT_CLASSNAME}_image`} src={image.includes('http') ? image : `http://194.62.19.52:7000/${image}`} alt={'content-block-image'} /></div>
        : <div className={`${DEFAULT_CLASSNAME}_textBlock`}>
            <div className={`${DEFAULT_CLASSNAME}_title`} style={{ color: textColor}}>{title}</div>
            <div className={`${DEFAULT_CLASSNAME}_text`} style={{ color: textColor, width: "100%", whiteSpace: "pre-line"}}>
              {Array.isArray(text) ? text.map(item => <div>{item}</div>) : text}
            </div>
          </div>
      }
    </div>
  )
}