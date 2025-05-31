import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: grid;
  grid-template-areas:
    "map toolbar"
    "map toolbar"
    "map toolbar";
  grid-template-columns: 65% 30%;
  
  grid-template-rows: 60% 20% 10%;
  width: 100vw;
  height: 100vh;
  background-color:rgb(201, 193, 193);
`;

export const MapContainer = styled.div`
  grid-area: map;
  width: 90%;
  height: 90%;
  margin: 1%;

  .ol-viewport {
    border-radius: 8px;
  }
`;