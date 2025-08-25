import type { AIAnalysisData, WeatherData } from '@/types/weather'

/**
 * 生成AI分析的优化提示词
 */
export function generateWeatherAnalysisPrompt(weatherData: WeatherData): {
  system: string
  user: string
} {
  const { current, forecast } = weatherData

  // 构建结构化的天气信息
  const weatherInfo = {
    current: {
      city: current.city,
      weather: current.weather,
      temperature: current.temperature,
      humidity: current.humidity,
      windpower: `${current.winddirection}风 ${current.windpower}级`,
      reporttime: current.reporttime,
    },
    forecast: forecast.slice(0, 3).map((day) => ({
      date: day.date,
      week: day.week,
      dayweather: day.dayweather,
      nightweather: day.nightweather,
      tempRange: `${day.nighttemp}°C ~ ${day.daytemp}°C`,
      wind: `白天${day.daywind}，夜间${day.nightwind}`,
    })),
  }

  const systemPrompt = `
你是一位专业的天气分析师和生活顾问，请基于用户提供的天气数据为用户提供个性化的生活建议。

## 分析要求
请从以下4个维度提供专业建议，每个维度控制在50-80字：

1. **穿衣建议**：根据温度、天气状况和风力，推荐合适的服装搭配
2. **出行建议**：基于天气条件，提供交通出行和时间安排建议
3. **活动推荐**：结合天气特点，推荐适合的室内外活动
4. **健康提示**：针对当前天气条件，提供健康防护建议

## 回复格式
请严格按照以下JSON格式回复：
{
  "clothingAdvice": "穿衣建议内容",
  "travelAdvice": "出行建议内容",
  "activityRecommendation": "活动推荐内容",
  "healthTips": "健康提示内容",
  "summary": "综合天气分析总结（100字以内）"
}

## 注意事项
- 建议要实用、具体、贴近生活
- 语言要亲切自然，避免过于专业的术语
- 考虑中国用户的生活习惯和文化背景
- 如遇极端天气，要特别强调安全提醒
`.trim()

  const userPrompt = `
## 天气数据
**当前天气（${weatherInfo.current.city}）：**
- 天气状况：${weatherInfo.current.weather}
- 温度：${weatherInfo.current.temperature}°C
- 湿度：${weatherInfo.current.humidity}%
- 风力：${weatherInfo.current.windpower}
- 更新时间：${weatherInfo.current.reporttime}

**未来3天预报：**
${weatherInfo.forecast
  .map((day) => `- ${day.date}（${day.week}）：${day.dayweather}转${day.nightweather}，${day.wind}`)
  .join('\n')}
`.trim()

  return {
    system: systemPrompt,
    user: userPrompt,
  }
}

/**
 * 从纯文本响应中提取建议内容
 */
function parseTextResponse(text: string): AIAnalysisData {
  const defaultResponse = {
    clothingAdvice: '建议根据当前温度选择合适的服装，注意保暖或防晒。',
    travelAdvice: '出行前请关注天气变化，合理安排出行时间。',
    activityRecommendation: '可根据天气情况选择适合的室内外活动。',
    healthTips: '请注意天气变化对健康的影响，做好相应防护。',
    summary: '请关注天气变化，合理安排生活和出行。',
  }

  // 尝试从文本中提取关键信息
  const sections = text.split(/[。！？\n]/).filter((s) => s.trim())

  if (sections.length >= 4) {
    return {
      clothingAdvice: sections[0]?.trim() || defaultResponse.clothingAdvice,
      travelAdvice: sections[1]?.trim() || defaultResponse.travelAdvice,
      activityRecommendation: sections[2]?.trim() || defaultResponse.activityRecommendation,
      healthTips: sections[3]?.trim() || defaultResponse.healthTips,
      summary: sections.slice(4).join('。') || defaultResponse.summary,
    }
  }

  return defaultResponse
}

/**
 * 解析AI响应文本，提取JSON数据
 */
export function parseAIResponse(responseText: string): AIAnalysisData {
  try {
    // 尝试直接解析JSON
    return JSON.parse(responseText)
  } catch {
    // 如果直接解析失败，尝试提取JSON部分
    const start = responseText.indexOf('{')
    const end = responseText.lastIndexOf('}')
    try {
      const jsonStr = responseText.slice(start, end + 1)
      return JSON.parse(jsonStr)
    } catch (err) {
      console.error('解析 JSON 出错:', err)
      // 如果仍然失败，返回默认结构
      return parseTextResponse(responseText)
    }
  }
}

/**
 * 生成天气图标映射
 */
export function getWeatherIcon(weather: string): string {
  const iconMap: Record<string, string> = {
    晴: '☀️',
    多云: '⛅',
    阴: '☁️',
    小雨: '🌦️',
    中雨: '🌧️',
    大雨: '⛈️',
    暴雨: '🌩️',
    雷阵雨: '⛈️',
    小雪: '🌨️',
    中雪: '❄️',
    大雪: '🌨️',
    雾: '🌫️',
    霾: '😷',
    沙尘暴: '🌪️',
  }

  // 使用数组的find方法替代for...of循环
  const foundKey = Object.keys(iconMap).find((key) => weather.includes(key))
  return foundKey ? iconMap[foundKey] : '🌤️' // 默认图标
}

/**
 * 格式化温度显示
 */
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`
}

/**
 * 格式化日期显示
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return '今天'
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return '明天'
  }
  return `${date.getMonth() + 1}/${date.getDate()}`
}
