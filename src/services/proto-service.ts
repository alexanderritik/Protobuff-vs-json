import * as protobuf from 'protobufjs';
import * as path from 'path';
import fs from 'fs';
import { time } from 'console';

export interface EventMessage {
  nameId: string;
  timestamp: string;
  fields: { [key: string]: string };
  resourceType: string;
  inputType: string;
  projectId: string;
}

class ProtoService {
  private root!: protobuf.Root;
  private Event!: protobuf.Type;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {

      // Load proto definition from file
      const protoPath = path.resolve(__dirname, '../../src/proto/sensor.proto');  
      this.root = protobuf.loadSync(protoPath);
    
      // Get the Event message type
      this.Event = this.root.lookupType('sensor.Event');
    } catch (error) {
      console.error('Failed to initialize Protocol Buffers:', error);
      throw error;
    }
  }

  public encodeEvent(event: EventMessage): Uint8Array {
    if (!this.Event) {
      throw new Error('Protocol Buffers not initialized');
    }

    // Verify the message
    const errMsg = this.Event.verify(event);
    if (errMsg) {
      throw new Error(`Invalid event: ${errMsg}`);
    }

    // Create a message from a plain object
    const message = this.Event.create(event);
    
    // Encode the message
    return this.Event.encode(message).finish();
  }

  public decodeEvent(buffer: Buffer | Uint8Array): EventMessage {
    if (!this.Event) {
      throw new Error('Protocol Buffers not initialized');
    }

    // Decode the message
    const message = this.Event.decode(buffer);
    
    // Convert to a plain object
    return this.Event.toObject(message, {
      defaults: true,
      arrays: true,
      objects: true,
      longs: String,
      enums: String,
      bytes: String,
    }) as EventMessage;
  }
}

// Create a singleton instance
const protoService = new ProtoService();
export default protoService;