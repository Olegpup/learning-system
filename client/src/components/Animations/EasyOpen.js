import React, { useState, useEffect } from 'react';

const EasyOpen = ({ children, onClose, duration = 700, transitionStyles = 'transition-all ease-in-out' }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsOpen(true), 10);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration-250);
  };

  return (
    <div
      className={`${transitionStyles} duration-${duration} ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}
    >
      {children(handleClose)}
    </div>
  );
};

export default EasyOpen;
