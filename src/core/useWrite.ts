import { getCurrentInstance, ref, unref } from 'vue'
import { handleChar, delay } from '@/core/util'
import useState from './useState'

const endOfSentence = /[？！。~：]$/
const comma = /\D[，；、]$/
const endOfBlock = /[^/]\n\n$/
const debug = import.meta.env.DEV

export default function () {
  const text = ref('')
  const speed = ref(debug ? 0 : 16)
  const styleBuffer = ref('')

  const { paused, animationSkipped } = useState()

  const ctx = getCurrentInstance()

  async function writeTo(
    el: HTMLDivElement,
    message: string,
    index: number,
    interval: number,
    mirrorToStyle: boolean,
    charsPerInterval: number
  ): Promise<void> {
    if (unref(animationSkipped)) {
      throw new Error('SKIP IT')
    }
    let chars = message.slice(index, index + charsPerInterval)
    index += charsPerInterval

    el.scrollTop = el.scrollHeight

    if (mirrorToStyle) {
      writeChar(chars)
    } else {
      writeSimpleChar(chars)
    }

    if (index < message.length) {
      let thisInterval = interval
      let thisSlice = message.slice(index - 2, index)
      if (comma.test(thisSlice)) {
        thisInterval = interval * 30
      }
      if (endOfSentence.test(thisSlice)) {
        thisInterval = interval * 70
      }
      thisSlice = message.slice(index - 2, index + 1)
      if (endOfBlock.test(thisSlice)) {
        thisInterval = interval * 50
      }

      do {
        await delay(thisInterval)
      } while (unref(paused))

      return writeTo(
        el,
        message,
        index,
        interval,
        mirrorToStyle,
        charsPerInterval
      )
    }
  }

  function writeChar(char: string) {
    text.value = handleChar(text.value, char)
    styleBuffer.value += char
    if (char === ';') {
      ctx?.emit('styleAppend', styleBuffer.value)
      styleBuffer.value = ''
    }
  }

  function writeSimpleChar(char: string) {
    text.value += char
  }

  return {
    text,
    styleBuffer,
    speed,
    writeTo
  }
}
