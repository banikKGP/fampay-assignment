import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {format, LoggingBindings, LoggingComponent} from '@loopback/logging';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class InitApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    this.configure(LoggingBindings.COMPONENT).to({
      enableFluent: false,
      enableHttpAccessLog: true
    })
    this.configure(LoggingBindings.WINSTON_LOGGER).to({
      level: 'info',
      format: format.json(),
      defaultMeta: {framework: 'LoopBack'},
    })
    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(CronComponent)
    this.component(LoggingComponent)

    // this.add(createBindingFromClass(CronjobProviderProvider))


    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
