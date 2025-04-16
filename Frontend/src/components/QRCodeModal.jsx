import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FiX, FiDownload } from "react-icons/fi";

const QRCodeModal = ({ isOpen, onClose, userUmid, logo }) => {
  if (!isOpen) return null;

  const origin = window.location.origin;
  const qrValue = `${origin}/user/${userUmid}`;

  const downloadQRCode = () => {
    const canvas = document.querySelector("canvas");
    const a = document.createElement("a");
    a.download = `medicare-qr-${userUmid}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Your QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <QRCodeCanvas
            value={qrValue}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={false}
            style={{ borderRadius: "10px" }}
            imageSettings={{
              src: logo,
              x: undefined,
              y: undefined,
              height: 44,
              width: 44,
              excavate: true,
              radius: 5, // Rounded corners for the logo cutout area
            }}
          />
        </div>
        <div className="text-center">
          <p className="text-gray-600 mb-3">
            Scan this QR code to quickly access your Medicare information.
          </p>
          <button
            onClick={downloadQRCode}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiDownload className="mr-2" />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;