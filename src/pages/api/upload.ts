import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises';
import formidable from 'formidable';
import type { File as FormidableFile } from 'formidable'; 

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const uploadDir = path.join(process.cwd(), 'public', 'images');

    if (req.method === 'POST') {
        try {
            const form = formidable({
                uploadDir: uploadDir,
                keepExtensions: true,
            });

            const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    resolve([fields, files]);
                });
            });

            const imageFiles = files.image as FormidableFile[] | undefined;
            const imageFile = imageFiles?.[0];

            const titleField = fields.title as string | string[] | undefined;
            const title = Array.isArray(titleField) ? titleField[0] : titleField;

            if (!imageFile) {
                return res.status(400).json({ message: 'No image file uploaded.' });
            }

            const sanitizedTitle = title ? String(title).replace(/[^a-z0-9]/gi, '_').toLowerCase() : `image_${Date.now()}`;
            const fileExtension = path.extname(imageFile.filepath);
            const newFilename = `${sanitizedTitle}${fileExtension}`;
            const newPath = path.join(uploadDir, newFilename);

            await fs.rename(imageFile.filepath, newPath);

            const imageUrl = `/images/${newFilename}`;

            return res.status(200).json({ message: 'Image processed successfully!', imageUrl });

        } catch (error) {
            console.error('API upload error:', error);
            return res.status(500).json({ message: 'Failed to process image upload.', error: (error as Error).message });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { imageUrl } = req.query;

            if (!imageUrl || typeof imageUrl !== 'string') {
                return res.status(400).json({ message: 'Image URL is required for deletion.' });
            }
            const filename = path.basename(imageUrl);
            const filePath = path.join(uploadDir, filename);

            try {
                await fs.access(filePath);
                await fs.unlink(filePath);
            } catch (error: any) {
                if (error.code === 'ENOENT') {
                    return res.status(404).json({ message: 'File not found on server.' });
                }
                throw error;
            }

            return res.status(200).json({ message: 'Success' });

        } catch (error) {
            console.error('API delete error:', error);
            return res.status(500).json({ message: 'Failed', error: (error as Error).message });
        }
    } else {
        res.setHeader('Allow', ['POST', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}