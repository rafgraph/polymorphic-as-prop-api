import * as React from 'react';
import { Interactive } from 'react-interactive';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

interface GitHubIconLinkProps {
  href?: string;
  title?: string;
  newWindow?: boolean;
}

export const GitHubIconLink: React.VFC<GitHubIconLinkProps> = ({
  newWindow = true,
  title,
  ...props
}) => (
  <Interactive.A
    {...props}
    title={title}
    aria-label={title}
    target={newWindow ? '_blank' : undefined}
    rel={newWindow ? 'noopener noreferrer' : undefined}
    style={{
      color: 'black',
      outline: 'none',
      display: 'inline-block',
      width: '36px',
      height: '36px',
      padding: '3px',
      margin: '-3px',
      borderRadius: '50%',
    }}
    hoverStyle={{
      color: 'hsl(120,100%,33%)',
      borderColor: 'hsl(120,100%,33%)',
    }}
    activeStyle={{
      color: 'hsl(120,100%,33%)',
      borderColor: 'hsl(120,100%,33%)',
    }}
    focusFromKeyStyle={{
      boxShadow: '0 0 0 2px hsl(270,85%,60%)',
    }}
  >
    <GitHubLogoIcon
      width="30"
      height="30"
      // scale up the svg icon because it doesn't fill the view box
      // see: https://github.com/radix-ui/icons/issues/73
      style={{ transform: 'scale(1.1278)' }}
    />
  </Interactive.A>
);
