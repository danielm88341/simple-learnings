const PORT = 8000;
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))