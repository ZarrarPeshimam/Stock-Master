import React, { createContext, useContext, useState } from "react";

const DeliveryContext = createContext();

export function DeliveryProvider({ children }) {
  const [deliveries, setDeliveries] = useState([]);

  function addDelivery(newDelivery) {
    setDeliveries([...deliveries, newDelivery]);
  }

  return (
    <DeliveryContext.Provider value={{ deliveries, addDelivery }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  return useContext(DeliveryContext);
}
