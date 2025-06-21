import { useRef } from "react";

// Icons
import { Gift, Upload } from "lucide-react";

const GiftSection: React.FC<{
  giftImage: string | null;
  onImageUpload: (file: File) => void;
  isDark: boolean;
}> = ({ giftImage, onImageUpload, isDark }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div
      className={`${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } rounded-2xl shadow-2xl p-8 border mb-12`}
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Gift
            className={`w-8 h-8 ${
              isDark ? "text-yellow-400" : "text-purple-600"
            } mr-3`}
          />
          <h2
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Bumper Prize
          </h2>
          <Gift
            className={`w-8 h-8 ${
              isDark ? "text-yellow-400" : "text-purple-600"
            } ml-3`}
          />
        </div>
        {/* <p
          className={`text-lg ${
            isDark ? "text-gray-300" : "text-gray-600"
          } mb-8`}
        >
          The winner will receive this amazing gift!
        </p> */}
      </div>

      <div className="relative max-w-4xl mx-auto">
        {giftImage ? (
          <div
            className="relative group cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={giftImage}
              alt="Prize"
              className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 animate-overlayShow z-[70] backdrop-blur-sm bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
              <div className="text-white text-center">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Click to change image</p>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={handleImageClick}
            className={`w-full h-64 md:h-80 border-2 border-dashed ${
              isDark
                ? "border-gray-600 bg-gray-700 hover:bg-gray-600"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            } rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center group`}
          >
            <Upload
              className={`w-16 h-16 ${
                isDark ? "text-gray-400" : "text-gray-400"
              } mb-4 group-hover:scale-110 transition-transform`}
            />
            <p
              className={`text-lg font-semibold ${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-2`}
            >
              Click to upload prize image
            </p>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              JPG, PNG, or GIF up to 10MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default GiftSection;
