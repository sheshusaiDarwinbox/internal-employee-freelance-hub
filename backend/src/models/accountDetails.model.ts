import { Schema, model, Document } from 'mongoose';

interface AccountDetails extends Document {
  EID: string;
  bankName: string;
  accountNo: string;
  IFSCNo: string;
  expiredDate?: string; // Change to string, MM/YY format
  CVC?: number;
  totalBalance: number;
}

const accountDetailsSchema = new Schema<AccountDetails>({
  EID: { type: String, required: true, unique: true },
  bankName: { type: String },
  accountNo: { type: String },
  IFSCNo: { type: String },
  expiredDate: { type: String }, // Change to String here too.
  CVC: { type: Number },
  totalBalance: { type: Number, default: 0 },
});

const AccountDetailsModel = model<AccountDetails>('AccountDetails', accountDetailsSchema);

export { AccountDetailsModel };