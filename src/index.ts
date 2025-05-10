import express from 'express';
import eventsRoutes from './services/events.routes';
import kafkaService from './services/kafka-service';
import { EventMessage } from './services/proto-service';

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/events', eventsRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Service is running' });
});

// Start consuming events from Kafka
const startKafkaConsumer = async () => {
  await kafkaService.subscribeToEvents((event: EventMessage) => {
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
  } catch (error) {
    console.error('Failed to start Kafka consumer:', error);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing HTTP server and Kafka connections');
  await kafkaService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received. Closing HTTP server and Kafka connections');
  await kafkaService.disconnect();
  process.exit(0);
});