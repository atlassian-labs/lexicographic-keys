import { encode } from '..';

describe('encode', () => {
  it('should throw an error if value is not a string or an integer', () => {
    expect(() => encode(true as any)).toThrowErrorMatchingInlineSnapshot(
      `"encode only supports string or number segments instead got "typeof segments[0] === boolean""`,
    );
  });

  it('should encode an identifier composed of strings', () => {
    expect(encode('test')).toMatchInlineSnapshot(`"[S]test#"`);
  });

  it('should encode an identifier composed of positive numbers', () => {
    expect(encode(1)).toMatchInlineSnapshot(`"[P]0000000000000001#"`);
  });

  it('should encode an identifier composed of negative numbers', () => {
    expect(encode(-1)).toMatchInlineSnapshot(`"[N]9007199254740990#"`);
  });

  it('should encode an identifier composed of strings and numbers', () => {
    expect(encode('test', 1, -1, 'blah')).toMatchInlineSnapshot(
      `"[S]test#[P]0000000000000001#[N]9007199254740990#[S]blah#"`,
    );
  });

  it('should sort strings after negative numbers', () => {
    const value1 = encode(-1);
    const value2 = encode('a');

    expect(value2 > value1).toBe(true);
  });

  it('should sort strings after positive numbers', () => {
    const value1 = encode(1);
    const value2 = encode('a');

    expect(value2 > value1).toBe(true);
  });

  it('should sort negative numbers before positive numbers', () => {
    const value1 = encode(-1);
    const value2 = encode(1);

    expect(value2 > value1).toBe(true);
  });

  it('should sort identifiers consisting of multiple mixed segments', () => {
    const deployment1 = encode(
      'app',
      'uuid',
      'deployments',
      1,
      'events',
      10000000,
    );
    const deployment2 = encode(
      'app',
      'uuid',
      'deployments',
      2,
      'events',
      10000000,
    );

    expect(deployment1 < deployment2).toBe(true);
    expect(deployment1).toMatchInlineSnapshot(
      `"[S]app#[S]uuid#[S]deployments#[P]0000000000000001#[S]events#[P]0000000010000000#"`,
    );
    expect(deployment2).toMatchInlineSnapshot(
      `"[S]app#[S]uuid#[S]deployments#[P]0000000000000002#[S]events#[P]0000000010000000#"`,
    );
  });

  it('should create identifiers that sort with other different identifiers - 1', () => {
    const keys = [
      encode('app', 'uuid', 'deployments', 1),
      encode('app', 'uuid', 'deployments', 1, 'events', 10000000),
      encode('app', 'uuid', 'deployments', 1, 'events', 10000001),
      encode('app', 'uuid', 'deployments', 2),
      encode('app', 'uuid', 'deployments', 2, 'events', 10000000),
      encode('app', 'uuid', 'deployments', 2, 'events', 10000001),
    ];

    const sortedKeys = [...keys].sort();

    expect(keys).toEqual(sortedKeys);
  });

  it('should create identifiers that sort with other different identifiers - 2', () => {
    const keys = [
      encode('app', 'id', 'deployments', 1, 'events', 10000000),
      encode('app', 'id', 'deployments', 1, 'events', 10000001),
      encode('app', 'uuid', 'deployments', 1),
      encode('app', 'uuid', 'deployments', 2),
      encode('app', 'uuid', 'deployments', 2, 'lock', 10000000),
      encode('app', 'uuid', 'deployments', 2, 'lock', 10000001),
    ];

    const sortedKeys = [...keys].sort();

    expect(keys).toEqual(sortedKeys);
  });

  it('should create identifiers with uuids that sort with other different identifiers', () => {
    const appOneId = '68454610-5cfd-40da-8689-d6719217cde8';
    const appTwoId = 'a36c15f3-6bf9-49ee-81d8-390aaf98d69e';

    const keys = [
      encode('app', appOneId, 'deployments', 1),
      encode('app', appOneId, 'deployments', 1, 'events', 10000000),
      encode('app', appOneId, 'deployments', 1, 'events', 10000001),
      encode('app', appOneId, 'deployments', 1, 'lock'),
      encode('app', appTwoId, 'deployments', 1),
      encode('app', appTwoId, 'deployments', 1, 'events', 10000000),
      encode('app', appTwoId, 'deployments', 1, 'events', 10000001),
      encode('app', appTwoId, 'deployments', 1, 'lock'),
    ];

    const sortedKeys = [...keys].sort();

    expect(keys).toEqual(sortedKeys);
  });

  it('should create sortable identifiers with negative numbers', () => {
    const keys = [
      encode('app', 'uuid', 'deployments', -2),
      encode('app', 'uuid', 'deployments', -2, 'events', -10020001),
      encode('app', 'uuid', 'deployments', -2, 'events', -10000000),
      encode('app', 'uuid', 'deployments', -1),
      encode('app', 'uuid', 'deployments', -1, 'events', -10030001),
      encode('app', 'uuid', 'deployments', -1, 'events', -10000000),
    ];

    const sortedKeys = [...keys].sort();

    expect(keys).toEqual(sortedKeys);
  });
});

describe('encodePrefix', () => {
  it('should create a matching prefix for identifier with numbers', () => {
    const prefix = encode('test');
    const identifier = encode('test', 1);

    expect(identifier.startsWith(prefix)).toBe(true);
    expect(identifier).toMatchInlineSnapshot(`"[S]test#[P]0000000000000001#"`);
    expect(prefix).toMatchInlineSnapshot(`"[S]test#"`);
  });

  it('should create a matching prefix for identifier with strings', () => {
    const prefix = encode('test');
    const identifier = encode('test', 'test');

    expect(identifier.startsWith(prefix)).toBe(true);
    expect(identifier).toMatchInlineSnapshot(`"[S]test#[S]test#"`);
    expect(prefix).toMatchInlineSnapshot(`"[S]test#"`);
  });

  it('should create a matching prefix for identifier with multiple segments', () => {
    const prefix = encode('app', 'uuid', 'deployments', 1, 'events');
    const identifier = encode(
      'app',
      'uuid',
      'deployments',
      1,
      'events',
      10000000,
    );

    expect(identifier.startsWith(prefix)).toBe(true);
    expect(identifier).toMatchInlineSnapshot(
      `"[S]app#[S]uuid#[S]deployments#[P]0000000000000001#[S]events#[P]0000000010000000#"`,
    );
    expect(prefix).toMatchInlineSnapshot(
      `"[S]app#[S]uuid#[S]deployments#[P]0000000000000001#[S]events#"`,
    );
  });

  it('should not match identifiers with different prefix', () => {
    const prefix = encode('app', 'uuid', 'deployments', 1, 'events');
    const identifier = encode(
      'app',
      'uuid',
      'deployments',
      2,
      'events',
      10000000,
    );

    expect(identifier.startsWith(prefix)).toBe(false);
    expect(identifier).toMatchInlineSnapshot(
      `"[S]app#[S]uuid#[S]deployments#[P]0000000000000002#[S]events#[P]0000000010000000#"`,
    );
    expect(prefix).toMatchInlineSnapshot(
      `"[S]app#[S]uuid#[S]deployments#[P]0000000000000001#[S]events#"`,
    );
  });

  it('should select all keys which start with a prefix', () => {
    const keys = [
      encode('app', 'uuid', 'deployments', -2),
      encode('app', 'uuid', 'deployments', -2, 'events', -10020001),
      encode('app', 'uuid', 'deployments', -2, 'events', -10000000),
      encode('app', 'uuid', 'deployments', -1),
      encode('app', 'uuid', 'deployments', -1, 'events', -10030001),
      encode('app', 'uuid', 'deployments', -1, 'events', -10000000),
    ];

    const getBeginningWith = (prefix: string) =>
      keys.filter((key) => key.startsWith(prefix));

    expect(getBeginningWith(encode('app', 'uuid', 'deployments', -2, 'events')))
      .toMatchInlineSnapshot(`
        [
          "[S]app#[S]uuid#[S]deployments#[N]9007199254740989#[S]events#[N]9007199244720990#",
          "[S]app#[S]uuid#[S]deployments#[N]9007199254740989#[S]events#[N]9007199244740991#",
        ]
    `);
  });

  it('should select all keys under a specific key', () => {
    const keys = [
      encode('app', 'uuid', 'deployments', -2),
      encode('app', 'uuid', 'deployments', -2, 'events', -10020001),
      encode('app', 'uuid', 'deployments', -2, 'events', -10000000),
      encode('app', 'uuid', 'deployments', -1),
      encode('app', 'uuid', 'deployments', -1, 'events', -10030001),
      encode('app', 'uuid', 'deployments', -1, 'events', -10000000),
    ];

    const getBeginningWith = (prefix: string) =>
      keys.filter((key) => key.startsWith(prefix));

    expect(getBeginningWith(encode('app', 'uuid', 'deployments', -2)))
      .toMatchInlineSnapshot(`
        [
          "[S]app#[S]uuid#[S]deployments#[N]9007199254740989#",
          "[S]app#[S]uuid#[S]deployments#[N]9007199254740989#[S]events#[N]9007199244720990#",
          "[S]app#[S]uuid#[S]deployments#[N]9007199254740989#[S]events#[N]9007199244740991#",
        ]
    `);
  });
});
