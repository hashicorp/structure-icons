/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

module.exports  = {
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    browser: false,
    node: true,
  },
  "extends": ["plugin:prettier/recommended"],
}
