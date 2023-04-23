import { NewRelicConfig } from '@newrelic/native-metrics';

const config: NewRelicConfig = {
  app_name: 'shortUrl',
  license_key: 'af239e415b6a24c6c7f640f66926f867FFFFNRAL',
  logging: {
    level: process.env.NEW_RELIC_LOG_LEVEL || 'info',
  },
};

export { config, NewRelicConfig };
