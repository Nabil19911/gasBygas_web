import RequestStatusEnum from "../constant/requestStatusEnum";

interface IToken {
  _id?: string;
  token: string;
  expiryDate: string;
  status: RequestStatusEnum;
}

export default IToken;
