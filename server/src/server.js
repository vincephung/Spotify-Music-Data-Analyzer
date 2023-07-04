// Add local environment variables to process.env
require('dotenv').config({ path: './.env.local' });

// Add global environment variables to process.env 
require('dotenv').config({ path: './.env' });

const app = require("./index")
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});