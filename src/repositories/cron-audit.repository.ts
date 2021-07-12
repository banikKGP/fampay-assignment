import {DefaultCrudRepository} from '@loopback/repository';
import {CronAudit, CronAuditRelations} from '../models';
import {MongodsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CronAuditRepository extends DefaultCrudRepository<
  CronAudit,
  typeof CronAudit.prototype._id,
  CronAuditRelations
> {
  constructor(
    @inject('datasources.mongods') dataSource: MongodsDataSource,
  ) {
    super(CronAudit, dataSource);
  }
}
