const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const { Stream } = require("stream");

const nodeXlsx = require("node-xlsx"); //need delete later

//const app = express();

const results = [];
//const maxResults = 10;
const csvFilePath = "./data/school_en.csv";

const query = "a";

const searchBarstream = fs
  .createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (row) => {
    const schoolName = row.school_name || "";
    //if (schoolName.includes(query)) {
    results.push([schoolName]);
    if (results.length >= 442) {
      console.log(results);
      console.log("Start build xlsx");
      var sameBuffer = nodeXlsx.build([
        { name: "repost_name", data: results },
      ]);
      fs.writeFileSync("schoolNameOnly.xlsx", sameBuffer);
      console.log("xlse done");
      searchBarstream.pause();
      //callback(null, results);
      //}
    }
  })
  .on("end", () => {
    console.log("result = ");
    console.log(results);
    //callback(null, results);
  })
  .on("error", (err) => {
    console.log(err);
    //callback(err);
  });
