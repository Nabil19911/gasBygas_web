import { jwtDecode } from "jwt-decode";

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  console.log(decoded, accessToken)
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

export default isValidToken;
