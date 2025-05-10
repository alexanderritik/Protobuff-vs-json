"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const proto_service_1 = __importDefault(require("./proto-service"));
class KafkaService {
    constructor() {
        this.TOPIC = 'sensor-events';
        this.kafka = new kafkajs_1.Kafka({
            clientId: 'sensor-event-api',
            brokers: ['localhost:9092'], // Update with your Kafka broker addresses
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: 'sensor-event-group' });
        this.initialize();
    }
    async initialize() {
        try {
            await this.producer.connect();
            console.log('Kafka producer connected');
        }
        catch (error) {
            console.error('Failed to connect Kafka producer:', error);
        }
    }
    async publishEvent(event) {
        try {
            // Encode the event using Protocol Buffers
            const encodedEvent = proto_service_1.default.encodeEvent(event);
            // Send the encoded event to Kafka
            await this.producer.send({
                topic: this.TOPIC,
                compression: kafkajs_1.CompressionTypes.LZ4,
                messages: [
                    {
                        key: event.nameId,
                        value: Buffer.from(encodedEvent)
                    }
                ],
            });
            console.log(`Event published to Kafka: ${event.nameId}`);
        }
        catch (error) {
            console.error('Failed to publish event to Kafka:', error);
            throw error;
        }
    }
    async subscribeToEvents(callback) {
        try {
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: this.TOPIC });
            await this.consumer.run({
                eachMessage: async ({ message }) => {
                    try {
                        if (message.value) {
                            // Decode the event using Protocol Buffers
                            const event = proto_service_1.default.decodeEvent(message.value);
                            callback(event);
                        }
                    }
                    catch (error) {
                        console.error('Error processing Kafka message:', error);
                    }
                },
            });
        }
        catch (error) {
            console.error('Failed to subscribe to Kafka:', error);
            throw error;
        }
    }
    async disconnect() {
        await this.producer.disconnect();
        await this.consumer.disconnect();
    }
}
// Create a singleton instance
const kafkaService = new KafkaService();
exports.default = kafkaService;
