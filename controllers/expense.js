const { json } = require('body-parser');
const exp = require('../moduls/Expense');
const User=require('../moduls/Signup');
const sequelize=require(`../utils/database`);
const DownloadFile= require('../moduls/DownloadFile');
const S3services=require(`../services/S3services`);

const addexpense =async(req, res, next)=>{
    const t = await sequelize.transaction();
try{
    const name = req.body.name;
    const expense = req.body.expense;
    const item = req.body.item;
    const category = req.body.category;
    const Expense=await exp.create({
        name:name,
        expense:expense,
        item:item,
        category:category,
        SignUpUserId:req.user.id
    },{transaction:t})
   {
        res.status(201).send({status:true, msg: "Data succesfully Created "})
        console.log(`Create succesfully  Name:${name} - Exp: ${expense} - Item: ${item} - Category: ${category}`);
    }
    let amount = req.body.expense-0;
    amount = amount + req.user.totalExpense;
     User.update(
      { totalExpense: amount },
      { where: { id: req.user.id },transaction:t}
    ).then(async()=>{
    await  t.commit();
  res.status(200)}
)}
    catch(err){
        await  t.rollback();
        res.status(500).json({status: false, Error: err.message});
        console.log(err.message);
    }
}

//Get All Data 
const getExpenses =async(req, res, next)=>{
    try { 
        const page= +req.query.page||1;
          const ITEM_PER_PAGE = 5
          const limit = Number(req.query.limit) || ITEM_PER_PAGE;
          let totalItem= await exp.count({where:{SignUpUserId:req.user.id}})
          const offset = (page-1)* limit;
           exp.findAll({
              offset:offset,
            limit:limit,
            where:{SignUpUserId:req.user.id},
            }).then((Expenses)=>{
              console.log(totalItem);
              const hasMoreData = totalItem - (page-1)*limit > limit ? true : false;
              const nextPage = hasMoreData ? Number(page) + 1 : undefined;
              const previousPage = page > 1 ? Number(page)-1 : undefined;
              const hasPreviousPage = previousPage ? true : false;
  
              res.json({
                Expenses:Expenses,
                currentpage:page,
                hasNextPage:hasMoreData,
                nextpage:nextPage,
                hasPreviousPage:hasPreviousPage,
                previousPage:previousPage,
              })
            }
          )
    }
  catch (err) {
          console.log(err,"err");
          res.status(500).json({ success: false, err });
        }
}

 const deletedata =async(req, res, next)=>{
      try{
         const expenseId = req.params.id;
          if(expenseId==undefined||expenseId===0)
          {
           return res.status(400).json({status: false})
          }
          let amount;
          let result = await exp.findAll({ where:{ id:expenseId}});
          amount = result[0].expense;//geting delete amount
          await exp.destroy({where:{id:expenseId,SignUpUserId:req.user.id}});
          amount = req.user.totalExpense - amount;//getting remaining value after delet 
          User.update( { totalExpense: amount },{ where: { id: req.user.id }} );
          res.status(200).json({status: true, msg : "Deleted Successfully" })
       }
    catch(err){
      res.status(500).json({status: false, Error : err.message})
        console.log(err.message);
    }
}

//Edit Data
const editdata = async(req, res, next)=>{
try{
    const userId = req.params.id;
    const editItem = await exp.findByPk(userId)
   {
        editItem.name = req.body.name;
        editItem.expense =req.body.expense;
        editItem.item = req.body.item;
        editItem.category = req.body.item;
        return User.save()
    }
}
    catch(err){console.log(err)}
}

//PAGE NOT FOUND
const pageNotFound =(req, res, next)=>{
  res.status(404).json('<h1>Page Not Found</h1>')
}

  //downloadExpenses
  const downloadExpenses =  async (req, res) => {
    try {
           const expenses=await req.user.getExpenses();
           const stringifiedExpenses=JSON.stringify(expenses);
           const userId = req.user.id;
           const filename=`expense ${userId} / ${new Date()}.txt`;
           const fileURL= await S3services.uploadS3(stringifiedExpenses,filename);
           const response = await req.user.createDownloadFile({fileURL});
           if(response){
            return res.status(200).json({fileURL, success: true});
            }
        throw new Error('Failed to create a record in the DownloadedFiles');
      } catch(err) {
      console.log(err);
        res.status(500).json({fileURL:"", error: err, success: false, message: 'Something went wrong'})
    }
};

const getFileUrl = async (req, res)=> {
  try{
      const files = await req.user.getDownloadFiles({attributes: ['fileURL']});
    if(files){
          return res.status(200).json({fileURL: files, success: true});
      }
        throw new Error('error in fetching history');
  }
  catch(err){
      console.log(err);
      res.status(500).json({fileUrl:'', success:false, error:err});
  }
}

module.exports ={ addexpense, getExpenses, deletedata, editdata, pageNotFound,downloadExpenses,getFileUrl}