import {Entity, model, property} from '@loopback/repository';
import moment from 'moment';

@model()
export class CronAudit extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'}
  })
  _id?: string;

  @property({
    type: 'date',
    required: true,
  })
  publishedAfter: Date;

  @property({
    type: 'date',
    required: true,
  })
  publishedBefore: Date;

  @property({
    type: 'string',
    required: true,
    enum: ["IN_PROGRESS", "COMPLETED", "FAILED"]
  })
  status: string;

  @property({
    type: 'string',
    required: true,
  })
  apiKey: string;

  @property({
    type: 'string',
    required: false,
  })
  pageToken?: string;

  @property({
    type: 'date',
    required: true,
    default: moment().toDate(),
  })
  createdAt: Date;

  @property({
    type: 'date',
    required: true,
    default: moment().toDate(),
  })
  modifiedAt: Date;

  constructor(data?: Partial<CronAudit>) {
    super(data);
  }
}

export interface CronAuditRelations {
  // describe navigational properties here
}

export type CronAuditWithRelations = CronAudit & CronAuditRelations;
