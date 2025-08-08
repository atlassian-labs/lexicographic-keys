# Xencoding

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE) [![npm version](https://img.shields.io/npm/v/@atlassian/xencoding.svg?style=flat-square)](https://www.npmjs.com/package/@atlassian/xencoding) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

Xencoding is a lexicographical encoding library that converts mixed-type data (strings and numbers) into sortable string keys. This enables efficient range queries and prefix matching in key-value stores\databases (i.e DynamoDB), and other systems that rely on lexicographical ordering.

## Key Features

- **Lexicographical Sorting**: Encoded strings sort in the same order as their original values
- **Mixed Type Support**: Handles both strings and numbers in the same key
- **Prefix Matching**: Supports efficient prefix-based queries
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Zero Dependencies**: Lightweight pure JavaScript implementation

## Why Xencoding?

Xencoding offers several advantages over alternative encoding libraries like [charwise](https://github.com/dominictarr/charwise):

- **Human-Readable Output**: Generated keys are a lot more readable
- **Proper Integer Handling**: Treats integers as integers rather than converting them to floats, preserving precision and natural sorting
- **Built-in Prefix Support**: Every encoded identifier naturally serves as a prefix for hierarchical queries, enabling efficient range scans
- **Focused API**: Simple surface area supporting only strings and integers, reducing complexity and potential errors

## Usage

### Basic Encoding and Decoding

```typescript
import { encode, decode } from '@atlassian/xencoding';

// Encode mixed types into a sortable string
const key = encode('user', 42, 'profile');
console.log(key); // "[S]user#[P]0000000000000042#[S]profile#"

// Decode back to original values
const values = decode(key);
console.log(values); // ['user', 42, 'profile']
```

### Lexicographical Ordering

```typescript
import { encode } from '@atlassian/xencoding';

// Create keys that sort correctly
const keys = [
  encode('app', 'deployment', 10),
  encode('app', 'deployment', 2),
  encode('app', 'deployment', 1),
  encode('app', 'event', 1)
];

// Sort lexicographically
const sorted = keys.sort();
console.log(sorted);
// [
//   "[S]app#[S]deployment#[P]0000000000000001#",
//   "[S]app#[S]deployment#[P]0000000000000002#",
//   "[S]app#[S]deployment#[P]0000000000000010#",
//   "[S]app#[S]event#[P]0000000000000001#"
// ]
```

### Prefix Matching

```typescript
import { encode } from '@atlassian/xencoding';

// Create a prefix for queries
const prefix = encode('app', 'deployment');

// Generate some keys
const allKeys = [
  encode('app', 'deployment', 1, 'data'),
  encode('app', 'deployment', 2, 'config'),
  encode('app', 'event', 1, 'log'),
  encode('other', 'service', 1)
];

// Find all keys that start with the prefix
const matchingKeys = allKeys.filter(key => key.startsWith(prefix));
console.log(matchingKeys);
// [
//   "[S]app#[S]deployment#[P]0000000000000001#[S]data#",
//   "[S]app#[S]deployment#[P]0000000000000002#[S]config#"
// ]
```

### Working with Negative Numbers

```typescript
import { encode, decode } from '@atlassian/xencoding';

// Negative numbers are supported and sort correctly
const keys = [
  encode('metric', -100),
  encode('metric', -1),
  encode('metric', 0),
  encode('metric', 1),
  encode('metric', 100)
];

console.log(keys.sort());
// Negative numbers will sort before positive numbers
```

## Installation

```bash
yarn add @atlassian/xencoding
```

Or with npm:

```bash
npm install @atlassian/xencoding
```

## API Documentation

### `encode(...segments)`

Encodes multiple segments into a lexicographically sortable string.

**Parameters:**

- `...segments` - Variable number of string or number arguments

**Returns:**

- `string` - The encoded string with segments separated by '#'

**Throws:**

- `Error` - When a segment is not a string or number

### `decode(input)`

Decodes an encoded string back into its original segments.

**Parameters:**

- `input` - `string` - The encoded string to decode

**Returns:**

- `Array<string|number>` - Array of decoded segments

**Throws:**

- `Error` - When encountering an invalid segment prefix

## String Validation

String segments must match the pattern: `/^[a-zA-Z0-9\-_][a-zA-Z0-9\-_.]*$/`

- Must start with alphanumeric, hyphen, or underscore
- Can contain alphanumeric characters, hyphens, underscores, and periods
- Cannot start with a period

## Number Support

- Supports all safe integers (`Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`)
- Negative numbers sort before positive numbers
- Zero is treated as a positive number

## Tests

Run the test suite:

```bash
yarn test
```

The library includes comprehensive tests covering:

- Basic encoding/decoding functionality
- Lexicographical sorting behavior
- Prefix matching capabilities
- Error handling
- Edge cases with negative numbers and mixed types

## Contributions

Contributions to Xencoding are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

Copyright (c) 2025 Atlassian US., Inc.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.

[![With ❤️ from Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers.png)](https://www.atlassian.com)
