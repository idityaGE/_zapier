import prisma from "./lib/prisma";
import { Kafka } from "kafkajs";
import { TOPIC_NAME, KAFKA_BROKER } from "@repo/kafka-config";
import dotenv from "dotenv";

dotenv.config();

const BATCH_SIZE = 10;
const PROCESSING_INTERVAL = 3000; // 3 seconds

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: [KAFKA_BROKER],
});

async function main() {
  try {
    const producer = kafka.producer();
    await producer.connect();

    // Infinite loop for processing
    while (1) {
      // The prisma.zapRunOutbox.findMany method fetches up to 10 rows from the zapRunOutbox table in the database. The where: {} clause means it fetches all rows, and the take: 10 clause limits the number of rows to 10.
      const pendingRows = await prisma.zapRunOutbox.findMany({
        where: {},
        take: BATCH_SIZE,
      });
      // console.log(pendingRows);

      // The messages array is created by mapping over pendingRows, converting each row into a message with a value that is a JSON string containing the zapRunId and a stage field set to 0.
      producer.send({
        topic: TOPIC_NAME,
        messages: pendingRows.map((row: any) => {
          return {
            value: JSON.stringify({ zapRunId: row.zapRunId, stage: 0 }),
          };
        }),
      });

      // Deletes the rows from the zapRunOutbox table that were just processed and sent to Kafka. The where clause specifies that only rows with IDs in the pendingRows array should be deleted.
      await prisma.zapRunOutbox.deleteMany({
        where: {
          id: {
            in: pendingRows.map((row: any) => row.id),
          },
        },
      });

      await new Promise((resolve) => setTimeout(resolve, PROCESSING_INTERVAL));
    }
  } catch (error) {
    console.log("Error = ", error);
    await new Promise((resolve) => setTimeout(resolve, PROCESSING_INTERVAL));
  }
}

main();
