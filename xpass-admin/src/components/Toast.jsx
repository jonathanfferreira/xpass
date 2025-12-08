import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

/**
 * A container for displaying toast notifications.
 *
 * Renders a list of ToastItem components.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.toasts - Array of toast objects.
 * @param {Function} props.removeToast - Callback to remove a toast by ID.
 * @returns {JSX.Element} The rendered ToastContainer.
 */
const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

/**
 * An individual toast notification component.
 *
 * Displays a message with an icon and auto-dismisses after a timeout.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.toast - The toast data.
 * @param {string} props.toast.id - Unique ID of the toast.
 * @param {'success'|'error'|'info'} props.toast.type - Type of the toast.
 * @param {string} props.toast.title - Title of the toast.
 * @param {string} [props.toast.message] - Optional message body.
 * @param {Function} props.onRemove - Callback to remove the toast.
 * @returns {JSX.Element} The rendered ToastItem.
 */
const ToastItem = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onRemove]);

    const styles = {
        success: 'bg-onyx-900 border-green-500/50 text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]',
        error: 'bg-onyx-900 border-red-500/50 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]',
        info: 'bg-onyx-900 border-blue-500/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]',
    };

    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <AlertCircle size={20} className="text-red-500" />,
        info: <Info size={20} className="text-blue-500" />,
    };

    return (
        <div className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border w-80 animate-in slide-in-from-right duration-300 relative overflow-hidden group ${styles[toast.type]}`}>
            {/* Background Gloss */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 mr-2">
                <h4 className="text-sm font-bold font-heading uppercase tracking-wide">{toast.title}</h4>
                {toast.message && <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{toast.message}</p>}
            </div>
            <button onClick={onRemove} className="text-zinc-500 hover:text-white transition-colors">
                <X size={16} />
            </button>

            {/* Progress Bar (Visual only) */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 w-full animate-[shrink_4s_linear_forwards]" />
        </div>
    );
};

export default ToastContainer;
