import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, post, requestBody
} from '@loopback/rest';
import * as _ from "lodash";
import {ApplicationConstant} from '../constants';
import {YoutubeData} from '../models';
import {YoutubeDataRepository} from '../repositories';
import {ElasticSearchService} from '../services/elastic-search.service';

export class YoutubeDataController {
  constructor(
    @repository(YoutubeDataRepository)
    public youtubeDataRepository: YoutubeDataRepository,
    @service(ElasticSearchService) private elasticSearchService: ElasticSearchService
  ) { }

  @post('/youtube', {
    responses: {
      '200': {
        description: 'YoutubeData model instance',
        content: {'application/json': {schema: getModelSchemaRef(YoutubeData)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(YoutubeData, {
            title: 'NewYoutubeData',
            exclude: ['_id'],
          }),
        },
      },
    })
    youtubeData: Omit<YoutubeData, '_id'>,
  ): Promise<YoutubeData> {
    return this.youtubeDataRepository.create(youtubeData);
  }

  @get('/youtube/count', {
    responses: {
      '200': {
        description: 'YoutubeData model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(YoutubeData) where?: Where<YoutubeData>,
  ): Promise<Count> {
    return this.youtubeDataRepository.count(where);
  }

  @get('/youtube', {
    responses: {
      '200': {
        description: 'Array of YoutubeData model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(YoutubeData, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(YoutubeData) filter?: Filter<YoutubeData>,
  ): Promise<{totalCount: number, currentCount: number, data: YoutubeData[]}> {
    if (_.isNil(filter)) {
      filter = {
        limit: ApplicationConstant.LIMIT,
        order: ['publishedAt DESC']
      }
    }
    if (!_.isInteger(filter.limit)) {
      filter.limit = ApplicationConstant.LIMIT
    }
    if (_.isNil(filter.order)) {
      filter.order = ['publishedAt DESC']
    }
    const [totalCount, data] = await Promise.all([
      this.youtubeDataRepository.count(filter.where),
      this.youtubeDataRepository.find(filter)
    ]);
    return {
      totalCount: totalCount.count,
      currentCount: data.length,
      data
    }
  }

  @get('/youtube/search', {
    responses: {
      '200': {
        description: 'Array of YoutubeData model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(YoutubeData),
            },
          },
        },
      },
    },
  })
  async searchTermQuery(
    @param.query.string('searchTerm') searchTerm: string,
    @param.query.number('limit') limit: number,
    @param.query.number('skip') skip: number,
  ): Promise<{totalCount: number, currentCount: number, data: any[]}> {

    return this.elasticSearchService.findByTerms(searchTerm, limit, skip)
    // return {
    //   totalCount: totalCount.count,
    //   currentCount: data.length,
    //   data
    // }
  }

  // @patch('/youtube', {
  //   responses: {
  //     '200': {
  //       description: 'YoutubeData PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(YoutubeData, {partial: true}),
  //       },
  //     },
  //   })
  //   youtubeData: YoutubeData,
  //   @param.where(YoutubeData) where?: Where<YoutubeData>,
  // ): Promise<Count> {
  //   return this.youtubeDataRepository.updateAll(youtubeData, where);
  // }

  @get('/youtube/{id}', {
    responses: {
      '200': {
        description: 'YoutubeData model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(YoutubeData, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(YoutubeData, {exclude: 'where'}) filter?: FilterExcludingWhere<YoutubeData>
  ): Promise<YoutubeData> {
    return this.youtubeDataRepository.findById(id, filter);
  }

  // @patch('/youtube/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'YoutubeData PATCH success',
  //     },
  //   },
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(YoutubeData, {partial: true}),
  //       },
  //     },
  //   })
  //   youtubeData: YoutubeData,
  // ): Promise<void> {
  //   await this.youtubeDataRepository.updateById(id, youtubeData);
  // }

  // @put('/youtube/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'YoutubeData PUT success',
  //     },
  //   },
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() youtubeData: YoutubeData,
  // ): Promise<void> {
  //   await this.youtubeDataRepository.replaceById(id, youtubeData);
  // }

  // @del('/youtube/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'YoutubeData DELETE success',
  //     },
  //   },
  // })
  // async deleteById(@param.path.string('id') id: string): Promise<void> {
  //   await this.youtubeDataRepository.deleteById(id);
  // }
}
