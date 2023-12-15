import mongoose from "mongoose";
import GraveRequest from "../models/graveRequestModel.js";

const getGraveRequests = async (req, res, next) => {
  try {
    const allRows = await GraveRequest.find().sort({status: 'desc'});
    if (allRows) {
      res.send(allRows);
    } else {
      res.status(400).send({
        message: 'Cannot get cemeteries'
      });
    }
  } catch (err) {
    next(err);
  }
};


const addGraveRequest = async (req, res) => {
  const { grave, name, surname, email, phone, status, createdAt } = req.body;

  const newRow = await GraveRequest.create({
    grave: new mongoose.Types.ObjectId(grave),
    name: name,
    surname: surname,
    email: email,
    phone: phone,
    status: status,
    createdAt: createdAt,
  });
  console.log(newRow);
  if (newRow) {
    res.status(201).json({
      _id: newRow._id,
      grave: newRow.grave,
      name: newRow.name,
      surname: newRow.surname,
      email: newRow.email,
      phone: newRow.phone,
      status: newRow.status,
      createdAt: newRow.createdAt,
    });
  } else {
    res.status(400).send({
      message: 'Invalid Grave Request data'
    });
  }
};


const updateGraveRequest = async (req, res) => {
  const { _id, status, name, surname, email, phone, createdAt } = req.body;
  
  const filter = { _id: _id }; // Criteria to find a row
  const update = { status: status, name: name, surname: surname, email: email, phone: phone, createdAt: createdAt}; // Fields to update

  const updatedRow = await GraveRequest.findOneAndUpdate(filter, update, {new: true});

  console.log(updatedRow);
  
  if (updatedRow) {
    res.status(200).json({
      _id: updatedRow._id,
      name: updatedRow.name,
      surname: updatedRow.surname,
      email: updatedRow.email,
      phone: updatedRow.phone,
      createdAt: updatedRow.createdAt,
      status: updatedRow.status,
    });
  } else {
    res.status(400).send({
      message: 'Cannot update the grave request'
    });
  }
};

const deleteGraveRequest = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await GraveRequest.deleteOne({ _id: id });
    console.log(res);
    if (result.deletedCount === 1) {
      console.log("deleted count 1");
      res.send({ id: id });
    } else {
      res.status(400).send({
        message: 'Nothing to delete'
      });
    }
    // res.send(objToSend);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: `Cannot delete the grave request. ${error}`
    });
  }
};

export { getGraveRequests, addGraveRequest, updateGraveRequest, deleteGraveRequest };
