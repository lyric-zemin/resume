<template>
  <pre id="style-text" contenteditable v-html="text" ref="el"></pre>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'
import { handleChar } from '@/core/util'
import useWrite from '@/core/useWrite'

import style0 from './styles0.css?inline'
import style1 from './styles1.css?inline'
import style2 from './styles2.css?inline'

const styleText = [style0, style1, style2]

const { writeTo, speed, text } = useWrite()

const el = ref<HTMLDivElement>()
const ctx = getCurrentInstance()

async function write(index: number) {
  await writeTo(el.value!, styleText[index], 0, speed.value, true, 1)
}

function writeToEnd() {
  let txt = styleText.join('\n')

  let styleHTML = ''
  for (let i = 0; i < txt.length; i++) {
    styleHTML = handleChar(styleHTML, txt[i])
  }
  text.value = styleHTML
  ctx?.emit('styleOverwrite', '#work-text * {transition: none; }' + txt)
}

defineExpose({ write, writeToEnd })
</script>
