const express = require('express'); 
const app = express(); 
const PORT = 5000;

app.get('/api/data', (req, res) => {
  res.json({ message: "Hello from the Node.js backend!" });
});

app.get('/api/hello', (req, res) => {
    res.json({hello: "Hello World!"}); 
}); 

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
