const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGO_IP, MONGO_PORT, MONGO_USERNAME, MONGO_PASSWORD, PORT } = require("./config/config");
//OpenAPI 
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerOptions = require('./config/swagger')
const swaggerUi = require('swagger-ui-express')

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended:  false}))
app.use(cors())

const mongoDbUrl = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}`;

console.log(mongoDbUrl)

//connect to the db
mongoose.connect(mongoDbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log( 'Database Connected'))
.catch( err => console.error( err ));
mongoose.set('useFindAndModify', false)

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database!'))

//Booking router
const bookingRouter = require('./routes/booking');
app.use('/', bookingRouter);

//error handling
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.status(err.status || 500);
  res.send(err);
})

//GET on hompage, to be deleted i guess
app.get('/', (req, res) => {
  res.json({message: 'Hello World!'});
});

app.listen(PORT, () => console.log(`Express is listening on port ${PORT}!`));

const openApiSpecification = swaggerJSDoc(swaggerOptions.options)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecification))

