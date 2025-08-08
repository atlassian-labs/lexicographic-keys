import type { NumberSegment } from '../number';
import { decodeNumberSegment, encodeNumberSegment } from '../number';

describe('encodeNumber', () => {
  it(`should throw an error if decoded value starts with invalid prefix`, () => {
    const stringSegment = '[S]test';
    expect(() =>
      decodeNumberSegment(stringSegment as NumberSegment),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid segment prefix "[S]" for number - expected either "[P]" or "[N]""`,
    );
  });

  it(`should throw error if not a float`, () => {
    expect(() => encodeNumberSegment(1.1)).toMatchError(
      new Error('Can only encode safe integer values'),
    );
  });

  it(`should throw error if NaN`, () => {
    expect(() => encodeNumberSegment(Number.NaN)).toMatchError(
      new Error('Can only encode safe integer values'),
    );
  });

  it(`should throw error if infinity`, () => {
    expect(() => encodeNumberSegment(Number.POSITIVE_INFINITY)).toMatchError(
      new Error('Can only encode safe integer values'),
    );
  });

  it(`should throw error if negative infinity`, () => {
    expect(() => encodeNumberSegment(Number.NEGATIVE_INFINITY)).toMatchError(
      new Error('Can only encode safe integer values'),
    );
  });

  it(`should throw error if not a safe integer`, () => {
    expect(() => encodeNumberSegment(Number.MAX_VALUE)).toMatchError(
      new Error('Can only encode safe integer values'),
    );
  });

  it(`should encode and decode max safe integer correctly`, () => {
    expect(
      decodeNumberSegment(encodeNumberSegment(Number.MAX_SAFE_INTEGER)),
    ).toEqual(Number.MAX_SAFE_INTEGER);
  });

  it(`should encode and decode 1 correctly`, () => {
    expect(decodeNumberSegment(encodeNumberSegment(1))).toEqual(1);
    expect(encodeNumberSegment(1)).toMatchInlineSnapshot(
      `"[P]0000000000000001"`,
    );
  });

  it(`should encode and decode 0 correctly`, () => {
    expect(decodeNumberSegment(encodeNumberSegment(0))).toEqual(0);
    expect(encodeNumberSegment(0)).toMatchInlineSnapshot(
      `"[P]0000000000000000"`,
    );
  });

  it(`should encode and decode 1234 correctly`, () => {
    expect(decodeNumberSegment(encodeNumberSegment(1234))).toEqual(1234);
    expect(encodeNumberSegment(1234)).toMatchInlineSnapshot(
      `"[P]0000000000001234"`,
    );
  });

  it(`should encode and decode -1 correctly`, () => {
    expect(decodeNumberSegment(encodeNumberSegment(-1))).toEqual(-1);
    expect(encodeNumberSegment(-1)).toMatchInlineSnapshot(
      `"[N]9007199254740990"`,
    );
  });

  it(`should encode and decode -0 correctly`, () => {
    expect(decodeNumberSegment(encodeNumberSegment(-0))).toBe(0);
    expect(encodeNumberSegment(-0)).toMatchInlineSnapshot(
      `"[P]0000000000000000"`,
    );
  });

  it(`should encode and decode -1234 correctly`, () => {
    expect(decodeNumberSegment(encodeNumberSegment(-1234))).toEqual(-1234);
    expect(encodeNumberSegment(-1234)).toMatchInlineSnapshot(
      `"[N]9007199254739757"`,
    );
  });

  it('positive segments should be sortable', () => {
    const value1 = encodeNumberSegment(11);
    const value2 = encodeNumberSegment(101);

    expect(value1 < value2).toBe(true);
  });

  it('positive segments should be sorted after zero', () => {
    const value1 = encodeNumberSegment(0);
    const value2 = encodeNumberSegment(1);

    expect(value1 < value2).toBe(true);
  });

  it('+safe integer should be sortable', () => {
    const value1 = encodeNumberSegment(1);
    const value2 = encodeNumberSegment(Number.MAX_SAFE_INTEGER);

    expect(value1 < value2).toBe(true);
  });

  it('negative segments should be sorted before zero', () => {
    const value1 = encodeNumberSegment(0);
    const value2 = encodeNumberSegment(-1);

    expect(value1 > value2).toBe(true);
  });

  it('negative segments should be sortable', () => {
    const value1 = encodeNumberSegment(-11);
    const value2 = encodeNumberSegment(-101);

    expect(value1 > value2).toBe(true);
  });

  it('-safe integer should be sortable', () => {
    const value1 = encodeNumberSegment(-1);
    const value2 = encodeNumberSegment(Number.MIN_SAFE_INTEGER);

    expect(value1 > value2).toBe(true);
  });

  it('negative and positive segments should be sortable', () => {
    const value1 = encodeNumberSegment(10);
    const value2 = encodeNumberSegment(-10);

    expect(value1 > value2).toBe(true);
  });
});
