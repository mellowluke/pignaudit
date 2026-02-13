import { Worker, type ConnectionOptions } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
}) as unknown as ConnectionOptions;

const auditReportWorker = new Worker(
  "audit-reports",
  async (job) => {
    console.log(`Processing job ${job.id}: ${job.name}`);
    // Report generation logic will go here
  },
  { connection },
);

const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    console.log(`Processing notification ${job.id}: ${job.name}`);
    // Notification delivery logic will go here
  },
  { connection },
);

console.log("PignAudit workers started");

process.on("SIGTERM", async () => {
  await auditReportWorker.close();
  await notificationWorker.close();
  process.exit(0);
});
