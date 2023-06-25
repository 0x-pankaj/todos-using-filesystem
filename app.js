const express = require('express');
const fs = require("fs");
const users = require("./users.json");


const app = express();

app.use(express.json());

async function getTodos(req,res){
  // res.status(200).json(users);
  await fs.readFile("./users.json","utf-8",(err,data)=>{
    console.log(data);
    res.json(JSON.parse(data))
  })
   
}
async function getIdTodo(req,res){
  const id = req.params.id;
  await fs.readFile("./users.json","utf-8",async(err,data)=> {
      // console.log(data);
    const users = JSON.parse(data);

    const user = await users.find(user => user.id == id);
    console.log(user);
    res.json(user);

    // console.log(users);
      // res.json(users);
  })
 
}
function postTodos(req,res){

   const {title, completed=false , description} = req.body;
   const newId = users[users.length-1].id + 1;
   console.log(newId);

   const todo ={
     "id":newId,
     "title":title,
     "completed":completed,
     "description":description
   }
   console.log(todo);
   users.push(todo);
   console.log(users);
   fs.writeFile("./users.json", JSON.stringify(users),(err)=>{
      if(err) throw err;
      console.log("file has been saved");
   })
   res.status(201).send("saved successfully");

}
function updateTodo(req,res){
  const id = parseInt(req.params.id)
  const {title,description} = req.body;
  console.log(id);
  const updatedUser = users.map((user) => {
    if(user.id === id){
      return {
        ...user,
        title,
        description
      }
    }
    return user;
  })
  fs.writeFile("./users.json",JSON.stringify(updatedUser),(err)=>{
    if(err) throw err;
    console.log("file updated");
    res.send("file updated ");
  })
}

function deleteTodo(req,res){
    const id = req.params.id;

   const deletedUserArray =  users.filter(user=> user.id != id)
   fs.writeFile("./users.json",JSON.stringify(deletedUserArray),(err)=>{
      if(err) throw err;
      console.log("deleted user");
      res.send("user deleted");
   })
}


app.get("/",(req,res)=>{
   res.json(users);
})

app.get("/todos", getTodos);
app.get("/todos/:id",getIdTodo);
app.post("/todos",postTodos);
app.put("/todos/:id",updateTodo);
app.delete("/todos/:id",deleteTodo);

app.all("*",(req,res)=>{
  res.status(404).send("Path Not Defined");
})

app.listen(3000,()=>{
  console.log(`welcome todo server`);
})

module.exports = app;