import { DataQuery, DataSourceJsonData } from '@grafana/data';

export enum SdsDataSourceType {
  OCS = 'OCS',
  EDS = 'EDS',
}

export interface SdsQuery extends DataQuery {
  streamId: string;
  streamName: string;
}

export interface SdsDataSourceOptions extends DataSourceJsonData {
  type: SdsDataSourceType;
  edsPort: string;
  ocsUrl: string;
  ocsVersion: string;
  ocsTenant: string;
  ocsClient: string;
  ocsUseCommunity: boolean;
  ocsCommunity: string;
  oauthPassThru: boolean;
  namespace: string;
}

export interface SdsDataSourceSecureOptions {
  ocsSecret: string;
}
