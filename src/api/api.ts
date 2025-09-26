import axios from "./axios";

interface AxiosProps {
  url: string;
  token?: string;
}

export async function getRequest({url, token}: AxiosProps) {
  const config = token ? { params: { token } } : {};
  return axios.get(url, config);
}




