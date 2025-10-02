

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
  
  // Format to 12-hour time with AM/PM
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return formattedTime;
}

export { formatTimestamp };