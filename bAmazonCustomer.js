var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "picklem88",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  //console.log("con attempt",connection);
  displayProducts();
  start();
});

var itemQuantity;

function start() {

    inquirer
      .prompt([
        {
        name: "productID", 
        type: "input",  //this is an input field for the user OR I could do list and then add the options afterwards
        message: "Please select item by 'ID'"              
        },     
            //move the below to the function for artist or favorite songe etc. 
        {
        name: "productQuantity", 
        type: "input",  //this is an input field for the user OR I could do list and then add the options afterwards
        message: "How many of the item would you like?",
        }
        ])
        .then(function(answer) {
           var usersQuantity = answer.productQuantity; 
           var usersProductID = answer.productID;
           quantityCheck(usersProductID,usersQuantity); //must pass these values so you can use it in the function below
    });
};

//--------------------------------------------------//

function quantityCheck(name,usersQuantity) { 
    connection.query("SELECT id, product_name, price, quantity FROM products WHERE id = ?",[name],function(err, res) {

        itemQuantity = res[0].quantity;
        itemPrice = res[0].price;
        var totalCost = (parseInt(usersQuantity)*parseInt(itemPrice));
               
        //console.log("item Quantity:", itemQuantity);

        if(usersQuantity < itemQuantity){
            
            //console.log("all good");
            connection.query("UPDATE products SET quantity = (quantity - " + usersQuantity + ")WHERE id = " + name,function(err, res){
                 if(err){
                 console.log("error updating table");
                 }
                 else{
                 console.log("table updated");
                 console.log("You owe: $", totalCost);
                 }
             });
                         
     }else{
         console.log("error");
     }

        console.log("-----------------------------------");
        //console.log("response", res);
        //console.log(res[0].quantity);
        //console.log("name:", name);
          connection.end();

    });
    
}

//--------------------------------------------------//
function displayProducts() {
    var query = "SELECT id, product_name, price FROM products";
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.log(res);
      });
      //start();
      
    };

  