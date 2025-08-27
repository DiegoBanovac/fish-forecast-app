

import { weatherCodes } from "../constants"

const WeekForecast = ({ weeklyForecast }) => {
    const getDayName = (dateString) => {
        const days = ['Nedjelja', 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota'];
        return days[new Date(dateString).getDay()];
    };


    const calculateDailyFishingScore = (dayData) => {
        let score = 0;

        
        const moonPhase = dayData.astro?.moon_phase; 
        if (moonPhase === 'Full Moon' || moonPhase === 'New Moon') {
            score += 30;
        } else if (moonPhase === 'First Quarter' || moonPhase === 'Last Quarter') {
            score += 15;
        }

        
        const windSpeed = dayData.day.maxwind_kph;
        if (windSpeed >= 5 && windSpeed <= 20) { 
            score += 25;
        } else if (windSpeed > 20 && windSpeed <= 40) { 
            score += 10;
        } 
        

      
        const airTemp = dayData.day.avgtemp_c;
        
        if (airTemp >= 10 && airTemp <= 25) { 
            score += 25;
        } else if ((airTemp >= 5 && airTemp < 10) || (airTemp > 25 && airTemp <= 30)) {
            score += 10;
        }
       

        
        const rain = dayData.day.totalprecip_mm;
        if (rain > 0.1 && rain <= 3) {
            score += 10;
        } else if (rain > 3 && rain <= 10) { 
            score += 5;
        } else if (rain > 10) { 
            score -= 5; 
        }

        
        const conditionCode = dayData.day.condition.code;
        
        const weatherIconKey = Object.keys(weatherCodes).find((icon) =>
            weatherCodes[icon].includes(conditionCode)
        );

        
        if (weatherIconKey === 'cloudy' || weatherIconKey === 'overcast_day' || weatherIconKey === 'mist' || weatherIconKey === 'fog') {
            score += 10; 
        } else if (weatherIconKey === 'partly_cloudy_day') {
            score += 5; 
        } 
        

        
        return Math.min(Math.max(Math.round(score), 0), 100);
    };

   
    const todayIndex = weeklyForecast.findIndex(day => 
        new Date(day.date).toDateString() === new Date().toDateString()
    );

    
    const forecastToShow = todayIndex >= 0 
        ? weeklyForecast.slice(todayIndex + 1, todayIndex + 7)
        : weeklyForecast.slice(0, 6);

    return (
        <div className="p-6 flex flex-col w-full h-full bg-[#202b3b] rounded-3xl">
            <div className="mb-5">
                <h2 className="text-[#c0cbdc] text-1xl uppercase font-bold">Prognoza 6 dana</h2>
            </div>
            <div className="flex flex-row divide-x divide-[#2a384b] overflow-x-auto">
                {forecastToShow.map((day, index) => {
                
                    const dailyFishingScore = calculateDailyFishingScore(day);
                    
                    return (
                        <div key={index} className="basis-1/6 flex flex-col px-2">
                            <div>
                                <h2 className="text-center text-[#c0cbdc] font-semibold">{getDayName(day.date)}</h2>
                            </div>
                            <div className="flex items-center justify-center my-2">
                                <img
                                    src={`icons/${Object.keys(weatherCodes).find((icon) => 
                                        weatherCodes[icon].includes(day.day.condition.code))}.svg`}
                                    alt="Weather Icon"
                                    className="h-15 w-15"
                                />
                            </div>
                            <div>
                                <h2 className="text-xl text-center text-white font-extrabold">
                                    {Math.round(day.day.maxtemp_c)}
                                    <span className="font-normal text-[#c0cbdc]"> / {Math.round(day.day.mintemp_c)}°</span>
                                </h2>
                            </div>
                            <div className="mt-2 text-center">
                                <p className="text-sm text-[#c0cbdc] font-semibold">Aktivnost:</p>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${dailyFishingScore}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-white mt-1">{dailyFishingScore}%</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeekForecast;