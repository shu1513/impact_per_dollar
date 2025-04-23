import app from "./app";
import {config} from './config/env';
import { startCleanupJob } from "./cron/cleanup";

app.listen(config.port, ()=>{
    console.log(`Server running on port ${config.port}`);
    startCleanupJob();
});