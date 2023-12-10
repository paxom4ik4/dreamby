import React, { useEffect } from 'react';

export const useClickOutside = (ref, callback) => {
  const handleClick = (e) => {
    if (e.target.closest('div').className.includes('catalog-class')) {
      return;
    }

    if (e.target.className.includes('header_tablet_catalog')) {
      return;
    }

    if (e.target.className.includes('catalog-item')) {
      return;
    }

    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.addEventListener('mousedown', handleClick);
    };
  });
};
