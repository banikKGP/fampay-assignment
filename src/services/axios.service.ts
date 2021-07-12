import {bind, /* inject, */ BindingScope} from '@loopback/core';
import axios, {AxiosRequestConfig} from "axios";

@bind({scope: BindingScope.TRANSIENT})
export class AxiosService {
  constructor(
  ) { }

  get(url: string, config?: AxiosRequestConfig) {
    return axios.get(url, config)
    // return require('../../dummy.json')
  }
}
