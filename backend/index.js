const connectToMongo = require('./db');
const express = require('express')
const app = express()
const port = 5001
app.use(express.json())

 app.use('/api/auth',require('./routes/auth'))
 app.use('/api/notes',require('./routes/notes'))


  
     app.listen(port, () => {
       console.log(`app listening on http://localhost:${port}`)
 })
 

 const startServer = async () => {
     await connectToMongo();
    
 };

 startServer();
