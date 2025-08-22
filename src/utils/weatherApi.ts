import axios from 'axios'
import type {
  AmapWeatherResponse,
  AIAnalysisRequest,
  AIAnalysisResponse,
  WeatherData,
  CityInfo,
} from '@/types/weather'
import { generateWeatherAnalysisPrompt } from './aiPrompts'

// 高德地图API配置
const AMAP_BASE_URL = 'https://restapi.amap.com/v3/weather'
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY

// AI服务配置
const AI_BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions'
const AI_API_KEY = 'sk-tjubpksskzjkyxflrrutglttbabplxqfyflmykxkoshizqqk'

// 创建axios实例
const amapApi = axios.create({
  baseURL: AMAP_BASE_URL,
  timeout: 10000,
})

const aiApi = axios.create({
  baseURL: AI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${AI_API_KEY}`,
  },
})

/**
 * 获取实时天气信息
 */
export async function getCurrentWeather(city: string): Promise<AmapWeatherResponse> {
  try {
    const response = await amapApi.get('/weatherInfo', {
      params: {
        key: AMAP_KEY,
        city: city,
        extensions: 'base',
      },
    })
    return response.data
  } catch (error) {
    console.error('获取实时天气失败:', error)
    throw new Error('获取实时天气信息失败，请检查网络连接')
  }
}

/**
 * 获取天气预报信息
 */
export async function getWeatherForecast(city: string): Promise<AmapWeatherResponse> {
  try {
    const response = await amapApi.get('/weatherInfo', {
      params: {
        key: AMAP_KEY,
        city: city,
        extensions: 'all',
      },
    })
    return response.data
  } catch (error) {
    console.error('获取天气预报失败:', error)
    throw new Error('获取天气预报信息失败，请检查网络连接')
  }
}

/**
 * 获取完整天气数据（实时+预报）
 */
export async function getCompleteWeatherData(city: string): Promise<WeatherData> {
  try {
    // 并行获取实时天气和预报数据
    const [currentResponse, forecastResponse] = await Promise.all([
      getCurrentWeather(city),
      getWeatherForecast(city),
    ])

    if (currentResponse.status !== '1' || forecastResponse.status !== '1') {
      throw new Error('天气API返回错误状态')
    }

    const currentWeather = currentResponse.lives?.[0]
    const forecastWeather = forecastResponse.forecasts?.[0]

    if (!currentWeather || !forecastWeather) {
      throw new Error('天气数据格式错误')
    }

    // 转换数据格式
    const weatherData: WeatherData = {
      current: {
        city: currentWeather.city,
        weather: currentWeather.weather,
        temperature: parseFloat(currentWeather.temperature_float || currentWeather.temperature),
        humidity: parseFloat(currentWeather.humidity_float || currentWeather.humidity),
        windDirection: currentWeather.winddirection,
        windPower: currentWeather.windpower,
        reportTime: currentWeather.reporttime,
      },
      forecast: forecastWeather.casts.map((cast) => ({
        date: cast.date,
        week: cast.week,
        dayWeather: cast.dayweather,
        nightWeather: cast.nightweather,
        dayTemp: parseFloat(cast.daytemp_float || cast.daytemp),
        nightTemp: parseFloat(cast.nighttemp_float || cast.nighttemp),
        dayWind: cast.daywind,
        nightWind: cast.nightwind,
      })),
    }

    return weatherData
  } catch (error) {
    console.error('获取完整天气数据失败:', error)
    throw error
  }
}

/**
 * 调用AI分析服务
 */
export async function getAIAnalysis({
  current,
  forecast,
}: WeatherData): Promise<AIAnalysisResponse> {
  try {
    const prompt = generateWeatherAnalysisPrompt({
      current: {
        province: '',
        city: current.city,
        adcode: '',
        weather: current.weather,
        temperature: current.temperature.toString(),
        winddirection: current.windDirection,
        windpower: current.windPower,
        humidity: current.humidity.toString(),
        reporttime: current.reportTime,
        temperature_float: current.temperature.toString(),
        humidity_float: current.humidity.toString(),
      },
      forecast: forecast.map((item) => ({
        date: item.date,
        week: item.week,
        dayweather: item.dayWeather,
        nightweather: item.nightWeather,
        daytemp: item.dayTemp.toString(),
        nighttemp: item.nightTemp.toString(),
        daywind: item.dayWind,
        nightwind: item.nightWind,
        daypower: '',
        nightpower: '',
        daytemp_float: item.dayTemp.toString(),
        nighttemp_float: item.nightTemp.toString(),
      })),
    })

    const requestData = {
      // model: 'gpt-5',
      model: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }

    const response = await aiApi.post('', requestData)
    console.log('response', response)

    return response.data
  } catch (error) {
    console.error('AI分析服务调用失败:', error)
    // 返回默认分析结果
    return {
      success: false,
      error: 'AI分析服务暂时不可用，请稍后重试',
    }
  }
}

// 预定义城市列表
export const CITIES: CityInfo[] = [
  { name: '西安市', adcode: '610100', citycode: '029' },
  { name: '北京市', adcode: '110000', citycode: '010' },
  { name: '上海市', adcode: '310000', citycode: '021' },
  { name: '广州市', adcode: '440100', citycode: '020' },
  { name: '深圳市', adcode: '440300', citycode: '0755' },
  { name: '杭州市', adcode: '330100', citycode: '0571' },
  { name: '成都市', adcode: '510100', citycode: '028' },
  { name: '重庆市', adcode: '500000', citycode: '023' },
]

// 数据缓存工具
const CACHE_KEY = 'weather_cache'
const CACHE_DURATION = 10 * 60 * 1000 // 10分钟

export function getCachedWeatherData(city: string): WeatherData | null {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}_${city}`)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(`${CACHE_KEY}_${city}`)
      return null
    }

    return data
  } catch {
    return null
  }
}

export function setCachedWeatherData(city: string, data: WeatherData): void {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(`${CACHE_KEY}_${city}`, JSON.stringify(cacheData))
  } catch (error) {
    console.warn('缓存天气数据失败:', error)
  }
}
