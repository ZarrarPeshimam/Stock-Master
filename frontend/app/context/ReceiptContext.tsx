import React, { createContext, useContext, useState } from "react";

const ReceiptContext = createContext(null);

export const ReceiptProvider = ({ children }) => {
  const [receipts, setReceipts] = useState([]);

  const addReceipt = (receipt) => {
    setReceipts((prev) => [...prev, receipt]);
  };

  return (
    <ReceiptContext.Provider value={{ receipts, addReceipt }}>
      {children}
    </ReceiptContext.Provider>
  );
};

export const useReceipts = () => useContext(ReceiptContext);
