import { useState, useEffect } from 'react';
import { 
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  MapPin,
  Clock
} from 'lucide-react';
import LoginModal from '../components/LoginModal';

interface CityTime {
  city: string;
  timezone: string;
  time: string;
}

interface UserWeather {
  city: string;
  temp: number;
  condition: string;
  icon: string;
  feelsLike: number;
}

interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
}

export default function LandingPageSimple() {
  const [cityTimes, setCityTimes] = useState<CityTime[]>([]);
  const [userWeather, setUserWeather] = useState<UserWeather | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Cities to display with their timezones
  const cities = [
    { city: 'San Francisco', timezone: 'America/Los_Angeles' },
    { city: 'Chicago', timezone: 'America/Chicago' },
    { city: 'London', timezone: 'Europe/London' },
    { city: 'Tallinn', timezone: 'Europe/Tallinn' },
    { city: 'Lusaka', timezone: 'Africa/Lusaka' },
    { city: 'Sydney', timezone: 'Australia/Sydney' }
  ];

  // Update city times every second
  useEffect(() => {
    const updateTimes = () => {
      const times = cities.map(city => ({
        ...city,
        time: new Date().toLocaleTimeString('en-US', {
          timeZone: city.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      }));
      setCityTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get user's location and weather
  useEffect(() => {
    const fetchUserWeather = async () => {
      try {
        // Get user's location
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              
              // Fetch weather and forecast for user's location
              const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`
              );
              const weatherData = await weatherResponse.json();
              
              // Reverse geocode to get city name
              const geoResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const geoData = await geoResponse.json();
              
              const weatherCode = weatherData.current.weather_code;
              let condition = 'Clear';
              let icon = 'sun';
              
              if (weatherCode >= 61 && weatherCode <= 67) {
                condition = 'Rainy';
                icon = 'rain';
              } else if (weatherCode >= 71 && weatherCode <= 77) {
                condition = 'Snowy';
                icon = 'snow';
              } else if (weatherCode >= 51 && weatherCode <= 57) {
                condition = 'Drizzle';
                icon = 'rain';
              } else if (weatherCode >= 2 && weatherCode <= 3) {
                condition = 'Cloudy';
                icon = 'cloud';
              }

              setUserWeather({
                city: geoData.address.city || geoData.address.town || geoData.address.village || 'Your Location',
                temp: Math.round(weatherData.current.temperature_2m),
                feelsLike: Math.round(weatherData.current.apparent_temperature),
                condition,
                icon
              });

              // Process 4-day forecast (skip today, show next 4 days)
              const forecastData: DailyForecast[] = [];
              for (let i = 1; i <= 4; i++) {
                const forecastCode = weatherData.daily.weather_code[i];
                let forecastCondition = 'Clear';
                let forecastIcon = 'sun';
                
                if (forecastCode >= 61 && forecastCode <= 67) {
                  forecastCondition = 'Rain';
                  forecastIcon = 'rain';
                } else if (forecastCode >= 71 && forecastCode <= 77) {
                  forecastCondition = 'Snow';
                  forecastIcon = 'snow';
                } else if (forecastCode >= 51 && forecastCode <= 57) {
                  forecastCondition = 'Drizzle';
                  forecastIcon = 'rain';
                } else if (forecastCode >= 2 && forecastCode <= 3) {
                  forecastCondition = 'Cloudy';
                  forecastIcon = 'cloud';
                }

                const date = new Date(weatherData.daily.time[i]);
                forecastData.push({
                  date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                  maxTemp: Math.round(weatherData.daily.temperature_2m_max[i]),
                  minTemp: Math.round(weatherData.daily.temperature_2m_min[i]),
                  condition: forecastCondition,
                  icon: forecastIcon
                });
              }
              setForecast(forecastData);
              setLoading(false);
            },
            (error) => {
              console.error('Error getting location:', error);
              // Fallback to London if location denied
              fetchDefaultWeather();
            }
          );
        } else {
          // Fallback if geolocation not supported
          fetchDefaultWeather();
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        fetchDefaultWeather();
      }
    };

    const fetchDefaultWeather = async () => {
      try {
        // Default to London
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`
        );
        const data = await response.json();
        
        const weatherCode = data.current.weather_code;
        let condition = 'Clear';
        let icon = 'sun';
        
        if (weatherCode >= 61 && weatherCode <= 67) {
          condition = 'Rainy';
          icon = 'rain';
        } else if (weatherCode >= 71 && weatherCode <= 77) {
          condition = 'Snowy';
          icon = 'snow';
        } else if (weatherCode >= 2 && weatherCode <= 3) {
          condition = 'Cloudy';
          icon = 'cloud';
        }

        setUserWeather({
          city: 'London',
          temp: Math.round(data.current.temperature_2m),
          feelsLike: Math.round(data.current.apparent_temperature),
          condition,
          icon
        });

        // Process 4-day forecast
        const forecastData: DailyForecast[] = [];
        for (let i = 1; i <= 4; i++) {
          const forecastCode = data.daily.weather_code[i];
          let forecastCondition = 'Clear';
          let forecastIcon = 'sun';
          
          if (forecastCode >= 61 && forecastCode <= 67) {
            forecastCondition = 'Rain';
            forecastIcon = 'rain';
          } else if (forecastCode >= 71 && forecastCode <= 77) {
            forecastCondition = 'Snow';
            forecastIcon = 'snow';
          } else if (forecastCode >= 2 && forecastCode <= 3) {
            forecastCondition = 'Cloudy';
            forecastIcon = 'cloud';
          }

          const date = new Date(data.daily.time[i]);
          forecastData.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            maxTemp: Math.round(data.daily.temperature_2m_max[i]),
            minTemp: Math.round(data.daily.temperature_2m_min[i]),
            condition: forecastCondition,
            icon: forecastIcon
          });
        }
        setForecast(forecastData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching default weather:', error);
        setLoading(false);
      }
    };

    fetchUserWeather();
  }, []);

  const getWeatherIcon = (icon: string, className: string = 'w-6 h-6') => {
    switch (icon) {
      case 'rain':
        return <CloudRain className={className} />;
      case 'snow':
        return <CloudSnow className={className} />;
      case 'cloud':
        return <Cloud className={className} />;
      default:
        return <Sun className={className} />;
    }
  };

  return (
    <>
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/heysalad-white-logo.svg" 
                alt="HeySalad" 
                className="h-12"
              />
            </div>
            
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2 bg-[#E01D1D] hover:bg-[#c91919] text-white rounded-md font-medium transition-all duration-200 text-sm"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Weather */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          {/* User's Location Weather */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E01D1D]"></div>
            </div>
          ) : userWeather && (
            <div className="mb-16">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Main Weather - Left Side */}
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 text-zinc-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Feels like</span>
                  </div>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="text-[#E01D1D]">
                      {getWeatherIcon(userWeather.icon, 'w-16 h-16')}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-7xl font-bold">{userWeather.temp}</span>
                        <span className="text-3xl text-zinc-400">°C</span>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">{userWeather.city}</h2>
                  <p className="text-zinc-400">{userWeather.condition}</p>
                  <p className="text-sm text-zinc-500 mt-2">Feels like {userWeather.feelsLike}°C</p>
                </div>

                {/* 4-Day Forecast - Right Side (Intercom-style) */}
                {forecast.length > 0 && (
                  <div className="lg:w-80">
                    <h3 className="text-lg font-semibold mb-4">4-Day Forecast</h3>
                    <div className="space-y-3">
                      {forecast.map((day, index) => (
                        <div
                          key={index}
                          className="p-3 bg-zinc-900/50 backdrop-blur rounded-lg border border-zinc-800 hover:border-[#E01D1D]/30 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-zinc-400 mb-1">{day.date}</p>
                              <p className="text-xs text-zinc-500">{day.condition}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-[#E01D1D]">
                                {getWeatherIcon(day.icon, 'w-6 h-6')}
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold">{day.maxTemp}°</span>
                                <span className="text-sm text-zinc-500 ml-1">{day.minTemp}°</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* City Clocks */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold mb-6 text-center">Global Time</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {cityTimes.map((city, index) => (
                <div
                  key={index}
                  className="p-4 bg-zinc-900/50 backdrop-blur rounded-lg border border-zinc-800 hover:border-[#E01D1D]/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#E01D1D]" />
                    <h3 className="text-sm font-semibold">{city.city}</h3>
                  </div>
                  <p className="text-2xl font-mono font-bold tabular-nums">{city.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center gap-8">
            <img 
              src="/heysalad-white-logo.svg" 
              alt="HeySalad Harmony" 
              className="h-10"
            />
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Careers</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
            
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} HeySalad Inc.
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
