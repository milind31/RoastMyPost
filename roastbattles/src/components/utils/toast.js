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

export const successToast = (message) => {
    toast.success(message, {
        style: { fontFamily: 'Roboto Mono, monospace', width:'75%', height:'50%', textAlign:'left' },
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

export const infoToast = (message) => {
    toast.info(message, {
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