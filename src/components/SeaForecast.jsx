// SeaForecast.jsx

import skyBackground from '../assets/sky.jpg';
import { weatherCodes } from "../constants";
import { useState, useEffect } from 'react';

const SeaForecast = ({ currentWeather, hourlyForecast, currentMarine }) => {
    const [currentTideIndex, setCurrentTideIndex] = useState(-1);
    const [fishingScore, setFishingScore] = useState(0);

    useEffect(() => {
        const determineCurrentTide = () => {
            const now = new Date();
            
            const allTides = [
                { type: currentMarine.tide, time: currentMarine.tideTime },
                { type: currentMarine.tide2, time: currentMarine.tideTime2 },
                { type: currentMarine.tide3, time: currentMarine.tideTime3 },
                { type: currentMarine.tide4, time: currentMarine.tideTime4 }
            ];

            const validTides = allTides.filter(tide => tide.time);

            if (validTides.length === 0) {
                return -1;
            }

            for (let i = 0; i < validTides.length; i++) {
                const tideTime = new Date(validTides[i].time);
                
                const nextTideTime = i < validTides.length - 1 
                    ? new Date(validTides[i+1].time) 
                    : new Date(validTides[0].time); // Wraps around to the first tide if it's the last one
                
                if (now >= tideTime && now < nextTideTime) {
                    return i;
                }
            }
            return -1;
        };

        const calculateFishingScore = () => {
            let score = 0;
            const now = new Date();

            // 1. Tide Score (Max 25 points)
            const allTides = [
                { type: currentMarine.tide, time: currentMarine.tideTime },
                { type: currentMarine.tide2, time: currentMarine.tideTime2 },
                { type: currentMarine.tide3, time: currentMarine.tideTime3 },
                { type: currentMarine.tide4, time: currentMarine.tideTime4 }
            ];
            const validTides = allTides.filter(tide => tide.time);
            
            if (validTides.length > 0) {
                const tideTimes = validTides.map(tide => new Date(tide.time).getTime());
                const timeDifferences = tideTimes.map(tideTime => Math.abs(now.getTime() - tideTime));
                const minDiff = Math.min(...timeDifferences);
                
                // Max difference for a full day cycle (adjust if needed for a typical tide cycle)
                const maxRelevantDiff = 6 * 60 * 60 * 1000; // 6 hours, assuming a roughly 6-hour interval between high/low
                score += 25 * (1 - Math.min(minDiff / (maxRelevantDiff), 1));
            }

            // 2. Moon Phase Score (Max 20 points)
            const moonPhase = currentMarine.moonPhase;
            if (moonPhase === 'Full Moon' || moonPhase === 'New Moon') {
                score += 20;
            } else if (moonPhase === 'First Quarter' || moonPhase === 'Last Quarter') {
                score += 10;
            }

            // 3. Atmospheric Pressure Score (Max 15 points)
            const pressure = currentWeather.pressure;
            if (pressure >= 1010 && pressure <= 1020) { // Ideal range
                score += 15;
            } else if (pressure > 1000 && pressure < 1030) { // Acceptable range
                 score += 7;
            }

            // 4. Wind Speed Score (Max 15 points)
            const windSpeed = currentWeather.wind; // in kph
            if (windSpeed >= 5 && windSpeed <= 20) { // Light to moderate breeze
                score += 15;
            } else if (windSpeed > 20 && windSpeed <= 40) { // Moderate to strong
                score += 7;
            } // Very low or very high wind get 0 points for this factor

            // 5. Sea Temperature Score (Max 15 points)
            const seaTemp = currentMarine.sea_temperature;
            if (seaTemp >= 15 && seaTemp <= 25) { // General ideal range for many species
                score += 15;
            } else if (seaTemp >= 10 && seaTemp < 15 || seaTemp > 25 && seaTemp <= 30) { // Tolerable but less ideal
                score += 7;
            }

            // 6. Rain Score (Max 5 points)
            const rain = currentWeather.rain; // in mm
            if (rain > 0.1 && rain <= 3) { // Light rain
                score += 5;
            } else if (rain > 3) { // Heavy rain (can make water murky)
                score -= 2; // Deduct a small amount for heavy rain
            }

            // 7. Cloud Cover Score (Max 5 points)
            const cloud = currentWeather.cloud; // in percentage
            if (cloud > 50) { // Overcast conditions often good
                score += 5;
            } else if (cloud > 20 && cloud <= 50) { // Partly cloudy
                score += 2;
            }

            // Cap the score between 0 and 100
            return Math.min(Math.max(Math.round(score), 0), 100);
        };

        setCurrentTideIndex(determineCurrentTide());
        setFishingScore(calculateFishingScore());
    }, [currentMarine, currentWeather]); // Dependencies: Re-calculate when marine or weather data changes

    const renderTide = (tide, index) => {
        if (!tide) return null;

        const isActive = index === currentTideIndex;
        return (
            <span 
                key={index} 
                className={`${isActive ? "underline font-bold text-white" : "text-[#c0cbdc]"}`}
            >
                {tide}
                {index < 3 ? " / " : ""}
            </span>
        );
    };

    return (
        <div className="p-6 flex flex-col w-full h-full bg-[#202b3b] rounded-3xl">
            <div className="flex basis-1/13">
                <h2 className="text-[#c0cbdc] text-1xl uppercase font-bold">Morski uvjeti</h2>
            </div>
            <div className="flex flex-col basis-12/13">
                <div className="pl-4 pr-4 basis-1/10 flex flex-col">
                    <h2 className="text-[#c0cbdc] text-1xl font-semibold pb-3">Aktivnost riba</h2>
                    {/* New structure for score labels and progress bar */}
                    <div className="flex justify-between items-center w-full">
                        <span className="text-sm text-[#c0cbdc]">0</span>
                        <span className="text-md text-white font-bold">{fishingScore}</span>
                        <span className="text-sm text-[#c0cbdc]">100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-1 mb-10">
                        <div 
                            className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${fishingScore}%` }}
                        ></div>
                    </div>
                </div>
                <div className="basis-3/10 flex flex-col">
                    <div className="basis-1/1 flex flex-row flex-nowrap overflow-x-auto divide-x divide-[#2a384b]">
                        {hourlyForecast.map((hour, index) => (
                            <div key={index} className="basis-1/6 flex flex-col">
                                <div className="basis-1/6">
                                    <h2 className="text-center text-[#c0cbdc] font-semibold">
                                        {new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </h2>
                                </div>
                                <div className="flex basis-3/6 items-center justify-center">
                                    <img 
                                        src={`icons/${Object.keys(weatherCodes).find((icon) =>
                                            weatherCodes[icon].includes(hour.condition.code))}.svg`} 
                                        alt="Animated Weather" 
                                        className="h-15 w-15" 
                                    />
                                </div>
                                <div className="basis-2/6">
                                    <h2 className="text-xl text-center text-white font-extrabold">
                                        {Math.round(hour.temp_c)}°
                                    </h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="basis-6/10 flex flex-col">
                    <div className='basis-2/3 flex pt-5'>
                        <div className="flex flex-col basis-1/2">
                            <div className="flex flex-row basis-1/2">
                                <div className="flex items-top justify-center basis-1/9">
                                    <span className="material-symbols-outlined text-[#c0cbdc] text-2xl">water</span>
                                </div>
                                <div className="flex flex-col basis-8/9">
                                    <div className="flex basis-1/4">
                                        <h2 className="text-[#c0cbdc] font-semibold">Temperatura mora</h2>
                                    </div>
                                    <div className="flex basis-2/4">
                                        <h2 className="text-2xl text-white font-extrabold">
                                            {currentMarine.sea_temperature}<span>°</span>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row basis-1/3">
                                <div className="flex items-top justify-center basis-1/9">
                                    <span className="material-symbols-outlined text-[#c0cbdc] text-2xl">arrow_downward</span>
                                </div>
                                <div className="flex flex-col basis-8/9">
                                    <div className="flex basis-1/3">
                                        <h2 className="text-[#c0cbdc] font-semibold">Tlak</h2>
                                    </div>
                                    <div className="flex basis-2/3">
                                        <h2 className="text-2xl text-white font-extrabold">
                                            {currentWeather.pressure}<span>mb</span>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col basis-1/2">
                            <div className="flex flex-row basis-1/2">
                                <div className="flex items-top justify-center basis-1/9">
                                    <span className="material-symbols-outlined text-[#c0cbdc] text-2xl">waves</span>
                                </div>
                                <div className="flex flex-col basis-8/9">
                                    <div className="flex basis-1/4">
                                        <h2 className="text-[#c0cbdc] font-semibold">Morska mijena</h2>
                                    </div>
                                    <div className="flex basis-2/3">
                                        <h2 className="text-2xl text-white font-extrabold">
                                            {currentMarine.tide && renderTide(currentMarine.tide, 0)}
                                            {currentMarine.tide2 && renderTide(currentMarine.tide2, 1)}
                                            {currentMarine.tide3 && renderTide(currentMarine.tide3, 2)}
                                            {currentMarine.tide4 && renderTide(currentMarine.tide4, 3)}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row basis-1/3">
                                <div className="flex items-top justify-center basis-1/9">
                                    <span className="material-symbols-outlined text-[#c0cbdc] text-2xl">cloud</span>
                                </div>
                                <div className="flex flex-col basis-8/9">
                                    <div className="flex basis-1/3">
                                        <h2 className="text-[#c0cbdc] font-semibold">Oblačnost</h2>
                                    </div>
                                    <div className="flex basis-2/4">
                                        <h2 className="text-2xl text-white font-extrabold">
                                            {currentWeather.cloud}<span>%</span>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='basis-1/3 flex'>
                        <div
                            className="p-5 flex flex-col bg-cover bg-center bg-no-repeat h-full w-full rounded-3xl"
                            style={{ backgroundImage: `url(${skyBackground})` }}
                        >
                            <div className='flex flex-col'>
                                <div className="flex flex-row">
                                    <div className="pt-1 pr-3 flex items-top justify-center">
                                        <span className="material-symbols-outlined text-[#c0cbdc] text-3xl">bedtime</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex">
                                            <h2 className="text-[#c0cbdc] font-semibold text-2xl">Mjesečeva mjena</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className='pl-9 pt-4 flex'>
                                    <h1 className="text-white text-4xl font-bold">{currentMarine.moonPhase}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeaForecast;