import React, { createContext, useContext, useState } from "react";

// 1. Create context
const SidebarContext = createContext();

// 2. Context provider
export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, setIsSidebarOpen, toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// 3. Custom hook for easier usage
export const useSidebar = () => useContext(SidebarContext);
