import {inject, service} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodsDataSource} from '../datasources';
import {YoutubeData, YoutubeDataRelations} from '../models';
import {ElasticSearchService} from '../services/elastic-search.service';

export class YoutubeDataRepository extends DefaultCrudRepository<
  YoutubeData,
  typeof YoutubeData.prototype._id,
  YoutubeDataRelations
> {
  constructor(
    @inject('datasources.mongods') dataSource: MongodsDataSource,
    @service(ElasticSearchService) private elasticSearchService: ElasticSearchService
  ) {
    super(YoutubeData, dataSource);
  }
  definePersistedModel(entityClass: typeof YoutubeData) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe("after save", (ctx, next) => {
      let payload = ctx.instance.toJSON()
      let uqid = payload._id.toString()
      delete payload._id
      this.elasticSearchService.createIndex(uqid, payload)
      next()
    })
    return modelClass
  }
}
