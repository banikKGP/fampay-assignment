import {inject, Provider} from '@loopback/core';
import {CronJob, cronJob} from '@loopback/cron';
import {CronJobController} from '../controllers';

@cronJob()
export class CronjobProvider implements Provider<CronJob> {
  constructor(
    @inject('controllers.CronJobController') private cronJobController: CronJobController
  ) {
  }

  value() {
    const job = new CronJob({
      cronTime: '*/30 * * * * *',
      start: true,
      onTick: () => {
        this.cronJobController.initJob(process.env.SEARCH_KEY || "football")
      }
    });
    job.onError(err => {
      console.error(err)
    })
    return job;
  }
}
