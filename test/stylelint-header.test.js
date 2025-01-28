/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

import { getTestRule, getTestRuleConfigs } from "jest-preset-stylelint";

import myPlugin from "../index.js";

const plugins = [myPlugin];

global.testRule = getTestRule({ plugins });
global.testRuleConfigs = getTestRuleConfigs({ plugins });

const {
	ruleName,
	rule: { messages },
} = myPlugin;

/** @description Test case with input file URL */
testRule({
	plugins,
	ruleName,
	config: [
		join("test", "input.txt"),
		{
			nonMatchingTolerance: 1,
			templateVariables: {
				company: "Adobe",
			},
		},
	],
	fix: true,

	accept: [
		{
			code: readFileSync(join("test", "pass.css"), { encoding: "utf-8" }),
			description: "Simple CSS with header included",
		},
	],

	reject: [
		{
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
			fixed: readFileSync(join("test", "fixed.css"), { encoding: "utf-8" }),
			description: "Auto-fix file missing header",
			message: messages.rejected,
		},
	],
});

/** @description Test case with input template string */
testRule({
	plugins,
	ruleName,
	config: [
		"Copyright <%= YEAR %> <%= company %>.",
		{
			nonMatchingTolerance: 1,
			templateVariables: {
				company: "Adobe",
			},
		},
	],

	accept: [
		{
			code: readFileSync(join("test", "pass.css"), { encoding: "utf-8" }),
			description: "Simple CSS with header included",
		},
	],

	reject: [
		{
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
			description: "Error if missing header",
			message: messages.rejected,
		},
	],
});

/** @description Test case with multi-line header in input file */
testRule({
	plugins,
	ruleName,
	config: [join(__dirname, "../COPYRIGHT")],

	accept: [
		{
			code: readFileSync(join("test", "multi-line.css"), { encoding: "utf-8" }),
			description: "Simple CSS with multi-line header",
		},
	],

	reject: [
		{
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
			description: "Error if missing header",
			message: messages.rejected,
		},
	],
});

/** @description Test case with disabled rule (should not run) */
testRule({
	plugins,
	ruleName,
	config: null,
	accept: [
		{
			description: "Rule disabled",
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
		},
	],
});

/** @description Test case with invalid input */
testRule({
	plugins,
	ruleName,
	config: true,
	reject: [
		{
			description: "Invalid inputs",
			message: 'Invalid option value "true" for rule "header/header"',
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
		},
	],
});

/** @description Test case with invalid input for nonMatchingTolerance */
testRule({
	plugins,
	ruleName,
	config: ["Copyright <%= YEAR %> Adobe.", { nonMatchingTolerance: 10 }],
	reject: [
		{
			description: "Invalid input for nonMatchingTolerance",
			message:
				'Invalid value "10" for option "nonMatchingTolerance" of rule "header/header"',
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
		},
	],
});

/** @description Test case to validate removable tests */
testRule({
	plugins,
	ruleName,
	config: [
		join("test", "input.txt"),
		{
			nonMatchingTolerance: 1,
			templateVariables: {
				company: "Adobe",
			},
			isRemovable: true,
		},
	],
	fix: true,

	accept: [
		{
			code: readFileSync(join("test", "pass-removable.css"), { encoding: "utf-8" }),
			description: "Simple CSS with header included in a removable comment",
		},
	],

	reject: [
		{
			code: readFileSync(join("test", "fail.css"), { encoding: "utf-8" }),
			fixed: readFileSync(join("test", "fixed-removable.css"), { encoding: "utf-8" }),
			description: "Auto-fix file missing header with removable comment",
			message: messages.rejected,
		},
	],
});
