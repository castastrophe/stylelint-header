/*!
 * Copyright 2024. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at <http://www.apache.org/licenses/LICENSE-2.0>
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const { existsSync, readFileSync } = require("fs");
const { join } = require("path");

const { createPlugin, utils } = require("stylelint");

const { compareTwoStrings } = require("string-similarity");
const { template } = require("lodash");

const ruleName = "header/header";

const messages = utils.ruleMessages(ruleName, {
	rejected: "Header not found",
});

const plugin = createPlugin(
	ruleName,
	(pathOrString, options = {}, context = {}) =>
		(root, result) => {
			const validOptions = utils.validateOptions(
				result,
				ruleName,
				{
					actual: pathOrString,
					possible: [
						null,
						(x) => typeof x === "string",
						(x) => typeof x === "string" && existsSync(x),
						(x) => typeof x === "string" && existsSync(join(process.cwd(), x)),
					],
				},
				{
					optional: true,
					actual: options,
					possible: {
						nonMatchingTolerance: [
							(val) => typeof val === "number" && val >= 0 && val <= 1,
						],
						templateVariables: [Object, null],
					},
				}
			);

			if (!validOptions) return;

			let headerTemplate = existsSync(pathOrString)
				? readFileSync(pathOrString, "utf8")
				: existsSync(join(process.cwd(), pathOrString))
				? readFileSync(join(process.cwd(), pathOrString), "utf8")
				: pathOrString;

			if (!headerTemplate) return;

			// Trim any comment tags from the string and remove whitespace
			headerTemplate = headerTemplate
				.replace(/(\/\*|\*\/|(\s*\*))/g, "")
				.trim();

			const getHeader = template(headerTemplate);
			const header = getHeader({
				YEAR: new Date().getFullYear(),
				FILE_NAME: context.file?.basename,
				FILE_PATH: context.file?.dirname,
				...(options.templateVariables ?? {}),
			});

			const nonMatchingTolerance = options?.nonMatchingTolerance || 0.98;

			// Walk comments on root to find if header exists
			let found = false;
			root.walkComments((comment, _idx) => {
				// Remove any asterisks and whitespace from the texts before comparing
				const clean = (text) =>
					text
						.replace(/(\*|\n|\s)/g, "")
						.replace(/^!/g, "")
						.trim();

				// If the two strings are at least 98% alike, it's a match
				if (
					compareTwoStrings(clean(comment.text), clean(header)) >=
					nonMatchingTolerance
				) {
					found = true;
				}

				// This escapes the loop if found, continues if not found
				return !found;
			});

			if (found) return;

			if (context.fix) {
				// Add the provided header to the top of the file
				root.prepend({
					text: header
						.split("\n")
						.map((line) => ` * ${line}`)
						.join("\n"),
					raws: {
						left: "!\n",
						right: "\n ",
					},
				});
				// Put a few newlines between the comment and the first property
				root.nodes[1].raws.before = context.newline + context.newline;
			} else {
				// Just report the issue
				utils.report({
					ruleName: ruleName,
					result: result,
					message: messages.rejected,
					node: root,
				});
			}
		}
);

plugin.ruleName = ruleName;
plugin.messages = messages;

module.exports = plugin;
