import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ItemsSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true },
});

export default model("Item", ItemsSchema);
