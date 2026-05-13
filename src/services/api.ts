const API_URL = process.env.REACT_APP_API_URL;

// COMMON HEADER FUNCTION
const getHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  ...(token && {
    Authorization: `Bearer ${token}`,
  }),
});

// COMMON REQUEST FUNCTION
const request = async (url: string, options: RequestInit) => {
  const response = await fetch(`${API_URL}${url}`, options);
  return response.json();
};

// AUTH Login APIs
export const loginApi = (email: string, password: string) => {
  return request("/auth/login", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

// EMPLOYEE APIs//
// GET EMPLOYEES API
export const getEmployeeApi = (
  page: number,
  limit: number,
  search: string,
  token: string,
) => {
  return request(`/employee?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: getHeaders(token),
  });
};

// CREATE EMPLOYEE API
export const createEmployeeApi = (payload: object, token: string) => {
  return request("/employee", {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });
};

// UPDATE EMPLOYEE API
export const updateEmployeeApi = (
  id: number,
  payload: object,
  token: string,
) => {
  return request(`/employee/update/${id}`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });
};

// DELETE EMPLOYEE API
export const deleteEmployeeApi = (id: number, token: string) => {
  return request(`/employee/delete/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
};

// GET DASHBOARD STATS API
export const getDashboardStatsApi = (token: string) => {
  return request("/dashboard", {
    method: "GET",
    headers: getHeaders(token),
  });
};

// GET POLICY API
export const getPoliciesApi = (
  page: number,
  limit: number,
  search: string,
  token: string,
) => {
  return request(`/policy?page=${page}&limit=${limit}&search=${search}`, {
    method: "GET",
    headers: getHeaders(token),
  });
};

//CREATE POLICY API
export const createPolicyApi = (payload: object, token: string) => {
  return request("/policy", {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });
};

//UPDATE POLICY API
export const updatePolicyApi = (id: number, payload: object, token: string) => {
  return request(`/policy/update/${id}`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });
};

//DELETE POLICY API
export const deletePolicyApi = (id: number, token: string) => {
  return request(`/policy/delete/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
};
