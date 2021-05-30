import { randomRGBColorGenerator } from '../randomRGBColorGenerator';

test('returns an array of length 3', () => {
  const received = randomRGBColorGenerator();
  expect(Array.isArray(received)).toBe(true);
  expect(received).toHaveLength(3);
});

test('returns an array with integers for red, green, and blue', () => {
  const received = randomRGBColorGenerator();
  expect(Number.isInteger(received[0])).toBe(true);
  expect(Number.isInteger(received[1])).toBe(true);
  expect(Number.isInteger(received[2])).toBe(true);
});
