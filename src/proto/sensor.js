/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.sensor = (function() {

    /**
     * Namespace sensor.
     * @exports sensor
     * @namespace
     */
    var sensor = {};

    sensor.Event = (function() {

        /**
         * Properties of an Event.
         * @memberof sensor
         * @interface IEvent
         * @property {string|null} [nameId] Event nameId
         * @property {string|null} [timestamp] Event timestamp
         * @property {Object.<string,string>|null} [fields] Event fields
         * @property {string|null} [resourceType] Event resourceType
         * @property {string|null} [inputType] Event inputType
         * @property {string|null} [projectId] Event projectId
         */

        /**
         * Constructs a new Event.
         * @memberof sensor
         * @classdesc Represents an Event.
         * @implements IEvent
         * @constructor
         * @param {sensor.IEvent=} [properties] Properties to set
         */
        function Event(properties) {
            this.fields = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Event nameId.
         * @member {string} nameId
         * @memberof sensor.Event
         * @instance
         */
        Event.prototype.nameId = "";

        /**
         * Event timestamp.
         * @member {string} timestamp
         * @memberof sensor.Event
         * @instance
         */
        Event.prototype.timestamp = "";

        /**
         * Event fields.
         * @member {Object.<string,string>} fields
         * @memberof sensor.Event
         * @instance
         */
        Event.prototype.fields = $util.emptyObject;

        /**
         * Event resourceType.
         * @member {string} resourceType
         * @memberof sensor.Event
         * @instance
         */
        Event.prototype.resourceType = "";

        /**
         * Event inputType.
         * @member {string} inputType
         * @memberof sensor.Event
         * @instance
         */
        Event.prototype.inputType = "";

        /**
         * Event projectId.
         * @member {string} projectId
         * @memberof sensor.Event
         * @instance
         */
        Event.prototype.projectId = "";

        /**
         * Creates a new Event instance using the specified properties.
         * @function create
         * @memberof sensor.Event
         * @static
         * @param {sensor.IEvent=} [properties] Properties to set
         * @returns {sensor.Event} Event instance
         */
        Event.create = function create(properties) {
            return new Event(properties);
        };

        /**
         * Encodes the specified Event message. Does not implicitly {@link sensor.Event.verify|verify} messages.
         * @function encode
         * @memberof sensor.Event
         * @static
         * @param {sensor.IEvent} message Event message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Event.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nameId != null && Object.hasOwnProperty.call(message, "nameId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nameId);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.timestamp);
            if (message.fields != null && Object.hasOwnProperty.call(message, "fields"))
                for (var keys = Object.keys(message.fields), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.fields[keys[i]]).ldelim();
            if (message.resourceType != null && Object.hasOwnProperty.call(message, "resourceType"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.resourceType);
            if (message.inputType != null && Object.hasOwnProperty.call(message, "inputType"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.inputType);
            if (message.projectId != null && Object.hasOwnProperty.call(message, "projectId"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.projectId);
            return writer;
        };

        /**
         * Encodes the specified Event message, length delimited. Does not implicitly {@link sensor.Event.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sensor.Event
         * @static
         * @param {sensor.IEvent} message Event message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Event.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Event message from the specified reader or buffer.
         * @function decode
         * @memberof sensor.Event
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sensor.Event} Event
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Event.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensor.Event(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.nameId = reader.string();
                        break;
                    }
                case 2: {
                        message.timestamp = reader.string();
                        break;
                    }
                case 3: {
                        if (message.fields === $util.emptyObject)
                            message.fields = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = "";
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = reader.string();
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.fields[key] = value;
                        break;
                    }
                case 4: {
                        message.resourceType = reader.string();
                        break;
                    }
                case 5: {
                        message.inputType = reader.string();
                        break;
                    }
                case 6: {
                        message.projectId = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Event message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sensor.Event
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sensor.Event} Event
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Event.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Event message.
         * @function verify
         * @memberof sensor.Event
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Event.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nameId != null && message.hasOwnProperty("nameId"))
                if (!$util.isString(message.nameId))
                    return "nameId: string expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isString(message.timestamp))
                    return "timestamp: string expected";
            if (message.fields != null && message.hasOwnProperty("fields")) {
                if (!$util.isObject(message.fields))
                    return "fields: object expected";
                var key = Object.keys(message.fields);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isString(message.fields[key[i]]))
                        return "fields: string{k:string} expected";
            }
            if (message.resourceType != null && message.hasOwnProperty("resourceType"))
                if (!$util.isString(message.resourceType))
                    return "resourceType: string expected";
            if (message.inputType != null && message.hasOwnProperty("inputType"))
                if (!$util.isString(message.inputType))
                    return "inputType: string expected";
            if (message.projectId != null && message.hasOwnProperty("projectId"))
                if (!$util.isString(message.projectId))
                    return "projectId: string expected";
            return null;
        };

        /**
         * Creates an Event message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sensor.Event
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sensor.Event} Event
         */
        Event.fromObject = function fromObject(object) {
            if (object instanceof $root.sensor.Event)
                return object;
            var message = new $root.sensor.Event();
            if (object.nameId != null)
                message.nameId = String(object.nameId);
            if (object.timestamp != null)
                message.timestamp = String(object.timestamp);
            if (object.fields) {
                if (typeof object.fields !== "object")
                    throw TypeError(".sensor.Event.fields: object expected");
                message.fields = {};
                for (var keys = Object.keys(object.fields), i = 0; i < keys.length; ++i)
                    message.fields[keys[i]] = String(object.fields[keys[i]]);
            }
            if (object.resourceType != null)
                message.resourceType = String(object.resourceType);
            if (object.inputType != null)
                message.inputType = String(object.inputType);
            if (object.projectId != null)
                message.projectId = String(object.projectId);
            return message;
        };

        /**
         * Creates a plain object from an Event message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sensor.Event
         * @static
         * @param {sensor.Event} message Event
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Event.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.fields = {};
            if (options.defaults) {
                object.nameId = "";
                object.timestamp = "";
                object.resourceType = "";
                object.inputType = "";
                object.projectId = "";
            }
            if (message.nameId != null && message.hasOwnProperty("nameId"))
                object.nameId = message.nameId;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                object.timestamp = message.timestamp;
            var keys2;
            if (message.fields && (keys2 = Object.keys(message.fields)).length) {
                object.fields = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.fields[keys2[j]] = message.fields[keys2[j]];
            }
            if (message.resourceType != null && message.hasOwnProperty("resourceType"))
                object.resourceType = message.resourceType;
            if (message.inputType != null && message.hasOwnProperty("inputType"))
                object.inputType = message.inputType;
            if (message.projectId != null && message.hasOwnProperty("projectId"))
                object.projectId = message.projectId;
            return object;
        };

        /**
         * Converts this Event to JSON.
         * @function toJSON
         * @memberof sensor.Event
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Event.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Event
         * @function getTypeUrl
         * @memberof sensor.Event
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Event.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/sensor.Event";
        };

        return Event;
    })();

    return sensor;
})();

module.exports = $root;
