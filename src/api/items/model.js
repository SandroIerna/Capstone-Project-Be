import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ItemsSchema = new Schema({
  name: { type: String, required: true },
  cathegory: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true },
  information: {
    calories: { type: String, required: false },
    proteins: { type: String, required: false },
    sugar: { type: String, required: false },
    carbs: { type: String, required: false },
    ingredients: { type: String, required: false },
    production: { type: String, required: false },
  },
});

export default model("Item", ItemsSchema);
