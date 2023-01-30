const express = require('express');
const app = express();
const cors = require('cors');

const PORT = 5000;

let corsOptions = {
    origin: ['https://localhost:3000', 'http://localhost:3000'],
    credentials: true
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
	res.json({ 'message' : 'Hello, World!'});
});

app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});