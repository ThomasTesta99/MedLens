'use client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Providers() {
  return (
    <ToastContainer
      position="top-right"
      theme="dark"
      closeOnClick
      pauseOnHover
      newestOnTop
      draggable
      autoClose={10000}
      className="!top-5 !right-5 !w-auto !max-w-[92vw] md:!max-w-md z-[9999]"
      toastClassName={(ctx) =>
        [
          '!relative !rounded-2xl !px-5 !py-4 !shadow-2xl !border !backdrop-blur',
          'bg-white/10 border-white/15 text-slate-100',
          ctx?.type === 'success' && 'border-emerald-400/30',
          ctx?.type === 'error' && 'border-rose-400/30',
          ctx?.type === 'info' && 'border-sky-400/30',
          ctx?.type === 'warning' && 'border-amber-400/30'
        ]
          .filter(Boolean)
          .join(' ')
      }
      progressClassName="!bg-indigo-400"
      closeButton={({ closeToast }) => (
        <button
          onClick={closeToast}
          className="absolute top-2 right-2 text-slate-300 hover:text-white transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      )}
      style={{ backdropFilter: 'blur(8px)' }}
    />
  );
}
