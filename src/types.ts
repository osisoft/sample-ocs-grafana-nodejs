import { DataQuery, DataSourceJsonData } from '@grafana/data';

export enum SdsDataSourceType {
  OCS = 'OCS',
  EDS = 'EDS',
}

export interface SdsQuery extends DataQuery {
  stream: SdsStream;
  method: string;
  position?: string;
  searchMode?: string;
  filter?: string;
}

export interface SdsStream {
  TypeId?: string;
	Id: string;
	Name?: string;
	Description?: string;
}

export interface SdsDataSourceOptions extends DataSourceJsonData {
  type: SdsDataSourceType;
  eds_port: string;
  ocs_url: string;
  ocs_version: string;
  ocs_tenant: string;
  ocs_client: string;
  oauthPassThru: boolean;
  namespace: string;
}

export interface SdsDataSourceSecureOptions {
  ocs_secret: string;
}
