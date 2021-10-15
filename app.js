const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const a = {
    x : 1,
    y : 2,
    z : 3
}

const A = JSON.stringify(a);

app.get('/', (req, res) => {
    res.send(A);
})

const port = 4000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});