import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function startCleanupJob() {
    cron.schedule('0 * * * *', () => {
      void (async () => {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        try {
          const result = await prisma.customer.deleteMany({
            where: {
              emailVerified: false,
              createdAt: {
                lt: cutoff,
              },
            },
          });
          console.log(`Deleted ${result.count} unverified users`);
        } catch (err) {
          console.error('Failed to delete unverified users:', err);
        }
      })();
    });
  }