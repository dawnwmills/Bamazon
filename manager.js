  //dependencies
  var mysql = require("mysql");
  var Table = require("cli-table");
  var inquirer = require("inquirer");

  var connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "admin",
      database: "bamazonDB"
  });


  connection.connect(function(err) {
      if (err) throw err;
      console.log("connected as id " + connection.threadId);
      managerPrompt();
  });

  function managerPrompt(){
    inquirer.prompt([
      {
      name: "choice",
      type: "list",
      message: "Select report below:",
      choices: ["View Product Sales", "View Inventory Balance", "Add Inventory", "Add New Product", "Exit"]
      }
    ]).then(function(manager){
      console.log(manager.choice);
      switch(manager.choice) {
            case "View Product Sales":
                viewProductSales(function(){
                  managerPrompt();
                });
            break;

            case "View Inventory Balance":
                viewInvBalance(function(){
                  managerPrompt();
                });
            break;

            case "Add Inventory":
                addInventory();
            break;

            case "Add New Product":
                newProduct();
            break;

            case "Exit":
                connection.end();
            break;
        }
      });
  }



  function viewProductSales(managerSelect){
    
    var table = new Table({
      head: ["ID", "Product", "Department", "Price", "Quantity Available"]

    });
    
   connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, 
                   res[i].department_name, "$" + res[i].price, 
                   res[i].stock_quantity]);
        }
        
    

      console.log(table.toString());
      
      managerSelect();
      });
  }

  //view all items where stock_quantity is less than 5

  function viewInvBalance(managerSelect){
    
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",
    function(err, res){
      if(err) throw err;
      

      if (res.length === 0) {
        console.log("There are no items with low inventory.");
        

        managerSelect();
      } else {
        

        var table = new Table({
          head: ["ID", "Product", "Department", "Price", "Quantity Available"]
        });
        for (var i = 0; i < res.length; i++) {
          table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]);
        }
        

        console.log(table.toString());
        console.log("These items are low on inventory.");
        

        managerSelect();
      }
    });
  }



  //add more inventory to items

  function addInventory(){
    var items = [];
    
    connection.query("SELECT product_name FROM products", function(err, res){
      if (err) throw err;
      
      for (var i = 0; i < res.length; i++) {
        items.push(res[i].product_name)
      }
      
      inquirer.prompt([
        {
        name: "choices",
        type: "checkbox",
        message: "Which products would you to add inventory for?",
        choices: items
        }
      ]).then(function(manager){
        
          if (manager.choices.length === 0) {
            console.log("Oops! You didn\"t select anything!");
            managerPrompt();
          } else {
            
            addQuantity(manager.choices);
          }
        });
    });
  }

  //get quantity of each item to add to StockQuantity

  function addQuantity(itemNames){
    

    var item = itemNames.shift();
    var itemStock;
    
    connection.query("SELECT stock_quantity FROM products WHERE ?", {
      product_name: item
    }, function(err, res){
      if(err) throw err;
      itemStock = res[0].stock_quantity;
      itemStock = parseInt(itemStock)
    });
    
    inquirer.prompt([
      {
      name: "amount",
      type: "text",
      message: "How many " + item + " would you like to add?",
      //validate that the input is a number
      validate: function(str){
          if (isNaN(parseInt(str))) {
            console.log("\nOops. That\"s not a valid number!");
            return false;
          } else {
            return true;
          }
        }
      }
    ]).then(function(manager){
      var amount = manager.amount
      amount = parseInt(amount);
      
      connection.query("UPDATE products SET ? WHERE ?", [
      {
        stock_quantity: itemStock += amount
      },
      {
        product_name: item
      }], function(err){
        if(err) throw err;
      });
      
      if (itemNames.length != 0) {
          addQuantity(itemNames);
        } else {
         
          console.log("Inventory has been updated.");
          managerPrompt();
        }
      });
  }



  //add a new product to the Products table


  function newProduct(){
    var newProduct = [];
  }
   