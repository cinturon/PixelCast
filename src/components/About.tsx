import { RetroPanel } from "./RetroPanel";
import packageJson from "../../package.json";

type AboutProps = {
  onClose: () => void;
};

export const About = ({ onClose }: AboutProps) => {
  return (
    <div className="modal" role="presentation">
      <button
        type="button"
        className="modal__backdrop"
        aria-label="Close About"
        onClick={onClose}
      />
      <RetroPanel className="about-modal">
        <div
          className="about-modal__content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-modal-title"
        >
          <div className="about-modal__header">
            <h2 id="about-modal-title" className="ct-section-title">
              About
            </h2>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>

          <p className="about-modal__app-name">PixelCast</p>
          <p className="about-modal__version">Version {packageJson.version}</p>
          <p className="about-modal__tagline">Tomorrow&apos;s sky, yesterday&apos;s pixels.</p>
          <p className="about-modal__description">
            A desktop weather station with chunky typography and honest forecasts—current
            conditions, the week ahead, and optional rain when the API says so.
          </p>
          <p className="about-modal__link">
            <a
              href="https://github.com/cinturon/PixelCast"
              target="_blank"
              rel="noreferrer"
            >
              github.com/cinturon/PixelCast
            </a>
          </p>
          <p className="about-modal__link">
            <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
              Weather data by Open-Meteo.com
            </a>
          </p>  
          <p className="about-modal__copyright">© 2026 PixelCast</p>
        </div>
      </RetroPanel>
    </div>
  );
};
