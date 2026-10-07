import React from 'react';
import { Button } from './Button';
import { cn } from '@/utils/cn';
export const EmptyState = ({ icon, title, description, action, className, }) => {
    return (<div className={cn('flex flex-col items-center justify-center text-center py-16 px-8', className)}>
      {icon && (<div className="bg-[#EDEDE9] rounded-full p-4 mb-4 text-[#7D6E63] flex items-center justify-center">
          {icon}
        </div>)}
      <h3 className="text-lg font-semibold text-[#2D231E] mb-2">{title}</h3>
      <p className="text-[#7D6E63] text-sm max-w-md mb-6">{description}</p>
      {action && (React.isValidElement(action) ? (action) : typeof action === 'object' && 'label' in action && 'onClick' in action ? (<Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>) : null)}
    </div>);
};
