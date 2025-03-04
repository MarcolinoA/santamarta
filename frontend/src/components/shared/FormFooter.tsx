// components/shared/FormFooter.tsx
import React from "react";
import Link from "next/link";
import style from "../../Styles/Form.module.css";

interface FormFooterProps {
  message: string | null;
  loading: boolean;
  btnDataId: string;
  btnLoadingText: string;
  btnText: string;
  hrefLink: string;
  linkText: string;
  hrefLink2?: string;
  linkText2?: string;
  hrefLink3?: string;
  linkText3?: string;
}

const FormFooter: React.FC<FormFooterProps> = ({
	linkText,
	hrefLink,
	linkText2,
	hrefLink2,
	linkText3,
	hrefLink3,
	btnLoadingText,
	btnText,
	message,
	loading,
	btnDataId,
}) => {
	return (
		<div className={style.formFooterContainer}>
			<button
				data-id={btnDataId}
				type="submit"
				className={style.formButton}
				disabled={loading}
			>
				{loading ? btnLoadingText : btnText}
			</button>
			{message && (
				<p className={style.error} data-id="error-message">
					<span>{message}</span>
				</p>
			)}
			<div className={style.messagesContainer}>
  {hrefLink && linkText && (
    <div>
      <Link
        data-id="textLink"
        href={hrefLink}
        className={style.errorMessage}
      >
        {linkText}
      </Link>
    </div>
  )}
  {hrefLink2 && linkText2 && (
    <div>
      <Link
        data-id="textLink2"
        href={hrefLink2}
        className={style.errorMessage}
      >
        {linkText2}
      </Link>
    </div>
  )}
  {hrefLink3 && linkText3 && (
    <div>
      <Link
        data-id="textLink3"
        href={hrefLink3}
        className={style.errorMessage}
      >
        {linkText3}
      </Link>
    </div>
  )}
</div>

		</div>
	);
};

export default FormFooter;
