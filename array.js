const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const { Stream } = require("stream");
const nodeXlsx = require("node-xlsx"); //need delete later

const results = [];
const csvFilePath = "./data/school_en.csv";