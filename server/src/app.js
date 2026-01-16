const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');
const config = require('./config/config')

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

require('./routes')(app)

sequelize.sync()
    .then(() => {
        app.listen(config.port);
        console.log(`Server started on port ${config.port}`);
    });
// sequelize.sync({ force: true })