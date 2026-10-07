import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/utils/cn';
const TabsContext = createContext(undefined);
export const Tabs = ({ defaultValue = '', value, onChange, onValueChange, children, className, }) => {
    const [internalTab, setInternalTab] = useState(defaultValue);
    const activeTab = value !== undefined ? value : internalTab;
    const setActiveTab = (newValue) => {
        if (value === undefined) {
            setInternalTab(newValue);
        }
        if (onChange) {
            onChange(newValue);
        }
        if (onValueChange) {
            onValueChange(newValue);
        }
    };
    return (<TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>);
};
export const TabsList = ({ children, className, }) => {
    return (<div className={cn('flex gap-0 border-b border-[#D6CCC2] mb-6', className)}>
      {children}
    </div>);
};
export const TabsTrigger = ({ value, children, className, }) => {
    const context = useContext(TabsContext);
    if (!context)
        throw new Error('TabsTrigger must be used within Tabs');
    const isActive = context.activeTab === value;
    return (<button onClick={() => context.setActiveTab(value)} className={cn('px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#59463B]/40', isActive
            ? 'border-[#59463B] text-[#59463B]'
            : 'border-transparent text-[#7D6E63] hover:text-[#2D231E]', className)}>
      {children}
    </button>);
};
export const TabsContent = ({ value, children, className, }) => {
    const context = useContext(TabsContext);
    if (!context)
        throw new Error('TabsContent must be used within Tabs');
    if (context.activeTab !== value)
        return null;
    return <div className={className}>{children}</div>;
};
