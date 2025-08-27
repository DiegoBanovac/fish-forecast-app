// App.js

import './App.css'
import { useState, useRef } from 'react'
import Sidebar from './components/Sidebar'
import SearchSection from "./components/SearchSection"
import CurrentWeather from './components/CurrentWeather'
import WeekForecast from './components/WeekForecast'
import DayForecast from './components/DayForecast'
import SeaForecast from './components/SeaForecast'
import { weatherCodes } from "./constants"

function App() {
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [currentMarine, setCurrentMarine] = useState({});
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [city, setCity] = useState('');
  const searchInputRef = useRef(null);

  const filterHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0, 0, 0)
    const next24hours = currentHour + 24 * 60 * 60 * 1000;

    const next24hoursData = hourlyData.filter(({ time }) => {
      const forecastTime = new Date(time).getTime();
      return forecastTime >= currentHour && forecastTime <= next24hours;
    });

    const filteredDataEvery2Hours = next24hoursData
      .filter((_, index) => index % 3 === 0)
        .map(hour => ({
          time: hour.time,
          temp_c: hour.temp_c,
          condition: hour.condition,
          chance_of_rain: hour.chance_of_rain,
        }));
    setHourlyForecast(filteredDataEvery2Hours);
  };

  const getWeatherDetails = async(API_URL, cityName) => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      const name = data.location.name;
      const temperature = Math.floor(data.current.temp_c);
      const description = data.current.condition.text;
      const feelslike = data.current.feelslike_c;
      const wind = data.current.wind_kph;
      const rain = data.current.precip_mm;
      const uv = data.current.uv;
      const pressure = data.current.pressure_mb;
      const cloud = data.current.cloud;
      const weatherIcon = Object.keys(weatherCodes).find((icon) =>
        weatherCodes[icon].includes(data.current.condition.code));

      setCurrentWeather({ name, temperature, description, feelslike, wind, rain, uv, pressure, cloud, weatherIcon });
      setWeeklyForecast(data.forecast.forecastday);

      if (cityName) {
        setCity(cityName);
      } else if (data.location?.name) {
        setCity(data.location.name);
      }

      const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];
      filterHourlyForecast(combinedHourlyData);
    } catch (error) {
      console.log(error);
    }
  };

  const getMarineDetails = async(MARINE_URL) => {
    try {
      const response = await fetch(MARINE_URL);
      const data = await response.json();

      const tideData = data.forecast.forecastday[0].day.tides[0]?.tide || [];

      setCurrentMarine({
       
        tide: tideData[0]?.tide_type || '',
        tideTime: tideData[0]?.tide_time || null,
        tide2: tideData[1]?.tide_type || '',
        tideTime2: tideData[1]?.tide_time || null,
        tide3: tideData[2]?.tide_type || '',
        tideTime3: tideData[2]?.tide_time || null,
        tide4: tideData[3]?.tide_type || '',
        tideTime4: tideData[3]?.tide_time || null,
        sea_temperature: data.forecast.forecastday[0].hour[0]?.water_temp_c, 
        moonPhase: data.forecast.forecastday[0].astro?.moon_phase, 
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-row h-screen bg-[#0b131e]'>
      <div className='pl-4 pt-4 pb-4 pr-2 w-[100px] flex-none'>
        <Sidebar />
      </div>

      <div className='flex flex-row flex-grow'>
        <div className='flex flex-col basis-2/4'>
          <SearchSection
            getWeatherDetails={getWeatherDetails}
            getMarineDetails={getMarineDetails}
            city={city}
            setCity={setCity}
            ref={searchInputRef}
          />
          <div className='basis-1/3 p-2'>
            <CurrentWeather currentWeather={currentWeather}/>
          </div>
          <div className='basis-1/3 p-2'>
            <WeekForecast weeklyForecast={weeklyForecast}/>
          </div>
          <div className='basis-1/3 pl-2 pt-2 pb-4 pr-2'>
            <DayForecast currentWeather={currentWeather}/>
          </div>
        </div>
        <div className='basis-2/4 pl-2 pt-24 pb-4 pr-4'>
          <SeaForecast
            currentWeather={currentWeather}
            hourlyForecast={hourlyForecast}
            currentMarine={currentMarine}
          />
        </div>
      </div>
    </div>
  )
}

export default App