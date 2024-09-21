import React from "react";
import style from "../../../Styles/HomePage/ImageList.module.css";
import Image, { StaticImageData } from "next/image";

type ImageType = {
	_id: string;
	image: string | StaticImageData;
	title: string;
	active: Boolean;
};

interface ImageListProps {
	images: ImageType[];
	onDelete: (id: string) => void;
	loading: boolean;
	error: string | null;
}

const ImageList: React.FC<ImageListProps> = ({
	images,
	onDelete,
	loading,
	error,
}) => {
	return (
		<div className={style.imageList}>
			<div className={style.scrollableContainer}>
				{images.map((image) => (
					<div className={style.imageItem} key={image._id}>
						{/*<Image src={image.image} alt={image.title} className={style.image} />*/}
						<div className={style.imageInfo}>
							<h3 className={style.imageTitle}>{image.title}</h3>
							<p className={style.imageStatus}>Stato: {image.active ? "Attivo" : "Non attivo"}</p>
							<button
								className={style.deleteButton}
								onClick={() => onDelete(image._id)}
							>
								Elimina
							</button>
						</div>
					</div>
				))}
			</div>
			<div>
				{loading && <p>Loading...</p>}
				{error && <p>{error}</p>}
			</div>
		</div>
	);
};

export default ImageList;
