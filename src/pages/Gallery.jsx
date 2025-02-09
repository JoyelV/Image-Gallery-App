import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';
import axiosInstance from "../utility/axiosInstance";

export default function ImageGallery() {
  const userId = localStorage.getItem("userId");
  const [images, setImages] = useState([]);
  const [titles, setTitles] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchImages();
  },[]);

  const fetchImages = async () => {
    try {
      const response = await axiosInstance.get(`/images/${userId}`);
      const sortedImages = response.data.sort((a, b) => a.order - b.order);
      setImages(sortedImages);
      const initialTitles = {};
      response.data.forEach((img) => {
        initialTitles[img._id] = img.title;
      });
      setTitles(initialTitles);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: "image/*" });

  const handleTitleChange = (id, value) => {
    setTitles((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]);
      formData.append(`titles[${i}]`, titles[i] || `Untitled ${i + 1}`);
    }
    formData.append("userId", userId);

    try {
      await axiosInstance.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchImages();
      setTitles({});
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/images/${id}`);
      setImages(images.filter((img) => img._id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setNewImageFile(null);
  };

  const handleUpdateImage = async () => {
    if (!editingImage) return;

    const formData = new FormData();
    formData.append("title", titles[editingImage._id]);
    if (newImageFile) {
      formData.append("image", newImageFile);
    }

    try {
      await axiosInstance.put(`/images/${editingImage._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditingImage(null);
      setNewImageFile(null);
      fetchImages();
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedImages = [...images];
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    const updatedImageOrder = reorderedImages.map((img, index) => ({ _id: img._id, order: index }));

    try {
      const response = await axiosInstance.put("/images/reorder", { userId, images: updatedImageOrder });
      console.log(response.data)
      setImages(reorderedImages);
    } catch (error) {
      console.error('Error updating image order:', error);
      fetchImages();
    }
  };

  return (
    <div className="p-2 bg-white min-h-screen">
      <div className="w-full mx-auto bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Image Gallery</h2>

        {/* Upload New Images
        <input type="file" multiple onChange={handleFileChange} className="mb-4" />
        {selectedFiles &&
          Array.from(selectedFiles).map((file, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Title for ${file.name}`}
              value={titles[index] || ""}
              onChange={(e) => handleTitleChange(index, e.target.value)}
              className="block w-full p-2 border rounded mb-2"
            />
          ))}
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload
        </button> */}

                {/* Drag & Drop Upload */}
                <div {...getRootProps()} className="border-dashed border-2 p-6 text-center cursor-pointer mb-4">
          <input {...getInputProps()} />
          <p>Drag & drop images here, or click to select files</p>
        </div>
        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold">Selected Images:</h3>
            <div className="flex gap-2 overflow-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="border p-2 rounded">
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-20 h-20 object-cover" />
                  <input
                    type="text"
                    placeholder={`Title for ${file.name}`}
                    value={titles[index] || ""}
                    onChange={(e) => setTitles(prev => ({ ...prev, [index]: e.target.value }))}
                    className="block w-full p-1 border rounded mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload
        </button>

        {/* Display Images with Drag & Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="image-list" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2"
              >
                {images.map((image, index) => (
                  <Draggable key={image._id} draggableId={image._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative border p-3 rounded shadow bg-gray-200"
                      >
                        <img
                          src={image.imageURL}
                          alt={image.title}
                          className="w-full h-32 sm:h-40 object-cover rounded"
                        />
                        <p className="text-center mt-2 text-sm sm:text-base">{image.title}</p>
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={() => handleEdit(image)}
                            className="bg-yellow-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded w-full mr-1 text-sm sm:text-base"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(image._id)}
                            className="bg-red-500 text-white px-4 py-2 sm:px-3 sm:py-1 rounded w-full ml-1 text-sm sm:text-base"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold mt-5 py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Edit Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-bold mb-2">Edit Image</h2>
            <img src={editingImage.imageURL} alt={editingImage.title} className="w-40 h-40 object-cover rounded mb-2" />
            <input
              type="text"
              value={titles[editingImage._id] || ""}
              onChange={(e) => handleTitleChange(editingImage._id, e.target.value)}
              className="block w-full p-2 border rounded mb-2"
            />
            <input type="file" onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}className="mb-2" />
            <div className="flex justify-between">
              <button onClick={handleUpdateImage} className="bg-green-500 text-white px-3 py-1 rounded">
                Save
              </button>
              <button onClick={() => setEditingImage(null)} className="bg-gray-500 text-white px-3 py-1 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
