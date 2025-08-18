import { setupL10N } from "./libs/l10n"
import zhCN from "./translations/zhCN"

let pluginName: string

export async function load(_name: string) {
  pluginName = _name

  // Your plugin code goes here.
  setupL10N(orca.state.locale, { "zh-CN": zhCN })

  console.log(`${pluginName} loaded.`)
}

export async function unload() {
  // Clean up any resources used by the plugin here.

  console.log(`${pluginName} unloaded.`)
}
