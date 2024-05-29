import { PopoverProps } from '@/lib/types'
import { useEffect, useRef } from 'react';

export default function PopoverMenu({ isOpen, onClose, children }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'pointer-events-none'}`}>
      <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className="w-full h-full flex justify-end items-center">
        <div 
          ref={popoverRef} 
          className={`h-full w-[calc(100%-100px)] bg-white shadow-md p-4 transform transition duration-300 ease-in-out ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
