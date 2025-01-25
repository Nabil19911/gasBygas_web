import RequestStatusEnum from "../constant/requestStatusEnum";

interface IToken {
  token: string;
  expiryDate: string;
  status: RequestStatusEnum;
}

export default IToken;
