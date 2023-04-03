import mongoose from "mongoose";

const { Schema, model } = mongoose;

const StockItems = new Schema({
  _id: { type: mongoose.Types.ObjectId, required: true, ref: "Item" },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  value: { type: String, enum: ["Euro", "Dollar"], default: "Euro" },
  sale: { type: Boolean, required: true },
});

const StoresSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  stock: [{ type: StockItems, required: true }],
  location: {
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
  },
  banner: { type: String, default: "" },
  description: { type: String, required: true },
  image: {
    type: String,
    default:
      "https://www.citypng.com/public/uploads/preview/download-shopping-store-market-icon-png-11641399721chs8wj3v67.png",
  },
});

export default model("Store", StoresSchema);
