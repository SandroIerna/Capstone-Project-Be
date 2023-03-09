import mongoose from "mongoose";

const { Schema, model } = mongoose;

const StoresSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, required: false, ref: "Users" },
  stock: [
    {
      itemId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      sale: { type: Boolean, required: true },
    },
  ],
});

export default model("Store", StoresSchema);
