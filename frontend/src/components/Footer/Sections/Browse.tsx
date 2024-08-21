"use client"
import style from "../../../Styles/Footer.module.css"

const Browse = () => {
  return (
    <div className={style.browse}>
      <h4 className={style.BrowseTitle}>Browse</h4>
      <ul className={style.browseNav}>
          <li className={style.BrowseItem}>
            <a
              className={style.BrowseLink}
            >
              Home
            </a>
          </li>
          <li className={style.BrowseItem}>
            <a
              className={style.BrowseLink}
            >
              Personale
            </a>
          </li>
          <li className={style.BrowseItem}>
            <a
              className={style.BrowseLink}
            >
              Attivita
            </a>
          </li>
          <li className={style.BrowseItem}>
            <a
              className={style.BrowseItem}
            >
              Contattaci
            </a>
          </li>
        </ul>
    </div>
  );
}

export default Browse