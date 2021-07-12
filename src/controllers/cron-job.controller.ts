// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {repository} from '@loopback/repository';
import {AxiosRequestConfig} from 'axios';
import * as _ from "lodash";
import moment from 'moment';
import {ApplicationConstant} from '../constants';
import {YoutubeData} from '../models';
import {CronAuditRepository, YoutubeDataRepository} from '../repositories';
import {AxiosService} from '../services';

// import {inject} from '@loopback/core';


export class CronJobController {
  startRange: Date;
  endRange: Date;
  constructor(
    @repository(YoutubeDataRepository) private youtubeDataRepository: YoutubeDataRepository,
    @repository(CronAuditRepository) private cronAuditRepository: CronAuditRepository,
    @inject(LoggingBindings.WINSTON_LOGGER) private logger: WinstonLogger,
    @service(AxiosService) private axiosService: AxiosService
  ) {
  }

  async initJob(searchKey: string | undefined) {
    try {
      this.endRange = moment.utc().toDate()
      const lastFetchedJob = await this.cronAuditRepository.findOne({
        order: ["publishedBefore DESC", "_id"]
      })
      if (lastFetchedJob) {
        this.startRange = moment.utc(moment(lastFetchedJob.publishedBefore).add(1, 'second')).toDate()
      } else {
        this.startRange = moment.utc(moment().subtract(60, 'minute')).toDate()
      }
      this.fetchData(searchKey, this.startRange, this.endRange)

    } catch (err) {
      this.logger.error(err)
    }
  }

  async fetchData(searchKey: string | undefined, startRange: Date, endRange: Date, pageToken: string = '') {
    const batch = await this.cronAuditRepository.create({
      publishedAfter: this.startRange,
      publishedBefore: this.endRange,
      apiKey: process.env.GAPI_KEY,
      pageToken,
      status: 'IN_PROGRESS'
    })
    const url = ApplicationConstant.YoutubeUrl
    const config: AxiosRequestConfig = {
      params: {
        key: process.env.GAPI_KEY,
        part: 'snippet',
        maxResults: ApplicationConstant.MaxResults,
        order: 'date',
        q: searchKey,
        publishedBefore: endRange,
        publishedAfter: startRange,
        pageToken,
      }
    }
    const {data, status} = await this.axiosService.get(url, config)
    if (status > 400) {
      return this.cronAuditRepository.updateById(batch._id, {
        status: 'FAILED'
      })
    }
    const bulkInsert: YoutubeData[] = []
    if (Array.isArray(data.items) && data.items.length > 0) {
      data.items.map((item: any) => {
        let payload = new YoutubeData({
          publishedAt: item?.snippet?.publishedAt,
          videoTitle: item?.snippet?.title,
          description: item?.snippet?.title,
          publishedTime: item?.snippet?.publishTime,
          thumbnails: item?.snippets?.thumbnails,
          youtubeVideoId: item?.id?.videoId
        })
        this.youtubeDataRepository.create(payload)
        bulkInsert.push(payload)
      })
      // await this.youtubeDataRepository.createAll(bulkInsert)
    }
    await this.cronAuditRepository.updateById(batch._id, {
      status: 'COMPLETED'
    })
    if (!_.isNil(data?.nextPageToken)) {
      this.fetchData(searchKey, startRange, endRange, data.nextPageToken)
    }
  }
}
