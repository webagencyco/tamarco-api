import { Schema, model } from 'mongoose';

const UsageSchema = new Schema({
  date: { type: Date, required: true },
  usageMinutes: { type: Number, required: true },
});

const NumberSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User'},
  number: { type: String},
  tariff: { type: Number},
  price : { type: Number},
  tariffPrice : { type: String},
  destination: { type: String},
  includedMinutes: { type: Number}, 
  minutesUsed: { type: Number, default: 0 },
  totalCalls: { type: Number, default: 0 },
  tailorPrice: { type: Number, default: 0 },
  // availableMinutes: { type: Number, default: 0 },
  numberType: { type: String, },
  overage: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  // usage: [UsageSchema],
});

NumberSchema.methods.calculateUsage = function() {
  this.minutesUsed = this.usage.reduce((total, entry) => total + entry.usageMinutes, 0);
  this.totalCalls = this.usage.length;
  this.availableMinutes = this.includedMinutes > this.minutesUsed ? this.includedMinutes - this.minutesUsed : 0;
  this.overage = this.minutesUsed > this.includedMinutes ? this.minutesUsed - this.includedMinutes : 0;
};

const NumberModel = model('Number', NumberSchema);
export default NumberModel;
