import ClearDay from '../assets/SVG/day_clear.svg'

const CurrentWeather = ({currentWeather}) => {
    return (
        <div className="p-7 flex flex-row w-full h-full">
            <div className="basis-1/2 flex flex-col "> 
                    <div className="flex-1 flex-col ">
                        <div className="flex-1 flex">
                            <h1 className="text-white text-4xl font-bold">{currentWeather.name}</h1>
                        </div>
                        <div className="flex-1 flex">
                            <h1 className="text-[#c0cbdc] text-1xl">{currentWeather.description}</h1>
                        </div>
                    </div>
                    <div className="flex-1  flex">
                        <h1 className="text-white text-5xl font-extrabold ">{currentWeather.temperature}<span>°C</span></h1>
                    </div>
                </div>
            <div className="basis-1/2  flex items-center justify-middle">
                <img src={`icons/${currentWeather.weatherIcon}.svg`} alt="Animated Weather" className="h-55 " />
            </div>
        </div>
    );
};

export default CurrentWeather;