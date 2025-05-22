<script setup lang="ts">
import { defineModel, ref } from 'vue'
import SonComponent from './son.vue'

defineOptions({ name: 'ExperimentIndex' })

const childProps = ref('父组件传递的标签')

const handleChildChange = (value: string | number) => {
  console.log('子组件传递的值', value)
  childProps.value = value
}

// defineModel - 双向绑定基础值
const modelValue = defineModel<string | number>()
</script>
<template>
  <main>
    <!-- 使用传递的title prop -->
    <h3>父组件</h3>

    <!-- 绑定modelValue并触发自定义事件 -->
    <input v-model="modelValue" placeholder="通过 defineModel 绑定" />

    <!-- 监听子组件事件 -->
    <SonComponent v-model="modelValue" :label="childProps" @child-change="handleChildChange" />
  </main>
</template>
