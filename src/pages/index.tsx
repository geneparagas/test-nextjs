import React, { useState } from 'react';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'

import 'bootstrap/dist/css/bootstrap.min.css';

interface Recipe {
    name: string;
    title: string;
}

export default function Home() {
  const [view, setView] = useState<'list' | 'add' | 'view' | 'edit'>('list');
  const [recipeItems, setRecipeItems] = useState<Recipe[]>(() => {
    return [
      {
        name: 'Gene Paragas',
        title: 'adobong manok'
      }
    ]
  });

  const [selectedItem, setSelectedItem] = useState<Recipe | null>(null);

  const addRecipe = (newRecipe: Recipe) => {

    setRecipeItems((prevRecipes: Recipe[]) => [...prevRecipes, {...newRecipe}]);
    setView('list');
  }

  const updateRecipe = (updatedRecipe: Recipe) => {

    setRecipeItems((prevRecipes: Recipe[]) => 
      prevRecipes.map((recipe: Recipe) => recipe.name === updatedRecipe.name ? updatedRecipe : recipe 
    ));
    setView('list');
  }

  const AddRecipeForm: React.FC<{onSubmit: (recipe: Recipe) => void; loadData?: Recipe; editMode?: boolean}>  = ({onSubmit, loadData, editMode}) => {

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

  const RecipeDetails: React.FC<{recipe: Recipe; onEdit: (recipe: Recipe) => void;}> = ({recipe, onEdit}) => (
      <div className='container-fluid'>
          <div className='row justify-content-center'>
            <div className='col bg-white shadow-md p-3'>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <div>{recipe.name}</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Title</label>
                    <div>{recipe.title}</div>
                </div>
                <button type="submit" className="btn btn-primary" onClick={() => onEdit(recipe)}>Edit</button>
            </div>
          </div>
          
        </div>
  )

  return (
    <>
      <Head>
        <header className="d-flex flex-wrap justify-content-center py-3 border-bottom">
          Header 
        </header>
      </Head>
      <main>
        {view === 'list' && <div className='container-fluid'>
          <div className='row'>
            <div className='col-3 p-3'>
              <div className='bg-white shadow-md p-3'>
                filters
              </div>
            </div>
            <div className='col-9 p-3'>
              <div className='bg-white shadow-md p-3'>
                items
                <div className='row'>
                  {recipeItems.map(rec => (
                    <div className='border mb-1' onClick={() => {setSelectedItem(rec), setView('view')}}>{rec.title} - {rec.name}</div>
                  ))}
                </div>
              </div>
            </div> 
          </div>
          <div className='p-3'>
            <button type="button" className="btn btn-primary" onClick={() => setView('add')}>Add</button>
          </div>
        </div>}
        {view === 'add' && <AddRecipeForm onSubmit={addRecipe} />}
        {view === 'view' && <RecipeDetails recipe={selectedItem} onEdit={(recipe: Recipe) => {setSelectedItem(recipe); setView('edit'); }} />}
        {view === 'edit' && selectedItem && <AddRecipeForm onSubmit={updateRecipe} loadData={selectedItem} editMode={true} />}
      </main>
    </>
  )
}
