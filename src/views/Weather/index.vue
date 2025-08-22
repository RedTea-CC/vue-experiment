<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  getCompleteWeatherData,
  getAIAnalysis,
  getCachedWeatherData,
  setCachedWeatherData,
  CITIES,
} from '@/utils/weatherApi'
import CurrentWeather from '@/components/Weather/CurrentWeather.vue'
import WeatherForecast from '@/components/Weather/WeatherForecast.vue'
import AIAnalysis from '@/components/Weather/AIAnalysis.vue'
import type { WeatherData, ApiState, CityInfo } from '@/types/weather'
import { parseAIResponse } from '@/utils/aiPrompts'

// 响应式数据
const weatherData = ref<WeatherData | null>(null)
const currentCity = ref<CityInfo>(CITIES[0]) // 默认西安市
const apiState = reactive<ApiState>({
  loading: false,
  error: null,
  lastUpdate: null,
})

const aiAnalysisState = reactive({
  loading: false,
  error: null as string | null,
})
// 计算属性已移至子组件中

/**
 * 获取天气数据
 */
async function fetchWeatherData(useCache = true) {
  try {
    apiState.loading = true
    apiState.error = null

    // 尝试从缓存获取数据
    if (useCache) {
      const cached = getCachedWeatherData(currentCity.value.adcode)
      if (cached) {
        weatherData.value = cached
        apiState.lastUpdate = new Date().toISOString()
        apiState.loading = false
        return
      }
    }

    // 获取天气数据
    const data = await getCompleteWeatherData(currentCity.value.adcode)

    weatherData.value = data
    apiState.lastUpdate = new Date().toISOString()

    // 缓存数据
    setCachedWeatherData(currentCity.value.adcode, data)
  } catch (error) {
    console.error('获取天气数据失败:', error)
    apiState.error = error instanceof Error ? error.message : '获取天气数据失败'
  } finally {
    apiState.loading = false
  }
}

/**
 * 刷新天气数据
 */
function refreshWeather() {
  fetchWeatherData(false)
}

/**
 * 切换城市
 */
function changeCity(city: CityInfo) {
  if (city.adcode === currentCity.value.adcode) return

  currentCity.value = city
  weatherData.value = null
  fetchWeatherData()
}

/**
 * 手动获取AI分析
 */
async function getAIAnalysisManually() {
  if (!weatherData.value) return

  try {
    aiAnalysisState.loading = true
    aiAnalysisState.error = null
    const aiResponse = await getAIAnalysis(weatherData.value)
    const responseContent = aiResponse.choices[0].message.content

    weatherData.value.aiAnalysis = parseAIResponse(responseContent)
  } catch (error) {
    console.error('AI分析获取失败:', error)
    aiAnalysisState.error = error instanceof Error ? error.message : 'AI分析失败'

    // 提供默认AI建议
    weatherData.value.aiAnalysis = {
      clothingAdvice: '建议根据当前温度选择合适的服装，注意保暖或防晒。',
      travelAdvice: '出行前请关注天气变化，合理安排出行时间。',
      activityRecommendation: '可根据天气情况选择适合的室内外活动。',
      healthTips: '请注意天气变化对健康的影响，做好相应防护。',
      summary: '请关注天气变化，合理安排生活和出行。',
    }
  } finally {
    aiAnalysisState.loading = false
  }
}
/**
 * 格式化更新时间
 */
function formatUpdateTime(timeStr: string): string {
  const time = new Date(timeStr)
  return time.toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 组件挂载时获取数据
onMounted(() => {
  console.log('onMounted')

  fetchWeatherData()
})
</script>

<template>
  <main class="weather-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">🌤️</span>
        天气AI分析助手
      </h1>
      <p class="page-subtitle">智能天气分析，贴心生活建议</p>
    </div>

    <!-- 城市选择器 -->
    <div class="city-selector">
      <label class="selector-label">选择城市：</label>
      <select
        v-model="currentCity"
        @change="changeCity(currentCity)"
        class="city-select"
        :disabled="apiState.loading"
      >
        <option v-for="city in CITIES" :key="city.adcode" :value="city">
          {{ city.name }}
        </option>
      </select>
    </div>

    <!-- 加载状态 -->
    <div v-if="apiState.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在获取天气数据...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="apiState.error" class="error-container">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ apiState.error }}</p>
      <button @click="refreshWeather" class="retry-button">重试</button>
    </div>

    <!-- 天气数据展示 -->
    <div v-else-if="weatherData" class="weather-content">
      <!-- 当前天气组件 -->
      <CurrentWeather
        :weather-data="weatherData"
        :last-update="apiState.lastUpdate"
        @refresh="refreshWeather"
      />

      <!-- 天气预报组件 -->
      <WeatherForecast :weather-data="weatherData" :max-days="4" />

      <!-- AI分析按钮和组件 -->
      <div class="ai-analysis-section">
        <div v-if="!weatherData.aiAnalysis" class="ai-analysis-trigger">
          <h3 class="trigger-title">
            <span class="title-icon">🤖</span>
            AI智能分析
          </h3>
          <p class="trigger-description">
            获取基于当前天气的个性化建议，包括穿衣、出行、活动和健康提示
          </p>
          <button
            @click="getAIAnalysisManually"
            :disabled="aiAnalysisState.loading"
            class="ai-trigger-button"
          >
            <span v-if="aiAnalysisState.loading" class="button-loading">
              <span class="loading-spinner-small"></span>
              分析中...
            </span>
            <span v-else> 🧠 开始AI分析 </span>
          </button>
          <p v-if="aiAnalysisState.error" class="ai-error">
            {{ aiAnalysisState.error }}
          </p>
        </div>

        <AIAnalysis v-if="weatherData.aiAnalysis" :ai-analysis="weatherData.aiAnalysis" />

        <button
          v-if="weatherData.aiAnalysis"
          @click="getAIAnalysisManually"
          :disabled="aiAnalysisState.loading"
          class="ai-refresh-button"
        >
          <span v-if="aiAnalysisState.loading">
            <span class="loading-spinner-small"></span>
            重新分析中...
          </span>
          <span v-else> 🔄 重新分析 </span>
        </button>
      </div>

      <!-- 数据来源说明 -->
      <div class="data-source">
        <p class="source-text">
          <span class="source-icon">ℹ️</span>
          数据来源：高德地图天气API | AI分析：智能助手
        </p>
        <p v-if="apiState.lastUpdate" class="last-update">
          最后更新：{{ formatUpdateTime(apiState.lastUpdate) }}
        </p>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">🌤️</div>
      <p class="empty-text">暂无天气数据</p>
      <button @click="() => fetchWeatherData()" class="load-button">获取天气数据</button>
    </div>
  </main>
</template>

<style scoped>
@import './index.css';

/* 数据来源说明 */
.data-source {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.source-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #636e72;
  margin-bottom: 8px;
}

.source-icon {
  font-size: 1.1rem;
}

.last-update {
  font-size: 0.85rem;
  color: #b2bec3;
  margin: 0;
}
</style>
