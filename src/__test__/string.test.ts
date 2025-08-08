import { decodeStringSegment, encodeStringSegment } from '../string';

describe('encodeStringSegment', () => {
  it(`should throw error if segment contains invalid character`, () => {
    expect(() => encodeStringSegment('#')).toMatchError(
      new Error('Segment contains invalid characters'),
    );
  });

  it(`should throw error if segment starts with a period`, () => {
    expect(() => encodeStringSegment('.test')).toMatchError(
      new Error('Segment contains invalid characters'),
    );
    expect(() => encodeStringSegment('.')).toMatchError(
      new Error('Segment contains invalid characters'),
    );
  });

  it('should encode valid tag names correctly', () => {
    // Basic alphanumeric
    expect(encodeStringSegment('tag1')).toBe('[S]tag1');
    expect(encodeStringSegment('Tag123')).toBe('[S]Tag123');
    expect(encodeStringSegment('myTag')).toBe('[S]myTag');

    // With hyphens
    expect(encodeStringSegment('my-tag')).toBe('[S]my-tag');
    expect(encodeStringSegment('test-tag-name')).toBe('[S]test-tag-name');

    // With underscores
    expect(encodeStringSegment('my_tag')).toBe('[S]my_tag');
    expect(encodeStringSegment('test_tag_name')).toBe('[S]test_tag_name');

    // With periods (but not starting with period)
    expect(encodeStringSegment('tag.name')).toBe('[S]tag.name');
    expect(encodeStringSegment('my.tag.name')).toBe('[S]my.tag.name');

    // Mixed valid characters
    expect(encodeStringSegment('my-tag_name.v1')).toBe('[S]my-tag_name.v1');
    expect(encodeStringSegment('Tag-123_test.final')).toBe(
      '[S]Tag-123_test.final',
    );

    // Single character valid names
    expect(encodeStringSegment('a')).toBe('[S]a');
    expect(encodeStringSegment('Z')).toBe('[S]Z');
    expect(encodeStringSegment('1')).toBe('[S]1');
    expect(encodeStringSegment('_')).toBe('[S]_');
    expect(encodeStringSegment('-')).toBe('[S]-');
  });

  it(`should return a string prefixed with a`, () => {
    const input = 'TestingStringWith-_';
    expect(decodeStringSegment(encodeStringSegment(input))).toEqual(input);
    expect(encodeStringSegment(input)).toMatchInlineSnapshot(
      `"[S]TestingStringWith-_"`,
    );
  });

  it('segments should be sortable', () => {
    const value1 = encodeStringSegment('test-1');
    const value2 = encodeStringSegment('test-10');

    expect(value1 < value2).toBe(true);
  });
});
