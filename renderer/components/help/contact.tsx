import { styled } from '@/styles';
import { Icon } from '@/ui';
import * as React from 'react';

const Contact = () => {
  return (
    <Box>
      <p>
        Have any questions, suggestions,
        <br />
        feedback, want to say hi?
      </p>

      <ContactButton href="mailto:matej@matejlauko.com">
        <Icon css={{ mr: '$2' }} size="4">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </Icon>
        Contact me
      </ContactButton>

      <Created>
        Created by <a href="https://twitter.com/MatejLauko">@matejlauko</a>
      </Created>
    </Box>
  );
};

export default Contact;

const Box = styled('main', {
  textAlign: 'center',
});

const ContactButton = styled('a', {
  appearance: 'none',
  userSelect: 'none',
  outline: 'none',
  fontWeight: '$bold',
  borderWidth: '2px',
  borderRadius: '500px',
  height: '$8',
  px: '$4',
  minWidth: '150px',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.2s',
  textDecoration: 'none',

  '&:hover': {
    bg: '$bg_hover',
  },
});

const Created = styled('p', {
  mt: '$8',
});
