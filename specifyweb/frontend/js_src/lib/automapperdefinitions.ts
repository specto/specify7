/*
 *
 * This file contains information to help auto-map imported XLSX and CSV files
 * to the Specify 6 data model. Originally Based on
 * https://github.com/specify/specify6/blob/master/config/datamodel_automappings.xml
 *
 *
 */

import type { IR, RA, RR } from './components/wbplanview';
import type {
  AutomapperScope,
  MappingPath,
} from './components/wbplanviewmapper';

/*
 *  Automapper does 2 passes though the schema whenever it is asked to map
 *  some headers. This is needed to ensure priority mapping for some mapping
 *  paths. In particular, `shortcuts` and `tableSynonyms` are used on the
 *  first pass. The second path goes over `synonyms` and also does string
 *  comparison (matching)
 */

export interface Options {
  /*
   * A structure for defining matching rules
   * NOTE: All values must use lower case exclusively!
   *
   */

  // Regex match (header.match(regex) !== null)
  readonly regex?: RA<RegExp>;

  // Exact string match (header===string)
  readonly string?: RA<string>;

  // Substring match (header.indexOf(string)!==-1)
  readonly contains?: RA<string>;

  /*
   * NOTE: formattedHeaderFieldSynonym is also available as a matching
   * rule, but only for `synonym` rules. See more later in this file
   */
}

// Main structure

export interface TableSynonym {
  /*
   * Mapping path needed to reach <tableName>. Can include any number
   * of parents, up to base table
   */
  readonly mappingPathFilter: MappingPath;
  readonly synonyms: RA<string>;
}

interface AutoMapperDefinitions {
  /*
   * NOTE: all keys and values in the definitions should use lower case
   * (since headers, table names and field names used by the mapper are
   * all in lower case), unless it is explicitly specified that they are
   * case-insensitive
   *
   */

  /*
   * Table Synonyms are to be used when a table has a different
   *   name in a particular context
   * Also, since automapper runs through each table only once,
   *   table synonyms can be used as a way bypass that limitation
   * Besides that, even though `synonyms` and matches are normally
   *   checked in the second pass, if a table has
   *   Table Synonyms, it's `synonyms` and matches would also
   *   be checked in the first pass
   */
  readonly tableSynonyms: IR<
    /*
     * TableName (case-insensitive)
     * Described earlier in the file
     */
    RA<TableSynonym>
  >;

  /*
   * Rank synonyms are used to when the same tree rank can have
   * different name depending on the discipline
   */
  readonly rankSynonyms: IR<
    // TableName (case-insensitive)
    {
      rankName: string;
      synonyms: RA<string>;
    }[]
  >;

  /*
   * Don't match list designates certain fields in particular
   *   tables as ineligible for automatic matching under
   *   certain scopes
   * This is helpful if some fields are commonly matched when
   *   they should not be
   * Don't match list is of the highest priority and would cancel
   *   a mapping even if a shortcut, or a synonym was used
   */
  readonly dontMatch: IR<
    // TableName (case-insensitive)
    IR<
      /*
       * FieldName (case-insensitive)
       * Defined in wbplanviewmapper.tsx
       */
      RA<AutomapperScope>
    >
  >;

  /*
   * Don't map headers that match the regex
   * This is helpful if some fields are too ambiguous and thus should not be
   *  automapped
   * Don't map list is of the highest priority and would cancel
   *   a mapping even if a shortcut, or a synonym was used
   */
  readonly dontMap: Partial<
    RR<
      // Defined in wbplanviewmapper.tsx
      AutomapperScope,
      // Described earlier in the file
      { headers: Options }
    >
  >;

  /*
   * Shortcuts are to be used when successful header match should
   *   map to a certain mapping path rather than a field name
   * Shortcuts have higher priority than synonyms and thus can
   *   also be used to map commonly confused fields before they
   *   are erroneously mapped elsewhere
   * Shortcut is followed only if header matched the comparisons
   *   and a path to tableName from baseTableName
   */
  readonly shortcuts: IR<
    // TableName (case-insensitive)
    Partial<
      RR<
        // Defined in wbplanviewmapper.tsx
        AutomapperScope,
        {
          /*
           * Mapping path that is to be appended to the current path
           * when shortcut is followed
           */
          mappingPath: MappingPath;
          // Described earlier in the file
          headers: Options;
        }[]
      >
    >
  >;

  /*
   * Synonyms should be used when fieldName of tableName should be mapped
   *   to a particular header, yet field label alone is not enough to
   *   guarantee a successful match
   * Synonyms are helpful in situations where field name can be spelled
   *   in different ways, or may vary depending on the context
   * Synonym is used only if header matched the comparisons and
   *   and there exists a path from tableName to baseTableName
   */
  readonly synonyms: IR<
    // TableName (case-insensitive)
    IR<
      // FieldName (case-insensitive)
      Partial<
        RR<
          // Defined in wbplanviewmapper.tsx
          AutomapperScope,
          {
            headers: Options & {
              /*
               * Additional matching rule - available
               * only for `synonym` definitions
               * Matches only if header is strictly
               * in one of the following forms:
               *  - <fieldNameSynonym> <tableName>
               *   - <tableName> <fieldNameSynonym>
               *   - <tableName> <index> <fieldNameSynonym>
               *   - <tableName> <fieldNameSynonym> <index>
               * Where <fieldNameSynonym> is the value
               * provided in formattedHeaderFieldSynonym
               */
              formattedHeaderFieldSynonym?: RA<string>;
            };
          }
        >
      >
    >
  >;
}

const definitions: AutoMapperDefinitions = {
  tableSynonyms: {
    Agent: [
      {
        mappingPathFilter: ['determination', 'determiner'],
        synonyms: ['determiner', 'who id'],
      },
      {
        mappingPathFilter: ['determinations', 'determiner'],
        synonyms: ['determiner', 'who id'],
      },
      {
        mappingPathFilter: ['collectingevent', 'collectors', 'agent'],
        synonyms: ['collector'],
      },
      {
        mappingPathFilter: ['collectingevents', 'collectors', 'agent'],
        synonyms: ['collector'],
      },
      {
        mappingPathFilter: ['collectionobject', 'cataloger'],
        synonyms: ['cataloger'],
      },
      {
        mappingPathFilter: ['collectionobjects', 'cataloger'],
        synonyms: ['cataloger'],
      },
      {
        mappingPathFilter: ['referencework', 'authors'],
        synonyms: ['author'],
      },
      {
        mappingPathFilter: ['geocoorddetails', 'georefdetby'],
        synonyms: ['geo ref by'],
      },
      {
        mappingPathFilter: ['preparation', 'preparedbyagent'],
        synonyms: ['prepared'],
      },
      {
        mappingPathFilter: ['preparations', 'preparedbyagent'],
        synonyms: ['prepared'],
      },
      {
        mappingPathFilter: ['accessionagent', 'agent'],
        synonyms: ['accession agent', 'accessioned by'],
      },
      {
        mappingPathFilter: ['accessionagents', 'agent'],
        synonyms: ['accession agent', 'accessioned by'],
      },
      {
        mappingPathFilter: ['dnasequence', 'sequencer'],
        synonyms: ['sequencer'],
      },
    ],
    Determination: [
      {
        mappingPathFilter: ['collectionobject', 'determinations'],
        synonyms: ['id'],
      },
    ],
    CollectingEvent: [
      {
        mappingPathFilter: [],
        synonyms: ['collected'],
      },
    ],
    CollectionObject: [
      {
        mappingPathFilter: ['collectionobject'],
        synonyms: ['co'],
      },
    ],
    Locality: [
      {
        mappingPathFilter: ['locality'],
        synonyms: ['loc'],
      },
    ],
  },
  rankSynonyms: {
    Taxon: [
      {
        rankName: 'Superdivision',
        synonyms: ['Superphylum'],
      },
      {
        rankName: 'Division',
        synonyms: ['Phylum'],
      },
      {
        rankName: 'Subdivision',
        synonyms: ['Subphylum'],
      },
      {
        rankName: 'Infradivision',
        synonyms: ['Infraphylum'],
      },
      {
        rankName: 'Microdivision',
        synonyms: ['Microphylum'],
      },
      {
        rankName: 'Superphylum',
        synonyms: ['Superdivision'],
      },
      {
        rankName: 'Phylum',
        synonyms: ['Division'],
      },
      {
        rankName: 'Subphylum',
        synonyms: ['Subdivision'],
      },
      {
        rankName: 'Infraphylum',
        synonyms: ['Infradivision'],
      },
      {
        rankName: 'Microphylum',
        synonyms: ['Microdivision'],
      },
    ],
  },
  dontMatch: {
    Address: {
      // Some ranks were mapped to Address instead of Geography
      country: ['automapper'],
      state: ['automapper'],
    },
  },
  dontMap: {
    automapper: {
      headers: {
        regex: [/^type[^a-z]*$/, /^remarks/, /^notes/],
      },
    },
  },
  shortcuts: {
    CollectionObject: {
      automapper: [
        {
          mappingPath: ['cataloger', 'lastname'],
          headers: {
            contains: ['cataloged by', 'catalogued by'],
          },
        },
      ],
      suggestion: [
        {
          mappingPath: ['cataloger', 'lastname'],
          headers: {
            contains: ['cataloged by', 'catalogued by'],
          },
        },
      ],
    },
    Determination: {
      suggestion: [
        {
          mappingPath: ['determiner', 'lastname'],
          headers: {
            contains: ['determiner'],
          },
        },
      ],
    },
  },
  synonyms: {
    DnaSequence: {
      genbankAccessionNumber: {
        automapper: {
          headers: {
            contains: ['genbank'],
          },
        },
      },
    },
    Agent: {
      middleInitial: {
        suggestion: {
          headers: {
            contains: ['middle'],
          },
        },
        automapper: {
          headers: {
            formattedHeaderFieldSynonym: ['middle'],
          },
        },
      },
      firstName: {
        suggestion: {
          headers: {
            contains: ['first'],
          },
        },
        automapper: {
          headers: {
            formattedHeaderFieldSynonym: ['first'],
          },
        },
      },
      lastName: {
        suggestion: {
          headers: {
            contains: ['last'],
          },
        },
        automapper: {
          headers: {
            formattedHeaderFieldSynonym: ['last'],
          },
        },
      },
    },
    CollectingEvent: {
      verbatimDate: {
        suggestion: {
          headers: {
            contains: ['date verbatim', 'date collected verbatim'],
          },
        },
      },
      startDate: {
        automapper: {
          headers: {
            string: ['date'],
          },
        },
        suggestion: {
          headers: {
            contains: ['start', 'collected'],
          },
        },
      },
      endDate: {
        suggestion: {
          headers: {
            contains: ['end', 'date'],
          },
        },
      },
      method: {
        automapper: {
          headers: {
            contains: ['collection method'],
          },
        },
        suggestion: {
          headers: {
            contains: ['method'],
          },
        },
      },
      stationfieldnumber: {
        automapper: {
          headers: {
            regex: [
              /^(?:coll(?:ect(?:ing)?)?\.??(?: ev(?:ent)?)?\.?|field)?(?: (?:#|n(?:o|um(?:ber)?)?))?\.?$/,
            ],
          },
        },
      },
    },
    Accession: {
      accessionnumber: {
        automapper: {
          headers: {
            regex: [/^acc(?:ession)?\.?(?: (?:#|n(?:o|um(?:ber)?)?))?\.?$/],
            string: ['accession'],
          },
        },
      },
    },
    Locality: {
      maxElevation: {
        automapper: {
          headers: {
            contains: ['max elev', 'max depth'],
          },
        },
      },
      minElevation: {
        automapper: {
          headers: {
            contains: ['elev', 'depth'],
          },
        },
      },
      latitude1: {
        automapper: {
          headers: {
            contains: ['latitude 1'],
            string: ['latitude', 'lat', 'lat1', 'lat 1'],
          },
        },
        suggestion: {
          headers: {
            contains: ['latitude', 'lat '],
          },
        },
      },
      latitude2: {
        automapper: {
          headers: {
            contains: ['latitude 2'],
          },
        },
      },
      longitude1: {
        automapper: {
          headers: {
            contains: ['longitude 1'],
            string: ['longitude', 'long', 'long1', 'long 1'],
          },
        },
        suggestion: {
          headers: {
            contains: ['longitude', 'long '],
          },
        },
      },
      longitude2: {
        automapper: {
          headers: {
            contains: ['longitude 2'],
          },
        },
      },
      latlongmethod: {
        automapper: {
          headers: {
            contains: ['lat/long method'],
          },
        },
        suggestion: {
          headers: {
            contains: ['method'],
          },
        },
      },
      localityname: {
        automapper: {
          headers: {
            string: ['localitynum', 'locality'],
          },
        },
        suggestion: {
          headers: {
            contains: ['location'],
          },
        },
      },
      namedplace: {
        automapper: {
          headers: {
            contains: ['named place'],
          },
        },
      },
    },
    Gift: {
      receivedComments: {
        suggestion: {
          headers: {
            contains: ['comments'],
          },
        },
      },
    },
    CollectionObject: {
      fieldNumber: {
        automapper: {
          headers: {
            contains: ['field #', 'field no', 'field num'],
          },
        },
      },
      catalogedDate: {
        automapper: {
          headers: {
            contains: ['catalog date', 'cataloged date', 'catalogued date'],
            string: ['cat date'],
          },
        },
      },
      catalogNumber: {
        automapper: {
          headers: {
            regex: [
              /^(?:specimen|cat(?:alogu?e?)?)\.?(?: (?:#|n(?:o|um(?:ber)?)?))?\.?$/,
            ],
          },
        },
        suggestion: {
          headers: {
            string: ['#', 'no', 'num', 'number'],
          },
        },
      },
      altcatalognumber: {
        automapper: {
          headers: {
            regex: [
              /^alt(?:ernative)?\.? (?:specimen|cat(?:alogu?e?)?)\.?(?: (?:#|n(?:o|um(?:ber)?)?))?\.?$/,
            ],
            string: ['altcatno'],
          },
        },
      },
    },
    Geography: {
      state: {
        automapper: {
          headers: {
            contains: ['state'],
          },
        },
      },
      continent: {
        automapper: {
          headers: {
            contains: ['continent'],
          },
        },
      },
    },
    Determination: {
      determinedDate: {
        suggestion: {
          headers: {
            contains: ['date'],
          },
        },
        automapper: {
          headers: {
            formattedHeaderFieldSynonym: ['date'],
          },
        },
      },
      typeStatusName: {
        suggestion: {
          headers: {
            contains: ['status'],
          },
        },
        automapper: {
          headers: {
            formattedHeaderFieldSynonym: ['status'],
          },
        },
      },
    },
    PrepType: {
      name: {
        automapper: {
          headers: {
            contains: ['preptype', 'prep ', 'preparation'],
          },
        },
      },
    },
  },
};

/*
 * Method that converts all table names and field names in definitions to
 * lower case
 */
function definitionsToLowercase(
  definitions: AutoMapperDefinitions
): AutoMapperDefinitions {
  const keysToLowerCase = (object: object, levels = 1): object =>
    Object.fromEntries(
      Object.entries(object).map(([key, value]) => [
        key.toLowerCase(),
        levels > 1 ? keysToLowerCase(value, levels - 1) : value,
      ])
    );

  /*
   * Specify how deep to go into each branch when converting to lowerCase
   */
  const structureDepth: [
    structureName: keyof typeof definitions,
    depth: number
  ][] = [
    ['tableSynonyms', 1],
    ['rankSynonyms', 1],
    ['dontMatch', 1 + 1],
    ['shortcuts', 1],
    ['synonyms', 1 + 1],
  ];
  structureDepth.forEach(
    ([structureName, depth]) =>
      // @ts-expect-error
      (definitions[structureName] = keysToLowerCase(
        definitions[structureName],
        depth
      ))
  );

  return Object.freeze(definitions);
}

export default definitionsToLowercase(definitions);
