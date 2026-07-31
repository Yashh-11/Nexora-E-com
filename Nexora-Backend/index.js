import express from "express"
import 'dotenv/config'
import db from "./configs/db.js";
import router from "./routes/index.js";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors"

const port = process.env.PORT || 8081;
const app = express();

app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(cors())

app.use('/api', router)

if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log("Server Started")
        console.log(`http://localhost:${port}`);
    })
}

export default app;
