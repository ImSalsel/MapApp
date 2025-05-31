import styled from 'styled-components';

export const ToolbarContainer = styled.div`
  grid-area: toolbar;
  padding: 10px;
  height: 100%;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column; 
  gap: 15px; 
  border-radius: 8px;
  margin: 2%;
`;

export const ToolButtonsRow = styled.div`
  display: flex;
  flex-direction: row; 
  gap: 8px; 
  flex-wrap: wrap; 
`;

export const ToolButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 4px;
  font-size: 0.8em;

  &:hover {
    background-color: #e9e9e9;
  }

  &.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
`;

export const ActiveToolPanelContainer = styled.div`
  min-height: 50px; 
`;

export const PanelContainer = styled.div`
  padding: 15px;
  border-radius: 4px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 10px; 
`;

export const InputLabel = styled.label`
  font-size: 0.9em;
  color: #333;
  margin-bottom: 3px;
`;

export const InputField = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  width: 100%; 
  max-width: 30%;
  box-sizing: border-box; 
`;

export const PointInputGroup = styled.div`
  display: flex;
  gap: 10px; 
  
  & > ${InputField} { 
    width: auto; 
    flex: 1; 
  }
`;

export const CalculatedValue = styled.p`
  font-size: 1em;
  font-weight: bold;
  color: #2c3e50;
  margin: 5px 0;
  padding: 8px;
  background-color: #ffff;
  border-radius: 3px;
`;

export const SegmentRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
  border-bottom: 1px solid #ffff;
  padding: 4px 0;
`;

export const TrashIcon = styled.span`
  cursor: pointer;
  font-size: 1.3em;
  margin-left: 8px;
`;

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;