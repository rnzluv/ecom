import mongoose from "mongoose";

const purchasesHistorySchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  date: { type: Date, default: Date.now },
  details: { type: String, default: "" },
});

export default mongoose.model("PurchasesHistory", purchasesHistorySchema);
