import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import styles from '@/styles/Form.module.css';

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
    name: z.string().min(1, 'Name is required.'),
    email: z.email('Invalid email address.').min(1, 'Email is required.'),
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
    currentRecipeItems: Recipe[];
    onDelete: (name: string, image: string) => void;
}> = ({ onSubmit, loadData, editMode, goBack, onDelete, currentRecipeItems }) => {

    const [formData, setFormData] = useState<Omit<Recipe, 'image'> & { image: string | File | null }>(loadData || {
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

    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<'danger'>('danger');

    useEffect(() => {
        if (editMode && loadData.image) {
            setPreview(loadData.image);
            setFormData(prev => ({ ...prev, image: loadData.image }));
        }
    }, [preview, editMode]);

    useEffect(() => {
        if (showToast) {
          const timer = setTimeout(() => setShowToast(false), 3000);
          return () => clearTimeout(timer);
        }
      }, [showToast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;

        if (type === 'file') {
            const file = (e.target as HTMLInputElement).files?.[0];

            console.log('file', file)

            if (file) {

                if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") {
                    setFormData((prev: any) => ({ ...prev, image: file }));

                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setPreview(reader.result as string)
                    }

                    reader.readAsDataURL(file);
                } else {
                    setToastMessage('only accept png and jpg');
                    setShowToast(true);
                }
                
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

        if (!editMode && !newErrors.title && currentRecipeItems.some((recipe: Recipe) => recipe.title.toLowerCase() === formData.title.toLowerCase())) {
            newErrors.title = 'unique';
            setToastMessage('title must be unique.');
            setShowToast(true);
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
                <div className='py-4'> <span className={styles.back} onClick={goBack}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                </svg> Back</span></div>
                <form onSubmit={handleSubmit}>
                    <div className='row justify-content-center'>
                        <div className='col-4 px-3'>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label d-block">

                                    {preview ? <img src={preview} className={`w-100 h-auto ${styles.image}`} /> : <img src='/assets/upload_image.png' className={`w-100 h-auto ${styles.image}`} />}
                                </label>
                                {!editMode && <input
                                    type="file"
                                    className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                    id="image"
                                    accept='image/*'
                                    placeholder="Upload image"
                                    hidden
                                    onChange={(e) => handleChange(e)}
                                />}
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
                                {errors.title && errors.title !== 'unique' && <div className='invalid-feedback'>{errors.title}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="text"
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
                                <textarea
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    id="description"
                                    placeholder="description here"
                                    value={formData.description}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.description && <div className='invalid-feedback'>{errors.description}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ingredients" className="form-label">Ingredients</label>
                                <textarea
                                    className={`form-control ${errors.ingredients ? 'is-invalid' : ''}`}
                                    id="ingredients"
                                    placeholder="ingredients here"
                                    value={formData.ingredients}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.ingredients && <div className='invalid-feedback'>{errors.ingredients}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="instructions" className="form-label">Instructions</label>
                                <textarea
                                    className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
                                    id="instructions"
                                    placeholder="instructions here"
                                    value={formData.instructions}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.instructions && <div className='invalid-feedback'>{errors.instructions}</div>}
                            </div>
                            <div className='mb-3 d-flex'>
                                <div className='ms-auto'>
                                    {editMode && <button type="button" className={`btn ${styles.button_delete}`} onClick={() => onDelete(formData.name, preview)}>Delete</button>}
                                    <button type="submit" className={`btn px-3 ${styles.button_save}`}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 start-0 mx-auto p-3" style={{ zIndex: 1100 }}>
          <div className={`toast show align-items-center text-white bg-${toastType} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">
                {toastMessage}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={() => setShowToast(false)}></button>
            </div>
          </div>
        </div>
      )}
        </div>
    )
}

export default RecipeForm;