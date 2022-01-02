const express = require('express'),
      dbOperation = require('./dbFiles/dbOperation'),
      cors    = require('cors');

const API_PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.get('/api', async(req, res) => {
    console.log('/api Called');
    const result = await dbOperation.getItemData();
    res.send(result.recordset);
});

app.get('/quit', async(req, res) => {
    console.log('/quit Called');
    res.send({result: 'Quit'});
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));