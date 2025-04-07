export function formatDateTime(dateTimeString?: any) {
    if (!dateTimeString) {
      return { formattedDate: "", formattedTime: "" };
    }
    const dateTime = new Date(dateTimeString);
    const formattedDate = `${dateTime.getDate().toString().padStart(2, "0")}/${(
      dateTime.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${dateTime.getFullYear()}`;
    const formattedTime = `${dateTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${dateTime.getSeconds().toString().padStart(2, "0")}`;
    return { formattedDate, formattedTime };
  };