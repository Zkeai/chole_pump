import mongoose from "mongoose";

const newPumpCoinSchema = new mongoose.Schema({
    devAddress: { type: String },
    mintAddress: { type: String },
    historyLength: { type: Number },
})

export const NewPumpCoin = mongoose.models?.NewPumpCoin || mongoose.model('NewPumpCoin', newPumpCoinSchema);