import React, { useEffect, useState } from 'react';
import { z } from 'zod';

// interface RecipeStructure {
//     id: string;
//     name: string;
//     title: string;
//     image: string;
//     email: string;
//     description: string;
//     ingredients: string;
//     instructions: string;
//     dateAdded: string;
//     isFavorite: boolean;
// }

const recipeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required.'),
    email: z.string().min(1, 'Email is required.').email('Invalid email address.'),
    title: z.string().min(1, 'Title is required.'),
    description: z.string().min(1, 'Description is required.'),
    ingredients: z.string().min(1, 'Ingredients are required.'),
    instructions: z.string().min(1, 'Instructions are required.'),
    image: z.string().min(1, 'Image URL is required.'),
    dateAdded: z.string(),
    isFavorite: z.boolean().default(false),
})

export type Recipe = z.infer<typeof recipeSchema>;

const RecipeForm: React.FC<{ 
    onSubmit: (recipe: Recipe) => void; 
    loadData?: Recipe; 
    editMode?: boolean; 
    goBack: () => void;
}> = ({ onSubmit, loadData, editMode, goBack }) => {

    const [formData, setFormData] = useState<Omit<Recipe, 'image'> & { image: string | File | null }>(loadData || {
        id: '',
        name: '',
        title: '',
        image: null,
        email: '',
        description: '',
        ingredients: '',
        instructions: '',
        dateAdded: new Date().toISOString(),
        isFavorite: false
    });

    const [preview, setPreview] = useState<string | null>(loadData?.image || null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (editMode && loadData.image) {
            setPreview(loadData.image);
            setFormData(prev => ({ ...prev, image: loadData.image }));
        }
    }, [preview, editMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type } = e.target;

        if (type === 'file') {
            const file = (e.target as HTMLInputElement).files?.[0];

            console.log('file', file)

            if (file) {
                setFormData((prev: any) => ({ ...prev, image: file }));

                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string)
                }

                reader.readAsDataURL(file);
            } else {
                setFormData(prev => ({ ...prev, image: null }));
                setPreview(null)
            }
        } else {
            setFormData({ ...formData, [id]: value });
        }

    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (validateForm()) {
            let imageUrl = typeof formData.image === 'string' ? formData.image : '';

            console.log('imageUrl', imageUrl)

            if (formData.image instanceof File) {

                console.log('checking', formData.image)
                const uploadFormData = new FormData();
                uploadFormData.append('image', formData.image);
                uploadFormData.append('title', formData.title);

                try {
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: uploadFormData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Image upload failed.');
                    }

                    const result = await response.json();
                    imageUrl = result.imageUrl;

                } catch (error: any) {
                    console.error('Upload error:', error);

                    return;
                }
            }

            onSubmit({
                ...formData,
                image: imageUrl
            } as Recipe);

        }


    }

    const validateForm = (): boolean => {
        let newErrors: { [key: string]: string } = {};

        const dataToValidate = {
            ...formData,
            image: typeof formData.image === 'string' ? formData.image : (formData.image instanceof File ? formData.image.name : '')
        }

        const result = recipeSchema.safeParse(dataToValidate);

        if (!result.success) {
            result.error.issues.forEach((err: { path: string | any[]; message: string; }) => {
                if (err.path.length > 0) {
                    newErrors[err.path[0]] = err.message;
                }
            })
        }

        if (!editMode && !formData.image) {
            newErrors.image = 'Image is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    return (
        <div className='container-fluid'>
            <div className='container pt-5'>
                <div className='py-4'> <button type="button" className="btn btn-primary" onClick={goBack}>Back</button></div>
                <form onSubmit={handleSubmit}>
                    <div className='row justify-content-center'>
                        <div className='col-4'>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label d-block">
                                    
                                    {preview ? <img src={preview} className='w-100 h-auto' /> : <img src='/assets/upload_image.png' className='w-100 h-auto' />}
                                </label>
                                <input
                                    type="file"
                                    className='form-control'
                                    id="image"
                                    accept='image/*'
                                    placeholder="Upload image"
                                    hidden
                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                            </div>
                        </div>
                        <div className='col shadow-md px-3'>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Your Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    readOnly={editMode}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.name && <div className='invalid-feedback'>{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Title</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                    id="title"
                                    placeholder="Enter your title"
                                    value={formData.title}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.title && <div className='invalid-feedback'>{errors.title}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    id="description"
                                    placeholder="Enter recipe description"
                                    value={formData.description}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.description && <div className='invalid-feedback'>{errors.description}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ingredients" className="form-label">Ingredients</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.ingredients ? 'is-invalid' : ''}`}
                                    id="ingredients"
                                    placeholder="Enter recipe ingredients"
                                    value={formData.ingredients}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.ingredients && <div className='invalid-feedback'>{errors.ingredients}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="instructions" className="form-label">Instructions</label>
                                <input
                                    type="textarea"
                                    className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
                                    id="instructions"
                                    placeholder="Enter recipe instructions"
                                    value={formData.instructions}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.instructions && <div className='invalid-feedback'>{errors.instructions}</div>}
                            </div>
                            <div className='mb-3'>
                                <button type="submit" className="btn btn-primary">{editMode ? 'update' : 'save'}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RecipeForm;