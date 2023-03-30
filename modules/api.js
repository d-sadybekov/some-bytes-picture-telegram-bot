const sendRequest = async (method, url, body = null, headers = null) => {
  return await fetch(url, {
    method,
    headers,
    body: body !== null ? JSON.stringify(body) : body
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    return response.json().then((error) => {
      const e = new Error("Что-то пошло не так.");
      e.data = error.message;
      throw e;
    });
  });
};

export default sendRequest;
