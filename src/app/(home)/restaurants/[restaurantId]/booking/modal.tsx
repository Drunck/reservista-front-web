import { ModalProps } from '@/lib/types';
import { CloseIcon } from '@/ui/components/icons';
import React from 'react'


export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" value="Close Modal">
          <CloseIcon className='w-4 h-4' />
        </button>
        {children}
      </div>
    </div>
  );
};
