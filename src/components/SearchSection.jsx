import { forwardRef } from 'react';

const SearchSection = forwardRef(({ getWeatherDetails, getMarineDetails, city, setCity }, ref) => {
  const handleCitySearch = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    const API_URL = `http://localhost:5000/api/weather?city=${city}`;
    const MARINE_URL = `http://localhost:5000/api/marine?city=${city}`;
    getWeatherDetails(API_URL, city);
    getMarineDetails(MARINE_URL);
  };

  const handleLocationSearch = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        const API_URL = `http://localhost:5000/api/weather?city=${latitude},${longitude}`;
        const MARINE_URL = `http://localhost:5000/api/marine?city=${latitude},${longitude}`;
        getWeatherDetails(API_URL);
        getMarineDetails(MARINE_URL);
      },
      () => {
        alert("Molimo vas da upalite dozvolu lokacije");
      }
    );
  };

  return (
    <form onSubmit={handleCitySearch} className="flex items-center space-x-4 m-5 pt-3">
      <div className="flex items-center bg-[#202b3b] rounded-3xl px-3 py-1 w-150 h-13">
        <span className="material-symbols-outlined text-[#c0cbdc] mr-2">search</span>
        <input 
          type="search" 
          placeholder="Unesi ime grada" 
          ref={ref}
          className="search-input outline-none placeholder-[#c0cbdc] text-[#c0cbdc]"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required 
        />
      </div>

      <button 
        type="button"
        className="rounded-2xl px-[14px] py-[14px] flex items-center space-x-1 bg-[#202b3b]" 
        onClick={handleLocationSearch}
      >
        <span className="material-symbols-outlined text-[#c0cbdc]">my_location</span>
      </button>
    </form>
  );
});

export default SearchSection;