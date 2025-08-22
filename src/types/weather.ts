// 高德地图天气API响应类型定义

export interface AmapWeatherResponse {
  status: string
  count: string
  info: string
  infocode: string
  lives?: AmapLiveWeather[]
  forecasts?: AmapForecastWeather[]
}

export interface AmapLiveWeather {
  province: string
  city: string
  adcode: string
  weather: string
  temperature: string
  winddirection: string
  windpower: string
  humidity: string
  reporttime: string
  temperature_float: string
  humidity_float: string
}

export interface AmapForecastWeather {
  city: string
  adcode: string
  province: string
  reporttime: string
  casts: AmapWeatherCast[]
}

export interface AmapWeatherCast {
  date: string
  week: string
  dayweather: string
  nightweather: string
  daytemp: string
  nighttemp: string
  daywind: string
  nightwind: string
  daypower: string
  nightpower: string
  daytemp_float: string
  nighttemp_float: string
}

// AI分析服务类型定义
export interface AIAnalysisRequest {
  model: string
  weatherData: {
    current: AmapLiveWeather
    forecast: AmapWeatherCast[]
  }
  city: string
  requestTime: string
}

export interface AIAnalysisResponse {
  success?: boolean
  data: {
    choices: [{ message: { content: { responseContent: string } } }]
  }
  error?: string
}

export interface AIAnalysisData {
  clothingAdvice: string
  travelAdvice: string
  activityRecommendation: string
  healthTips: string
  summary: string
}

// 应用内部使用的天气数据类型
export interface WeatherData {
  current: {
    city: string
    weather: string
    temperature: number
    humidity: number
    winddirection: string
    windpower: string
    reporttime: string
  }
  forecast: AmapWeatherCast[]
  aiAnalysis?: AIAnalysisData
}

// 城市信息类型
export interface CityInfo {
  name: string
  adcode: string
  citycode: string
}

// API状态类型
export interface ApiState {
  loading: boolean
  error: string | null
  lastUpdate: string | null
}
