import Decorations from "./components/Decorations"
import { setupL10N, t } from "./libs/l10n"
import { DbId } from "./orca"
import zhCN from "./translations/zhCN"

const { subscribe } = window.Valtio
const { createRoot } = window
const { MenuText } = orca.components

const WIDTH = 390

let pluginName: string

export async function load(_name: string) {
  pluginName = _name

  // Your plugin code goes here.
  setupL10N(orca.state.locale, { "zh-CN": zhCN })

  const key = `${pluginName}.exporting`
  const isExporting = localStorage.getItem(key)
  if (isExporting) {
    setupCard()
  }

  if (orca.state.blockMenuCommands[`${pluginName}.exportShareCard`] == null) {
    orca.blockMenuCommands.registerBlockMenuCommand(
      `${pluginName}.exportShareCard`,
      {
        worksOnMultipleBlocks: false,
        render(blockId, _rootBlockId, close) {
          return (
            <MenuText
              title={t("Export share card")}
              preIcon="ti ti-photo-share"
              onClick={() => {
                close()
                exportShareCard(blockId)
              }}
            />
          )
        },
      },
    )
  }

  console.log(`${pluginName} loaded.`)
}

export async function unload() {
  // Clean up any resources used by the plugin here.
  orca.blockMenuCommands.unregisterBlockMenuCommand(
    `${pluginName}.exportShareCard`,
  )

  console.log(`${pluginName} unloaded.`)
}

async function exportShareCard(blockId: DbId) {
  const key = `${pluginName}.exporting`
  localStorage.setItem(key, "1")
  try {
    await orca.invokeBackend("export-png", blockId, WIDTH, true)
  } finally {
    localStorage.removeItem(key)
  }
}

function setupCard() {
  document.documentElement.classList.add(`kef-sharecard`)
  orca.themes.injectCSSResource(`${pluginName}/dist/styles.css`, pluginName)

  const panel = orca.nav.findViewPanel(
    orca.state.activePanel,
    orca.state.panels,
  )
  if (panel == null) return

  const unsubscribe = subscribe(panel, async () => {
    if (panel.view === "block") {
      unsubscribe()

      setTimeout(() => {
        // Give long-form style
        const rootBlock = document.querySelector(
          ".orca-block-editor-blocks>.orca-block",
        ) as HTMLElement | undefined
        if (rootBlock) {
          rootBlock.classList.add("orca-long-form")
        }

        // Move tags
        const editorMain = document.querySelector(".orca-block-editor-main") as
          | HTMLElement
          | undefined
        if (editorMain) {
          const tags = document.querySelectorAll(
            ".orca-panel.active>.orca-hideable:not(.orca-hideable-hidden) .orca-tags",
          )
          for (const tag of tags) {
            editorMain.appendChild(tag)
          }
        }

        const blockEditor = document.querySelector(".orca-block-editor") as
          | HTMLElement
          | undefined
        if (blockEditor) {
          // Inject elements
          const decorations = document.createElement("div")
          decorations.className = "kef-sharecard-decorations"
          const root = createRoot(decorations)
          root.render(<Decorations />)
          blockEditor.appendChild(decorations)
        }
      }, 100)
    }
  })
}
