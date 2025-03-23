export const uploadImage = async (base64) => {
  const url = process.env.EXPO_PUBLIC_OCR_API_URL + '/financial';
  const headers = { "x-api-key": process.env.EXPO_PUBLIC_OCR_API_KEY, "Content-Type": "application/json" };
  const payload = {
    documents: [
      {
        data: base64, // Base64-encoded image
      }],
    preset: {
      slug: "invoice"
    }
  };
  const jsonPayload = JSON.stringify(payload);

  const options = { method: "POST", headers, body: jsonPayload };
  return await fetch(url, options);
};

export const categoryItem = async (base64) => {
  const url = process.env.EXPO_PUBLIC_OCR_API_URL + '/prompt_builder/configurations/invoicecategory';
  const headers = { "x-api-key": process.env.EXPO_PUBLIC_OCR_API_KEY, "Content-Type": "application/json" };
  const payload = {
    documents: [
      {
        data: base64, // Base64-encoded image
      }]
  };
  const jsonPayload = JSON.stringify(payload);

  const options = { method: "POST", headers, body: jsonPayload };
  return await fetch(url, options);
};
