<template>
  <div>
    <button @click="startCounter">开始计数</button>
    <button @click="stopCounter" :disabled="!isRunning">停止计数</button>
    <p>计数器: {{ counter }}</p>
    <p>计算值: {{ doubled }}</p>
    <p v-if="isRunning">作用域状态: 运行中</p>
    <p v-else>作用域状态: 已停止</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, effectScope, watch, onScopeDispose, EffectScope } from 'vue'

const counter = ref(0)
const isRunning = ref(false)
let scope: EffectScope | null = null
const doubled = ref(0)

// 开始计数器
const startCounter = () => {
  if (scope) scope.stop()

  scope = effectScope()
  scope.run(() => {
    const interval = setInterval(() => {
      counter.value++
    }, 1000)

    const doubledComputed = computed(() => counter.value * 2)
    watch(
      doubledComputed,
      (val) => {
        doubled.value = val
      },
      { immediate: true },
    )

    watch(counter, (newValue) => {
      console.log('计数器更新为:', newValue)
    })

    isRunning.value = true

    // 正确的清理方式
    onScopeDispose(() => {
      clearInterval(interval)
      isRunning.value = false
      console.log('作用域已停止')
    })
  })
}

// 停止计数器
const stopCounter = () => {
  if (scope) {
    scope.stop()
    scope = null
  }
}
</script>
