module.exports = {
  "extends": [
    "eslint:recommended",
  ],
  "env": {
    "browser": true,
    "node": true,
    "es6": false,
    "jasmine": true
  },
  "rules": {
    "indent": [2, 2],
    "quotes": [2, "single"],
    "linebreak-style": [2, "unix"],
    "semi": [2, "always"],

    // general style rules
    //
    // enforce spacing inside array brackets
    'array-bracket-spacing': [2, 'never'],
    // enforce one true brace style
    'brace-style': [2, '1tbs', {'allowSingleLine': true }],
    // require camel case names
    'camelcase': [1, {'properties': 'always'}],
    // enforce spacing before and after comma
    'comma-spacing': [2, {'before': false, 'after': true}],
    // enforce one true comma style
    'comma-style': [2, 'last'],
    // disallow padding inside computed properties
    'computed-property-spacing': [2, 'never'],
    // enforces consistent naming when capturing the current execution context
    'consistent-this': 0,
    // enforce newline at the end of file, with no multiple empty lines
    'eol-last': 2,
    // require function expressions to have a name
    'func-names': 0,
    // enforces use of function declarations or expressions
    'func-style': 0,
    // this option enforces minimum and maximum identifier lengths (variable names, property names etc.)
    'id-length': 0,
    // enforces spacing between keys and values in object literal properties
    'key-spacing': [2, {'beforeColon': false, 'afterColon': true}],
    // enforces empty lines around comments
    'lines-around-comment': 0,
    // specify the maximum depth callbacks can be nested
    'max-nested-callbacks': [1, 5],
    // require a capital letter for constructors
    'new-cap': [0],
    // disallow the omission of parentheses when invoking a constructor with no arguments
    'new-parens': 0,
    // allow/disallow an empty newline after var statement
    'newline-after-var': 0,
    // disallow use of the Array constructor
    'no-array-constructor': 0,
    // disallow use of the continue statement
    'no-continue': 0,
    // disallow comments inline after code
    'no-inline-comments': 0,
    // disallow if as the only statement in an else block
    'no-lonely-if': 0,
    // disallow mixed spaces and tabs for indentation
    'no-mixed-spaces-and-tabs': 2,
    // disallow multiple empty lines and only one newline at the end
    'no-multiple-empty-lines': [2, {'max': 2, 'maxEOF': 1}],
    // disallow nested ternary expressions
    'no-nested-ternary': 2,
    // disallow use of the Object constructor
    'no-new-object': 2,
    // disallow space between function identifier and application
    'no-spaced-func': 2,
    // disallow the use of ternary operators
    'no-ternary': 0,
    // disallow trailing whitespace at the end of lines
    'no-trailing-spaces': 0,
    // disallow dangling underscores in identifiers
    'no-underscore-dangle': 2,
    // disallow the use of Boolean literals in conditional expressions
    'no-unneeded-ternary': 2,
    // require padding inside curly braces
    'object-curly-spacing': [2, 'always'],
    // allow just one var statement per function
    'one-var': [2, 'never'],
    // require assignment operator shorthand where possible or prohibit it entirely
    'operator-assignment': 0,
    // enforce operators to be placed before or after line breaks
    'operator-linebreak': 0,
    // enforce padding within blocks
    'padded-blocks': [2, 'never'],
    // require quotes around object literal property names
    'quote-props': 0,
    // require identifiers to match the provided regular expression
    'id-match': 0,
    // enforce spacing before and after semicolons
    'semi-spacing': [2, {'before': false, 'after': true}],
    // require or disallow use of semicolons instead of ASI
    'sort-vars': 0,
    // require a space before certain keywords
    'space-before-keywords': [2, 'always'],
    // require a space after certain keywords
    'space-after-keywords': [2, 'always'],
    // require or disallow space before blocks
    'space-before-blocks': 2,
    // require or disallow space before function opening parenthesis
    // https://github.com/eslint/eslint/blob/master/docs/rules/space-before-function-paren.md
    'space-before-function-paren': [2, { 'anonymous': 'always', 'named': 'never' }],
    // require or disallow spaces inside parentheses
    'space-in-parens': [2, 'never'],
    // require spaces around operators
    'space-infix-ops': 2,
    // require a space after return, throw, and case
    'space-return-throw-case': 2,
    // Require or disallow spaces before/after unary operators
    'space-unary-ops': 0,
    // require or disallow a space immediately following the // or /* in a comment
    'spaced-comment': 0,
    // require regex literals to be wrapped in parentheses
    'wrap-regex': 0,
    // Disallow console.* statements
    'no-console': 1,

    // es6 rules
    //
    // require parens in arrow function arguments
    'arrow-parens': 0,
    // require space before/after arrow function's arrow
    // https://github.com/eslint/eslint/blob/master/docs/rules/arrow-spacing.md
    'arrow-spacing': [2, { 'before': true, 'after': true }],
    // verify super() callings in constructors
    'constructor-super': 0,
    // enforce the spacing around the * in generator functions
    'generator-star-spacing': 0,
    // disallow modifying variables of class declarations
    'no-class-assign': 0,
    // disallow modifying variables that are declared using const
    'no-const-assign': 2,
    // disallow to use this/super before super() calling in constructors.
    'no-this-before-super': 0,
    // require let or const instead of var
    'no-var': 2,
    // require method and property shorthand syntax for object literals
    'object-shorthand': 2,
    // suggest using of const declaration for variables that are never modified after declared
    'prefer-const': 2,
    // suggest using the spread operator instead of .apply()
    'prefer-spread': 2,
    // suggest using Reflect methods where applicable
    'prefer-reflect': 0,
    // disallow generator functions that do not have yield
    'require-yield': 0,


  },
  "plugins": [
    
  ],
  "ecmaFeatures": {
    'arrowFunctions': true,
    'blockBindings': true,
    'classes': false,
    'defaultParams': true,
    'destructuring': true,
    'forOf': true,
    'generators': false,
    'modules': true,
    'objectLiteralComputedProperties': true,
    'objectLiteralDuplicateProperties': false,
    'objectLiteralShorthandMethods': true,
    'objectLiteralShorthandProperties': true,
    'restParams': true,
    'spread': true,
    'superInFunctions': true,
    'templateStrings': true,
    'jsx': true
  },
  "globals": {

  }
};
