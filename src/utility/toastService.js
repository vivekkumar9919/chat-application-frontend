import toast from "react-hot-toast";

class ToastService {
    static show(type, message, options) {
        const toastType = type.toLowerCase();
        const fakePromise = new Promise((resolve) =>
            setTimeout(resolve, 1500)
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
            default:
                return toast(message, options);
        }
    }
}

export default ToastService;