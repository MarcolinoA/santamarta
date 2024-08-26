import style from "../../Styles/Footer.module.css";
import Contact from "./Sections/Contact";
import Browse from "./Sections/Browse";
import Info from "./Sections/Info";

const Footer = () => {
  return (
    <footer>
      <div className={style.waveContainer}>
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#FDD040"
            fillOpacity="1"
            d="M0,128L48,112C96,96,192,64,288,90.7C384,117,480,203,576,218.7C672,235,768,181,864,154.7C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
        <div className={style.footerContainer}>
          <div className={style.firstSection}>
          <Info />
          </div>

        <div className={style.secondSection}>
          <Browse />
        </div>

        <div className={style.thirdSection}>
          <Contact />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
