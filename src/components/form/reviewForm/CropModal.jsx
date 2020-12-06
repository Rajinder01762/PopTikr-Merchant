/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ReactCrop from "react-image-crop";

function CropImage({ src, setBlob }) {
  const [crop, setCrop] = useState({
    unit: "px",
    width: 102,
    height: 72,
    aspect: 16 / 9,
  });
  const [imageRef, setImageRef] = useState(null);
  const [url, setUrl] = useState("");

  function getCroppedImg(croped) {
    if (imageRef && croped.width && croped.height) {
      const canvas = document.createElement("canvas");
      const scaleX = imageRef.naturalWidth / imageRef.width;
      const scaleY = imageRef.naturalHeight / imageRef.height;
      canvas.width = croped.width;
      canvas.height = croped.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        imageRef,
        croped.x * scaleX,
        croped.y * scaleY,
        croped.width * scaleX,
        croped.height * scaleY,
        0,
        0,
        croped.width,
        croped.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = "newFile.jpeg";
        const fileUrl = window.URL.createObjectURL(blob);
        setBlob(blob);
        setUrl(fileUrl);
      }, "image/jpeg");
    }
  }
  return (
    <>
      <img src={url} />
      <ReactCrop
        locked
        src={src}
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        ruleOfThirds
        onImageLoaded={(image) => setImageRef(image)}
        onComplete={(croped) => getCroppedImg(croped)}
      />
    </>
  );
}

const ImageCropModal = (props) => {
  const { className, isOpen, toggle, src, handleLogoUpload } = props;
  const [blob, setBlob] = useState(null);

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Crop Coupon Image</ModalHeader>
        <ModalBody>
          <CropImage setBlob={setBlob} src={src} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleLogoUpload(blob)}>
            Upload
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ImageCropModal;
