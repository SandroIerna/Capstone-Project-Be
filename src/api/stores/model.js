import mongoose from "mongoose";

const { Schema, model } = mongoose;

const StockItems = new Schema({
  itemId: { type: mongoose.Types.ObjectId, required: true, ref: "Item" },
  quantity: { type: Number, required: true },
  price: { type: String, required: true },
  sale: { type: Boolean, required: true },
});

const StoresSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  stock: [{ type: StockItems, required: true }],
  image: {
    type: String,
    default:
      "https://www.citypng.com/public/uploads/preview/download-shopping-store-market-icon-png-11641399721chs8wj3v67.png",
  },
});

export default model("Store", StoresSchema);
