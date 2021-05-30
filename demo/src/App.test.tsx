import { render } from '@testing-library/react';
import { App } from './App';

describe('renders links to rollpkg', () => {
  const { container } = render(<App />);
  const links = container.getElementsByTagName('a');
  const hrefs = Object.values(links).map((link) => link.getAttribute('href'));

  test('renders link to rollpkg', () => {
    expect(hrefs).toContain('https://github.com/rafgraph/rollpkg');
  });

  test('renders link to rollpkg example package', () => {
    expect(hrefs).toContain(
      'https://github.com/rafgraph/rollpkg-example-package',
    );
  });
});
