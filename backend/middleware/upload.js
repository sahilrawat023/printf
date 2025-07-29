import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });
 
export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files'); 