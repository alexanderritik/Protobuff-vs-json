import { CompressionTypes, Kafka, Producer, Consumer } from 'kafkajs';
import protoService, { EventMessage } from './proto-service';

class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private readonly TOPIC = 'sensor-events';
  
  constructor() {
    this.kafka = new Kafka({
      clientId: 'sensor-event-api',
      brokers: ['localhost:9092'], // Update with your Kafka broker addresses
    });
    
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'sensor-event-group' });
    
    this.initialize();
  }
  
  private async initialize() {
    try {
      await this.producer.connect();
      console.log('Kafka producer connected');
    } catch (error) {
      console.error('Failed to connect Kafka producer:', error);
    }
  }
  
  public async publishEvent(event: EventMessage): Promise<void> {
    try {
      // Encode the event using Protocol Buffers
      const encodedEvent = protoService.encodeEvent(event);
      
      // Send the encoded event to Kafka
      await this.producer.send({
        topic: this.TOPIC,
        compression: CompressionTypes.LZ4,
        messages: [
          { 
            key: event.nameId,
            value: Buffer.from(encodedEvent) 
          }
        ],
      });
      
      console.log(`Event published to Kafka: ${event.nameId}`);
    } catch (error) {
      console.error('Failed to publish event to Kafka:', error);
      throw error;
    }
  }
  
  public async subscribeToEvents(callback: (event: EventMessage) => void): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.TOPIC });
      
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          try {
            if (message.value) {
              // Decode the event using Protocol Buffers
              const event = protoService.decodeEvent(message.value);
              callback(event);
            }
          } catch (error) {
            console.error('Error processing Kafka message:', error);
          }
        },
      });
    } catch (error) {
      console.error('Failed to subscribe to Kafka:', error);
      throw error;
    }
  }
  
  public async disconnect(): Promise<void> {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
}

// Create a singleton instance
const kafkaService = new KafkaService();
export default kafkaService;