export type StringSegment = string & { __typename: 'StringSegment' };

const stringPrefix = '[S]';
const allowedStringPattern = /^[a-zA-Z0-9\-_][a-zA-Z0-9\-_.]*$/;

export function isEncodedStringSegment(input: string): input is StringSegment {
  return input.startsWith(stringPrefix);
}

export function decodeStringSegment(input: StringSegment) {
  const stringValue = input.substr(stringPrefix.length);
  return stringValue;
}

export function encodeStringSegment(input: string): StringSegment {
  if (!allowedStringPattern.test(input)) {
    throw new Error('Segment contains invalid characters');
  }

  return (stringPrefix + input) as StringSegment;
}
