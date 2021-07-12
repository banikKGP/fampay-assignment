import {Entity, model, property} from '@loopback/repository';
import moment from 'moment';

@model()
export class YoutubeData extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'}
  })
  _id?: string;


  @property({
    type: 'string',
    // unique: true,
    // required: true,
    index: true
  })
  youtubeVideoId?: string;

  @property({
    type: 'string',
    required: true,
    index: true
  })
  videoTitle: string;

  @property({
    type: 'string',
    index: true
  })
  description?: string;

  @property({
    type: 'date',
    required: true,
  })
  publishedAt: string;

  @property({
    type: 'date',
    required: true,
  })
  publishedTime: string;

  @property({
    type: 'object',
  })
  thumbnails?: any;

  @property({
    type: 'date',
    required: true,
    default: moment().toDate()
  })
  createdAt: string;

  @property({
    type: 'date',
    required: true,
    default: moment().toDate()
  })
  modifiedAt: string;

  constructor(data?: Partial<YoutubeData>) {
    super(data);
  }
}

export interface YoutubeDataRelations {
  // describe navigational properties here
}

export type YoutubeDataWithRelations = YoutubeData & YoutubeDataRelations;
