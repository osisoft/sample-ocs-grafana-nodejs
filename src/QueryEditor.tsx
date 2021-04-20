import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { LegacyForms, InlineFormLabel, InlineField, Select, Input } from '@grafana/ui';
import React, { PureComponent, ChangeEvent } from 'react';

import { SdsDataSource } from './DataSource';
import { SdsDataSourceOptions, SdsQuery, SdsStream } from './types';

const { AsyncSelect } = LegacyForms;

const methodOptions = [
  { label: 'Values', value: 'values' },
  { label: 'First', value: 'first' },
  { label: 'Last', value: 'last' },
  { label: 'Distinct', value: 'distinct'},
  { label: 'Interpolated', value: 'interpolated'},
  { label: 'Summaries', value: 'summaries' }
];

const positionOptions = [
  { label: 'End', value: 'end' },
  { label: 'Start', value: 'start' }
];

const searchModes = [
  { label: 'Exact', value: 'exact' },
  { label: 'ExactOrNext', value: 'exactOrNext' },
  { label: 'Next', value: 'next' },
  { label: 'ExactOrPrevious', value: 'exactOrPrevious' },
  { label: 'Previous', value: 'previous' }
];

type Props = QueryEditorProps<SdsDataSource, SdsQuery, SdsDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  streams: SelectableValue<string>[] = [];

  constructor(props: Props) {
    super(props);
  }

  async queryStreamsAsync(value: string) {
    return await this.props.datasource.getStreams(value);
  }

  onSelectedStream = (value: SelectableValue<SdsStream>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, stream: value.value as SdsStream });
  };

  onMethodChange = (value: SelectableValue<string>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, method: value.value || 'values' });
  };

  onSearchModeChange = (value: SelectableValue<string>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, searchMode: value.value || 'exact' });
  };

  onPositionChange = (value: SelectableValue<string>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, position: value.value || 'end' });
  };

  onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, filter: e.currentTarget.value });
  };

  render() {
    const query = this.props.query;
    const { stream, method, searchMode, filter, position } = query;
    const select_stream: SelectableValue<SdsStream> = { value: stream, label: stream&&stream.Name };

    return (
      <div className="gf-form">
        <InlineFormLabel width={8}>Stream</InlineFormLabel>
        <AsyncSelect
          defaultOptions={true}
          width={20}
          loadOptions={inputvalue => this.queryStreamsAsync(inputvalue)}
          defaultValue={stream}
          value={select_stream}
          onChange={inputvalue => this.onSelectedStream(inputvalue)}
          placeholder="Select Stream"
          loadingMessage={() => 'Loading streams...'}
          noOptionsMessage={() => 'No streams found'}
        />
        <LegacyForms.Input value={stream&&stream.Id || ''} readOnly={true} hidden />
        <InlineField label="Method" tooltip="Method used to retreive data from SDS">
          <Select
            width={15}
            value={methodOptions.find(_ => _.value === method) || "values"}
            onChange={this.onMethodChange}
            options={methodOptions}
          />
        </InlineField>
        {method == 'distinct' ? (
          <>
            <InlineField label="Position" tooltip="Time frame position to retrieve value from">
              <Select
                width={8}
                value={positionOptions.find(_ => _.value === position) || "end"}
                onChange={this.onPositionChange}
                options={positionOptions}
              />
            </InlineField>
            <InlineField label="Search Mode" tooltip="Search behavior when seeking a stored event">
              <Select
                width={15}
                value={searchModes.find(_ => _.value === searchMode) || "exact"}
                onChange={this.onSearchModeChange}
                options={searchModes}
              />
            </InlineField>
          </>
        ) : null}
        {/values|summaries/.test(method) ? (
          <InlineField label="Filter" tooltip="Filter expression">
            <Input value={filter} onChange={this.onFilterChange} spellCheck={false} css="" />
          </InlineField>
        ) : null}
      </div>
    );
  }
}
