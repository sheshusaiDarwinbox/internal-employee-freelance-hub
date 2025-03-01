export const formatDate = (date) => {
  if (!date) return "";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }
    return dateObj.toLocaleDateString("en-US", options);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};
