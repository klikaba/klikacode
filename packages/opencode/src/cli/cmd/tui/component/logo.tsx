import { TextAttributes } from "@opentui/core"
import { For } from "solid-js"
import { useTheme } from "@tui/context/theme"

const K = ["██  ██", "██ ██ ", "████  ", "██ ██ ", "██  ██"]
const L = ["██   ", "██   ", "██   ", "██   ", "█████"]
const I = ["██", "██", "██", "██", "██"]
const A = ["  ████  ", " ██  ██ ", " ██████ ", " ██  ██ ", " ██  ██ "]
const C = [" ████ ", "██    ", "██    ", "██    ", " ████ "]
const O = [" ████ ", "██  ██", "██  ██", "██  ██", " ████ "]
const D = ["████  ", "██ ██ ", "██  ██", "██ ██ ", "████  "]
const E = ["█████", "██   ", "████ ", "██   ", "█████"]

const LOGO_LEFT = K.map((_line, index) => `${K[index]} ${L[index]} ${I[index]} ${K[index]}`)
const LOGO_RIGHT = A
const CODE = C.map(
  (_line, index) => `${C[index]} ${O[index]} ${D[index]} ${E[index]}`,
)

export function Logo() {
  const { theme } = useTheme()
  return (
    <box>
      <For each={LOGO_LEFT}>
        {(line, index) => (
          <box flexDirection="row" gap={1}>
            <text fg={theme.textMuted} selectable={false}>
              {line}
            </text>
            <text fg={theme.primary} attributes={TextAttributes.BOLD} selectable={false}>
              {LOGO_RIGHT[index()]}
            </text>
          </box>
        )}
      </For>
      <box height={1} />
      <For each={CODE}>
        {(line) => (
          <box flexDirection="row" justifyContent="center">
            <text fg={theme.textMuted} attributes={TextAttributes.BOLD} selectable={false}>
              {line}
            </text>
          </box>
        )}
      </For>
    </box>
  )
}
