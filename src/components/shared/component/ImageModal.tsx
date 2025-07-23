import { X } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const ImageModal = ({ isOpen, onClose, imageUrl }: ImageModalProps) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 top-0 bg-black/70 flex items-center justify-center z-50">
      <div className="relative max-w-4xl w-full justify-center flex items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl bg-black/40 p-2 rounded-full hover:bg-black/60 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={imageUrl}
          alt="Dokumentasi"
          className="w-full max-h-[80vh] justify-center flex object-contain rounded-md shadow-lg border"
        />
      </div>
    </div>
  );
};

export default ImageModal;
