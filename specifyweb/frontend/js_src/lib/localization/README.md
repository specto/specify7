# Front-end Localization

## Guidelines for Programmers

- All keys must use strict camel case, unless absolutely necessary to do
  otherwise (e.x, in case of `S2N` or other proper nouns that contain numbers or
  capitalized letters)

- Prefer full terms rather than acronyms or shortened variants. Some people may
  be unfamiliar with the acronyms used.

  Also, a single term may have multiple shortened variants, leading to
  inconsistencies and bugs. Notable exception is the `wb` (Workbench), as it is
  used extensively and does not have conflicting meanings. `ds` (Data Set) would
  not be a great choice as it is not used as widely, and can be confused for
  other terms (Disk Space, Demo Software, Describe Specify, Do Something, etc)

- Similarly, try to be as consistent as possible in key naming. For example, in
  case of the dialog that appears when upload plan is not defined, use
  `noUploadPlanDialogTitle`, `noUploadPlanDialogHeading`,
  `noUploadPlanDialogMessage` for specifying the title, heading and the message
  of the dialog respectively.

- Each dictionary must be named in camel case and end with "Text" for
  consistency and easy grepping

- Do not use dynamic references.

  Incorrect example:

  ```js
  wbText(hasError ? 'errorOccurred' : 'successMessage');
  ```

  Correct example:

  ```js
  hasError ? wbText('errorOccurred') : wbText('successMessage');
  ```

  Similarly, don't construct key names dynamically. This is needed to simplify
  finding references of a particular key in code. Also, it allows to easily find
  unused values and remove them from the dictionary.

- Each entry may be a string, a JSX Element, or a function that takes arbitrary
  arguments and returns a string or a JSX Element. It is important to note that
  in the case of functions, it must be pure (e.x produce the same output given
  the same input). It should also not relay on any external variables as those
  should be specified as an argument instead.

  Incorrect example:

  ```js
  DataSetName: () => `New Data Set ${new Date().toDateString()}`;
  ```

  Correct example:

  ```js
  newDataSetName: (date: string) => `New Data Set ${date}`;
  ```

- When writing multi-line strings, keep in mind that some values are going to be
  used in whitespace sensitive contexts. Most common example is the "title"
  attribute of a button. Another example is the cell comment text in the
  Workbench. In such cases, use array join instead of the grave accent mark.

  Incorrect example:

  ```js
  someWhitespaceSensitiveValue: `
    Lorem Ipsum is simply dummy text of the printing and typesetting
    industry. Lorem Ipsum has been the industry's standard dummy text
    ever since the 1500s
  `;
  ```

  Correct example:

  ```js
  someWhitespaceSensitiveValue: [
    'Lorem Ipsum is simply dummy text of the printing and typesetting ',
    "industry. Lorem Ipsum has been the industry's standard dummy text ",
    'ever since the 1500s',
  ].join('');
  ```

## Localization Utils

### Copy strings from existing language into new language

1. Paste whole dictionary file content into an HTML <textbox>
2. Assign the `textbox` variable to the HTML Textbox element
3. Run this code in the DevTools console:

   ```js
   textarea.value = textarea.value.replaceAll(
     /:\s+{\s+'en-us':(([\s\S]*?),\n)(?:\n|}|  (?!( |]))) /g,
     ": {\n    'en-us':$1    'ru-ru':$1  "
   );
   ```

   (Replace `en-us` with source and `ru-ru` with target)

### Get text from a dictionary as array

1. Paste whole dictionary file content into an HTML <textbox>
2. Assign the `textbox` variable to the HTML Textbox element
3. Run this code in the DevTools console:

   ```js
   matches = Array.from(
     textarea.value.matchAll(
       /(?:\s{6}|[:>]\s*|\(|return\s)(?:'([^']+)'|`\s*([^`]+)\s*`|\(([^)]+)\)[,;]|\[\s+([^\]]+)\s+\])/g
     )
   ).map((match, index) => Array.from(match).slice(1).find(Boolean).trim());
   ```
