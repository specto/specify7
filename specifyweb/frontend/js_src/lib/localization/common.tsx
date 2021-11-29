import React from 'react';

import { createDictionary, createHeader, createJsxHeader } from './utils';

// Refer to "Guidelines for Programmers" in ./README.md before editing this file

const commonText = createDictionary({
  specifySeven: {
    'en-us': 'Specify&nbsp7',
    'ru-ru': 'Specify&nbsp7',
    ca: 'Specify&nbsp7',
  },
  pageNotFound: {
    'en-us': 'Page Not Found',
    'ru-ru': 'Страница не найдена',
    ca: 'Page Not Found',
  },
  collectionAccessDeniedDialogTitle: {
    'en-us': 'Access denied',
    'ru-ru': 'Доступ отказано',
    ca: 'Access denied',
  },
  collectionAccessDeniedDialogHeader: {
    'en-us': createHeader('You do not have access to this collection'),
    'ru-ru': createHeader('У вас нет доступа к этой коллекции'),
    ca: createHeader('You do not have access to this collection'),
  },
  collectionAccessDeniedDialogMessage: {
    'en-us': (collectionName: string) =>
      `The currently logged in account does not have access to the
       ${collectionName} collection.`,
    'ru-ru': (collectionName: string) =>
      `Учетная запись, вошедшая в систему в данный момент, не имеет доступа к
       коллекции ${collectionName}.`,
    ca: (collectionName: string) =>
      `The currently logged in account does not have access to the
       ${collectionName} collection.`,
  },
  no: {
    'en-us': 'No',
    'ru-ru': 'Нет',
    ca: 'No',
  },
  cancel: {
    'en-us': 'Cancel',
    'ru-ru': 'Отмена',
    ca: 'Cancel',
  },
  create: {
    'en-us': 'Create',
    'ru-ru': 'Создать',
    ca: 'Create',
  },
  close: {
    'en-us': 'Close',
    'ru-ru': 'Закрыть',
    ca: 'Close',
  },
  apply: {
    'en-us': 'Apply',
    'ru-ru': 'Применить',
    ca: 'Apply',
  },
  applyAll: {
    'en-us': 'Apply All',
    'ru-ru': 'Применить все',
    ca: 'Apply All',
  },
  clearAll: {
    'en-us': 'Clear all',
    'ru-ru': 'Очистить все',
    ca: 'Clear all',
  },
  save: {
    'en-us': 'Save',
    'ru-ru': 'Сохранить',
    ca: 'Save',
  },
  add: {
    'en-us': 'Add',
    'ru-ru': 'Добавить',
    ca: 'Add',
  },
  open: {
    'en-us': 'Open',
    'ru-ru': 'Открыть',
    ca: 'Open',
  },
  delete: {
    'en-us': 'Delete',
    'ru-ru': 'Удалить',
    ca: 'Delete',
  },
  next: {
    'en-us': 'Next',
    'ru-ru': 'Следующий',
    ca: 'Next',
  },
  previous: {
    'en-us': 'Previous',
    'ru-ru': 'Предыдущий',
    ca: 'Previous',
  },
  tools: {
    'en-us': 'Tools',
    'ru-ru': 'Инструменты',
    ca: 'Tools',
  },
  loading: {
    'en-us': 'Loading...',
    'ru-ru': 'Загрузка...',
    ca: 'Loading...',
  },
  tableName: {
    'en-us': 'Table Name',
    'ru-ru': 'Имя таблицы',
    ca: 'Table Name',
  },
  name: {
    'en-us': 'Name',
    'ru-ru': 'Имя',
    ca: 'Name',
  },
  created: {
    'en-us': 'Created',
    'ru-ru': 'Созданный',
    ca: 'Created',
  },
  uploaded: {
    'en-us': 'Uploaded',
    'ru-ru': 'Загружено',
    ca: 'Uploaded',
  },
  createdBy: {
    'en-us': 'Created by:',
    'ru-ru': 'Создан:',
    ca: 'Created by:',
  },
  modifiedBy: {
    'en-us': 'Modified by:',
    'ru-ru': 'Модифицирован:',
    ca: 'Modified by:',
  },
  stop: {
    'en-us': 'Stop',
    'ru-ru': 'Стоп',
    ca: 'Stop',
  },
  remove: {
    'en-us': 'Remove',
    'ru-ru': 'Удалить',
    ca: 'Remove',
  },
  search: {
    'en-us': 'Search',
    'ru-ru': 'Искать',
    ca: 'Search',
  },
  noResults: {
    'en-us': 'No Results',
    'ru-ru': 'Нет результатов',
    ca: 'No Results',
  },
  notApplicable: {
    'en-us': 'N/A',
    'ru-ru': 'Н/Д',
    ca: 'N/A',
  },
  notFound: {
    'en-us': 'Not found',
    'ru-ru': 'Не найден',
    ca: 'Not found',
  },
  new: {
    'en-us': 'New',
    'ru-ru': 'Новый',
    ca: 'New',
  },
  reports: {
    'en-us': 'Reports',
    'ru-ru': 'Отчеты',
    ca: 'Reports',
  },
  labels: {
    'en-us': 'Labels',
    'ru-ru': 'Этикетки',
    ca: 'Labels',
  },
  edit: {
    'en-us': 'Edit',
    'ru-ru': 'Редактировать',
    ca: 'Edit',
  },
  ignore: {
    'en-us': 'Ignore',
    'ru-ru': 'Игнорировать',
    ca: 'Ignore',
  },
  logIn: {
    'en-us': 'Log In',
    'ru-ru': 'Авторизоваться',
    ca: 'Log In',
  },
  start: {
    'en-us': 'Start',
    'ru-ru': 'Начало',
    ca: 'Start',
  },
  end: {
    'en-us': 'End',
    'ru-ru': 'Конец',
    ca: 'End',
  },
  update: {
    'en-us': 'Update',
    'ru-ru': 'Обновить',
    ca: 'Update',
  },
  generate: {
    'en-us': 'Generate',
    'ru-ru': 'Генерировать',
    ca: 'Generate',
  },
  loadingInline: {
    'en-us': '(loading...)',
    'ru-ru': '(загрузка...)',
    ca: '(loading...)',
  },
  listTruncated: {
    'en-us': '(list truncated)',
    'ru-ru': '(список усечен)',
    ca: '(list truncated)',
  },
  metadataInline: {
    'en-us': 'Metadata:',
    'ru-ru': 'Метаданные:',
    ca: 'Metadata:',
  },
  metadata: {
    'en-us': 'Metadata',
    'ru-ru': 'Метаданные',
    ca: 'Metadata',
  },
  unmapped: {
    'en-us': 'Unmapped',
    'ru-ru': 'Не сопоставлений',
    ca: 'Unmapped',
  },
  mapped: {
    'en-us': 'Mapped',
    'ru-ru': 'Сопоставлений',
    ca: 'Mapped',
  },
  expand: {
    'en-us': 'Expand',
    'ru-ru': 'Расширить',
    ca: 'Expand',
  },
  geoMap: {
    'en-us': 'GeoMap',
    'ru-ru': 'Карта',
    ca: 'GeoMap',
  },
  fullDate: {
    'en-us': 'Full Date',
    'ru-ru': 'Полная дата',
    ca: 'Full Date',
  },
  year: {
    'en-us': 'Year',
    'ru-ru': 'Год',
    ca: 'Year',
  },
  month: {
    'en-us': 'Month',
    'ru-ru': 'Месяц',
    ca: 'Month',
  },
  day: {
    'en-us': 'Day',
    'ru-ru': 'День',
    ca: 'Day',
  },
  view: {
    'en-us': 'View',
    'ru-ru': 'Смотреть',
    ca: 'View',
  },
  addChild: {
    'en-us': 'Add child',
    'ru-ru': 'Добавить ребенка',
    ca: 'Add child',
  },
  move: {
    'en-us': 'Move',
    'ru-ru': 'Переместить',
    ca: 'Move',
  },
  opensInNewTab: {
    'en-us': '(opens in a new tab)',
    'ru-ru': '(открывается в новой вкладке)',
    ca: '(opens in a new tab)',
  },

  // Toolbar
  notifications: {
    'en-us': (count: number) => `Notifications: ${count}`,
    'ru-ru': (count: number) => `Уведомлений: ${count}`,
    ca: (count: number) => `Notifications: ${count}`,
  },
  attachments: {
    'en-us': 'Attachments',
    'ru-ru': 'Вложения',
    ca: 'Attachments',
  },
  dataEntry: {
    'en-us': 'Data Entry',
    'ru-ru': 'Ввод данных',
    ca: 'Data Entry',
  },
  makeDwca: {
    'en-us': 'Make DwCA',
    'ru-ru': 'Создать DwCA',
    ca: 'Make DwCA',
  },
  definitionResourceNotFound: {
    'en-us': (resourceName: string) =>
      `Definition resource "${resourceName}" was not found.`,
    'ru-ru': (resourceName: string) =>
      `Ресурс определения "${resourceName}" не найден.`,
    ca: (resourceName: string) =>
      `Definition resource "${resourceName}" was not found.`,
  },
  metadataResourceNotFound: {
    'en-us': (resourceName: string) =>
      `Metadata resource "${resourceName}" was not found.`,
    'ru-ru': (resourceName: string) =>
      `Ресурс метаданных "${resourceName}" не найден.`,
    ca: (resourceName: string) =>
      `Metadata resource "${resourceName}" was not found.`,
  },
  updateExportFeed: {
    'en-us': 'Update Feed Now',
    'ru-ru': 'Обновить фид',
    ca: 'Update Feed Now',
  },
  updateExportFeedDialogTitle: {
    'en-us': 'Export Feed',
    'ru-ru': 'Экспорт фида',
    ca: 'Export Feed',
  },
  updateExportFeedDialogHeader: {
    'en-us': createHeader('Update all export feed items now?'),
    'ru-ru': createHeader('Обновить все элементы фида экспорта сейчас?'),
    ca: createHeader('Update all export feed items now?'),
  },
  updateExportFeedDialogMessage: {
    'en-us': 'Update all export feed items now?',
    'ru-ru': 'Обновить все элементы фида экспорта сейчас?',
    ca: 'Update all export feed items now?',
  },
  feedExportStartedDialogTitle: {
    'en-us': 'Export Feed',
    'ru-ru': 'Экспорт фида',
    ca: 'Export Feed',
  },
  feedExportStartedDialogHeader: {
    'en-us': createHeader('Export feed update started'),
    'ru-ru': createHeader('Начато обновление экспортного фида'),
    ca: createHeader('Export feed update started'),
  },
  feedExportStartedDialogMessage: {
    'en-us': `
      Update started. You will receive a notification for each feed item
      updated.`,
    'ru-ru': `
      Обновление началось. Вы получите уведомление о каждом элементе фида`,
    ca: `
      Update started. You will receive a notification for each feed item
      updated.`,
  },
  dwcaExportStartedDialogTitle: {
    'en-us': 'DwCA',
    'ru-ru': 'DwCA',
    ca: 'DwCA',
  },
  dwcaExportStartedDialogHeader: {
    'en-us': createHeader('DwCA export started'),
    'ru-ru': createHeader('DwCA экспорт начат'),
    ca: createHeader('DwCA export started'),
  },
  dwcaExportStartedDialogMessage: {
    'en-us': `
      Export started. You will receive a notification
      when the export is complete.`,
    'ru-ru': `
      Экспорт начат. Вы получите уведомление когда экспорт будет завершен.`,
    ca: `
      Export started. You will receive a notification
      when the export is complete.`,
  },
  interactions: {
    'en-us': 'Interactions',
    'ru-ru': 'Взаимодействия',
    ca: 'Interactions',
  },
  generateMasterKey: {
    'en-us': 'Generate Master Key',
    'ru-ru': 'Сгенерировать мастер-ключ',
    ca: 'Generate Master Key',
  },
  generateMasterKeyDialogTitle: {
    'en-us': 'Master Key',
    'ru-ru': 'Мастер ключ',
    ca: 'Master Key',
  },
  generateMasterKeyDialogHeader: {
    'en-us': createHeader('Generate Master Key'),
    'ru-ru': createHeader('Сгенерировать мастер-ключ'),
    ca: createHeader('Generate Master Key'),
  },
  userPassword: {
    'en-us': 'User Password:',
    'ru-ru': 'Пользовательский пароль:',
    ca: 'User Password:',
  },
  masterKeyDialogTitle: {
    'en-us': 'Master Key',
    'ru-ru': 'Мастер ключ',
    ca: 'Master Key',
  },
  masterKeyDialogHeader: {
    'en-us': createHeader('Master key generated'),
    'ru-ru': createHeader('Мастер-ключ создан'),
    ca: createHeader('Master key generated'),
  },
  masterKeyFieldLabel: {
    'en-us': 'Master Key:',
    'ru-ru': 'Мастер ключ:',
    ca: 'Master Key:',
  },
  incorrectPassword: {
    'en-us': 'Password was incorrect.',
    'ru-ru': 'Пароль неверный.',
    ca: 'Password was incorrect.',
  },
  ascending: {
    'en-us': 'Ascending',
    'ru-ru': 'По возрастанию',
    ca: 'Ascending',
  },
  descending: {
    'en-us': 'Descending',
    'ru-ru': 'По убыванию',
    ca: 'Descending',
  },
  queries: {
    'en-us': 'Queries',
    'ru-ru': 'Запросы',
    ca: 'Queries',
  },
  queriesDialogTitle: {
    'en-us': (count: number) => `Queries (${count})`,
    'ru-ru': (count: number) => `Запросы (${count})`,
    ca: (count: number) => `Queries (${count})`,
  },
  newQueryDialogTitle: {
    'en-us': 'New Query Type',
    'ru-ru': 'Новый запрос',
    ca: 'New Query Type',
  },
  exportQueryForDwca: {
    'en-us': 'Export query for DwCA definition.',
    'ru-ru': 'Экспорт запрос для DwCA.',
    ca: 'Export query for DwCA definition.',
  },
  exportQueryForDwcaDialogTitle: {
    'en-us': 'Query XML for DwCA definition',
    'ru-ru': 'XML Запроса для определения DwCA',
    ca: 'Query XML for DwCA definition',
  },
  exportQueryForDwcaDialogHeader: {
    'en-us': createHeader('Query XML for DwCA definition'),
    'ru-ru': createHeader('XML Запроса для определения DwCA'),
    ca: createHeader('Query XML for DwCA definition'),
  },
  exportQueryAsReport: {
    'en-us': 'Define report based on query.',
    'ru-ru': 'Определите отчет на основе запроса.',
    ca: 'Define report based on query.',
  },
  exportQueryAsLabel: {
    'en-us': 'Define label based on query.',
    'ru-ru': 'Определите метку на основе запроса.',
    ca: 'Define label based on query.',
  },
  newResourceTitle: {
    'en-us': (resourceName: string) => `New ${resourceName}`,
    'ru-ru': (resourceName: string) => `Новый ${resourceName}`,
    ca: (resourceName: string) => `New ${resourceName}`,
  },
  labelName: {
    'en-us': 'Label Name',
    'ru-ru': 'Название ярлыка',
    ca: 'Label Name',
  },
  reportName: {
    'en-us': 'Report Name',
    'ru-ru': 'Название отчета',
    ca: 'Report Name',
  },
  createLabelDialogTitle: {
    'en-us': 'Labels',
    'ru-ru': 'Этикетки',
    ca: 'Labels',
  },
  createLabelDialogHeader: {
    'en-us': createHeader('Create new label'),
    'ru-ru': createHeader('Создать новую этикетку'),
    ca: createHeader('Create new label'),
  },
  createReportDialogTitle: {
    'en-us': 'Reports',
    'ru-ru': 'Отчеты',
    ca: 'Reports',
  },
  createReportDialogHeader: {
    'en-us': createHeader('Create new report'),
    'ru-ru': createHeader('Создать новый отчет'),
    ca: createHeader('Create new report'),
  },
  recordSets: {
    'en-us': 'Record Sets',
    'ru-ru': 'Наборы объектов',
    ca: 'Record Sets',
  },
  resources: {
    'en-us': 'Resources',
    'ru-ru': 'Ресурсы',
    ca: 'Resources',
  },
  appResources: {
    'en-us': 'App Resources',
    'ru-ru': 'Ресурсы приложения',
    ca: 'App Resources',
  },
  viewSets: {
    'en-us': 'View Sets',
    'ru-ru': 'Ресурсы для просмотров',
    ca: 'View Sets',
  },
  resourcesDialogTitle: {
    'en-us': 'Resources',
    'ru-ru': 'Ресурсы',
    ca: 'Resources',
  },
  resourcesDialogHeader: {
    'en-us': createHeader('Choose the resource type you wish to edit:'),
    'ru-ru': createHeader(
      'Выберите тип ресурса, который хотите отредактировать:'
    ),
    ca: createHeader('Choose the resource type you wish to edit:'),
  },
  repairTree: {
    'en-us': 'Repair Tree',
    'ru-ru': 'Ремонтировать дерево',
    ca: 'Repair Tree',
  },
  trees: {
    'en-us': 'Trees',
    'ru-ru': 'Деревья',
    ca: 'Trees',
  },
  treesDialogTitle: {
    'en-us': 'Trees',
    'ru-ru': 'Деревья',
    ca: 'Trees',
  },
  recordSet: {
    'en-us': 'Record Set',
    'ru-ru': 'Набор объектов',
    ca: 'Record Set',
  },
  recordCount: {
    'en-us': 'Record Count',
    'ru-ru': 'Количество объектов',
    ca: 'Record Count',
  },
  size: {
    'en-us': 'Size',
    'ru-ru': 'Размер',
    ca: 'Size',
  },
  manageUsers: {
    'en-us': 'Manage Users',
    'ru-ru': 'Управление пользователями',
    ca: 'Manage Users',
  },
  manageUsersDialogTitle: {
    'en-us': 'Manage Users',
    'ru-ru': 'Управление пользователями',
    ca: 'Manage Users',
  },
  query: {
    'en-us': 'Query',
    'ru-ru': 'Запрос',
    ca: 'Query',
  },
  workbench: {
    'en-us': 'WorkBench',
    'ru-ru': 'WorkBench',
    ca: 'WorkBench',
  },
  chooseDwcaDialogTitle: {
    'en-us': 'Choose DwCA',
    'ru-ru': 'Выберите DwCA',
    ca: 'Choose DwCA',
  },
  dwcaDefinition: {
    'en-us': 'DwCA definition:',
    'ru-ru': 'Определение DwCA:',
    ca: 'DwCA definition:',
  },
  metadataResource: {
    'en-us': 'Metadata resource:',
    'ru-ru': 'Ресурс метаданных:',
    ca: 'Metadata resource:',
  },
  // Error Boundary
  errorBoundaryDialogTitle: {
    'en-us': 'Unexpected Error',
    'ru-ru': 'Неожиданная ошибка',
    ca: 'Unexpected Error',
  },
  errorBoundaryDialogHeader: {
    'en-us': createJsxHeader('An unexpected error has occurred'),
    'ru-ru': createJsxHeader('Произошла неожиданная ошибка'),
    ca: createJsxHeader('An unexpected error has occurred'),
  },
  errorBoundaryDialogMessage: {
    'en-us': (
      <>
        Please reload the page and try again.
        <br />
        If this issue persists, please contact your IT support or if this is a
        Specify Cloud database, contact
        <a href="mailto:support@specifysoftware.org">
          support@specifysoftware.org
        </a>
      </>
    ),
    'ru-ru': (
      <>
        Пожалуйста, обновите страницу и попробуйте еще раз.
        <br />
        Если проблема не исчезнет, обратитесь в вашу IT службу поддержки или
        свяжитесь с нами:
        <a href="mailto:support@specifysoftware.org">
          support@specifysoftware.org
        </a>
      </>
    ),
    ca: (
      <>
        Please reload the page and try again.
        <br />
        If this issue persists, please contact your IT support or if this is a
        Specify Cloud database, contact
        <a href="mailto:support@specifysoftware.org">
          support@specifysoftware.org
        </a>
      </>
    ),
  },
  backEndErrorDialogTitle: {
    'en-us': 'Server Error',
    'ru-ru': 'Ошибка на сервере',
    ca: 'Server Error',
  },
  backEndErrorDialogHeader: {
    'en-us': createHeader(
      'An error occurred communicating with the Specify 7 server.'
    ),
    'ru-ru': createHeader('Произошла ошибка связи с сервером Specify 7.'),
    ca: createHeader(
      'An error occurred communicating with the Specify 7 server.'
    ),
  },
  backEndErrorDialogMessage: {
    'en-us': `
      Please reload the page and try again.<br>
      If the issue persists, please contact your IT support, or if this is
      a Specify Cloud database, contact
      <a href="mailto:support@specifysoftware.org">
        support@specifysoftware.org
      </a>.`,
    'ru-ru': (
      <>
        Пожалуйста, обновите страницу и попробуйте еще раз.
        <br />
        Если проблема не исчезнет, обратитесь в вашу IT службу поддержки или
        свяжитесь с нами:
        <a href="mailto:support@specifysoftware.org">
          support@specifysoftware.org
        </a>
      </>
    ),
    ca: `
      Please reload the page and try again.<br>
      If the issue persists, please contact your IT support, or if this is
      a Specify Cloud database, contact
      <a href="mailto:support@specifysoftware.org">
        support@specifysoftware.org
      </a>.`,
  },
  // Search
  expressSearch: {
    'en-us': 'Express Search',
    'ru-ru': 'Экспресс поиск',
    ca: 'Express Search',
  },
  primarySearch: {
    'en-us': 'Primary Search',
    'ru-ru': 'Первичный поиск',
    ca: 'Primary Search',
  },
  secondarySearch: {
    'en-us': 'Secondary Search',
    'ru-ru': 'Вторичный поиск',
    ca: 'Secondary Search',
  },
  running: {
    'en-us': 'Running...',
    'ru-ru': 'Выполнение...',
    ca: 'Running...',
  },
  noMatches: {
    'en-us': 'No Matches',
    'ru-ru': 'Нет совпадений',
    ca: 'No Matches',
  },
  searchQuery: {
    'en-us': 'Search Query',
    'ru-ru': 'Поиск',
    ca: 'Search Query',
  },
  unknown: {
    'en-us': 'Unknown',
    'ru-ru': 'Неизвестный',
    ca: 'Unknown',
  },
  // Unload Protection
  leavePageDialogTitle: {
    'en-us': 'Unsaved changes detected',
    'ru-ru': 'Обнаружены несохраненные изменения',
    ca: 'Unsaved changes detected',
  },
  leavePageDialogHeader: {
    'en-us': createHeader('Are you sure you want to leave this page?'),
    'ru-ru': createHeader('Вы уверены, что хотите покинуть эту страницу?'),
    ca: createHeader('Are you sure you want to leave this page?'),
  },
  leave: {
    'en-us': 'Leave',
    'ru-ru': 'Покинуть',
    ca: 'Leave',
  },
  // Notifications
  notificationsDialogTitle: {
    'en-us': 'Notifications',
    'ru-ru': 'Уведомления',
    ca: 'Notifications',
  },
  feedItemUpdated: {
    'en-us': 'Export feed item updated.',
    'ru-ru': 'Элемент фида экспорта обновлен.',
    ca: 'Export feed item updated.',
  },
  updateFeedFailed: {
    'en-us': 'Export feed update failed.',
    'ru-ru': 'Не удалось обновить экспортный канал.',
    ca: 'Export feed update failed.',
  },
  exception: {
    'en-us': 'Exception',
    'ru-ru': 'Трассировка стека',
    ca: 'Exception',
  },
  download: {
    'en-us': 'Download',
    'ru-ru': 'Скачать',
    ca: 'Download',
  },
  dwcaExportCompleted: {
    'en-us': 'DwCA export completed.',
    'ru-ru': 'Экспорт в DwCA завершен.',
    ca: 'DwCA export completed.',
  },
  dwcaExportFailed: {
    'en-us': 'DwCA export failed.',
    'ru-ru': 'Не удалось экспортировать DwCA.',
    ca: 'DwCA export failed.',
  },
  queryExportToCsvCompleted: {
    'en-us': 'Query export to CSV completed.',
    'ru-ru': 'Экспорт запроса в CSV завершен.',
    ca: 'Query export to CSV completed.',
  },
  queryExportToKmlCompleted: {
    'en-us': 'Query export to KML completed.',
    'ru-ru': 'Экспорт запроса в KML завершен.',
    ca: 'Query export to KML completed.',
  },
  dataSetOwnershipTransferred: {
    'en-us': (userName: string, dataSetName: string) => `
      ${userName} transferred the ownership of the ${dataSetName} dataset
      to you.`,
    'ru-ru': (userName: string, dataSetName: string) => `
      ${userName} передал вам право собственности на набор данных
      ${dataSetName}.`,
    ca: (userName: string, dataSetName: string) => `
      ${userName} transferred the ownership of the ${dataSetName} dataset
      to you.`,
  },
  // OtherCollectionView
  noAccessToResource: {
    'en-us': `
      You do not have access to any collection containing this resource
      through the currently logged in account`,
    'ru-ru': `
      У вас нет доступа ни к одной коллекции, содержащей этот ресурс
      через текущую учетную запись`,
    ca: `
      You do not have access to any collection containing this resource
      through the currently logged in account`,
  },
  resourceInaccessible: {
    'en-us': `
      The requested resource cannot be accessed while logged into the
      current collection.`,
    'ru-ru': `
      Запрошенный ресурс недоступен в текущей коллекция.`,
    ca: `
      The requested resource cannot be accessed while logged into the
      current collection.`,
  },
  selectCollection: {
    'en-us': 'Select one of the following collections:',
    'ru-ru': 'Выберите одну из следующих коллекций:',
    ca: 'Select one of the following collections:',
  },
  collection: {
    'en-us': 'Collection',
    'ru-ru': 'Коллекция',
    ca: 'Collection',
  },
  loginToProceed: {
    'en-us': (collectionName: string) => `
       You can login to the collection, ${collectionName}, to proceed:`,
    'ru-ru': (collectionName: string) => `
       Вы можете войти в коллекцию, ${collectionName}, чтобы продолжить:`,
    ca: (collectionName: string) => `
       You can login to the collection, ${collectionName}, to proceed:`,
  },
  // SpecifyApp
  versionMismatchDialogTitle: {
    'en-us': 'Version Mismatch',
    'ru-ru': 'Несоответствие версий',
    ca: 'Version Mismatch',
  },
  versionMismatchDialogHeader: {
    'en-us': createHeader('Specify version does not match database version'),
    'ru-ru': createHeader('Specify версия не соответствует версии базы данных'),
    ca: createHeader('Specify version does not match database version'),
  },
  versionMismatchDialogMessage: {
    'en-us': (specifySixVersion: string, databaseVersion: string) => `
      The Specify version ${specifySixVersion} does not match the database
      version ${databaseVersion}.`,
    'ru-ru': (specifySixVersion: string, databaseVersion: string) => `
      Specify версия ${specifySixVersion} не соответствует версии базы
      данных ${databaseVersion}.`,
    ca: (specifySixVersion: string, databaseVersion: string) => `
      The Specify version ${specifySixVersion} does not match the database
      version ${databaseVersion}.`,
  },
  versionMismatchSecondDialogMessage: {
    'en-us':
      'Some features of Specify 7 may therefore fail to operate correctly.',
    'ru-ru': 'Поэтому некоторые функции Specify 7 могут неработать.',
    ca: 'Some features of Specify 7 may therefore fail to operate correctly.',
  },
  resourceDeletedDialogTitle: {
    'en-us': 'Deleted',
    'ru-ru': 'Удалено',
    ca: 'Deleted',
  },
  resourceDeletedDialogHeader: {
    'en-us': createHeader('Item deleted'),
    'ru-ru': createHeader('Удалено'),
    ca: createHeader('Item deleted'),
  },
  resourceDeletedDialogMessage: {
    'en-us': 'Item was deleted successfully.',
    'ru-ru': 'Успешно удален.',
    ca: 'Item was deleted successfully.',
  },
  appTitle: {
    'en-us': (baseTitle: string) => `${baseTitle} | Specify 7`,
    'ru-ru': (baseTitle: string) => `${baseTitle} | Specify 7`,
    ca: (baseTitle: string) => `${baseTitle} | Specify 7`,
  },
  // StartApp
  sessionTimeOutDialogTitle: {
    'en-us': 'Access denied',
    'ru-ru': 'Доступе Отказано',
    ca: 'Access denied',
  },
  sessionTimeOutDialogHeader: {
    'en-us': createHeader('Insufficient Privileges'),
    'ru-ru': createHeader('Insufficient Privileges'),
    ca: createHeader('Insufficient Privileges'),
  },
  sessionTimeOutDialogMessage: {
    'en-us': `
      You lack sufficient privileges for that action, or your current
      session has been logged out.`,
    'ru-ru': `
      У вас недостаточно прав для этого действия, или текещий сеанс был
      отключен..`,
    ca: `
      You lack sufficient privileges for that action, or your current
      session has been logged out.`,
  },
  // UserTools
  logOut: {
    'en-us': 'Log out',
    'ru-ru': 'Выйти',
    ca: 'Log out',
  },
  changePassword: {
    'en-us': 'Change password',
    'ru-ru': 'Изменить пароль',
    ca: 'Change password',
  },
  userToolsDialogTitle: {
    'en-us': 'User Tools',
    'ru-ru': 'Инструменты',
    ca: 'User Tools',
  },
  language: {
    'en-us': 'Language:',
    'ru-ru': 'Язык:',
    ca: 'Language:',
  },
  changeLanguage: {
    'en-us': 'Change Language',
    'ru-ru': 'Изменить язык',
    ca: 'Change Language',
  },
});

export default commonText;
