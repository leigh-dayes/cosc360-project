const { PORT } = require('./config')

module.exports = {
    options: {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Drop Bear Table',
                version: '0.0.1',
                description: 'A (kind of) REST API CRUD reservations and restaurants'
            },
        },
        host: 'localhost:${PORT}',
        basePath: '/',
        apis: ['./routes/booking.js']
    }
}