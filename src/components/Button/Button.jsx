import Loader from "../Loader/Loader";

function Button({ children, loading, ...props }) {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                   py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 
                   transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <>
                    <Loader size={18} color="white" />
                    <span>Processing...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}

export default Button;
