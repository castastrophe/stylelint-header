# stylelint-header

A [stylelint](https://github.com/stylelint/stylelint) custom rule to check for a header comment (i.e., copyright notice).

This rule will cause stylelint to throw an error if no header exists in the file or if autofix is enabled, it will prepend the header to the document.

## Installation

```sh
yarn add -D stylelint-header
```

```sh
npm install --dev stylelint-header
```

Example of adding the plugin to your stylelint config:

```json
{
  "plugins": ["stylelint-header"],
  "rules": {
    "header/header": ["./COPYRIGHT"],
  },
}
```

### Options

#### templateVariables

Type `object`; Default `{}`

This is an object of key/value pairs that will be used to replace variables in the header template. For example, if you have a header template that looks like this:

```js
(c) <%= YEAR %> <%= company %>
```

You can pass in an object like this:

```js
{
  templateVariables: {
    company: "Adobe",
  },
}
```

And the resulting header will look like this:

```css
/*!
 * (c) 2025 Adobe
 */
```

Notice that the `YEAR` variable was replaced with the current year but not provided in the templateVariables object. This variable is automatically supported by the plugin.

The following variables are supported by default:

- `YEAR`: The current year
- `FILE_NAME`: The name of the file being linted
- `FILE_PATH`: The path to the file being linted

This plugin is using [lodash.template](https://lodash.com/docs/4.17.15#template) to replace variables in the header template. Please refer to the lodash documentation for more information on how to use this feature.

#### nonMatchingTolerance

Type `numeric`; Default `0.98`

This is a number between 0 and 1 representing the percentage of allowed difference between a found comment in the file and the provided header. Uses [`string-similarity`](https://www.npmjs.com/package/string-similarity) to determine value.

#### isRemovable

Type `boolean`; Default `false`

This setting determines whether the comment starts with `/*!`, a special syntax that is often retained even when other comments are stripped by minifiers such as cssnano. If set to `true`, copyright comments will be added with `/*` only; by default all comments use `/*!`.

## Usage

Add it to your stylelint config `plugins` array, then add `header/header` to your rules, specifying a string or file location for the header template. To toggle the rule off, set the rule to `null`.

To leverage the plugin with a hardcoded template string and a custom tolerance:

```js
{
  "plugins": ["stylelint-header"],
  "rules": {
    "header/header": [
      "Copyright <%= YEAR %>. <%= company %>",
      {
        templateVariables: {
          company: "Adobe",
        },
        nonMatchingTolerance: 0.8
      }
    ],
  },
};
```

To leverage the plugin with a path to a file containing the header template:

```js
{
  "plugins": ["stylelint-header"],
  "rules": {
    "header/header": ["./COPYRIGHT"],
  },
};
```

## Contributing

Contributions are welcome! Please open an [issue](https://github.com/castastrophe/postcss-custom-properties-mapping/issues/new) or submit a pull request.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details. This means you can use this however you like as long as you provide attribution back to this one. It's nice to share but it's also nice to get credit for your work. 😉

## Funding ☕️

If you find this plugin useful and would like to buy me a coffee/beer as a small thank you, I would greatly appreciate it! Funding links are available in the GitHub UI for this repo.

<a href="https://www.buymeacoffee.com/castastrophe" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

