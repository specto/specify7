import { createDictionary } from './utils';

// Refer to "Guidelines for Programmers" in ./README.md before editing this file

const welcomeText = createDictionary({
  pageTitle: {
    'en-us': 'Welcome',
    'ru-ru': 'Добро пожаловать',
    ca: 'Welcome',
  },
  mainPage: {
    'en-us': 'Main Page',
    'ru-ru': 'Главная',
    ca: 'Main Page',
  },
  aboutSpecifyButtonDescription: {
    'en-us': 'About Specify',
    'ru-ru': 'О Specify',
    ca: 'About Specify',
  },
  taxonTiles: {
    'en-us': 'Taxon Tiles',
    'ru-ru': 'Плитки таксонов',
    ca: 'Taxon Tiles',
  },
  taxonTilesDescription: {
    'en-us': (count: number) =>
      `Showing Taxa with ${count} or more Collection Objects`,
    'ru-ru': (count: number) =>
      `Показаны таксоны с ${count} или более экземплярами`,
    ca: (count: number) =>
      `Showing Taxa with ${count} or more Collection Objects`,
  },
  aboutSpecifyDialogTitle: {
    'en-us': 'About Specify',
    'ru-ru': 'О Specify',
    ca: 'About Specify',
  },
  fullAddress: {
    'en-us': `
      Specify Collections Consortium<br>
      Biodiversity Institute<br>
      University of Kansas<br>
      1345 Jayhawk Blvd.<br>
      Lawrence, KS 66045 USA`,
    'ru-ru': `
      Specify Collections Consortium<br>
      Biodiversity Institute<br>
      University of Kansas<br>
      1345 Jayhawk Blvd.<br>
      Lawrence, KS 66045 USA`,
    ca: `
      Specify Collections Consortium<br>
      Biodiversity Institute<br>
      University of Kansas<br>
      1345 Jayhawk Blvd.<br>
      Lawrence, KS 66045 USA`,
  },
  disclosure: {
    'en-us': `
      Specify Software is a product of the Specify Collections Consortium
      that is funded by its member institutions. Consortium Founding Members
      include: University of Michigan, University of Florida, Denmark
      Consortium of Museums, and the University of Kansas. The Consortium
      operates under the non-profit, 501(c)3, U.S. tax status of the University
      of Kansas Center for Research. Specify was supported previously by
      multiple awards from the U.S. National Science Foundation.`,
    'ru-ru': `
      Specify Software является продуктом консорциума Specify Collections.
      который финансируется организациями-членами. Члены-учредители консорциума
      включают: University of Michigan, University of Florida, Denmark
      Consortium of Museums и University of Kansas. Консорциум
      действует под некоммерческой организацией, 501(c)3, налоговым статусом США
      Университета University of Kansas. Specify ранее поддерживался
      многочисленные награды фонда U.S. National Science Foundation.`,
    ca: `
      Specify Software is a product of the Specify Collections Consortium
      that is funded by its member institutions. Consortium Founding Members
      include: University of Michigan, University of Florida, Denmark
      Consortium of Museums, and the University of Kansas. The Consortium
      operates under the non-profit, 501(c)3, U.S. tax status of the University
      of Kansas Center for Research. Specify was supported previously by
      multiple awards from the U.S. National Science Foundation.`,
  },
  licence: {
    'en-us': `
      Specify 7 Copyright © 2021 University of Kansas Center for
      Research. Specify comes with ABSOLUTELY NO WARRANTY. This is
      free software licensed under GNU General Public License 2
      (GPL2).`,
    'ru-ru': `
      Specify 7 Авторские права © 2021 University of Kansas для исследования.
      Specify поставляется с СОВЕРШЕННО ОТСУТСТВИЕМ ГАРАНТИИ. Это
      бесплатное программное обеспечение под лицензией GNU General Public
      License 2 (GPL2).`,
    ca: `
      Specify 7 Copyright © 2021 University of Kansas Center for
      Research. Specify comes with ABSOLUTELY NO WARRANTY. This is
      free software licensed under GNU General Public License 2
      (GPL2).`,
  },
  systemInformation: {
    'en-us': 'System Information',
    'ru-ru': 'Системная информация',
    ca: 'System Information',
  },
  version: {
    'en-us': 'Version:',
    'ru-ru': 'Версия:',
    ca: 'Version:',
  },
  specifySixVersion: {
    'en-us': 'Specify 6 Version:',
    'ru-ru': 'Specify 6 Версия:',
    ca: 'Specify 6 Version:',
  },
  databaseVersion: {
    'en-us': 'Database Version:',
    'ru-ru': 'Версия базы данных:',
    ca: 'Database Version:',
  },
  schemaVersion: {
    'en-us': 'Schema Version:',
    'ru-ru': 'Версия схемы базы данных:',
    ca: 'Schema Version:',
  },
  databaseName: {
    'en-us': 'Database Name:',
    'ru-ru': 'Имя базы данных:',
    ca: 'Database Name:',
  },
  institution: {
    'en-us': 'Institution:',
    'ru-ru': 'Учреждение:',
    ca: 'Institution:',
  },
  discipline: {
    'en-us': 'Discipline:',
    'ru-ru': 'Дисциплина:',
    ca: 'Discipline:',
  },
  collection: {
    'en-us': 'Collection:',
    'ru-ru': 'Коллекция:',
    ca: 'Collection:',
  },
  isaNumber: {
    'en-us': 'ISA Number:',
    'ru-ru': 'Номер ISA:',
    ca: 'ISA Number:',
  },
  browser: {
    'en-us': 'Browser',
    'ru-ru': 'Браузер',
    ca: 'Browser',
  },
});

export default welcomeText;
