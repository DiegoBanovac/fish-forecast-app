const DayForecast = ( {currentWeather} ) => {
    return (
        <div className="p-6 flex flex-col w-full h-full bg-[#202b3b] rounded-3xl">
            <div className="mb-5 basis-1/10">
                <h2 className="text-[#c0cbdc] text-1xl uppercase font-bold">Vremenski uvjeti</h2>
            </div>
            <div className="flex flex-row basis-9/10">
                <div className="flex flex-col basis-1/2">
                    <div className="flex flex-row basis-1/2">
                        <div className="flex items-top justify-center basis-1/9">
                            <span className="material-symbols-outlined text-[#c0cbdc] text-2xl">thermometer</span>
                        </div>
                        <div className="flex flex-col basis-8/9">
                            <div className="flex basis-1/3">
                                <h2 className="text-[#c0cbdc] font-semibold">Osjet</h2>
                            </div>
                            <div className="flex basis-2/3">
                                <h2 className="text-2xl  text-white font-extrabold">{currentWeather.feelslike}<span>°</span></h2>
                            </div>
                        </div>
                        
                    </div>
                    <div className="flex flex-row basis-1/2">
                        <div className="flex items-top justify-center basis-1/9">
                            <span className="material-symbols-outlined text-[#c0cbdc] text-2xl">rainy_light</span>
                        </div>
                        <div className="flex flex-col basis-8/9">
                            <div className="flex basis-1/3 ">
                                <h2 className="text-[#c0cbdc] font-semibold">Oborine</h2>
                            </div>
                            <div className="flex basis-2/3">
                                <h2 className="text-2xl  text-white font-extrabold">{currentWeather.rain}<span> mm</span></h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col basis-1/2">
                    <div className="flex flex-row basis-1/2">
                        <div className="flex items-top justify-center basis-1/9">
                            <span className="material-symbols-outlined text-[#c0cbdc] text-2xl">air</span>
                        </div>
                        <div className="flex flex-col basis-8/9">
                            <div className="flex basis-1/3 ">
                                <h2 className="text-[#c0cbdc] font-semibold">Vjetar</h2>
                            </div>
                            <div className="flex basis-2/3">
                                <h2 className="text-2xl  text-white font-extrabold">{currentWeather.wind}<span> kph</span></h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row basis-1/2">
                        <div className="flex items-top justify-center basis-1/9">
                            <span className="material-symbols-outlined text-[#c0cbdc] text-2xl"><span className="material-symbols-outlined">clear_day</span></span>
                        </div>
                        <div className="flex flex-col basis-8/9">
                            <div className="flex basis-1/3 ">
                                <h2 className="text-[#c0cbdc] font-semibold">UV Indeks</h2>
                            </div>
                            <div className="flex basis-2/3">
                                <h2 className="text-2xl  text-white font-extrabold">{currentWeather.uv}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default DayForecast;