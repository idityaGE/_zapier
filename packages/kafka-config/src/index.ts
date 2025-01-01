import dotenv from "dotenv";

dotenv.config();

const TOPIC_NAME = "zap-events";

const KAFKA_BROKER = process.env.KAFKA_BROKER || "localhost:9092";

export { TOPIC_NAME, KAFKA_BROKER };
