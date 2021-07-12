import {Client} from "@elastic/elasticsearch";
import {bind, /* inject, */ BindingScope, inject} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {ApplicationConstant} from '../constants';
import {YoutubeData} from '../models';

@bind({scope: BindingScope.TRANSIENT})
export class ElasticSearchService {
  private static ES_INDEX = 'fampay-index'
  elastiClient: Client;
  constructor(
    @inject(LoggingBindings.WINSTON_LOGGER) private logger: WinstonLogger,
  ) {
    this.elastiClient = new Client({
      node: process.env.ES_URL
    })
  }

  createIndex(id: string, payload: YoutubeData, index: string = ElasticSearchService.ES_INDEX) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.elastiClient.index({
          index,
          body: payload,
          id
        })
      } catch (err) {
        this.logger.error(err)
      }
    })
  }

  findByTerms(term: string, size: number = ApplicationConstant.LIMIT, from: number = ApplicationConstant.OFFSET): Promise<{totalCount: number, currentCount: number, data: any[]}> {
    return new Promise(async (resolve, reject) => {
      try {
        const fields = ['videoTitle', 'description']
        const filterQuery = {
          body: {
            size,
            from,
            "sort": [
              {
                "publishedAt": {
                  "order": "desc"
                }
              }
            ],
            query: {
              "query_string": {
                "query": term,
                fields,
                "boost": 1
              }
            }
          }
        }
        const {body} = await this.elastiClient.search<any>(filterQuery);
        const totalCount = body?.hits?.total?.value
        const data = body.hits.hits.map((item: any) => item._source);
        return resolve({
          totalCount,
          currentCount: data.length,
          data
        })
      } catch (err) {
        return reject(err)
      }
    })
  }
}
