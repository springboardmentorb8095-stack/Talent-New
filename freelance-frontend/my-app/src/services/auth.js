import API from "./api";



export const registerUser = async (data) => {
  return await API.post("register/", {
    username: data.username,
    email: data.email,
    password: data.password,
    password2: data.password2,
  });
};

export const loginUser = async (data) => {
  return await API.post("token/", {
    username: data.username,
    password: data.password,
  });
};
