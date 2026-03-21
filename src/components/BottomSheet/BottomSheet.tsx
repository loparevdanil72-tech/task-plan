import type { ReactNode } from 'react';
import './BottomSheet.css';

interface Props {
  children: ReactNode;
  onClose: () => void;
}

export function BottomSheet({ children, onClose }: Props) {
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="bottom-sheet">
        {children}
      </div>
    </>
  );
}
