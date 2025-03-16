const createRequest = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) return;

  const data = await response.json();
  return data;
};

export default createRequest;