var express = require('express')
var app = express()

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    console.log('Server is running at http://');
});