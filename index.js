const express = require("express")

const App = express();
const dotenv = require("dotenv");
const cookieParser = require("./node_modules/cookie-parser");
const cors = require("./node_modules/cors")
dotenv.config({path : "./config.env"})
require("./db/Connection")


App.use(cookieParser())
App.use(cors({origin: 'http://localhost:3000', credentials: true}))
// const cors = require('cors')
// const cookieParser = require('cookie-parser')

// App.use(cookieParser())
// App.use(cors({origin: 'http://localhost:3000', credentials: true}))
App.use(express.json());

App.use("/api/", require("./routes/Auth"))


App.listen( process.env.PORT || 5000 , () => console.log("connected to server"))