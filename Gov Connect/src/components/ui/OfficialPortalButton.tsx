import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

export interface OfficialPortalButtonProps {
  url: string;
  label?: string;
  className?: string;
}

export const OfficialPortalButton: React.FC<OfficialPortalButtonProps> = ({
  url,
  label = 'View Official Portal',
  className,
}) => {
  return (
    <Button
      variant="primary"
      className={cn('', className)}
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      rightIcon={<ExternalLink className="w-4 h-4" />}
    >
      {label}
    </Button>
  );
};
