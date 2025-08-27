import { useState } from 'react';

export const useModal = () => {
  const [show, setShow] = useState(false);
  const [item, setItem] = useState(null);

  const openModal = (data = null) => {
    setItem(data);
    setShow(true);
  };

  const closeModal = () => {
    setItem(null);
    setShow(false);
  };

  return { show, item, openModal, closeModal };
};
