const app = require('./app')
const port = process.env.PORT || 10000

app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}...`);
});