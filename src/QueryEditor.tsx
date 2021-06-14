import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { LegacyForms, InlineFormLabel } from '@grafana/ui';
import React, { PureComponent } from 'react';

import { SdsDataSource } from './DataSource';
import { SdsDataSourceOptions, SdsQuery } from './types';

const { AsyncSelect } = LegacyForms;

type Props = QueryEditorProps<SdsDataSource, SdsQuery, SdsDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  streams: Array<SelectableValue<string>> = [];

  constructor(props: Props) {
    super(props);
  }

  async queryStreamsAsync(value: string) {
    return await this.props.datasource.getStreams(value);
  }

  onSelectedStream = (value: SelectableValue<string>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, streamId: value.value || '', streamName: value.label || '' });
  };

  render() {
    const query = this.props.query;
    const selectStream: SelectableValue<string> = { label: query.streamName, value: query.streamId };

    return (
      <div className="gf-form">
        <InlineFormLabel width={8}>Stream</InlineFormLabel>
        <AsyncSelect
          defaultOptions={true}
          width={20}
          loadOptions={(inputvalue) => this.queryStreamsAsync(inputvalue)}
          defaultValue={query.streamId}
          value={selectStream}
          onChange={(inputvalue) => this.onSelectedStream(inputvalue)}
          placeholder="Select Stream"
          loadingMessage={() => 'Loading streams...'}
          noOptionsMessage={() => 'No streams found'}
        />
        <LegacyForms.Input value={query.streamId || ''} readOnly={true} hidden />
      </div>
    );
  }
}
