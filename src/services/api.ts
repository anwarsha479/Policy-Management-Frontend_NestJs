const API_URL = process.env.REACT_APP_API_URL;

interface ApiProps {
  method: string;
  url: string;
  data?: any;
  token?: string;
}

export const API = async ({ method, url, data, token }: ApiProps) => {
  const response = await fetch(`${API_URL}${url}`, {
    method,

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },

    ...(data && {
      body: JSON.stringify(data),
    }),
  });

  return response.json();
};

export const loginApi = (payload: object) => {
  return API({
    method: "POST",

    url: "/auth/login",

    data: payload,
  });
};

export const getEmployeeApi = (name: string, token: string) => {
  return API({
    method: "GET",

    url: `/employee?name=${name}`,

    token,
  });
};
