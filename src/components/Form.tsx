import React, { useEffect, useState } from 'react';

interface RecipeStructure {
    name: string;
    title: string;
}

export type Recipe = RecipeStructure;

const RecipeForm: React.FC<{onSubmit: (recipe: Recipe) => void; loadData?: Recipe; editMode?: boolean}>  = ({onSubmit, loadData, editMode}) => {

    const [formData, setFormData] = useState(loadData || {
      name: '',
      title: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
      e.preventDefault();

      onSubmit(formData);
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