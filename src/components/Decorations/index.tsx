import { t } from "../../libs/l10n"
import "./index.css"

export default function Decorations() {
  return (
    <>
      <div className="kef-sharecard-decoration-label">with</div>
      <i className="kef-sharecard-heart ti ti-heart-filled" />
      <div className="kef-sharecard-decoration-logo">{t("Orca Note")}</div>
      <div className="kef-sharecard-decoration-date">
        {new Date().toLocaleDateString()}
      </div>
    </>
  )
}
