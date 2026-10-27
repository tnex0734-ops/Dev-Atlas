import React from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useProject();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="h-4 w-4 text-[#047857] shrink-0" />,
          error: <AlertCircle className="h-4 w-4 text-[#ee0000] shrink-0" />,
          info: <Info className="h-4 w-4 text-[#0070f3] shrink-0" />,
          amber: <Sparkles className="h-4 w-4 text-[#f5a623] shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 rounded-[8px] border border-[#ebebeb] bg-white px-4 py-3 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] transition-all duration-150 animate-fade-in"
          >
            {icons[toast.type]}
            <p className="text-xs font-medium text-[#171717] max-w-xs">{toast.text}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-[#8f8f8f] hover:text-[#171717] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
