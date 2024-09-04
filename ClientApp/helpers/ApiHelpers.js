const toBearer = (token) => {
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

const defaultHeaders = (token) => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  "Accept-Language": "*",
  ...toBearer(token) 
});


export const getHelper = async (url, token) => {
  const response = await fetch(url, {
    headers: defaultHeaders(token),
    method: "GET"
  });

  if (!response.ok) throw response;

  return response.json();
}

export const postHelper = async (url, request, token) => {
  const response = await fetch(url, {
    headers: defaultHeaders(token),
    method: "POST",
    body: request ? JSON.stringify(request) : null
  });

  if (!response.ok) throw response;

  return response.json();
}

export const postImageHelper = async (url, formData, token) => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        "Authorization": `Bearer ${token}`
      },
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      // Attempt to parse the error response
      const errorResponse = await response.json();
      console.log("errorResponse: ", errorResponse)
      throw new Error(errorResponse.error || 'An unexpected error occurred');
    }

    return response.json();
  } catch (error) {
    // Handle error (display message to user, log it, etc.)
    console.error('Upload failed:', error.message);
    throw error; // Optionally rethrow or handle the error as needed
  }
}


export const putHelper = async (url, request, token) => {
  const response = await fetch(url, {
    headers: defaultHeaders(token),
    method: "PUT",
    body: request ? JSON.stringify(request) : null
  });

  if (!response.ok) throw response;

  return response.json();
}

export const patchHelper = async (url, request, token) => {
  const response = await fetch(url, {
    headers: defaultHeaders(token),
    method: "PATCH",
    body: request ? JSON.stringify(request) : null
  });

  if (!response.ok) throw response;

  return response.json();
}

export const deleteHelper = async (url, token) => {
  const response = await fetch(url, {
    headers: defaultHeaders(token),
    method: "DELETE"
  });

  if (!response.ok) throw response;

  return response.json();
}
