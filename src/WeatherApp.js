/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { ReactComponent as CloudyIcon } from './components/day-cloudy.svg';
import { ReactComponent as AirFlowIcon } from './components/airFlow.svg';
import { ReactComponent as RainIcon } from './components/rain.svg';
import { ReactComponent as RedoIcon } from './components/loading.svg';

import { API_GET_WEATHER,API_GET_RAIN } from './global/constants';
import { useState, useEffect } from 'react';

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
  console.log('232');
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: '',
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: '',
  })

  useEffect(() => {
    const fetchData = async () =>{
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(),
        fetchWeatherForecast(),
      ])
      console.log(currentWeather , weatherForecast  );
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast
      })
    }
    fetchData();
    //畫面渲染完成後呼叫
    
  },[]); //空陣列，比對有無更新陣列中內容

  const fetchWeatherForecast = () =>{
    return fetch(API_GET_RAIN)
    .then(res=>res.json())
    .then((data)=>{
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements,item) => {
          if (['Wx', 'PoP', 'CI'].includes(item.elementName)){
            neededElements[item.elementName]=item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      }
      //當箭頭函式單純只是要回傳物件時，可以連 return 都不寫，但回傳的物件需要使用小括號 () 包起來
    })
  }

  const fetchCurrentWeather = () => {
    return  fetch(API_GET_WEATHER)
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
          {}
        );
        return {
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          humid: weatherElements.HUMD,
        }
      });
  };
  
  return (
    <Container>
      <WeatherCard>
        <Location>{weatherElement.locationName}</Location>
        <Description>{weatherElement.description}{weatherElement.comfortability}</Description>
        <CurrentWeather>
          <Temperature>{Math.round(weatherElement.temperature)}<Celsius>°C</Celsius></Temperature>
          <Cloudy/>
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon/>
          {weatherElement.windSpeed} m/h</AirFlow>
        <Rain><RainIcon/>
          {Math.round(weatherElement.rainPossibility)}%
        </Rain>       
        <Redo onClick={() =>{
          fetchCurrentWeather();
          fetchWeatherForecast();
        }}>最後觀測時間:
          {new Intl.DateTimeFormat('zh-TW', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(weatherElement.observationTime))}
          <RedoIcon></RedoIcon>
          </Redo>   
      </WeatherCard>
    </Container>
  );
};

export default WeatherApp;