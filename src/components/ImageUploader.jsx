import { useState, useRef, useEffect } from "react";
import { FaCloudUploadAlt, FaLink, FaTimes, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { uploadImage } from "../services/api";

const ImageUploader = ({ value, onChange, folder, label, required, rounded }) => {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState("url"); // "url" or "upload"
  const [urlInput, setUrlInput] = useState(value || "");
  const fileRef = useRef();

  useEffect(() => {
    setUrlInput(value || "");
  }, [value]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadImage(file, folder);
      onChange(res.data.url);
      setUrlInput(res.data.url);
      toast.success("Image uploaded");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Upload failed";
      toast.error(msg);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleClear = () => {
    onChange("");
    setUrlInput("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
          {label} {required && "*"}
        </label>
      )}

      {/* Preview */}
      {value && (
        <div className={`relative mb-3 ${rounded === "full" ? "w-24 h-24 mx-auto" : "h-32"} ${rounded === "full" ? "rounded-full" : "rounded-xl"} overflow-hidden border border-gray-200`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1 right-1 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition"
          >
            <FaTimes className="text-[10px]" />
          </button>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mode === "url"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          <FaLink className="text-[10px]" /> URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mode === "upload"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          <FaCloudUploadAlt className="text-[10px]" /> Upload
        </button>
      </div>

      {/* URL Input */}
      {mode === "url" && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm"
          />
        </div>
      )}

      {/* File Upload */}
      {mode === "upload" && (
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
            uploading
              ? "border-emerald-300 bg-emerald-50"
              : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <FaSpinner className="text-emerald-500 text-xl animate-spin" />
              <span className="text-xs text-emerald-600 font-medium">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <FaCloudUploadAlt className="text-gray-400 text-2xl" />
              <span className="text-xs text-gray-500">Click to upload image (max 5MB)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
