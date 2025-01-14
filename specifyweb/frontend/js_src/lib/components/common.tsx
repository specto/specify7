import '../../css/theme.css';

import React from 'react';

import icons from '../icons';
import { spanNumber } from '../wbplanviewhelper';
import dataModelStorage from '../wbplanviewmodel';

const MAX_HUE = 360;
const getHue = spanNumber(
  'a'.charCodeAt(0) * 2,
  'z'.charCodeAt(0) * 2,
  0,
  MAX_HUE
);

export function TableIcon({
  tableName,
}: {
  readonly tableName: string;
}): JSX.Element {
  const tableIconSource = icons.getIcon(tableName);
  const tableLabel = dataModelStorage.tables[tableName]?.label ?? '';
  if (tableIconSource !== '/images/unknown.png')
    return (
      <span
        className="table-icon table-icon-image"
        style={{ backgroundImage: `url('${tableIconSource}')` }}
        title={tableLabel}
      />
    );

  const colorHue = getHue(tableName.charCodeAt(0) + tableName.charCodeAt(0));
  const color = `hsl(${colorHue}, 70%, 50%)`;
  return (
    <span
      style={{ backgroundColor: color }}
      className="table-icon table-icon-generated"
      title={tableLabel}
    >
      {tableName.slice(0, 2).toUpperCase()}
    </span>
  );
}

export const TableIconUndefined = (
  <span className="table-icon table-icon-undefined">⃠</span>
);

export const TableIconSelected = (
  <span className="table-icon table-icon-selected">✓</span>
);

export const TableIconEmpty = <span className="table-icon table-icon-emtpy" />;
