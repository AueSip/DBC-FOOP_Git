const express = require('express')
const fs = require('fs')
const path = require('path')

class myBanana {
    constructor () {
        this.app = express()
        this.app.set('view engine', 'ejs');
        this.app.use(express.static("images"));
        this.filePath = './bananas.json';
        this.setUpRoutes();

    }

    // Helper function to read data from JSON file
    readBananas() {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

  //api banana metod
    getAllBananas(req, res) {
        const data = this.readBananas(); // Call the helper to read the games file
        res.json(data)
    }

    //web banana method
    webBananas(req, res) {
        const result = this.readBananas(); // Call the helper to read the games file
        res.render(`banana`,{result})
    }
    setUpRoutes() {

        // api address system
        this.app.get("/api/banana", (req,res) => this.getAllBananas(req, res))

        //for website
        this.app.get("/banana", (req,res) => this.webBananas(req, res))
        
//all addresses with route and function
        this.app.get("/add", (req,res) => {
          res.render(`add.ejs`)	
        })
    
       
    }

 start(port = 3000) {
    this.app.listen(port, () => {
        console.log("Holy God It worked")
    })
 }

}

const app = new myBanana();
app.start();