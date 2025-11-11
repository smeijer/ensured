# ensured

Tiny runtime assertions that never drop your error messages.

## Why

[`tiny-invariant`](https://github.com/alexreardon/tiny-invariant) removes all error messages in production builds to save a few bytes. That might be okay for internal functions, but it's terrible for applications. You lose context when something goes wrong.

**ensured** keeps the bundle small, preserves your messages in all environments, and provides a consistent set of helpers for runtime guarantees.

## Install

```bash
npm install ensured
`````

## Usage

```ts
import { assert, expect, unreachable } from 'ensured';

// assert — checks truthiness
assert(count > 0, 'count must be positive');

// expect — checks non-nullishness
const user = expect(currentUser, 'no current user');

// unreachable — for exhaustive switches
switch (status) {
	case 'idle':
	case 'loading':
	case 'done':
		break;
	default:
		unreachable(status);
}
````

All functions throw `Error` instances and preserve your message.
If you pass an existing `Error`, it will be rethrown unchanged.

## API

### `assert(condition: unknown, error?: ErrorParam): asserts condition`

Throws if `condition` is falsy.

```ts
assert(result.ok, new Error('request failed'));
````

### `expect<Value>(value: Value | null | undefined, error?: ErrorParam): NonNullable<Value>`

Throws if `value` is `null` or `undefined`, otherwise returns it.

```ts
const user = expect(findUser(id), 'user not found');
````

### `unreachable(x?: never | ErrorParam, error?: ErrorParam): never`

Marks code that should never be reached.
Supports both `unreachable()` and `unreachable(value)` forms.

```ts
unreachable(); // unconditional
unreachable(kind); // with value
````

### `ErrorParam`

A flexible input type for all helpers:

```ts
type ErrorParam = Error | string | (() => Error | string);
````

This allows lazy construction for expensive messages:

```ts
assert(isValid, () => new Error(`Invalid item: ${JSON.stringify(item)}`));
````

## Why not strip messages?

Because your production logs matter more than a few kilobytes of bundle size.
`ensured` keeps errors readable and actionable everywhere. No hidden conditions, no dead-code tricks, no silent failures.
