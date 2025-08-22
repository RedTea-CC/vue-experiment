<template>
  <div class="current-weather-card">
    <div class="current-header">
      <div class="current-location">
        <span class="location-icon">📍</span>
        {{ weatherData.current.city }}
      </div>
      <div class="current-time">
        更新时间：{{ formatUpdateTime(weatherData.current.reporttime) }}
        <button
          @click="$emit('refresh')"
          class="refresh-button"
          :class="{ stale: isDataStale }"
          title="刷新数据"
        >
          🔄
        </button>
      </div>
    </div>

    <div class="current-main">
      <div class="current-temp-section">
        <div class="weather-icon">{{ currentWeatherIcon }}</div>
        <div class="temperature">{{ formattedCurrentTemp }}</div>
        <div class="weather-desc">{{ weatherData.current.weather }}</div>
      </div>

      <div class="current-details">
        <div class="detail-item">
          <span class="detail-label">湿度</span>
          <span class="detail-value">{{ weatherData.current.humidity }}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">风力</span>
          <span class="detail-value"
            >{{ weatherData.current.winddirection }}风 {{ weatherData.current.windpower }}级</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getWeatherIcon, formatTemperature } from '@/utils/aiPrompts'
import type { WeatherData } from '@/types/weather'

interface Props {
  weatherData: WeatherData
  lastUpdate?: string | null
}

interface Emits {
  refresh: []
}

const props = defineProps<Props>()
defineEmits<Emits>()

// 计算属性
const currentWeatherIcon = computed(() => {
  return getWeatherIcon(props.weatherData.current.weather)
})

const formattedCurrentTemp = computed(() => {
  return formatTemperature(props.weatherData.current.temperature)
})

const isDataStale = computed(() => {
  if (!props.lastUpdate) return true
  const updateTime = new Date(props.lastUpdate)
  const now = new Date()
  return now.getTime() - updateTime.getTime() > 10 * 60 * 1000 // 10分钟
})

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
</script>

<style scoped>
.current-weather-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.current-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.current-location {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3436;
}

.location-icon {
  font-size: 1.5rem;
}

.current-time {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #636e72;
}

.refresh-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.refresh-button:hover {
  background: rgba(116, 185, 255, 0.1);
  transform: rotate(180deg);
}

.refresh-button.stale {
  color: #e17055;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.current-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: center;
}

.current-temp-section {
  text-align: center;
}

.weather-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}

.temperature {
  font-size: 3.5rem;
  font-weight: 700;
  color: #2d3436;
  margin-bottom: 10px;
}

.weather-desc {
  font-size: 1.3rem;
  color: #636e72;
  font-weight: 500;
}

.current-details {
  display: grid;
  gap: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(116, 185, 255, 0.1);
  border-radius: 12px;
  border-left: 4px solid #74b9ff;
}

.detail-label {
  font-weight: 600;
  color: #2d3436;
}

.detail-value {
  font-weight: 500;
  color: #636e72;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .current-main {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .current-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .temperature {
    font-size: 2.5rem;
  }

  .weather-icon {
    font-size: 3rem;
  }
}
</style>
