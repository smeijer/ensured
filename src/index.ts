const defaultMessage: string = 'Invariant failed' as const;
type ErrorParam = Error | string | (() => Error | string);

function toError(input: ErrorParam | undefined): Error {
	if (input === undefined) return new Error(defaultMessage);
	const v = typeof input === 'function' ? input() : input;
	return typeof v === 'string' ? new Error(v) : v;
}

export function assert(condition: unknown, error?: ErrorParam): asserts condition {
	if (condition) return;
	throw toError(error);
}

export function expect<Value>(value: Value | null | undefined, error?: ErrorParam): Value {
	assert(value != null, error);
	return value as NonNullable<Value>;
}

export function unreachable(error?: ErrorParam): never;
export function unreachable(x: never, error?: ErrorParam): never;
export function unreachable(a?: unknown, b?: ErrorParam): never {
	if (arguments.length === 1) {
		throw toError(a as ErrorParam);
	}
	throw toError(b ?? `Unreachable reached: ${String(a)}`);
}
