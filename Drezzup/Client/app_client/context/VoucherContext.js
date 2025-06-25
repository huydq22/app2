import { createContext, useContext, useState } from 'react';

const VoucherContext = createContext();

export function VoucherProvider({ children }) {
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  return (
    <VoucherContext.Provider value={{ selectedVoucher, setSelectedVoucher }}>
      {children}
    </VoucherContext.Provider>
  );
}

export function useVoucher() {
  const context = useContext(VoucherContext);
  if (!context) {
    throw new Error('useVoucher must be used within a VoucherProvider');
  }
  return context;
} 