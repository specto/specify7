import React from 'react';
import * as Leaflet from '../leaflet';
import { issueDefinitions } from '../lifemapperinfoissuedefinitions';
import { LifemapperInfo } from '../lifemapperinforeducer';
import {
  AggregatorName,
  BadgeName,
  FullAggregatorInfo,
  sourceLabels,
} from '../lifemapperinfoutills';
import { lifemapperMessagesMeta, MessageTypes } from './lifemapperinfo';

export function Badge<IS_ENABLED extends boolean>({
  name,
  onClick: handleClick,
  isEnabled,
  hasError,
}: {
  name: AggregatorName,
  onClick: IS_ENABLED extends true ?
    () => void :
    undefined,
  isEnabled: IS_ENABLED
  hasError: boolean,
}) {
  return <button
    disabled={!isEnabled}
    onClick={handleClick}
    className={`lifemapper-source-icon ${
      isEnabled ?
        '' :
        'lifemapper-source-icon-not-found'
    } ${
      hasError ?
        'lifemapper-source-icon-issues-detected' :
        ''
    }`}
  >
    <img src={`/static/img/${name}.png`} alt={sourceLabels[name]} />
  </button>;
}

export function Aggregator({
  name,
  data,
}: {
  name: AggregatorName,
  data: FullAggregatorInfo,
}) {
  return <>
    {
      data.listOfIssues.length === 0 ?
        <p>
          Record was indexed successfully and no data quality issues
          were reported
        </p> :
        <>
          <h2>The following data quality issues were reported: </h2>
          <ul className="lifemapper-source-issues-list">
            {[
              ...data.listOfIssues,
              ...(
                data.count > 1 ?
                  ['HAS_MULTIPLE_RECORDS'] :
                  []
              ),
            ].map(issue =>
              <li key={issue}>{
                // @ts-ignore
                issueDefinitions[name]?.[issue] ||
                issueDefinitions['common']?.[issue] ||
                issue
              }</li>,
            )}
          </ul>
        </>
    }
    <br />
    {
      (
        typeof data.occurrenceCount !== 'undefined' &&
        data.occurrenceCount.length !== 0
      ) &&
      <>
        Number of occurrences of similar taxa records:
        <ul className="lifemapper-source-issues-list">
          {data.occurrenceCount.map(({scientificName, count, url}, index) =>
            <li key={index}>
              <a
                target="_blank"
                href={url}
                rel="noreferrer nofollow"
              >{scientificName} </a>
              (reported {count} times)
            </li>,
          )}
        </ul>
      </>
    }
  </>;
}

export function LifemapperMap({
  badgeName,
  lifemapperInfo,
}: {
  badgeName: BadgeName
  lifemapperInfo: LifemapperInfo,
}) {

  const mapRef = React.useRef<HTMLDivElement | null>(null);

  if (badgeName !== 'lifemapper')
    return null;

  React.useEffect(() => {

    if (!mapRef.current)
      return;

    const [
      map,
      layerGroup,
    ] = Leaflet.showCOMap(
      mapRef.current,
      lifemapperInfo.layers,
      (
        Object.entries(
          lifemapperInfo.messages,
        ) as ([MessageTypes, string[]][])
      ).filter(([messages]) =>
        messages.length !== 0,
      ).map(([name, messages]) => `<span
        class="lifemapper-message-section ${
        lifemapperMessagesMeta[name].className
      }"
      >
        <p>${lifemapperMessagesMeta[name].title}</p>
        ${messages.join('<br>')}
      </span>`).join(''),
    );

    Leaflet.addMarkersToMap(
      map,
      layerGroup,
      lifemapperInfo.markers.flat(2),
      'Local Occurrence Points',
    );


    return () => {
      //TODO: finish this
    };

  }, [mapRef]);

  return <div
    className="lifemapper-leaflet-map"
    ref={mapRef}
  />;

}