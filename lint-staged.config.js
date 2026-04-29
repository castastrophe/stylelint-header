export default {
	"*.js": [
		"eslint --fix --cache --no-error-on-unmatched-pattern --quiet",
		"prettier --write",
	],
	"package.json": ["prettier-package-json --write"],
	"*.{md,mdx,json,yml,yaml}": [
		"prettier --no-error-on-unmatched-pattern --ignore-unknown --log-level silent --write --config .prettierrc",
	],
};
