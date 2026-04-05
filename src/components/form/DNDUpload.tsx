// import { useEffect, useState } from "react";

// type DNDProps = {
//   onChange: (e: any) => void;
//   cropperHeight?: number;
//   cropperWidth?: number;
//   error?: string | boolean;
//   isMulti?: boolean;
//   cropperHeightPlaceholder?: number;
//   cropperWidthPlaceholder?: number;
//   type?: "image" | "video";
//   value?: any;
// };

// export interface FileWithPath extends File {
//     readonly path?: string;
//     readonly handle?: FileSystemFileHandle;
//     readonly relativePath?: string;
// }

// export enum ErrorCode {
//   FileInvalidType = "file-invalid-type",
//   FileTooLarge = "file-too-large",
//   FileTooSmall = "file-too-small",
//   TooManyFiles = "too-many-files",
// }

// export interface FileError {
//   message: string;
//   code: ErrorCode | string;
// }

// export interface FileRejection {
//   file: FileWithPath;
//   errors: readonly FileError[];
// }

// const maxLength = 150;
// const maxSize = Number(import.meta.env.VITE_MAX_FILE_SIZE || 200) * 1024 * 1024;

// const DndUpload: React.FC<DNDProps> = ({
//   onChange,
//   error,
//   isMulti = false,
//   cropperHeight = 100,
//   cropperWidth = 100,
//   cropperHeightPlaceholder = 1100,
//   cropperWidthPlaceholder = 1100,
//   value,
//   type = "image",
// }) => {
//   const [acceptedFiles, setAcceptedFiles] = useState<(File | Blob)[]>([]);
//   const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);
//   const [imageUrlInput, setImageUrlInput] = useState<string>("");
//   const [invalidUrlErr, setinvalidUrlErr] = useState<boolean>();

//   console.log("THIS IS THE ACCEPTEDFILE INSIDE FORM ELEMENT", acceptedFiles);
//   useEffect(() => {
//     if (
//       value &&
//       Array.isArray(value) &&
//       value?.every((item) => item instanceof File || item instanceof Blob)
//     ) {
//       setAcceptedFiles(value as any[]);
//     }
//     if ((value && value instanceof File) || value instanceof Blob) {
//       setAcceptedFiles(() => [value]);
//     }
//   }, [value]);

//   const handleManualUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const imageExtensions = /\.(jpeg|jpg|png|gif|webp|svg)$/i;
//     const videoExtensions = /\.(mp4|webm|ogg|mov|avi|mkv)$/i;

//     const url = e.target.value;
//     setImageUrlInput(url);
//     setinvalidUrlErr(true);

//     // If the URL is a valid image, update the change handler
//     if (
//       (type === "image" && imageExtensions.test(url)) ||
//       (type === "video" && videoExtensions.test(url))
//     ) {
//       setinvalidUrlErr(false);
//       onChange(url);
//     }
//   };

//   function nameLengthValidator(file: File) {
//     if (file.name.length > maxLength) {
//       return {
//         code: "name-too-large",
//         message: `Name is larger than ${maxLength} characters`,
//       };
//     }

//     if (file.size > maxSize) {
//       return {
//         code: "size-too-large",
//         message: `Size is larger than ${maxSize / (1024 * 1024)} MB`,
//       };
//     }

//     return null;
//   }

//   const [imageURL, setImageURL] = useState<string[]>([]);

//   const {
//     mutate: uploadToGalleryMutation,
//     isPending,
//     isSuccess,
//   } = useMutation({
//     mutationFn: uploadToGallery,
//     onSuccess: (response) => {
//       // Extract the image URL/ID from the response - adjust based on your API response structure
//       const uploadedImageUrl = response.data?.image || response.data?.url;
//       setImageUrlInput(uploadedImageUrl);
//       setImageURL((prev) => {
//         onChange(isMulti ? [...prev, uploadedImageUrl] : uploadedImageUrl);
//         return [...prev, uploadedImageUrl];
//       });

//       showToast({
//         title: "Uplaoded Successfully",
//         description: "File has been uploaded successfully",
//         type: "success",
//       });

//       console.log("This is the uploaded image url", uploadedImageUrl);
//       // @ts-ignore
//     },
//     onError: (error: any) => {
//       showToast({
//         title: "Uplaoded Failed",
//         description: "Error" + error?.message || "File upload failed",
//         type: "error",
//       });
//       setAcceptedFiles([]);
//       // setIsUploading(false);
//       // Handle error - show toast notification, etc.
//     },
//   });

//   const onDrop = useCallback(
//     async (acceptedFiles: File[]) => {
//       const formData = new FormData();
//       formData.append("image", acceptedFiles[0]);
//       await uploadToGalleryMutation({ formData });
//       setAcceptedFiles(acceptedFiles);
//       setFileRejections([]);
//     },
//     [onChange, isMulti, imageURL]
//   );

//   // const onDrop = useCallback(async (acceptedFiles: File[]) => {
//   //   const formData = new FormData();
//   //   formData.append("image", acceptedFiles[0]);
//   //   await uploadToGalleryMutation({ formData });
//   //   console.log("This has ran after the mutation")
//   //   // @ts-ignore
//   //   onChange(isMulti ? imageURL : imageURL[0]);
//   //   setAcceptedFiles(acceptedFiles);
//   //   setFileRejections([]);
//   // }, []);

//   const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
//     setFileRejections(rejectedFiles);
//     setAcceptedFiles([]);
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: {
//       ...(type === "image" && {
//         "image/png": [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"],
//       }),
//       ...(type === "video" && {
//         "video/mp4": [".mp4", ".mov", ".mpeg"],
//       }),
//     },
//     validator: nameLengthValidator,
//     maxFiles: 1,
//     onDrop,
//     onDropRejected,
//   });

//   /* cropped */
//   const [crop, setCrop] = useState<any>();
//   const [isCropOpen, setisCropOpen] = useState<boolean | null>(false);

//   const handleCrop = (file: File | Blob, index: number) => {
//     const objectUrl = URL.createObjectURL(file);
//     setCrop({ file, url: objectUrl, index });
//     // @ts-ignore
//     onChange(file);
//     setisCropOpen(true);
//   };
//   const [localVideoUrl, setLocalVideoUrl] = useState<string>("");
//   const acceptedFileItems =
//     Array.isArray(acceptedFiles) &&
//     acceptedFiles?.map((file, index) => {
//       const localURl = URL.createObjectURL(file);

//       return (
//         <div
//           className="border p-[10px] rounded-[6px] flex items-center justify-between gap-2 text-start bg-accent min-w-[200px]"
//           key={file instanceof File ? file.name : ""}
//         >
//           <div className="flex items-center gap-2">
//             <div className="">
//               {type == "video" ? <VideoIcon /> : <FileIcon />}
//             </div>
//             <div className="text-[12px] text-[#969696]">
//               <div className="flex">
//                 <div className="max-w-[150px] truncate">
//                   {file instanceof File ? file.name : ""}
//                 </div>
//               </div>
//               <ul>
//                 <li className="text-[12px] font-[500]">
//                   {file.size < 1024 * 1024
//                     ? (file.size / 1024).toFixed(1) + " KB"
//                     : (file.size / (1024 * 1024)).toFixed(1) + " MB"}
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             {type == "video" ? (
//               <div
//                 onClick={() => {
//                   setLocalVideoUrl(localURl);
//                   setisVideoOpen(true);
//                 }}
//                 className="text-[#1aa178] cursor-pointer p-[4px] rounded-[4px]"
//               >
//                 <EyeIcon size={14} />
//               </div>
//             ) : (
//               <div
//                 className="bg-[#1aa178] cursor-pointer p-[4px] rounded-[4px]"
//                 onClick={() => handleCrop(file, index)}
//               >
//                 <Crop size={14} color="white" />
//               </div>
//             )}
//             <div
//               className="bg-slate-50 cursor-pointer p-[4px] rounded-[4px]"
//               onClick={() => handleRemoveAccepted(index)}
//             >
//               <X size={14} />
//             </div>
//           </div>
//         </div>
//       );
//     });

//   const handleRemoveRejection = (indexToRemove: number) => {
//     setFileRejections((prevRejections) =>
//       prevRejections.filter((_, index) => index !== indexToRemove)
//     );
//   };
//   const handleRemoveAccepted = (indexToRemove: number) => {
//     setImageUrlInput("");
//     setData(null);
//     onChange(null);
//     setAcceptedFiles((prevRejections) =>
//       prevRejections.filter((_, index) => index !== indexToRemove)
//     );
//   };
//   const [isVideoOpen, setisVideoOpen] = useState<boolean | null>(null);
//   const fileRejectionItems = fileRejections.map(({ file, errors }, index) => (
//     <div
//       className="border p-[10px] rounded-[6px] flex items-center justify-between  gap-2 text-start bg-accent min-w-[200px]"
//       key={file.path}
//     >
//       <div className="flex items-center gap-2">
//         <div className="">{type == "video" ? <VideoIcon /> : <FileIcon />}</div>
//         <div className="text-[12px] text-[#969696]">
//           <div className="flex">
//             <div className="max-w-[150px] truncate">{file.name}</div> -{" "}
//             {file.size < 1024 * 1024
//               ? (file.size / 1024).toFixed(1) + " KB"
//               : (file.size / (1024 * 1024)).toFixed(1) + " MB"}
//           </div>
//           <ul>
//             {errors.map((e) => (
//               <li className="text-[12px] font-[500] text-red-500" key={e.code}>
//                 {e.message}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <div
//         className="bg-slate-50 cursor-pointer p-[4px] rounded-[4px]"
//         onClick={() => handleRemoveRejection(index)}
//       >
//         <X size={14} />
//       </div>
//     </div>
//   ));
//   const dropzoneProps =
//     fileRejectionItems.length === 0 &&
//     Array.isArray(acceptedFileItems) &&
//     acceptedFileItems?.length === 0
//       ? getRootProps()
//       : {};
//   const [data, setData] = useState<String | Blob | null>(null);

//   const dataUrl = useMemo(() => {
//     if (!value) return undefined;
//     if (typeof value === "string") return value;
//     if (value instanceof File || value instanceof Blob)
//       return URL.createObjectURL(value);
//     return;
//   }, [value]);

//   return (
//     <>
//       <div
//         {...dropzoneProps}
//         className={`${
//           error ? "border-red-500 " : ""
//         }p-[20px] h-[232px] border-[1.5px] border-[#E5E7EB] border-dashed rounded-[8px] min-h-[100px] overflow-auto w-full flex items-center relative ${
//           fileRejectionItems.length > 0
//             ? "border-red-500 bg-red-50"
//             : `${error ? "bg-red-500/10" : "hover:bg-[#1DA077]/10 "}`
//         } ${data && "bg-[#1DA077]"}`}
//         style={{
//           backgroundImage: type === "video" ? "" : `url(${dataUrl})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         {/* Black overlay when image exists */}
//         {(data || value) && (
//           <div className="absolute inset-0 bg-black/50 rounded-[8px]" />
//         )}

//         <div
//           className={cn(
//             "flex flex-col items-center text-center  my-auto max-h-full w-full relative ",
//             `${error ? "text-red-500" : "text-[#1DA077]"}`
//           )}
//         >
//           {fileRejectionItems.length === 0 ? (
//             <>
//               <CloudUpload
//                 className={cn(isPending && "animate-bounce")}
//                 color={
//                   error ? "#fb2c36 " : data || value ? "#ffffff" : "#1DA077"
//                 }
//               />
//               {isPending ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 <>
//                   <p
//                     className={`text-[14px] font-[500] ${
//                       data
//                         ? "text-white"
//                         : value &&
//                           `${
//                             error
//                               ? "text-red-500"
//                               : value
//                               ? "text-white"
//                               : "text-[#1DA077]"
//                           }`
//                     }`}
//                   >
//                     Drag and drop a {type} to upload
//                   </p>
//                   <p
//                     className={`text-[14px] text-wrap font-[500] ${
//                       data || value
//                         ? "text-white"
//                         : value &&
//                           `${error ? "text-red-500" : "text-[#1DA077]"}`
//                     }`}
//                   >
//                     {type == "video" ? "MP4 Mov and MPEG" : "PNG, JPG and JPEG"}{" "}
//                     up to {maxSize / (1024 * 1024)} MB
//                     <br /> Recommended Size: {cropperHeightPlaceholder} x{" "}
//                     {cropperWidthPlaceholder} px
//                   </p>
//                 </>
//               )}
//             </>
//           ) : (
//             <aside className="my-3">
//               <div className="flex flex-wrap gap-[10px]">
//                 {acceptedFileItems}
//               </div>
//               <div className="flex flex-wrap gap-[10px]">
//                 {fileRejectionItems}
//               </div>
//             </aside>
//           )}

//           <aside className="my-3">
//             <div className="flex flex-wrap gap-[10px]">{acceptedFileItems}</div>
//           </aside>
//           {type === "video" &&
//             typeof value === "string" &&
//             value.length > 0 && (
//               <div
//                 className="relative"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setisVideoOpen((prev) => !prev);
//                 }}
//               >
//                 <div className="absolute top-1/2 left-1/2 rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#1DA077] size-[30px] text-white flex justify-center items-center ">
//                   <Play size={17} />
//                 </div>
//                 <video
//                   src={value}
//                   className="w-full h-[100px] cursor-pointer rounded-md mt-4"
//                 />
//               </div>
//             )}
//         </div>

//         <input
//           {...getInputProps({
//             multiple: isMulti,
//           })}
//         />
//       </div>

//       <Dialog
//         className="bg-slate-100 shadow-none border-none min-w-[600px]"
//         open={!!isVideoOpen}
//         setOpen={() => {
//           setisVideoOpen(false);
//         }}
//       >
//         <video
//           src={localVideoUrl || value}
//           controls
//           controlsList="nodownload"
//           autoPlay
//           className="w-full h-full object-cover  cursor-pointer  rounded-md "
//         />
//       </Dialog>
//       <Dialog
//         className=""
//         open={!!isCropOpen}
//         title="Crop Image"
//         setOpen={() => setisCropOpen(null)}
//       >
//         {crop && (
//           <ImgCropper
//             output="blob"
//             src={crop.url}
//             setData={setData}
//             // @ts-ignore
//             data={data}
//             cropperHeight={cropperHeight}
//             cropperWidth={cropperWidth}
//             onSave={(data) => {
//               onChange(data);
//               setCrop(data);
//               setisCropOpen(false);
//             }}
//           />
//         )}
//       </Dialog>
//       <div className="mt-4">
//         <label
//           htmlFor="image-url"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           {type == "image" && "Or enter an image URL:"}
//           {type == "video" && "Or enter a video URL:"}
//         </label>
//         <input
//           id="image-url"
//           type="text"
//           value={imageUrlInput}
//           onChange={handleManualUrlChange}
//           placeholder={
//             type == "image"
//               ? "https://example.com/image.jpg"
//               : "https://example.com/video.mp4"
//           }
//           className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-green-200"
//           disabled={isSuccess}
//         />
//         {invalidUrlErr && (
//           <span className="text-[12px] font-[500] text-red-500">
//             {type == "image" && "InValid URL: It must end with image extension"}
//             {type == "video" && "InValid URL: It must end with video extension"}
//           </span>
//         )}
//       </div>
//     </>
//   );
// };