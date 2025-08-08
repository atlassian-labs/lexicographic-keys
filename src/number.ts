const negativeNumberPrefix = '[N]';
const positiveNumberPrefix = '[P]';
const numberPaddingLength = Number.MAX_SAFE_INTEGER.toString().length;

export type NumberSegment = string & { __typename: 'NumberSegment' };

export function isEncodedNumberSegment(input: string): input is NumberSegment {
  return (
    input.startsWith(negativeNumberPrefix) ||
    input.startsWith(positiveNumberPrefix)
  );
}

export function decodeNumberSegment(input: NumberSegment) {
  const segmentType = input.substring(0, positiveNumberPrefix.length);
  const segmentValue = input.substring(positiveNumberPrefix.length);

  if (segmentType === negativeNumberPrefix) {
    return Number.parseInt(segmentValue, 10) - Number.MAX_SAFE_INTEGER;
  }

  if (segmentType === positiveNumberPrefix) {
    return Number.parseInt(segmentValue, 10);
  }

  throw new Error(
    `Invalid segment prefix "${segmentType}" for number - expected either "${positiveNumberPrefix}" or "${negativeNumberPrefix}"`,
  );
}

export function encodeNumberSegment(input: number): NumberSegment {
  if (!Number.isSafeInteger(input)) {
    throw new Error('Can only encode safe integer values');
  }

  if (input >= 0) {
    return (positiveNumberPrefix +
      input.toString().padStart(numberPaddingLength, '0')) as NumberSegment;
  }

  const inputCompliment = Number.MAX_SAFE_INTEGER + input;
  return (negativeNumberPrefix +
    inputCompliment
      .toString()
      .padStart(numberPaddingLength, '0')) as NumberSegment;
}
