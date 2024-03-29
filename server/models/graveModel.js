import mongoose from "mongoose";

const graveSchema = mongoose.Schema({
  number: {
    type: Number,
  },
  row: {
    type: Number,
  },
  field: {
    type: Number,
  },
  LAT: {
    type: Number,
  },
  LON: {
    type: Number,
  },
  capacity: {
    type: Number,
  },
  contractTo: {
    type: Date,
  },
  status: {
    type: String,
    default: "FREE",
  },
  cemetery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cemetery",
  },
  graveType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GraveType",
  },
});

const Grave = mongoose.model("Grave", graveSchema);

export default Grave;
