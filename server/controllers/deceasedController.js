import Deceased from "../models/deceasedModel.js";

const saveDeceased = async (req, res, next) => {
  const sentDeacesed = req.body;
  console.log(sentDeacesed);

  const graveId = req.params.id;
  console.log(graveId);
  const deacesed = new Deceased({
    name: sentDeacesed.name,
    surname: sentDeacesed.surname,
    dateBirth: sentDeacesed.dateBirth,
    dateDeath: sentDeacesed.dateDeath,
    grave: graveId,
  });

  //const createdGrave = await grave.save();

  try {
    const createdDeacesed = await deacesed.save();
    console.log("TRy-CATCH");
    console.log(createdDeacesed);
    res.json(createdDeacesed);
  } catch (error) {
    console.log(error);
    return res.json({ message: "Cound not store data" });
  }
  //    client.close()

  console.log("POST request");
};

const getDeceased = async (req, res, next) => {
  try {
    const deceased = await Deceased.find()
      .populate({
        path: "grave",
        populate: {
          path: "cemetery",
        },
      })
      .populate({
        path: "grave",
        populate: {
          path: "graveType",
        },
      });

    if (deceased) {
      res.send(deceased);
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    next(err);
  }
};

const getDeceasedPaginate = async (req, res, next) => {
  try {
    console.log(req.query);
    const { start = 0, size = 10, filters, sorting, globalFilter } = req.query;
    //filtriranje po kolonama
    const filter = {};
    const parsedFilters = JSON.parse(filters);
    parsedFilters.forEach((f) => {
      if (f.id.toUpperCase().startsWith("DATE")) {
        if (!f.value[0] && !f.value[1]) {
          return;
        }

        let obj = {};
        if (f.value[0]) {
          obj.$gte = new Date(f.value[0]);
        }
        if (f.value[1]) {
          obj.$lte = new Date(f.value[1]);
        }
        filter[f.id] = obj;
      } else {
        filter[f.id] = new RegExp(f.value, "i");
      }
    });
    console.log(filter);
    //globalno filtriranje
    const globalSearch = new RegExp(globalFilter, "i");
    const globalFilterSearch = [
      { name: globalSearch },
      { surname: globalSearch },
    ];
    console.log(globalFilterSearch);
    //sortiranje
    const parsedSorting = JSON.parse(sorting);
    const sortingArray = [];
    parsedSorting.forEach((s) => {
      const columnName = s.id;
      const sort = s.desc ? -1 : 1;
      sortingArray.push([columnName, sort]);
    });

    const deceased = await Deceased.find(filter)
      .or(globalFilterSearch)
      .collation({ locale: "en", strength: 2 })
      .sort(sortingArray)
      .skip(start)
      .limit(parseInt(size));
    // .excec();
    //console.log(deceased);

    const totalDeceased = await Deceased.find(filter)
      .or(globalFilterSearch)
      .countDocuments();
    console.log(totalDeceased);
    //  res.send(deceased);
    res.json({
      data: deceased,
      totalItems: totalDeceased,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSingleDeceased = async (req, res, next) => {
  const deceasedId = req.params.id;
  try {
    const result = await Deceased.deleteOne({ _id: deceasedId });
    console.log(res);
    if (result.deletedCount === 1) {
      console.log("deleted count 1");
      res.send({ id: deceasedId });
    } else {
      res.json({ message: "Nothing to delete" });
    }
    // res.send(objToSend);
  } catch (error) {
    console.log(error);
    return res.json({ message: "Cound not get data" });
  }
};

const updateDeceased = async (req, res) => {
  const { _id, name, surname, dateBirth, dateDeath } = req.body;

  const filter = { _id: _id }; // Criteria to find a row
  const update = {
    name: name,
    surname: surname,
    dateBirth: dateBirth,
    dateDeath: dateDeath,
  }; // Fields to update

  const updatedDeceased = await Deceased.findOneAndUpdate(filter, update, {
    new: true,
  });

  console.log(updatedDeceased);

  if (updatedDeceased) {
    res.status(200).json({
      _id: updatedDeceased._id,
      name: updatedDeceased.name,
      surname: updatedDeceased.surname,
      dateBirth: updatedDeceased.dateBirth,
      dateDeath: updatedDeceased.dateDeath,
    });
  } else {
    res.status(400);
    throw new Error("Cannot update the deceased");
  }
};

const getDeceasedForGrave = async (req, res, next) => {
  const graveId = req.params.id;
  try {
    const deceased = await Deceased.find({ grave: graveId });
    if (deceased) {
      res.send(deceased);
    } else {
      res.status(400).send({
        message: "Server error",
      });
    }
  } catch (error) {
    next(error);
  }
};

export {
  saveDeceased,
  getDeceased,
  getDeceasedPaginate,
  deleteSingleDeceased,
  updateDeceased,
  getDeceasedForGrave,
};
