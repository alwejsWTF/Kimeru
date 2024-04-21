import React, { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const showToast = (message, type = "default") => {
    toast(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: type,
      className: `bg-${type} text-white`,
      bodyClassName: "text-white"
    });
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};
