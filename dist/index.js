"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const events_routes_1 = __importDefault(require("./services/events.routes"));
const kafka_service_1 = __importDefault(require("./services/kafka-service"));
// Initialize Express application
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// Routes
app.use('/api/events', events_routes_1.default);
// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Service is running' });
});
// Start consuming events from Kafka
const startKafkaConsumer = async () => {
    await kafka_service_1.default.subscribeToEvents((event) => {
        console.log('Received event from Kafka:', event);
        // Handle the event here (e.g., process it, store it, etc.)
    });
};
// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        // Start consuming events from Kafka
        await startKafkaConsumer();
        console.log('Kafka consumer started');
    }
    catch (error) {
        console.error('Failed to start Kafka consumer:', error);
    }
});
// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received. Closing HTTP server and Kafka connections');
    await kafka_service_1.default.disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT signal received. Closing HTTP server and Kafka connections');
    await kafka_service_1.default.disconnect();
    process.exit(0);
});
