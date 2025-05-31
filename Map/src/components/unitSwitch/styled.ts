import styled from "styled-components";

export const UnitSelectorContainer = styled.div`
  display: flex;
  gap: 24px; 
  margin: 12px 0;
`;

export const UnitGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; 
  padding: 8px 12px;
  background-color: #ffffff; 
  border-radius: 8px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); 
`;

export const GroupLabel = styled.label`
  color: #343a40;
  font-size: 0.8em;
`;

export const RadioButtonGroup = styled.div`
  display: flex;
  border-radius: 8px; 
  overflow: hidden;
  border: 1px solid #ced4da; 
`;

interface RadioSegmentLabelProps {
  isActive: boolean;
}

export const RadioSegmentLabel = styled.label<RadioSegmentLabelProps>`
  padding: 7px 14px;
  cursor: pointer;
  background-color: ${({ isActive }) => (isActive ? '#007bff' : '#ffffff')};
  color: ${({ isActive }) => (isActive ? '#ffffff' : '#495057')};
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  user-select: none; 

  input[type="radio"] {
    display: none;
  }

  &:not(:last-child) {
    border-right: 1px solid ${({ isActive }) => (isActive ? '#0056b3' : '#ced4da')};
  }
  
  ${({ isActive }: RadioSegmentLabelProps): string | false => isActive && `
    & + ${RadioSegmentLabel } { 
      border-left-color: #0056b3; 
    }
  `}

  &:hover {
    background-color: ${({ isActive }) => (isActive ? '#0056b3' : '#e9ecef')};
  }
`;