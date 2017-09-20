	//dependencies
	var mysql = require("mysql");
	var inquirer = require("inquirer");
	var prompt = require("prompt");
	var Table = require("cli-table");

	var connection = mysql.createConnection({
	  host: "localhost",
	  port: 3306,
	  user: "root",
	  password: "admin",
	  database: "bamazonDB"
	});

	connection.connect(function(err) {
	  if (err) throw err;
	  showAllProducts();
	});

	function showAllProducts () {
		var table = new Table ({
			head: ["ID", "Product", "Department", "Price", "Quantity Available"]

		});
			connection.query("SELECT * FROM products", function(err, res) {
				if (err) throw err;
				for (var i = 0; i < res.length; i++) {
	      table.push([res[i].item_id, res[i].product_name, 
	      					 res[i].department_name, '$' + res[i].price, 
	      					 res[i].stock_quantity]);
				}
				console.log(table.toString());
				selectItem();

			})
	}


	function selectItem () {

		var items = [];

		//get product ids from table
		connection.query("SELECT item_id FROM products", function(err,res) {
			if (err) throw err;
			 for (var i = 0; i < res.length; i++) {
	      items.push(res[i].item_id)
	    }

	    console.log("The array contains: " +items);

			inquirer.prompt ([
				{
					type: "input",
					name: "option",
					message: "Please enter the id of the item you would like to purchase."
				}
				
				]).then(function (answer) {
					console.log("GREAT!");
					console.log(answer.option);
					console.log("The item number is: " + answer.option);
					console.log("Value passed is: " + items);
					amountSelected(items, answer.option);

				})
			});
		

	}

	function amountSelected (items, sel) {

		console.log(" Coming in is: " + items);
		var item = items.shift();
		var sel = sel;
		item = sel;
		console.log("Sel is : " +sel);
	
		var itemQuantity;
		var department;

	 //query mysql to get the current stock, price, and department of the item
	 	connection.query('SELECT stock_quantity, price, department_name FROM products WHERE ?', {
	    item_id: item
	  	
	  	}, function(err, res){
	    	if(err) throw err;

	    
	    	itemQuantity = res[0].stock_quantity;
	    	itemCost = res[0].price;
	    	department = res[0].department_name;
	  });

	  //user input
	  inquirer.prompt([
	    {
	    	type: "input",
	    	name: "amount",
	    	message: "How many of item number " + sel + " would you like to purchase?"
	  	}
	  	]).then(function (amountIs) {
					
					console.log(amountIs.amount);
					console.log("Quantity is: " + itemQuantity);
					if (amountIs.amount > itemQuantity) {
						console.log("Sold Out");
					}
					else {
						itemQuantity -= amountIs.amount;
						console.log(itemQuantity + " Is left" )
						var total = amountIs.amount * itemCost;
						console.log("total is $" + total);
						console.log("OK! Let's Proceed")
					}
					
			})


	  	connection.end();
	}


		//updateDB();

	function updateDB(itemQuantity, itemSelection) {

	 	var totalQuan = itemQuantity;
	 	var itemId = itemSelection;
	    console.log("Amount Left is " + totalQuan);
	    console.log("Item Selection is: " + itemId);

	    var query = connection.query(
	        "UPDATE products SET ? WHERE ?",
	            [
	              {
	                     stock_quantity: totalQuan
	                 },
	                 {
	                     item_id: itemId
	                 }

	            ], function(err,res) {
	                     if (err) throw err;
	                 
	                  console.log(query.sql);
	                  
	                  console.log("New amount: " +totalQuan);
	              }

	 )
	    connection.end();

	}



			