<template>
  <div class="forecast-card">
    <h3 class="card-title">
      <span class="title-icon">📅</span>
      未来天气预报
    </h3>
    <div class="forecast-list">
      <div 
        v-for="day in forecastData" 
        :key="day.date"
        class="forecast-item"
      >
        <div class="forecast-date">
          {{ formatDate(day.date) }}
          <span class="forecast-week">{{ day.week }}</span>
        </div>
        <div class="forecast-weather">
          <div class="forecast-icon">{{ getWeatherIcon(day.dayWeather) }}</div>
          <div class="forecast-desc">
            <span class="day-weather">{{ day.dayWeather }}</span>
            <span v-if="day.dayWeather !== day.nightWeather" class="night-weather">
              转{{ day.nightWeather }}
            </span>
          </div>
        </div>
        <div class="forecast-temp">
          <span class="temp-high">{{ formatTemperature(day.dayTemp) }}</span>
          <span class="temp-divider">/</span>
          <span class="temp-low">{{ formatTemperature(day.nightTemp) }}</span>
        </div>
        <div class="forecast-wind">{{ day.dayWind }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getWeatherIcon, formatTemperature, formatDate } from '@/utils/aiPrompts'
import type { WeatherData } from '@/types/weather'

interface Props {
  weatherData: WeatherData
  maxDays?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDays: 4
})

// 计算属性 - 限制显示的天数
const forecastData = computed(() => {
  return props.weatherData.forecast.slice(0, props.maxDays)
})
</script>

<style scoped>
.forecast-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 25px;
}

.title-icon {
  font-size: 1.8rem;
}

.forecast-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.forecast-item {
  background: rgba(116, 185, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(116, 185, 255, 0.2);
  transition: all 0.3s ease;
}

.forecast-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.forecast-date {
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.forecast-week {
  font-size: 0.9rem;
  color: #636e72;
  font-weight: 400;
}

.forecast-weather {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.forecast-icon {
  font-size: 2rem;
}

.forecast-desc {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.day-weather {
  font-weight: 500;
  color: #2d3436;
}

.night-weather {
  font-size: 0.9rem;
  color: #636e72;
}

.forecast-temp {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.temp-high {
  font-weight: 600;
  color: #e17055;
}

.temp-divider {
  color: #b2bec3;
}

.temp-low {
  font-weight: 500;
  color: #74b9ff;
}

.forecast-wind {
  font-size: 0.9rem;
  color: #636e72;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .forecast-list {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .forecast-item {
    padding: 15px;
  }
  
  .card-title {
    font-size: 1.3rem;
  }
  
  .forecast-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .forecast-list {
    grid-template-columns: 1fr;
  }
  
  .forecast-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    gap: 10px;
    align-items: center;
  }
  
  .forecast-date {
    grid-column: 1;
    grid-row: 1;
    margin-bottom: 0;
  }
  
  .forecast-weather {
    grid-column: 2;
    grid-row: 1;
    margin-bottom: 0;
    justify-self: center;
  }
  
  .forecast-temp {
    grid-column: 3;
    grid-row: 1;
    margin-bottom: 0;
    justify-self: end;
  }
  
  .forecast-wind {
    grid-column: 1 / -1;
    grid-row: 2;
    text-align: center;
    padding-top: 10px;
    border-top: 1px solid rgba(116, 185, 255, 0.2);
  }
}
</style>
