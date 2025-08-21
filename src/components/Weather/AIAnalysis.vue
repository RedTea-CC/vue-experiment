<template>
  <div class="ai-analysis-card">
    <h3 class="card-title">
      <span class="title-icon">🤖</span>
      AI智能建议
    </h3>
    
    <div class="analysis-summary">
      <p class="summary-text">{{ aiAnalysis.summary }}</p>
    </div>

    <div class="analysis-grid">
      <div class="analysis-item">
        <div class="analysis-header">
          <span class="analysis-icon">👔</span>
          <span class="analysis-title">穿衣建议</span>
        </div>
        <p class="analysis-content">{{ aiAnalysis.clothingAdvice }}</p>
      </div>

      <div class="analysis-item">
        <div class="analysis-header">
          <span class="analysis-icon">🚗</span>
          <span class="analysis-title">出行建议</span>
        </div>
        <p class="analysis-content">{{ aiAnalysis.travelAdvice }}</p>
      </div>

      <div class="analysis-item">
        <div class="analysis-header">
          <span class="analysis-icon">🎯</span>
          <span class="analysis-title">活动推荐</span>
        </div>
        <p class="analysis-content">{{ aiAnalysis.activityRecommendation }}</p>
      </div>

      <div class="analysis-item">
        <div class="analysis-header">
          <span class="analysis-icon">💊</span>
          <span class="analysis-title">健康提示</span>
        </div>
        <p class="analysis-content">{{ aiAnalysis.healthTips }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AIAnalysisData {
  clothingAdvice: string
  travelAdvice: string
  activityRecommendation: string
  healthTips: string
  summary: string
}

interface Props {
  aiAnalysis: AIAnalysisData
}

defineProps<Props>()
</script>

<style scoped>
.ai-analysis-card {
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

.analysis-summary {
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 25px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.analysis-summary::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.summary-text {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.analysis-item {
  background: rgba(116, 185, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(116, 185, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.analysis-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: rgba(116, 185, 255, 0.4);
}

.analysis-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #74b9ff, #0984e3);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.analysis-item:hover::before {
  transform: scaleX(1);
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.analysis-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(116, 185, 255, 0.1);
  border-radius: 10px;
}

.analysis-title {
  font-weight: 600;
  color: #2d3436;
  font-size: 1.1rem;
}

.analysis-content {
  color: #636e72;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .analysis-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .analysis-item {
    padding: 15px;
  }
  
  .card-title {
    font-size: 1.3rem;
  }
  
  .analysis-summary {
    padding: 15px;
  }
  
  .summary-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .ai-analysis-card {
    padding: 20px;
  }
  
  .analysis-header {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .analysis-icon {
    margin: 0 auto;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .ai-analysis-card {
    background: rgba(45, 52, 54, 0.95);
    color: #ddd;
  }
  
  .card-title {
    color: #ddd;
  }
  
  .analysis-item {
    background: rgba(116, 185, 255, 0.1);
    border-color: rgba(116, 185, 255, 0.3);
  }
  
  .analysis-title {
    color: #ddd;
  }
  
  .analysis-content {
    color: #b2bec3;
  }
}
</style>
