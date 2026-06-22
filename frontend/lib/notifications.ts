export function getErrorMessage(error: any): string {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}

export function showErrorNotification(error: any) {
  const message = getErrorMessage(error);
  console.error("Error:", message);
  alert(message);
}

export function showSuccessNotification(message: string) {
  console.log("Success:", message);
  alert(message);
}
