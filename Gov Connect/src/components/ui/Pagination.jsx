import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/utils/cn';
export const Pagination = ({ currentPage, totalPages, onPageChange, className, }) => {
    const getPageNumbers = () => {
        const maxVisible = 7;
        const pages = [];
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++)
                    pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            }
            else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 4; i <= totalPages; i++)
                    pages.push(i);
            }
            else {
                pages.push(1);
                pages.push('ellipsis');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }
        return pages;
    };
    if (totalPages <= 1)
        return null;
    return (<nav className={cn('flex items-center justify-center gap-1', className)} aria-label="Pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg text-[#7D6E63] hover:bg-[#EDEDE9] disabled:opacity-50 disabled:pointer-events-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#59463B]/40" aria-label="Previous page">
        <ChevronLeft className="w-5 h-5"/>
      </button>

      {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis') {
                return (<span key={`ellipsis-${index}`} className="px-2 text-[#7D6E63]">
              <MoreHorizontal className="w-5 h-5"/>
            </span>);
            }
            const isCurrent = page === currentPage;
            return (<button key={`page-${page}`} onClick={() => onPageChange(page)} aria-current={isCurrent ? 'page' : undefined} className={cn('min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#59463B]/40', isCurrent
                    ? 'bg-[#59463B] text-white'
                    : 'text-[#7D6E63] hover:bg-[#EDEDE9] hover:text-[#2D231E]')}>
            {page}
          </button>);
        })}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg text-[#7D6E63] hover:bg-[#EDEDE9] disabled:opacity-50 disabled:pointer-events-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#59463B]/40" aria-label="Next page">
        <ChevronRight className="w-5 h-5"/>
      </button>
    </nav>);
};
