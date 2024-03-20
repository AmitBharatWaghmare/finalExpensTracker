const express = require("express");

const expenseController = require("../controllers/expense");
const userauthentication = require("../middleware/auth");

const router = express.Router();

//add data to databse from expense
router.post("/addexpense", userauthentication.authenticate,expenseController.addexpense);

//get data from databasegetExpenses
router.get("/getExpenses",userauthentication.authenticate,expenseController.getExpenses);

//delete data
router.delete("/deletedata/:id", userauthentication.authenticate,expenseController.deletedata);

//edit data
router.put("/editdata/:id",userauthentication.authenticate, expenseController.editdata);

//download data aws
router.get('/download', userauthentication.authenticate, expenseController.downloadExpenses)

router.get('/get-history', userauthentication.authenticate,expenseController.getFileUrl)

//Page Not Found
router.get('/*',expenseController.pageNotFound)

module.exports = router;
