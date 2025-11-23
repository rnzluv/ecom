import mongoose from "mongoose";

const adminCreatedHistorySchema = new mongoose.Schema({
  admin: { type: String, required: true },
  action: { type: String, required: true },
  date: { type: Date, default: Date.now },
  details: { type: String, default: "" },
});

export default mongoose.model("AdminCreatedHistory", adminCreatedHistorySchema);
