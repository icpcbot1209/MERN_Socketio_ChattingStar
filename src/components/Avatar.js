import React, { useState, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import $ from "jquery";
import "../styles/Avatar.scss";

import { Button, Modal } from "react-bootstrap";

export const Avatar = (props) => {
  const [upImg, setUpImg] = useState();
  const [imgRef, setImgRef] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 9 / 9 });
  const [previewUrl, setPreviewUrl] = useState();

  const [isCropping, setIsCropping] = useState(false);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setUpImg(reader.result);
        setIsCropping(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    setImgRef(img);
  }, []);

  const makeClientCrop = async (crop) => {
    if (imgRef && crop.width && crop.height) {
      createCropPreview(imgRef, crop, "newFile.jpeg");
    }
  };

  const createCropPreview = async (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(previewUrl);

        let theURL = window.URL.createObjectURL(blob);
        setPreviewUrl(theURL);
        props.handleChange(theURL);
      }, "image/jpeg");
    });
  };

  const handleCloseModal = () => {
    setIsCropping(false);
  };

  const handleSaveModal = () => {
    setIsCropping(false);
    //
    console.log(crop);
  };

  return (
    <div>
      <div
        className="avatar-wrapper"
        onClick={(e) => $(".file-upload").click()}
      >
        <i
          className="avatar-icon fa fa-user"
          style={{ display: upImg ? "none" : "block" }}
        />
        <img
          src={previewUrl}
          style={{ width: "100%", height: "100%", zIndex: "10" }}
          alt="User"
        />
        <input
          className="file-upload"
          type="file"
          accept="image/*"
          onChange={onSelectFile}
        />
      </div>

      <Modal
        style={{ color: "black" }}
        show={isCropping}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "80vh", overflow: "auto" }}>
          <ReactCrop
            src={upImg}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={makeClientCrop}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
