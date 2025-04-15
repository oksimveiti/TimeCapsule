import React from 'react';
import styled from 'styled-components';

const AnimatedInput = ({ label, type = "text", name, ...props }) => {
    return (
        <StyledWrapper>
            <div className='form-control'>
                <input
                    type={type}
                    name={name}
                    required
                    className={type === 'date' ? 'date-input' : ''}
                    {...props}
                />
                <label>
                    {label.split("").map((char, index) => (
                        <span key={index} style={{ transitionDelay: `${index * 50}ms` }}>
                            {char}
                        </span>
                    ))}
                </label>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .form-control {
    position: relative;
    margin: 20px 0 40px;
    width: 100%;
    max-width: 300px;
  }

  .form-control input {
    background-color: transparent;
    border: 0;
    border-bottom: 2px #fff solid;
    display: block;
    width: 100%;
    padding: 15px 0;
    font-size: 18px;
    color: #fff;
  }

  /* Sadece tarih inputlari için text-align: right */
  .form-control input.date-input {
    text-align: right;
    margin-right: 0.75rem;
  }

  .form-control input.hour-input {
    text-align: right;
    margin-right: 0.75rem;
  }

  .form-control input.hour-input::placeholder {
    text-align: right;
  }

  .form-control input:focus,
  .form-control input:valid {
    outline: 0;
    border-bottom-color: lightblue;
  }

  .form-control label {
    position: absolute;
    top: 15px;
    left: 0;
    pointer-events: none;
  }

  .form-control label span {
    display: inline-block;
    font-size: 18px;
    min-width: 5px;
    color: #fff;
    transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .form-control input:focus + label span,
  .form-control input:valid + label span {
    color: lightblue;
    transform: translateY(-30px);
  }

  .form-control input.date-input::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }

  .form-control input.hour-input::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;

export default AnimatedInput;