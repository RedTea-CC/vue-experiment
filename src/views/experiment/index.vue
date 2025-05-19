<script setup lang="ts">
defineOptions({ name: 'ExperimentIndex' })
// defineProps 示例
const props = defineProps<{
  msg: string
  count?: number
}>()

// defineEmits 示例
const emit = defineEmits<{
  (e: 'increment', value: number): void
  (e: 'reset'): void
}>()

// defineModel 示例（Vue 3.4+）
const modelValue = defineModel<string | number>()

function handleIncrement() {
  emit('increment', (props.count ?? 0) + 1)
}
function handleReset() {
  emit('reset')
}
</script>

<template>
  <main>
    <h3>defineProps 示例</h3>
    <div>msg: {{ props.msg }}</div>
    <div>count: {{ props.count }}</div>

    <h3>defineEmits 示例</h3>
    <button @click="handleIncrement">触发 increment</button>
    <button @click="handleReset">触发 reset</button>

    <h3>defineModel 示例</h3>
    <input v-model="modelValue" placeholder="通过 defineModel 绑定" />
    <div>modelValue: {{ modelValue }}</div>
  </main>
</template>
