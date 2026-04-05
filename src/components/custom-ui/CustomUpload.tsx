// import type  { UseFormSetValue } from "react-hook-form";
// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { Imagebucket } from "@/services/organization";
// import { notify } from "../toast/NotifyToast";
// import ImageUploader from "../upload/uploadComponent";

// type FormValues = {
//   name: string;
//   slug: string;
//   status: string;
//   plan_type: string;
//   max_branches: string;
//   max_employees: string;
//   max_webhooks: string;
//   trial_days?: string;
//   organization_logo_url?: string;
// };

// type CustomUploadProps = {
//   model: string;
//   fieldType: string;
//   setValue: UseFormSetValue<FormValues>; 
// };

// export default function ImageUploadWrapper({model, fieldType, setValue}: CustomUploadProps) {
//   const [file, setFile] = useState<File | null>(null);

//   const { mutate, isPending } = useMutation({
//     mutationFn: (formData: FormData) => Imagebucket(formData),
//     onSuccess: (res) => {
//         console.log("this is the res", res);
//         setValue("organization_logo_url", res?.s3_key || "");
//         notify({
//                 title: "Uploaded",
//                 message: `The Image has been successfully Uploaded.`,
//                 variant: "success",
//         });
//     },
//     onError: () => {
//         notify({
//                 title: "Error",
//                 message: `"Failed to upload image. Please try again."`,
//                 variant: "error",
//         });
//     },
//   });

//   const handleUpload = (formData: FormData) => {
//     mutate(formData);
//   };

//   return (
//     <div>
//       {isPending && (
//         <p className="text-center text-sm text-gray-500 mb-2">Uploading...</p>
//       )}
//       <ImageUploader
//         onUpload={handleUpload}
//         setFile={setFile}
//         file={file}
//         model={model}
//         fieldType={fieldType}
//       />
//     </div>
//   );
// }