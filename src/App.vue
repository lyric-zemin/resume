<script setup lang="ts">
import WordText from 'components/WordText/index.vue'
import StyleText from 'components/StyleText/index.vue'
import Footer from 'components/Footer/index.vue'
import { onMounted, ref } from 'vue'
import { delay } from '@/core/util'

const word = ref<any>(null)
const style = ref<any>(null)
const footer = ref<any>(null)

async function startAnimation() {
  try {
    await style.value.write(0)
    await word.value.write()
    await style.value.write(1)
    word.value.showWorkBox()
    await delay(2000)
    await style.value.write(2)
    footer.value.end()
  } catch (e) {
    if (e instanceof Error && e.message === 'SKIP IT') {
      surprisinglyShortAttentionSpan()
    } else {
      throw e
    }
  }
}

function surprisinglyShortAttentionSpan() {
  style.value.writeToEnd()
  word.value.showWorkBox()
  footer.value.end()
}

onMounted(startAnimation)

const styleTagEl = document.getElementById('style-tag') as HTMLStyleElement

function onStyleAppend(styleText: string) {
  styleTagEl.textContent += styleText
}
function onStyleOverwrite(styleText: string) {
  styleTagEl.textContent = styleText
}
</script>

<template>
  <StyleText
    ref="style"
    @styleAppend="onStyleAppend"
    @styleOverwrite="onStyleOverwrite"
  />
  <WordText ref="word" />
  <Footer ref="footer" />
</template>
