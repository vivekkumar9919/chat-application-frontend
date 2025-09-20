function ErrorMessage({ message }) {
    if (!message) return null;
    return (
      <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
        {message}
      </div>
    );
  }
  
  export default ErrorMessage;
  