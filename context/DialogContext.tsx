import React, { createContext, useContext, useState } from "react";

interface DialogContextType {
  openDialog: (id: string) => void;
  closeDialog: () => void;
  isOpen: boolean;
}

const DialogContext = createContext<DialogContextType | null>(null);

export const DialogContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [dialogId, setDialogId] = useState<string | null>(null);

  return (
    <DialogContext.Provider
      value={{
        openDialog: setDialogId,
        closeDialog: () => setDialogId(null),
        isOpen: !!dialogId,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const ctx = useContext(DialogContext);

  if (!ctx) {
    console.error("useDialog must be used inside DialogContextProvider");
    return {
      openDialog: () => {},
      closeDialog: () => {},
      isOpen: false,
    };
  }

  return ctx;
};
