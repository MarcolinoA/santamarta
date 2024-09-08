"use client"
import style from "../../../../Styles/Footer.module.css"

const Contact = () => {
  return (
    <div className={style.contact}>
      <h4 className={style.contactTitle}>Contatti</h4>
      <p className={style.address}>Corso Italia, 257, 73040 Specchia LE</p>
      <hr className={style.hr}/>

      <div className={style.mapsField}>
        <div className={style.mapsIcon}>
    Icon
        </div>
        <div className={style.mapsDiv}>
          <a
            className={style.mapsLink}
            href="https://www.google.com/maps/place/A.S.R.C.+SPORT+%26+FITNESS+CENTER/@39.9429617,18.293594,19z/data=!4m15!1m8!3m7!1s0x13440e5a62d58585:0xe04eb7b18cb31809!2s73040+Specchia+LE!3b1!8m2!3d39.9411672!4d18.2999958!16zL20vMGZfbWNk!3m5!1s0x13440fcad9261467:0xef7cc9440b1ea739!8m2!3d39.9433979!4d18.2940054!16s%2Fg%2F11t4x3y8nx?entry=ttu"
          >
            A.S.R.C. SPORT & FITNESS CENTER
          </a>
        </div>
      </div>

      <div className={style.phoneField}>
        <div className={style.phoneIcon}>
          Icon
        </div>
        <div className={style.phoneDiv}>
          <a className={style.phoneLink} href="tel:3358285510">
            3358285510
          </a>
        </div>
      </div>

      <div className={style.emailField}>
        <div className={style.emailIcon}>
          Icon
        </div>
        <div className={style.emailDiv}>
          <a className={style.emailLink} href="mailto:provapalestra@gmail.com">
            provapalestra@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;