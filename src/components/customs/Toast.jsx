import toast from "react-hot-toast";

const Toast = (t, message, options) => {
  return (
    <div
      className={`${
        t.visible ? "animate-custom-enter" : "animate-custom-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col ring-1 ring-black ring-opacity-5`}
    >
      {/* 🔔 Beautiful heading section */}
      <div className="bg-blue-600 text-white text-center py-2 rounded-t-lg">
        <h3 className="text-sm font-semibold tracking-wide uppercase">
          💬 New Message Notification
        </h3>
      </div>

      {/* Message content */}
      <div className="flex-1 w-full p-4 flex">
        <div className="flex-shrink-0 pt-0.5">
          <img
            className="h-10 w-10 rounded-full"
            src={options.avatar_url}
            alt="avatar-url"
          />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {options.display_name}
          </p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
      </div>

      {/* Close button */}
      <div className="flex border-t border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full rounded-b-lg py-2 text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Toast;
