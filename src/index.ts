import {
  decodeNumberSegment,
  encodeNumberSegment,
  isEncodedNumberSegment,
} from './number';
import {
  decodeStringSegment,
  encodeStringSegment,
  isEncodedStringSegment,
} from './string';

type Segment = string | number;

const separator = '#';

export function encode(...segments: Segment[]) {
  const encodeSegment = (segment: Segment, index: number) => {
    if (typeof segment === 'string') {
      return encodeStringSegment(segment);
    }

    if (typeof segment === 'number') {
      return encodeNumberSegment(segment);
    }

    throw new Error(
      `encode only supports string or number segments instead got "typeof segments[${index}] === ${typeof segment}"`,
    );
  };

  return segments.map(encodeSegment).join(separator) + separator;
}

export function decode(input: string): Segment[] {
  const decodeSegment = (encodedSegment: string, index: number) => {
    if (isEncodedNumberSegment(encodedSegment)) {
      return decodeNumberSegment(encodedSegment);
    }

    if (isEncodedStringSegment(encodedSegment)) {
      return decodeStringSegment(encodedSegment);
    }

    throw new Error(
      `decode only supports string or number segments prefixes instead got "segments[${index}] === ${encodedSegment}"`,
    );
  };

  return input.split(separator).filter(Boolean).map(decodeSegment);
}
