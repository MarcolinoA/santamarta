import React from "react";
import styles from "../../Styles/Footer.module.css"

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerSection}>
        <div className={styles.contact}>
          <h4>Contact</h4>
          <p>Street: 2017 Harron Drive</p>
          <p>City: Baltimore</p>
          <p>State: Maryland</p>
          <p>Zip Code: 21201</p>
          <p>Phone Number: 443-498-7166</p>
          <p>Mobile Number: 443-994-9384</p>
        </div>
        <div className={styles.menu}>
          <h4>Menu</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Books</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Courses</a></li>
            <li><a href="#">Our Blog</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>
        <div className={styles.recentPosts}>
          <h4>Recent Posts</h4>
          <ul>
            <li><a href="#">Breaking Down Barriers</a></li>
            <li><a href="#">A Celebration of Success</a></li>
            <li><a href="#">A World of Opportunities</a></li>
          </ul>
        </div>
        <div className={styles.newsletter}>
          <h4>Newsletter</h4>
          <form>
            <input type="email" placeholder="Your email address" />
            <button type="submit">Sign Up</button>
          </form>
          <div className={styles.socialIcons}>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-google"></i></a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© footer bottom</p>
      </div>
    </footer>
  );
};

export default Footer;
