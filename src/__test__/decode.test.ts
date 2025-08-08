import { decode } from '..';

describe('decode', () => {
  it('should decode composite id', () => {
    const id =
      '[S]app#[S]uuid#[S]deployments#[P]0000000000000001#[S]events#[P]0000000010000000#';
    expect(decode(id)).toMatchInlineSnapshot(`
     [
       "app",
       "uuid",
       "deployments",
       1,
       "events",
       10000000,
     ]
   `);
  });

  it('should throw an error if id invalid', () => {
    const id =
      '[S]app#[S]uuid#[S]deployments#[W]0000000000000001#[S]events#[P]0000000010000000#';
    expect(() => decode(id)).toThrowErrorMatchingInlineSnapshot(
      `"decode only supports string or number segments prefixes instead got "segments[3] === [W]0000000000000001""`,
    );
  });
});
