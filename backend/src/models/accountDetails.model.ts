import { Schema, model, Document } from 'mongoose';

interface AccountDetails extends Document {
  EID: string;
  bankName: string;
  accountNo: string;
  IFSCNo: string;
  totalBalance: number;
}

const accountDetailsSchema = new Schema<AccountDetails>({
  EID: { type: String, required: true, unique: true },
  bankName: { type: String, required: true },
  accountNo: { type: String, required: true },
  IFSCNo: { type: String, required: true },
  totalBalance: { type: Number, default: 0 },
});

const AccountDetailsModel = model<AccountDetails>('AccountDetails', accountDetailsSchema);

export { AccountDetailsModel };
