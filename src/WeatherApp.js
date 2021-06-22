/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { useState } from 'react';
import { ReactComponent as CloudyIcon } from './components/day-cloudy.svg';
import { ReactComponent as AirFlowIcon } from './components/airFlow.svg';
import { ReactComponent as RainIcon } from './components/rain.svg';
import { ReactComponent as RedoIcon } from './components/loading.svg';
import { API_GET_WEATHER } from './global/constants';
const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;
    svg {
      width: 25px;
      height: auto;
      margin-right: 30px;
    }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
    svg {
      width: 25px;
      height: auto;
      margin-right: 30px;
    }
`;
const Cloudy = styled(CloudyIcon)`
  /* 在這裡寫入 CSS 樣式 */
  flex-basis: 30%;
`;

const Redo = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState({
    observationTime: '2019-10-02 22:10:00',
    locationName: '臺北市',
    description: '多雲時晴',
    temperature: 27.5,
    windSpeed: 0.3,
    humid: 0.88,
  })
  
  const handleClick = () => {
    fetch(API_GET_WEATHER)
      .then((response) => response.json())
      .then((data) => {
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          },
        );
        setCurrentWeather({
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          description: '多雲時晴',
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          humid: weatherElements.HUMD,
        })
      });
  };
  
  return (
    <Container>
      <WeatherCard>
        <Location>{currentWeather.locationName}</Location>
        <Description>{currentWeather.description}</Description>
        <CurrentWeather>
          <Temperature>{Math.round(currentWeather.temperature)}<Celsius>°C</Celsius></Temperature>
          <Cloudy/>
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon/>
          {currentWeather.windSpeed} m/h</AirFlow>
        <Rain><RainIcon/>
          {Math.round(currentWeather.humid*100)}%
        </Rain>       
        <Redo onClick={handleClick}>最後觀測時間:
          {new Intl.DateTimeFormat('zh-TW', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(currentWeather.observationTime))}
          <RedoIcon></RedoIcon>
          </Redo>   
      </WeatherCard>
    </Container>
  );
};

export default WeatherApp;