//Toasts
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Configure toasts
toast.configure();

export const errorToast = (message) => {
    toast.error(message, {
        style: { fontFamily: 'Roboto Mono, monospace', textAlign:'left' },
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}