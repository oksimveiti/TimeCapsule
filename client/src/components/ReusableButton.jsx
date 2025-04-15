import React from 'react';
import styled from 'styled-components';

const ReusableButton = ({ children, onClick, accent = 'fuchsia', type = 'button', marginTop, align }) => {
  return (
    <StyledButton onClick={onClick} accent={accent} type={type} marginTop={marginTop} align={align}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  --hover-shadows: 10px 10px 33px #121212, -16px -16px 33px #303030;
  --accent: ${(props) => props.accent};

  font-family: "Poppins", sans-serif;
  letter-spacing: 0.1em;
  border: none;
  border-radius: 1.1em;
  background-color: #212121;
  cursor: pointer;
  color: white;
  padding: 1em 2em;
  transition: box-shadow ease-in-out 0.3s, background-color ease-in-out 0.1s,
    letter-spacing ease-in-out 0.1s, transform ease-in-out 0.1s;
  box-shadow: 5px 5px 10px #1c1c1c, -5px -5px 10px #262626;
  position: relative;
  z-index: 1;
  margin-top: ${(props) => props.marginTop || '0'};
  display: block;
  margin-left: ${(props) =>
    props.align === 'center' ? 'auto' : props.align === 'right' ? 'auto' : '0'};
  margin-right: ${(props) =>
    props.align === 'center' ? 'auto' : props.align === 'left' ? 'auto' : '0'};

  &:hover {
    box-shadow: var(--hover-shadows);
  }

  &:active {
    box-shadow: var(--hover-shadows), var(--accent) 0px 0px 30px 5px;
    background-color: var(--accent);
    transform: scale(0.95);
  }
`;

export default ReusableButton;
