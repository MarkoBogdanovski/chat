export function createMessage({ text, timestamp, user = 'Anonymous', type = 'message' }) {
    return {
      text,
      timestamp,
      user,
      type,
      formattedTime: new Date(timestamp).toLocaleTimeString(),
    };
  }
  