import ActiveStatus from "../constant/activeStatusOptions";

interface IToken {
  _id?: string;
  token: string;
  expiryDate: string;
  status: ActiveStatus;
}

export default IToken;
