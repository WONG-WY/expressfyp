require('dotenv').config();
var express = require("express");
var router = express.Router();

const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/school-details", (req, res) => {
  console.log("Enter school-details");
  const schoolName = req.query.school_name;
  if (!schoolName) {
    console.log("Need school name");
    return res.status(400).send("Need school name");
  }

  const csvFilePath = path.join(__dirname, "../data/school_en.csv"); //(__dirname, "..", "data", "school_en.csv")
  const results = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      if (row.school_name === schoolName) {
        results.push(row);
      }
    })
    .on("end", () => {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send("School not found");
      }
    })
    .on("error", (err) => {
      console.error("Error:", err);
      res.status(500).send("Internal Server Error");
    });
});


module.exports = router;
