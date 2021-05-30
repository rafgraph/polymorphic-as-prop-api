import { polymorphicAsArrayUtil, createPolymorphic, styled } from '../index';

test('exports a polymorphicAsArrayUtil function', () => {
  expect(typeof polymorphicAsArrayUtil).toBe('function');
});

test('exports a createPolymorphic function', () => {
  expect(typeof createPolymorphic).toBe('function');
});

test('exports a styled function', () => {
  expect(typeof styled).toBe('function');
});
