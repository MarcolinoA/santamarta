import React from "react";
import styles from "../../Styles/Footer.module.css";
import { Fjalla_One } from "next/font/google";

const fjalla = Fjalla_One({
  subsets: ["latin"],
  weight: "400",
});

const Footer: React.FC = () => {
	return (
		<footer className={`${styles.footer} ${fjalla.className}`}>
			<div className={styles.footerSection}>
				<div className={styles.contact}>
					<h4>Contact</h4>
					<p>Via Paganico, 29</p>
					<p>Velletri, RM</p>
					<p>00049</p>
					<p>+39 06 962 00 55</p>
					<p>info[at]santamartavelletri.it</p>
				</div>
				<div className={styles.menu}>
					<h4>Menu</h4>
					<ul>
						<li>
							<a href="#">Home</a>
						</li>
						<li>
							<a href="#">Books</a>
						</li>
						<li>
							<a href="#">About</a>
						</li>
						<li>
							<a href="#">Courses</a>
						</li>
						<li>
							<a href="#">Our Blog</a>
						</li>
						<li>
							<a href="#">Pricing</a>
						</li>
					</ul>
				</div>
				<div className={styles.recentPosts}>
					<h4>Recent Posts</h4>
					<ul>
						<li>
							<a href="#">Breaking Down Barriers</a>
						</li>
						<li>
							<a href="#">A Celebration of Success</a>
						</li>
						<li>
							<a href="#">A World of Opportunities</a>
						</li>
					</ul>
				</div>
			</div>
			<div className={styles.newsletter}>
				<h4>Newsletter</h4>
				<form className={styles.newsletterForm}>
					<input
						className={styles.newsletterInput}
						type="email"
						placeholder="Your email address"
					/>
					<button type="submit">Sign Up</button>
				</form>
				<div className={styles.socialIcons}>
					<a href="#">
						<i className="fab fa-facebook-f"></i>
					</a>
					<a href="#">
						<i className="fab fa-twitter"></i>
					</a>
					<a href="#">
						<i className="fab fa-instagram"></i>
					</a>
					<a href="#">
						<i className="fab fa-google"></i>
					</a>
				</div>
			</div>
			<div className={styles.footerBottom}>
				<p>© footer bottom</p>
			</div>
		</footer>
	);
};

export default Footer;
