require('dotenv').config();
require('express-async-errors');

//extras
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express');
const app = express();

//connectDb 
const connectDB =require('./db/connect');

//auth middleware
const authMiddleware = require('./middleware/authentication')

// route source
const auth = require('./routes/auth')
const jobs = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra packages
app.use(
  rateLimiter({
     windowMs:15 * 60 * 1000,   // 15 minutes
     max:100
  })
)
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/',(req,res)=>{
  res.send('home')
})

// routes
app.use('/api/v1/auth',auth)
app.use('/api/v1/jobs',authMiddleware,jobs)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
