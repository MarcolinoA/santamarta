import React from "react";
import stylesImageList from "../../../Styles/HomePage/ImageList.module.css";
import { StaticImageData } from "next/image";

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

const DeleteImgList: React.FC<ImageListProps> = ({
	images,
	onDelete,
	loading,
	error,
}) => {
	return (
		<div className={stylesImageList.imageList}>
			<div className={stylesImageList.scrollableContainer}>
				{images.map((image) => (
					<div className={stylesImageList.imageItem} key={image._id}>
						{/*<Image src={image.image} alt={image.title} className={style.image} />*/}
						<div className={stylesImageList.imageInfo}>
							<h3 className={stylesImageList.imageTitle}>{image.title}</h3>
							<p className={stylesImageList.imageStatus}>Stato: {image.active ? "Attivo" : "Non attivo"}</p>
							<button
								className={stylesImageList.deleteButton}
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

export default DeleteImgList;
