<script setup lang="ts">
import { defineModel, defineProps, defineEmits } from 'vue'

defineOptions({ name: 'SonComponent' })

// defineModel - 接收父组件v-model值
const modelValue = defineModel<string | number>()

// defineProps：3.5版本可以直接解构
const { label } = defineProps<{
  label: string
}>()

// defineEmits - 定义子组件事件
const emit = defineEmits<{
  (e: 'child-change', value: string | number): void
}>()

const handleEmit = (event: Event) => {
  emit('child-change', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div>
    <h3>子组件</h3>
    <!-- 显示传递的label prop -->
    <h4>prop:{{ label }}</h4>
    <input
      :value="label"
      @change="$emit('child-change', ($event.target as HTMLInputElement).value)"
      placeholder="子组件输入框"
    />
    <input :value="label" @change="handleEmit" placeholder="子组件输入框" />

    <h4>modelValue:{{ label }}</h4>
    <!-- 双向绑定modelValue并触发事件 -->
    <input v-model="modelValue" placeholder="子组件输入框" />
  </div>
</template>
