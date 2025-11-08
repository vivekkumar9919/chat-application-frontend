import toast from "react-hot-toast";
import Toast from "../components/customs/toast";

class ToastService {
    static show(type, message, options, setTimeoutTime = 1500) {
        const toastType = type.toLowerCase();
        const fakePromise = new Promise((resolve) =>
            setTimeout(resolve, setTimeoutTime)
        )
        switch (toastType) {
            case "success":
                return toast.success(message, options);
            case "error":
                return toast.error(message, options);
            case "loading":
                return toast.loading(message, options);
            case "promise":

                return toast.promise(fakePromise, {
                    loading: "Please wait…",
                    success: message || "Completed!",
                    error: "Oops! Something failed",
                });
            case "notify":
                return toast.custom((t) => (
                    Toast(t, message, options)
                ))
            default:
                return toast(message, options);
        }
    }
}

export default ToastService;