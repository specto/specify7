import type { IR } from './components/wbplanview';
import type { RelationshipType } from './components/wbplanviewmapper';
import schema from './schema';

export const dataModelFetcherVersion = '5';
export const cacheBucketName = 'dataModelFetcher';

export const knownRelationshipTypes: Set<string> = new Set([
  'one-to-one',
  'one-to-many',
  'many-to-one',
  'many-to-many',
]);

export const aliasRelationshipTypes: IR<RelationshipType> = {
  'zero-to-one': 'one-to-many',
};

export const fetchingParameters: {
  readonly requiredFieldsToHide: Readonly<string[]>;
  readonly tablesToRemove: Readonly<string[]>;
  readonly tableKeywordsToExclude: Readonly<string[]>;
  readonly requiredFieldsToMakeOptional: IR<Readonly<string[]>>;
  readonly commonBaseTables: Readonly<string[]>;
  readonly fieldsToRemove: IR<Readonly<string[]>>;
} = {
  /*
   * All required fields are not hidden, except for these, which are made
   * not required
   */
  requiredFieldsToHide: [
    'timestampcreated',
    'timestampmodified',
    'createdbyagent',
    'modifiedbyagent',
    'collectionmemberid',
    'rankid',
    'defintion',
    'definitionitem',
    'ordernumber',
    'isprimary',
    'ishybrid',
    'isaccepted',
    'isloanable',
    'treedef',
  ],

  /*
   * These tables and any relationships to these tables would be excluded
   * from the WB mapper
   */
  tablesToRemove: [
    'definition',
    'definitionitem',
    'geographytreedef',
    'geologictimeperiodtreedef',
    'treedef',
    'lithostrattreedefitem',
    'storagetreedefitem',
    'taxontreedefitem',
    'collectingeventattr',
    'collectionobjectattr',
    ...schema.orgHierarchy.filter(
      (tableName) => tableName !== 'collectionobject'
    ),
  ],

  /*
   * Remove the tables that have any of these keywords from the list of base
   * tables
   */
  tableKeywordsToExclude: [
    'Authorization',
    'Variant',
    'Attribute',
    'Property',
    'Item',
    'Definition',
    'Pnt',
    'Type',
  ],

  requiredFieldsToMakeOptional: {
    agent: ['agenttype'],
    determination: ['iscurrent'],
    loadpreparation: ['isresolved'],
    locality: ['srclatlongunit'],
  },

  // Base tables that are available by default
  commonBaseTables: [
    'accession',
    'agent',
    'borrow',
    'collectingevent',
    'collectionobject',
    'conservevent',
    'container',
    'deaccession',
    'determination',
    'dnasequence',
    'exchangein',
    'exchangeout',
    'geography',
    'gift',
    'loan',
    'locality',
    'permit',
    'preparation',
    'storage',
    'taxon',
    'treatmentevent',
  ],

  // Make these fields inaccessible in the WB's mapper
  fieldsToRemove: {
    agent: ['catalogerof'],
    collectionobject: ['currentDetermination'],
    loan: [
      'totalpreps',
      'unresolvedpreps',
      'unresolveditems',
      'resolvedpreps',
      'resolveditems',
    ],
    preptype: ['isonloan'],
    token: ['preferredtaxonof'],
    geography: ['fullname'],
  },
} as const;