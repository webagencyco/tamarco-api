import { Schema, model } from 'mongoose';

const NumberSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  number: { type: String, required: true },
  tariff: { type: String, required: true },
  destination: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Number = model('Number', NumberSchema);
export default Number;
