import React, { useEffect, useState } from 'react';

interface RecipeStructure {
    name: string;
    title: string;
    image: string;
}

export type Recipe = RecipeStructure;

const RecipeForm: React.FC<{onSubmit: (recipe: Recipe) => void; loadData?: Recipe; editMode?: boolean}>  = ({onSubmit, loadData, editMode}) => {

    const [formData, setFormData] = useState<Omit <Recipe, 'image'> & {image: string | File | null}>(loadData || {
      name: '',
      title: '',
      image: null
    });

    const [preview, setPreview] = useState<string | null>(loadData?.image || null);

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

    return (
      <div className='container-fluid'>
          <div className='row justify-content-center'>
            <div className='col bg-white shadow-md p-3'>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <input
                        type="text"
                        className='form-control'
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        readOnly={editMode}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Title</label>
                    <input
                        type="text"
                        className='form-control'
                        id="title"
                        placeholder="Enter your title"
                        value={formData.title}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input
                        type="file"
                        className='form-control'
                        id="image"
                        accept='image/*'
                        placeholder="Upload image"
                        onChange={(e) => handleChange(e)}
                    />
                    {preview && (<img src={preview} className='w-25 h-auto' />)}
                </div>
                <div className='mb-3'>
                  <button type="submit" className="btn btn-primary">{editMode ? 'update' : 'add'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
    )
  }

  export default RecipeForm;